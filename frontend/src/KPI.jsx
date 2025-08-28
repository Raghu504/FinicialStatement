import React, { useEffect, useState } from "react";
import axios from "axios";
import "./kpis.css";
import Fullanalysis from "./fullanalysis";
function App() {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/kpis")
      .then((response) => {
        setKpiData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching KPI data:", err);
        setError("Error fetching KPI data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="message">Loading...</div>;
  }

  if (error) {
    return <div className="message error">{error}</div>;
  }

  return (
    <div>
      <Fullanalysis />
    <div className="kpi-container">
      {kpiData.map((category, index) => (
        <table className="kpi-table" key={index}>
          <thead>
            {/* 1st row: category name */}
            <tr>
              <th colSpan="5" className="category-heading">
                {category.category}
              </th>
            </tr>
            {/* 2nd row: table column headings */}
            <tr className="kpi-header">
              <th>RESULT</th>
              <th>TARGET</th>
              <th>vs TARGET</th>
              <th>TREND</th>
              <th>IMPORTANCE</th>
            </tr>
          </thead>
          <tbody>
            {category.rows.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Row for the KPI name, spanning all 5 columns */}
                <tr>
                  <td colSpan="5" className="kpi-name-row">
                    {row.kpiName}
                  </td>
                </tr>
                {/* Row for the KPI data */}
                <tr>
                  <td>{row.result}</td>
                  <td>{row.target}</td>
                  <td>{row.vsTarget}</td>
                  <td
                    className={
                      row.vsTarget === "✓" ? "positive" : "negative"
                    }
                  >
                    {row.trend}
                  </td>
                  <td>{row.importance}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ))}
    </div>
    </div>
  );
}

export default App;
