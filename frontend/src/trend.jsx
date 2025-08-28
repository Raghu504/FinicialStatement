import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import Fullanalysis from "./fullanalysis";
function Trend() {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    async function fetchRevenueData() {
      try {
        const response = await axios.get("http://localhost:4000/api/revenue");
        setRevenueData(response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    }
    fetchRevenueData();
  }, []);

  return (
    <div>
        <Fullanalysis />
    <div className="container">
      <h1>Revenue Trend</h1>
      {revenueData.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <>
          <h2>Bar Graph</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <h2>Line Graph</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Revenue" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
    </div>
  );
}

export default Trend;
