import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { get, countBy } from "lodash";
import { Bar } from "react-chartjs-2";
import Link from "next/link";
import { getElection } from "../src/services/qv";
import { decryptElectionResults } from "../src/utils/electionDecrypt";

const renderCharts = (election) => {
  if (!election || !election.candidates) return null;
  const chartData = election.candidates.map((candidate) => ({
    title: candidate.title,
    votes: [],
  }));
  election.votes.forEach((vote) => {
    vote.votes.forEach((v) => {
      chartData[v.candidate].votes.push(v.vote);
    });
  });

  const renderedChart = chartData.map((chart, index) => {
    const count = countBy(chart.votes);
    const sorted = Object.keys(count)
      .map((key) => [key, count[key]])
      .sort((a, b) => a[0] - b[0]);
    const labels = sorted.map((s) => s[0]);
    const values = sorted.map((s) => s[1]);
    const option = {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };
    const data = {
      labels,
      datasets: [
        {
          data: values,
        },
      ],
    };
    return (
      <div key={index}>
        <div>{chart.title}</div>
        <Bar data={data} options={option} />
      </div>
    );
  });

  return renderedChart;
};

const Page = ({ router }) => {
  const [election, setElection] = useState();
  const electionId = get(router, "query.election");
  const userId = get(router, "query.userId", "");
  const privateKey = get(router, "query.privateKey");

  const fetchElection = async (id, uid) => {
    try {
      const election = await getElection(id, uid);
      if (privateKey) {
        const decryptedElection = await decryptElectionResults(
          election,
          privateKey
        );
        setElection(decryptedElection);
      } else {
        setElection(election);
      }
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
      {renderCharts(election)}
      <div className="mt-4 mb-4">
        <Link
          href={`/election?election=${electionId}${
            userId ? `&userId=${userId}` : ""
          }${privateKey ? `&privateKey=${privateKey}` : ""}`}
        >
          <button className="btn btn-dark btn-block mb-2">
            View Overall Results
          </button>
        </Link>
      </div>
    </div>
  );
};

export default withRouter(Page);
