import Link from "next/link";
import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { get } from "lodash";

const Page = ({ router }) => {
  const [origin, setOrigin] = useState();
  const electionId = get(router, "query.election");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, [origin]);

  const url = `${origin}/vote?election=${electionId}`;

  return (
    <div className="container">
      <div className="text-center">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${url}`}
        ></img>
      </div>
      <div className="text-center m-2">
        <h3>
          <a href={url}>{url}</a>
        </h3>
      </div>
      <div className="m-2">
        <Link href={`/election?election=${electionId}`}>
          <button className="btn btn-primary btn-block">View Results</button>
        </Link>
      </div>
    </div>
  );
};

export default withRouter(Page);
