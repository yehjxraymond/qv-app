import Router, { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { get, zipWith, sumBy, cloneDeep } from "lodash";
import { getElection } from "../src/services/qv";
import initialiseUserId from "../src/utils/initialiseUserId";
import { submitVotes } from "../src/services/qv";

const renderVotes = (candidates, votes, addVote, subVote) => {
  if (!candidates || !votes) return;
  const elements = zipWith(candidates, votes, (candidate, vote) => ({
    index: vote.candidate,
    title: candidate.title,
    description: candidate.description,
    vote: vote.vote
  }));
  const renderedVotes = elements.map((element, id) => (
    <div key={id}>
      <h4>{element.title}</h4>
      <div>{element.description}</div>
      <div>Votes: {element.vote}</div>
      <div>
        <button onClick={() => addVote(element.index, 1)}>Add Vote</button>
        <button onClick={() => addVote(element.index, -1)}>
          Subtract Vote
        </button>
      </div>
    </div>
  ));
  return <>{renderedVotes}</>;
};

const totalVoteBudget = votes => sumBy(votes, vote => Math.pow(vote.vote, 2));

const Page = ({ router }) => {
  const [userId, setUserId] = useState();
  const [election, setElection] = useState();
  const [votes, setVotes] = useState();
  const electionId = get(router, "query.election");

  initialiseUserId(setUserId);

  const fetchElection = async id => {
    const election = await getElection(id);
    setElection(election);
    setVotes(
      election.candidates.map((_candidate, id) => ({ candidate: id, vote: 0 }))
    );
  };

  useEffect(() => {
    if (!election && electionId) fetchElection(electionId);
  }, [electionId]);

  const addVote = (index, num) => {
    const newVotes = cloneDeep(votes);
    newVotes[index] = { ...newVotes[index], vote: newVotes[index].vote + num };
    if (newVotes[index].vote < 0) return alert("Cannot have negative votes");
    const newBudget = totalVoteBudget(newVotes);
    if (newBudget > election.config.budget) return alert("Insufficient budget");
    setVotes(newVotes);
  };

  const onSubmitVotes = async () => {
    try {
      const vote = {
        voter: userId,
        election: election.id,
        votes
      };
      await submitVotes(vote);
      Router.push(`/election?election=${election.id}`);
    } catch (e) {
      const errorFromServer = get(e, "response.data.error");
      alert(errorFromServer || e.message || e);
    }
  };

  return (
    <div className="container">
      <div>
        <h2>{get(election, "config.name")}</h2>
        <div>
          Budget: {get(election, "config.budget", 0) - totalVoteBudget(votes)}
        </div>
      </div>
      <div>{renderVotes(election && election.candidates, votes, addVote)}</div>
      <button className="btn btn-primary btn-block" onClick={onSubmitVotes}>
        Submit Votes
      </button>
    </div>
  );
};

export default withRouter(Page);
