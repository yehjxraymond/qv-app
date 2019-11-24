import React, { useState, useCallback } from "react";
import { cloneDeep } from "lodash";
import { csv } from "csvtojson";
import initialiseUserId from "../src/utils/initialiseUserId";
import { createElection } from "../src/services/qv";
import { useDropzone } from "react-dropzone";
import Router from "next/router";

const renderCandidates = (candidates, onUpdateCandidate) => {
  const renderedCandidates = candidates.map((candidate, id) => (
    <div key={id} className="p-2 mb-2 bg-light">
      <div>Title*:</div>
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
      <div>Name*:</div>
      <input
        className="form-control"
        placeholder="Enter Name"
        value={voter.name}
        onChange={e => onUpdateVoter(id, { ...voter, name: e.target.value })}
      />
      <div>Email*:</div>
      <input
        type="email"
        className="form-control"
        placeholder="Enter Email"
        value={voter.email}
        onChange={e => onUpdateVoter(id, { ...voter, email: e.target.value })}
      />
    </div>
  ));
  return <>{renderedVoters}</>;
};

const VoterDropZone = ({ setVoters, toggleCsvVoter }) => {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles[0]) {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        csv({ delimiter: "auto" })
          .fromString(reader.result)
          .then(result => {
            setVoters(result);
            if (toggleCsvVoter) toggleCsvVoter();
          });
      };
      reader.readAsText(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="d-flex flex-column align-items-center m-4">
          <i className="fas fa-file-upload m-2" style={{ fontSize: "5em" }}></i>
          <div className="mt-2">Drop list of voters here</div>
          <div className="mb-2" style={{ fontSize: "0.8em" }}>
            (Sample .csv below)
          </div>
        </div>
      </div>
      <a href="/static/csv/voters.csv" download>
        <i className="fas fa-file-download m-2"></i>
        Download Sample CSV Here
      </a>
    </div>
  );
};

const CandidateDropZone = ({ setCandidates, toggleCsvCandidate }) => {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles[0]) {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        csv({ delimiter: "auto" })
          .fromString(reader.result)
          .then(result => {
            setCandidates(result);
            if (toggleCsvCandidate) toggleCsvCandidate();
          });
      };
      reader.readAsText(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="d-flex flex-column align-items-center m-4">
          <i className="fas fa-file-upload m-2" style={{ fontSize: "5em" }}></i>
          <div className="mt-2">Drop list of candidates here</div>
          <div className="mb-2" style={{ fontSize: "0.8em" }}>
            (Sample .csv below)
          </div>
        </div>
      </div>
      <a href="/static/csv/candidates.csv" download>
        <i className="fas fa-file-download m-2"></i>
        Download Sample CSV Here
      </a>
    </div>
  );
};

const Options = ({
  budget,
  setBudget,
  showOptions,
  privateElection,
  setPrivateElection,
  voters,
  onUpdateVoter,
  setVoters,
  onAddVoter,
  notifyInvites,
  setNotifyInvites
}) => {
  const [csvVoter, setCsvVoter] = useState(false);
  const toggleCsvVoter = () => setCsvVoter(!csvVoter);
  if (!showOptions) return null;
  return (
    <div className="bg-light p-2">
      <div className="form-group">
        <label>Voter's Budget*:</label>
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
            id="privateSwitch"
            checked={privateElection}
            onChange={() => setPrivateElection(!privateElection)}
            readOnly
          />
          <label className="custom-control-label" htmlFor="privateSwitch">
            {privateElection ? "Private" : "Public"} Election
          </label>
        </div>
      </div>
      {privateElection ? (
        <div className="form-group">
          <div className="custom-switch">
            <input
              type="checkbox"
              className="custom-control-input"
              id="notifySwitch"
              checked={notifyInvites}
              onChange={() => setNotifyInvites(!notifyInvites)}
              readOnly
            />
            <label className="custom-control-label" htmlFor="notifySwitch">
              {notifyInvites ? "Email" : "Do Not Email"} Invited Voters
            </label>
          </div>
        </div>
      ) : null}
      {privateElection ? (
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="m-0">
              <label>Invited Voters:</label>
            </div>
            <div
              className="p-2"
              onClick={toggleCsvVoter}
              style={{ fontSize: "1.5em" }}
            >
              {csvVoter ? (
                <i class="fas fa-file-alt"></i>
              ) : (
                <i className="fas fa-file-csv"></i>
              )}
            </div>
          </div>
          {csvVoter ? (
            <VoterDropZone
              setVoters={setVoters}
              toggleCsvVoter={toggleCsvVoter}
            />
          ) : (
            <div>
              {renderVoters(voters, onUpdateVoter)}
              <button className="btn btn-dark btn-block" onClick={onAddVoter}>
                Add New Voter
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

const Page = () => {
  const [userId, setUserId] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [privateElection, setPrivateElection] = useState(false);
  const [csvCandidate, setCsvCandidate] = useState(false);
  const [notifyInvites, setNotifyInvites] = useState(false);
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
  const toggleCsvCandidate = () => setCsvCandidate(!csvCandidate);

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
          notifyInvites,
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
          <label>Election Name*:</label>
          <div className="d-flex align-items-center">
            <input
              className="form-control d-inline-block"
              placeholder="Enter election name"
              value={electionName}
              onChange={e => setElectionName(e.target.value)}
            />
            <div className="p-2" onClick={() => setShowOptions(!showOptions)}>
              <i className="fas fa-sliders-h d-inline-block"></i>
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
          setVoters={setVoters}
          notifyInvites={notifyInvites}
          setNotifyInvites={setNotifyInvites}
        />
        <div className="d-flex align-items-center justify-content-between">
          <div className="m-0">
            <label>Candidates:</label>
          </div>
          <div
            className="p-2"
            onClick={toggleCsvCandidate}
            style={{ fontSize: "1.5em" }}
          >
            {csvCandidate ? (
              <i class="fas fa-file-alt"></i>
            ) : (
              <i className="fas fa-file-csv"></i>
            )}
          </div>
        </div>
        {csvCandidate ? (
          <CandidateDropZone
            toggleCsvCandidate={toggleCsvCandidate}
            setCandidates={setCandidates}
          />
        ) : (
          <div>
            {renderCandidates(candidates, onUpdateCandidate)}
            <button
              className="btn btn-light btn-block"
              onClick={onAddCandidate}
            >
              Add New Candidate
            </button>
          </div>
        )}

        <button className="btn btn-dark btn-block" onClick={onCreateElection}>
          Create Election
        </button>
      </form>
    </div>
  );
};

export default Page;
