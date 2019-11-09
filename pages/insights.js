import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { get, countBy } from "lodash";
import { Bar } from "react-chartjs-2";
import { getElection } from "../src/services/qv";

const renderCharts = election => {
  if (!election || !election.candidates) return null;
  const chartData = election.candidates.map(candidate => ({
    title: candidate.title,
    votes: []
  }));
  election.votes.forEach(vote => {
    vote.votes.forEach(v => {
      chartData[v.candidate].votes.push(v.vote);
    });
  });

  const renderedChart = chartData.map((chart, index) => {
    const count = countBy(chart.votes);
    const sorted = Object.keys(count)
      .map(key => [key, count[key]])
      .sort((a, b) => a[0] - b[0]);
    const labels = sorted.map(s => s[0]);
    const values = sorted.map(s => s[1]);
    const option = {
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    };
    const data = {
      labels,
      datasets: [
        {
          data: values
        }
      ]
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

  const fetchElection = async id => {
    const election = await getElection(id);
    setElection(election);
  };

  useEffect(() => {
    if (!election && electionId) fetchElection(electionId);
  }, [electionId]);

  if (!election) return null;
  return (
    <div className="container">
      <div>
        <h1>{election.config.name}</h1>
      </div>
      {renderCharts(election)}
    </div>
  );
};

export default withRouter(Page);
