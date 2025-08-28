import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cashf.css";
import Fullanalysis from "./fullanalysis";

function Cashflow() {
  const [cashFlowData, setCashFlowData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:4000/api/cash-flow");
        setCashFlowData(response.data);
        if (response.data.length > 0) {
          setSelectedMonth(response.data[0].Month);
        }
      } catch (error) {
        console.error("Error fetching cash flow data:", error);
      }
    }
    fetchData();
  }, []);

  const months = cashFlowData.map((item) => item.Month);
  const monthData = cashFlowData.find((item) => item.Month === selectedMonth);

  return (
    <div>
        <Fullanalysis />
    <div className="container1">
      <h1>Cash Flow Metrics</h1>
      <div className="month-selector">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={m === selectedMonth ? "active" : ""}
          >
            {m}
          </button>
        ))}
      </div>

      {monthData ? (
        <div className="cash-flow-details">
          <h2>Data for {monthData.Month}</h2>
          <div className="cash-flow-item">
            <strong>Revenue:</strong>
            <span>₹{monthData.Revenue.toLocaleString()}</span>
          </div>
          <div className="cash-flow-item">
            <strong>Cost of Sales:</strong>
            <span>₹{monthData["Cost of Sales"].toLocaleString()}</span>
          </div>
          <div className="cash-flow-item">
            <strong>Expenses:</strong>
            <span>₹{monthData.Expenses.toLocaleString()}</span>
          </div>
          <div className="cash-flow-item">
            <strong>Other Income:</strong>
            <span>₹{monthData["Other Income"].toLocaleString()}</span>
          </div>
          <div className="cash-flow-item">
            <strong>Cash Tax Paid:</strong>
            <span>₹{monthData["Cash Tax Paid"].toLocaleString()}</span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Accounts Payable:</strong>
            <span>
              ₹{monthData["Change in Accounts Payable"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Other Current Liabilities:</strong>
            <span>
              ₹{monthData["Change in Other Current Liabilities"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Accounts Receivable:</strong>
            <span>
              ₹{monthData["Change in Accounts Receivable"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Inventory:</strong>
            <span>₹{monthData["Change in Inventory"].toLocaleString()}</span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Work In Progress:</strong>
            <span>
              ₹{monthData["Change in Work In Progress"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Other Current Assets:</strong>
            <span>
              ₹{monthData["Change in Other Current Assets"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Fixed Assets:</strong>
            <span>
              ₹{monthData["Change in Fixed Assets"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Intangible Assets:</strong>
            <span>
              ₹{monthData["Change in Intangible Assets"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Investments:</strong>
            <span>
              ₹{monthData["Change in Investments"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Net Interest (after tax):</strong>
            <span>
              ₹{monthData["Net Interest (after tax)"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Other Non-Current Liabilities:</strong>
            <span>
              ₹{monthData["Change in Other Non-Current Liabilities"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Dividends:</strong>
            <span>₹{monthData.Dividends.toLocaleString()}</span>
          </div>
          <div className="cash-flow-item">
            <strong>Change in Retained Earnings:</strong>
            <span>
              ₹{monthData["Change in Retained Earnings"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item">
            <strong>Adjustments:</strong>
            <span>₹{monthData.Adjustments.toLocaleString()}</span>
          </div>
          <hr />
          <div className="cash-flow-item highlight">
            <strong>Operating Cash Flow:</strong>
            <span>
              ₹{monthData["Operating Cash Flow"].toLocaleString()}
            </span>
          </div>
          <div className="cash-flow-item highlight">
            <strong>Free Cash Flow:</strong>
            <span>₹{monthData["Free Cash Flow"].toLocaleString()}</span>
          </div>
          <div className="cash-flow-item highlight">
            <strong>Net Cash Flow:</strong>
            <span>₹{monthData["Net Cash Flow"].toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
    </div>
  );
}

export default Cashflow;
