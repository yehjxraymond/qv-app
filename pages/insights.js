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
    const option = {
      //   tooltips: { enabled: false },
      legend: {
        display: false
      }
    };
    const data = {
      labels: Object.keys(count),

      datasets: [
        {
          //   backgroundColor: "rgba(255,99,132,0.2)",
          //   borderColor: "rgba(255,99,132,1)",
          //   borderWidth: 1,
          //   hoverBackgroundColor: "rgba(255,99,132,0.4)",
          //   hoverBorderColor: "rgba(255,99,132,1)",
          data: Object.keys(count).map(key => count[key])
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
