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
  const candidates = candidatesWithVotes(election).sort(
    (e1, e2) => e2.votes - e1.votes
  );
  const renderedVotes = candidates.map((candidate, id) => (
    <div key={id} className="row text-center bg-light p-2">
      <div className="col-8">{candidate.title}</div>
      <div className="col-4">{candidate.votes}</div>
    </div>
  ));
  return (
    <div className="container">
      <div className="row bg-dark text-light text-center p-2">
        <div className="col-8">Candidate</div>
        <div className="col-4">Votes</div>
      </div>
      {renderedVotes}
    </div>
  );
};

const Page = ({ router }) => {
  const [election, setElection] = useState();
  const electionId = get(router, "query.election");

  const fetchElection = async id => {
    const election = await getElection(id);
    console.log(election);
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
      {renderVotingResults(election)}
    </div>
  );
};

export default withRouter(Page);
