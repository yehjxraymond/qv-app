import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { get } from "lodash";
import Link from "next/link";
import QRCode from "qrcode.react";
import { getElection } from "../src/services/qv";

const VoterList = ({ voters, origin, electionId }) => {
  if (!voters) return null;
  const renderedVoters = voters.map((voter, index) => {
    const url = `${origin}/vote?election=${electionId}&userId=${voter.voterId}`;
    return (
      <div
        key={index}
        className="row bg-light mt-4 p-4 d-flex flex-column-reverse flex-md-row justify-content-between"
      >
        <div
          className="d-flex flex-column justify-content-between"
          style={{ maxWidth: 600 }}
        >
          <h2>{voter.name}</h2>
          <div>
            <a href={url} className="text-dark">
              {url}
            </a>
          </div>
        </div>
        <div className="text-center mb-md-0 mb-4">
          <QRCode value={url} size={200} />
        </div>
      </div>
    );
  });
  return <div className="container">{renderedVoters}</div>;
};

const Page = ({ router }) => {
  const [origin, setOrigin] = useState();
  const [election, setElection] = useState();
  const electionId = get(router, "query.election");
  const userId = get(router, "query.userId", "");
  const privateKey = get(router, "query.privateKey");

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

  useEffect(() => {
    setOrigin(window.location.origin);
  }, [origin]);

  if (!election) return null;
  return (
    <div className="container">
      <div>
        <h1>Private voting links for &#34;{election.config.name}&#34;</h1>
      </div>
      <VoterList
        voters={election.config.invite}
        origin={origin}
        electionId={electionId}
      />
      <div className="mt-4 mb-4">
        <Link
          href={`/election?election=${electionId}${
            userId ? `&userId=${userId}` : ""
          }${privateKey ? `&privateKey=${privateKey}` : ""}`}
        >
          <button className="btn btn-dark btn-block mb-2">View Results</button>
        </Link>
      </div>
    </div>
  );
};

export default withRouter(Page);
