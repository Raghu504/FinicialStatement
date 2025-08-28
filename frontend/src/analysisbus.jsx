import React from "react";
import "./analysis.css";
import analysisimg from "./images/analysis.png";

function Analysis() {
  return (
    <div className="analysis-container">
      <a href="/fullanalysis">Analysis</a>
      <p>In depth insights into business<br></br> performance</p>
      <img src={analysisimg} alt="Analysis" />
    </div>
  );
}

export default Analysis;
