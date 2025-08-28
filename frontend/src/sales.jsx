import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import "./sales.css";
import Fullanalysis from "./fullanalysis";
function Sales() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/forecast")
      .then((res) => {
        setChartData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching forecast data:", err);
        setError("Error fetching forecast data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="message">Loading forecast data...</div>;
  }

  if (error) {
    return <div className="message error">{error}</div>;
  }

  return (
    <div>
      <Fullanalysis />
    <div className="chart-container">
      <h1>LSTM Sales Forecast</h1>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Predicted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>
  );
}

export default Sales;
