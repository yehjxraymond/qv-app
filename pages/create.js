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
const renderVoters = (voters, onUpdateVoter) => {
  const renderedVoters = voters.map((voter, id) => (
    <div key={id} className="p-2 mb-2 bg-white">
      <div>Name:</div>
      <input
        className="form-control"
        placeholder="Enter Name"
        value={voter.name}
        onChange={e => onUpdateVoter(id, { ...voter, name: e.target.value })}
      />
      <div>Email:</div>
      <input
        type="email"
        className="form-control"
        placeholder="Enter Email"
        value={voter.description}
        onChange={e => onUpdateVoter(id, { ...voter, email: e.target.value })}
      />
    </div>
  ));
  return <>{renderedVoters}</>;
};

const Options = ({
  budget,
  setBudget,
  showOptions,
  privateElection,
  setPrivateElection,
  voters,
  onUpdateVoter,
  onAddVoter
}) => {
  if (!showOptions) return null;
  return (
    <div className="bg-light p-2">
      <div className="form-group">
        <label>Voter's Budget</label>
        <input
          className="form-control"
          placeholder="Enter Budget"
          value={budget}
          onChange={e => setBudget(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Election Privacy</label>
        <div className="custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customSwitches"
            checked={privateElection}
            onChange={() => setPrivateElection(!privateElection)}
            readOnly
          />
          <label className="custom-control-label" htmlFor="customSwitches">
            {privateElection ? "Private" : "Public"} Election
          </label>
        </div>
      </div>
      {privateElection ? (
        <div>
          <label>Invited Voters:</label>
          {renderVoters(voters, onUpdateVoter)}
          <button className="btn btn-dark btn-block" onClick={onAddVoter}>
            Add New Voter
          </button>
        </div>
      ) : null}
    </div>
  );
};

const Page = () => {
  const [userId, setUserId] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [privateElection, setPrivateElection] = useState(false);
  const [electionName, setElectionName] = useState("");
  const [candidates, setCandidates] = useState([
    { title: "", description: "" },
    { title: "", description: "" }
  ]);
  const [voters, setVoters] = useState([
    { name: "", email: "" },
    { name: "", email: "" }
  ]);
  const [budget, setBudget] = useState("99");

  initialiseUserId(setUserId);

  const onAddCandidate = e => {
    e.preventDefault();
    setCandidates([...candidates, { title: "", description: "" }]);
  };

  const onAddVoter = e => {
    e.preventDefault();
    setVoters([...voters, { name: "", email: "" }]);
  };

  const onCreateElection = async e => {
    try {
      e.preventDefault();
      const election = {
        owner: userId,
        config: { name: electionName, budget: Number(budget) },
        candidates
      };
      if (privateElection) {
        election.config = {
          ...election.config,
          private: privateElection,
          invite: voters
        };
      }
      const { id } = await createElection(election);
      if (!privateElection) {
        Router.push(`/share?election=${id}`);
      } else {
        Router.push(`/share-private?election=${id}&userId=${userId}`);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const onUpdateCandidate = (index, candidate) => {
    const newCandidates = cloneDeep(candidates);
    newCandidates[index] = candidate;
    setCandidates(newCandidates);
  };

  const onUpdateVoter = (index, voter) => {
    const newVoters = cloneDeep(voters);
    newVoters[index] = voter;
    setVoters(newVoters);
  };

  return (
    <div className="container">
      <div className="mt-4 mb-4">
        <h1>Create an election</h1>
      </div>
      <form>
        <div className="form-group">
          <label>Election Name</label>
          <div className="d-flex align-items-center">
            <input
              className="form-control d-inline-block"
              placeholder="Enter election name"
              value={electionName}
              onChange={e => setElectionName(e.target.value)}
            />
            <div className="p-2" onClick={() => setShowOptions(!showOptions)}>
              <i class="fas fa-sliders-h d-inline-block"></i>
            </div>
          </div>
        </div>
        <Options
          setBudget={setBudget}
          budget={budget}
          showOptions={showOptions}
          privateElection={privateElection}
          setPrivateElection={setPrivateElection}
          voters={voters}
          onUpdateVoter={onUpdateVoter}
          onAddVoter={onAddVoter}
        />
        <label>Candidates:</label>
        {renderCandidates(candidates, onUpdateCandidate)}
        <button className="btn btn-light btn-block" onClick={onAddCandidate}>
          Add New Candidate
        </button>
        <button className="btn btn-dark btn-block" onClick={onCreateElection}>
          Create Election
        </button>
      </form>
    </div>
  );
};

export default Page;
