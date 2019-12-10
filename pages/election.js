import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { getElection } from "../src/services/qv";
import Link from "next/link";

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
      <div className="row mb-2" style={{ flexDirection: "row-reverse" }}>
        <div className="bg-dark text-light p-2" style={{ borderRadius: 5 }}>
          No. Voters: {election.votes.length}
        </div>
      </div>
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
  const userId = get(router, "query.userId", "");
  const isPrivateElection = get(election, "config.private");

  const fetchElection = async (id, uid) => {
    try {
      const election = await getElection(id, uid);
      setElection(election);
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    if (!election && electionId) fetchElection(electionId, userId);
  }, [electionId]);

  if (!election) return null;
  return (
    <div className="container">
      <div>
        <h1>{election.config.name}</h1>
      </div>
      {renderVotingResults(election)}
      <div className="mt-2 mb-2">
        <Link
          href={`/insights?election=${electionId}${
            userId ? `&userId=${userId}` : ""
          }`}
        >
          <button className="btn btn-dark btn-block mb-2">View Insights</button>
        </Link>
      </div>
      {isPrivateElection ? (
        <div className="mt-2 mb-2">
          <Link
            href={`/share-private?election=${electionId}${
              userId ? `&userId=${userId}` : ""
            }`}
          >
            <button className="btn btn-dark btn-block mb-2">Voter Links</button>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(Page);
