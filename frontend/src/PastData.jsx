import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./pastcss.css"; // Importing the CSS

function PastDataVisualization() {
    const [barData, setBarData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const email = JSON.parse(localStorage.getItem("emailz"))?.email;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("http://localhost:5000/pastdata", { email });
                if (response.data.success) {
                    setBarData(response.data.data.barChart);
                    setLineData(response.data.data.lineChart);
                }
            } catch (error) {
                console.error("Error fetching past data:", error);
            }
        };

        if (email) {
            fetchData();
        }
    }, [email]);

    return (
        <div className="past-data-container">
            <h2>Past Data Visualization</h2>

            {/* Bar Chart: Income, Expenses, Debt, Investments, Loan Amount */}
            <h3>Financial Overview</h3>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="created_at" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="income" fill="#8884d8" />
                        <Bar dataKey="expenses" fill="#82ca9d" />
                        <Bar dataKey="debt" fill="#ff0000" />
                        <Bar dataKey="investments" fill="#ff7300" />
                        <Bar dataKey="loan_amount" fill="#0088FE" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Line Chart: Investments and Loan Amount Over Time */}
            <h3>Investments & Loan Amount Over Time</h3>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="created_at" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="investments" stroke="#ff7300" />
                        <Line type="monotone" dataKey="loan_amount" stroke="#0088FE" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default PastDataVisualization;
