import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { getElection } from "../src/services/qv";

const reduceVotes = votersVotes => {
  const score = {};
  votersVotes.forEach(voter => {
    voter.votes.forEach(vote => {
      if (!score[vote.candidate]) score[vote.candidate] = vote.vote;
      else score[vote.candidate] = score[vote.candidate] + vote.vote;
    });
  });
  return score;
};

const candidatesWithVotes = election => {
  const totalVotes = reduceVotes(election.votes);
  return election.candidates.map((candidate, id) => ({
    ...candidate,
    votes: totalVotes[id] || 0
  }));
};

const renderVotingResults = election => {
  const candidates = candidatesWithVotes(election);
  const renderedVotes = candidates.map((candidate, id) => (
    <div key={id}>
      <div>{candidate.title}</div>
      <div>{candidate.description}</div>
      <div>Votes: {candidate.votes}</div>
    </div>
  ));
  return renderedVotes;
};

const Page = ({ router }) => {
  const [election, setElection] = useState();
  const electionId = get(router, "query.election");

  const fetchElection = async id => {
    const election = await getElection(id);
    setElection(election);
  };

  useEffect(() => {
    if (!election && electionId) fetchElection(electionId);
  }, [electionId]);

  if (!election) return null;
  return (
    <div className="container">
      <div>
        <h1>{election.config.name}</h1>
      </div>
      <div>{renderVotingResults(election)}</div>
    </div>
  );
};

export default withRouter(Page);
