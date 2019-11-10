import React, { useState } from "react";
import { cloneDeep } from "lodash";
import initialiseUserId from "../src/utils/initialiseUserId";
import { createElection } from "../src/services/qv";
import Router from "next/router";

const renderCandidates = (candidates, onUpdateCandidate) => {
  const renderedCandidates = candidates.map((candidate, id) => (
    <div key={id} className="p-2 mb-2 bg-light">
      <div>Title:</div>
      <input
        className="form-control"
        placeholder="Enter title"
        value={candidate.title}
        onChange={e =>
          onUpdateCandidate(id, { ...candidate, title: e.target.value })
        }
      />
      <div>Description:</div>
      <input
        className="form-control"
        placeholder="Enter description"
        value={candidate.description}
        onChange={e =>
          onUpdateCandidate(id, { ...candidate, description: e.target.value })
        }
      />
    </div>
  ));
  return <>{renderedCandidates}</>;
};

const Page = () => {
  const [userId, setUserId] = useState();
  const [electionName, setElectionName] = useState("");
  const [candidates, setCandidates] = useState([
    { title: "", description: "" },
    { title: "", description: "" }
  ]);
  const [budget, setBudget] = useState("99");

  initialiseUserId(setUserId);

  const onAddCandidate = e => {
    e.preventDefault();
    setCandidates([...candidates, { title: "", description: "" }]);
  };

  const onCreateElection = async e => {
    e.preventDefault();
    const election = {
      owner: userId,
      config: { name: electionName, budget: Number(budget) },
      candidates
    };
    const { id } = await createElection(election);
    Router.push(`/share?election=${id}`);
  };

  const onUpdateCandidate = (index, candidate) => {
    const newCandidates = cloneDeep(candidates);
    newCandidates[index] = candidate;
    setCandidates(newCandidates);
  };

  return (
    <div className="container">
      <div className="mt-4 mb-4">
        <h1>Create an election</h1>
      </div>
      <form>
        <div className="form-group">
          <label>Election Name</label>
          <input
            className="form-control"
            placeholder="Enter election name"
            value={electionName}
            onChange={e => setElectionName(e.target.value)}
          />
        </div>
        <label>Candidates:</label>
        {renderCandidates(candidates, onUpdateCandidate)}
        <button className="btn btn-light btn-block" onClick={onAddCandidate}>
          Add New Candidate
        </button>
        <div className="form-group">
          <label>Voter's Budget</label>
          <input
            className="form-control"
            placeholder="Enter Budget"
            value={budget}
            onChange={e => setBudget(e.target.value)}
          />
        </div>
        <button className="btn btn-dark btn-block" onClick={onCreateElection}>
          Create Election
        </button>
      </form>
    </div>
  );
};

export default Page;
