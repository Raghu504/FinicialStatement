import React from "react";
import { Link } from "react-router-dom";
import "./ratiosc.css";
import Headerind from "./headerind";

const ratioDescriptions = {
  "Debt-Income Ratio": "Measures the proportion of debt compared to total income. A higher ratio indicates financial stress.",
  "Savings Ratio": "Shows the percentage of income saved. A higher savings ratio means better financial security.",
  "Expense Ratio": "Compares expenses to income. A lower expense ratio means better financial management.",
  "Investment Ratio": "Indicates the portion of income allocated to investments. Higher investments mean stronger financial growth.",
  "Full data Analysis": "Comprehensive analysis of income, debt, expenses, loans, and investments for overall financial health."
};

const RatiosPage = ({ ratios = [] }) => {
  // Use sample ratios if none are provided
  const displayRatios = ratios?.length > 0
    ? ratios
    : ["Debt-Income Ratio", "Savings Ratio", "Expense Ratio", "Investment Ratio", "Full data Analysis"];

  // Sample financial stats summary
 
  return (
    <>
      <Headerind />
      <div className="ratios-container">
        

        <h2>Financial Ratios Analysis</h2>
        <p>Select a financial ratio to explore detailed insights and visualize trends to make better financial decisions.</p>

        <div className="ratios-grid">
          {displayRatios.map((ratio, index) => (
            <div key={index} className="ratio-card">
              <h3>{ratio}</h3>
              <p>{ratioDescriptions[ratio] || "Analysis of financial health metrics."}</p>
              <Link to={`/ratio/${ratio}`}>
                <button>View {ratio}</button>
              </Link>
            </div>
          ))}

          {displayRatios.length === 0 && (
            <p className="no-ratios">No ratios available. Please upload your financial statements for analysis.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default RatiosPage;
