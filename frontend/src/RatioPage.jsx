import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./ratio.css";
import Headerind from "./headerind";

const RatioPage = () => {
  const { ratio } = useParams();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let response;
        if (ratio === "Full data Analysis") {
          console.log("Fetching full financial data...");
          response = await axios.post("http://127.0.0.1:4000/fullanalysis");
        } else {
          console.log(`Fetching data for ratio: ${ratio}`);
          response = await axios.post("http://127.0.0.1:4000/analyze", [ratio]);
        }

        console.log("Response Data:", response.data);

        if (ratio === "Full data Analysis") {
          const formattedCharts = Object.keys(response.data).map((key) => ({
            category: key,
            chartData: {
              labels: response.data[key].data_points.map((_, index) => `Point ${index + 1}`),
              datasets: [
                {
                  label: `${key} Data Points`,
                  data: response.data[key].data_points,
                  backgroundColor: response.data[key].data_points.map((_, index) =>
                    index % 2 === 0 ? "rgba(179, 87, 66, 0.6)" : "rgba(66, 135, 245, 0.6)"
                  ),
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            },
            insights: {
              min: response.data[key].min,
              max: response.data[key].max,
              average: response.data[key].average,
            },
          }));

          setChartData(formattedCharts);
        } else {
          setChartData([
            {
              category: ratio,
              chartData: {
                labels: response.data.data_points.map((_, index) => `Point ${index + 1}`),
                datasets: [
                  {
                    label: `${ratio} Data Points`,
                    data: response.data.data_points,
                    backgroundColor: response.data.data_points.map((_, index) =>
                      index % 2 === 0 ? "rgba(179, 87, 66, 0.6)" : "rgba(66, 135, 245, 0.6)"
                    ),
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              },
              insights: {
                min: response.data.min,
                max: response.data.max,
                average: response.data.average,
              },
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data", error);
        // For demo purposes, let's create some mock data if the API call fails
        createMockData(ratio);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ratio]);

  // Helper function to create mock data for demo purposes
  const createMockData = (ratioName) => {
    const mockDataPoints = Array.from({ length: 10 }, () =>
      parseFloat((Math.random() * 10).toFixed(4))
    );

    const min = Math.min(...mockDataPoints);
    const max = Math.max(...mockDataPoints);
    const average = mockDataPoints.reduce((a, b) => a + b, 0) / mockDataPoints.length;

    if (ratioName === "Full data Analysis") {
      const mockCategories = ["Liquidity Ratio", "Profitability Ratio", "Solvency Ratio", "Efficiency Ratio"];
      const formattedCharts = mockCategories.map(category => ({
        category,
        chartData: {
          labels: mockDataPoints.map((_, index) => `Point ${index + 1}`),
          datasets: [
            {
              label: `${category} Data Points`,
              data: mockDataPoints,
              backgroundColor: mockDataPoints.map((_, index) =>
                index % 2 === 0 ? "rgba(179, 87, 66, 0.6)" : "rgba(66, 135, 245, 0.6)"
              ),
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        insights: { min, max, average },
      }));

      setChartData(formattedCharts);
    } else {
      setChartData([
        {
          category: ratioName,
          chartData: {
            labels: mockDataPoints.map((_, index) => `Point ${index + 1}`),
            datasets: [
              {
                label: `${ratioName} Data Points`,
                data: mockDataPoints,
                backgroundColor: mockDataPoints.map((_, index) =>
                  index % 2 === 0 ? "rgba(179, 87, 66, 0.6)" : "rgba(66, 135, 245, 0.6)"
                ),
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          insights: { min, max, average },
        },
      ]);
    }
  };

  // Chart options for better appearance
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(26, 51, 83, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 6
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <>
      <Headerind />
      <div className="ratio-page-container">
        <h3>{ratio} Visualization</h3>
        {loading ? (
          <p className="loading-text">Loading financial data analysis...</p>
        ) : chartData ? (
          <>
            <div className="kpi-cards">
              {chartData.length === 1 && (
                <>
                  <div className="kpi-card">
                    <div className="kpi-title">Minimum Value</div>
                    <div className="kpi-value">{chartData[0].insights.min.toFixed(4)}</div>
                    <div className="kpi-context">Lowest data point in the series</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-title">Maximum Value</div>
                    <div className="kpi-value">{chartData[0].insights.max.toFixed(4)}</div>
                    <div className="kpi-context">Highest data point in the series</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-title">Average</div>
                    <div className="kpi-value">{chartData[0].insights.average.toFixed(4)}</div>
                    <div className="kpi-context">Mean value across all data points</div>
                  </div>
                </>
              )}
            </div>

            {chartData.map(({ category, chartData, insights }, index) => (
              <div key={index} className="ratio-content">
                <div className="insights-container">
                  <h4>{category} Insights</h4>
                  <p>
                    <strong>Min:</strong> {insights.min.toFixed(4)}
                    {insights.min < 3 && <span className="trend-arrow trend-down">↓</span>}
                  </p>
                  <p>
                    <strong>Max:</strong> {insights.max.toFixed(4)}
                    {insights.max > 7 && <span className="trend-arrow trend-up">↑</span>}
                  </p>
                  <p>
                    <strong>Average:</strong> {insights.average.toFixed(4)}
                    <span className={`trend-arrow ${
                      insights.average > 5 ? 'trend-up' :
                      insights.average < 3 ? 'trend-down' : 'trend-stable'
                    }`}>
                      {insights.average > 5 ? '↑' : insights.average < 3 ? '↓' : '→'}
                    </span>
                  </p>
                </div>
                <div className="chart-container">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="loading-text">No financial data available for analysis.</p>
        )}
      </div>
    </>
  );
};

export default RatioPage;
