import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function ChartDisplay({ chartData }) {
    if (!chartData || chartData.datasets.length === 0) {
        return <p>No data available for visualization.</p>;
    }

    const data = {
        labels: chartData.labels,
        datasets: chartData.datasets.map(dataset => ({
            ...dataset,
            borderColor: "#" + Math.floor(Math.random()*16777215).toString(16), // Random color for each dataset
            fill: false,
        }))
    };

    return (
        <div style={{ width: "80%", margin: "auto" }}>
            <h2>Financial Chart</h2>
            <Line data={data} />
        </div>
    );
}

export default ChartDisplay;
