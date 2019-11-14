import Link from "next/link";
import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { get } from "lodash";
import QRCode from "qrcode.react";

const Page = ({ router }) => {
  const [origin, setOrigin] = useState();
  const electionId = get(router, "query.election");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, [origin]);

  const url = `${origin}/vote?election=${electionId}`;

  return (
    <div className="container">
      <div>
        <h1>Share Your Voting Link</h1>
      </div>
      <div className="bg-light p-4">
        <div className="text-center">
          <QRCode value={url} size={200} />
        </div>
        <div className="text-center mt-4">
          <h3>
            <a href={url} className="text-dark">
              {url}
            </a>
          </h3>
        </div>
      </div>
      <div className="mt-2">
        <Link href={`/election?election=${electionId}`}>
          <button className="btn btn-dark btn-block">View Results</button>
        </Link>
      </div>
    </div>
  );
};

export default withRouter(Page);
