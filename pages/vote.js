import Router, { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { get, zipWith, sumBy, cloneDeep, orderBy } from "lodash";
import Select from "react-select";
import { getElection, submitVotes } from "../src/services/qv";
import initialiseUserId from "../src/utils/initialiseUserId";

import { encryptStringWithPublicKey } from "../src/utils/encryption";

const SORT_TYPES = {
  title: { label: "title", value: "title", order: "asc" },
  vote: { label: "vote", value: "vote", order: "desc" },
};

const renderVotes = (candidates, votes, addVote, sortTypeValue) => {
  if (!candidates || !votes) return;
  const elements = zipWith(candidates, votes, (candidate, vote) => ({
    index: vote.candidate,
    title: candidate.title,
    description: candidate.description,
    vote: vote.vote,
  }));
  const sortedElements = orderBy(
    elements,
    [sortTypeValue.value],
    [sortTypeValue.order]
  );
  const renderedVotes = sortedElements.map((element, id) => (
    <div key={id} className="row mt-2 p-2 bg-light">
      <div className="col-8">
        <h4>{element.title}</h4>
        <div>{element.description}</div>
      </div>
      <div className="col-4 text-center">
        <div onClick={() => addVote(element.index, 1)}>
          <i className="fas fa-plus fa-2x text-dark" />
        </div>
        <div className="bg-dark text-white p-2 m-2 rounded">{element.vote}</div>
        <div onClick={() => addVote(element.index, -1)}>
          <i className="fas fa-minus fa-2x text-dark" />
        </div>
      </div>
    </div>
  ));
  return <>{renderedVotes}</>;
};

const totalVoteBudget = (votes) =>
  sumBy(votes, (vote) => Math.pow(vote.vote, 2));

const Page = ({ router }) => {
  const [userId, setUserId] = useState();
  const [election, setElection] = useState();
  const [votes, setVotes] = useState();
  const [sortType, setSortType] = useState(SORT_TYPES.title);
  const [error, setError] = useState();
  const electionId = get(router, "query.election");
  const userIdOverwrite = get(router, "query.userId");

  initialiseUserId(setUserId);

  const fetchElection = async (id, uid) => {
    try {
      const election = await getElection(id, uid);
      setElection(election);
      setVotes(
        election.candidates.map((_candidate, id) => ({
          candidate: id,
          vote: 0,
        }))
      );
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    if (!election && electionId) fetchElection(electionId, userIdOverwrite);
  }, [electionId]);

  useEffect(() => {
    //TODO:
  }, [sortType]);

  const addVote = (index, num) => {
    const newVotes = cloneDeep(votes);
    newVotes[index] = { ...newVotes[index], vote: newVotes[index].vote + num };
    const newBudget = totalVoteBudget(newVotes);
    if (newBudget > election.config.budget) return alert("Insufficient budget");
    setVotes(newVotes);
  };

  const onSubmitVotes = async () => {
    try {
      const vote = {
        voter: userIdOverwrite || userId,
        election: election.id,
      };
      if (election.config.encryptionKey) {
        const encryptedVote = await encryptStringWithPublicKey(
          JSON.stringify(votes),
          election.config.encryptionKey
        );
        vote.encryptedVote = encryptedVote;
      } else {
        vote.votes = votes;
      }
      await submitVotes(vote);
      Router.push(`/election?election=${election.id}`);
    } catch (e) {
      const errorFromServer = get(e, "response.data.error");
      const msg = errorFromServer || e.message || e;
      alert(msg);
      setError(msg);
    }
  };

  return (
    <>
      <div className="sticky-top navbar bg-white">
        <h2>{get(election, "config.name")}</h2>
        <div className="d-flex align-items-center w-50 justify-content-end">
          <div className="d-flex align-items-center w-50 p-2 text-uppercase px-2">
            <div className="px-1">Sort by</div>
            <Select
              className="flex-grow-1 px-2"
              placeholder={SORT_TYPES.title.value}
              value={sortType}
              onChange={setSortType}
              options={Object.values(SORT_TYPES)}
              isSearchable={false}
            />
          </div>
          <div className="bg-dark text-white p-2 rounded">
            Budget: {get(election, "config.budget", 0) - totalVoteBudget(votes)}
          </div>
        </div>
      </div>
      <div className="container mb-4">
        <div>
          {renderVotes(
            election && election.candidates,
            votes,
            addVote,
            sortType
          )}
        </div>

        <button className="btn btn-dark btn-block mb-2" onClick={onSubmitVotes}>
          Submit Votes
        </button>
        {error ? (
          <Link href={`/election?election=${electionId}`}>
            <button className="btn btn-dark btn-block mb-2">
              View Results
            </button>
          </Link>
        ) : null}
      </div>
    </>
  );
};

export default withRouter(Page);
