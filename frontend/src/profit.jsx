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
function Profit() {
  const [profitData, setProfitData] = useState([]);

  useEffect(() => {
    async function fetchProfitData() {
      try {
        const response = await axios.get("http://localhost:4000/api/profit");
        setProfitData(response.data);
      } catch (error) {
        console.error("Error fetching profit data:", error);
      }
    }
    fetchProfitData();
  }, []);

  return (
    <div>
        <Fullanalysis />
    <div className="container">
      <h1>Profit Trend</h1>
      {profitData.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <>
          <h2>Bar Graph</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Bar dataKey="Profit" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <h2>Line Graph</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="Profit" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
    </div>
  );
}

export default Profit;
