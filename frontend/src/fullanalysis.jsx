import React from "react";
import "./fullanalysis.css";
import Headerbus from "./headerbis";
function Fullanalysis() {
  return (
    <div>
      <Headerbus />
    <div className="analysis-nav">
      <a className="analysis-link" href="/kpis">KPIs</a>
      <a className="analysis-link" href="/sales">Sales</a>
      <a className="analysis-link" href="/profit">Profit</a>
      <a className="analysis-link" href="/cashflow">Cash flow</a>
      <a className="analysis-link" href="/trend">Trend</a>
    </div>
    </div>
  );
}

export default Fullanalysis;
