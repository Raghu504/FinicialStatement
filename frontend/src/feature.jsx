import React from 'react';
import './Feature.css';

const Feature = () => {
  return (
    <div className="feature-container">
      <h1>Financial Statement Predictive Analysis</h1>
      <p>
        Our solution leverages advanced analytics and machine learning algorithms to forecast future financial performance based on historical data. Gain actionable insights to optimize your strategy and drive growth.
      </p>
      <ul className="feature-list">
        <li>
          <strong>Trend Forecasting:</strong> Predict future revenues, expenses, and cash flows by analyzing historical trends.
        </li>
        <li>
          <strong>Risk Assessment:</strong> Identify potential financial risks early and take corrective measures.
        </li>
        <li>
          <strong>Scenario Simulation:</strong> Evaluate “what-if” scenarios and understand the impact of various business decisions.
        </li>
        <li>
          <strong>Automated Insights:</strong> Receive automated recommendations and performance insights directly from your financial data.
        </li>
        <li>
          <strong>Interactive Visualizations:</strong> Explore your data with dynamic charts and dashboards to better understand key metrics.
        </li>
      </ul>
      <p>
        Embrace data-driven decision-making with our predictive analysis tools and stay ahead in today's competitive financial landscape.
      </p>
    </div>
  );
};

export default Feature;
