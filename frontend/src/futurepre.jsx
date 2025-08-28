import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./futurecss.css"
const FuturePredictions = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5002/fpredict")
      .then((response) => {
        if (response.data.success) {
          setPredictionData(response.data);
        } else {
          console.error("Prediction failed:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching prediction:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading predictions...</p>;
  if (!predictionData) return <p>No prediction data available.</p>;

  const { future_dates, predictions } = predictionData;
  const metrics = ["income", "debt", "credit_score", "loan_amount"];

  const lineChartData = {
    labels: future_dates,
    datasets: metrics.map((metric) => ({
      label: metric,
      data: predictions[metric],
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1,
    })),
  };

  const barChartData = {
    labels: metrics,
    datasets: [
      {
        label: "Final Day Predictions",
        data: metrics.map(
          (metric) => predictions[metric][predictions[metric].length - 1]
        ),
        backgroundColor: metrics.map(() => getRandomColor()),
      },
    ],
  };

  const incomeBarChartData = {
    labels: future_dates,
    datasets: [
      {
        label: "Income Predictions",
        data: predictions.income,
        backgroundColor: getRandomColor(),
      },
    ],
  };

  return (
    <div className="future-predictions-container">
   <h2>Future Predictions (Next 30 Days)</h2>

   <div className="chart-container">
      <h3>Line Chart</h3>
      <Line data={lineChartData} />
   </div>

   <div className="chart-container">
      <h3>Bar Chart (Final Day Predictions)</h3>
      <Bar data={barChartData} />
   </div>

   <div className="chart-container">
      <h3>Bar Chart (Income Predictions)</h3>
      <Bar data={incomeBarChartData} />
   </div>
</div>

  );
};

function getRandomColor() {
  const r = Math.floor(Math.random() * 156) + 100;
  const g = Math.floor(Math.random() * 156) + 100;
  const b = Math.floor(Math.random() * 156) + 100;
  return `rgba(${r}, ${g}, ${b}, 1)`;
}

export default FuturePredictions;
