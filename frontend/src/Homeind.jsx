import React from "react";
import Headerind from "./headerind";
import { BarChart3, TrendingUp, FileText, Clock } from "lucide-react";
import "./landing.css";

function Homeind() {
  return (
    <div className="landing-container">
      <Headerind />
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Financial Intelligence at Your Fingertips</h1>
          <p className="hero-subtitle">
            Transform your financial future with our advanced AI-powered prediction and analysis tools
          </p>
        </div>
      </section>

      <div className="features-grid">
        <div className="feature-card">
          <BarChart3 className="feature-icon" />
          <h3 className="feature-title">Predictive Analysis</h3>
          <p className="feature-description">
            Leverage advanced algorithms to predict market trends and optimize your financial decisions
          </p>
        </div>

        <div className="feature-card">
          <TrendingUp className="feature-icon" />
          <h3 className="feature-title">Real-time Insights</h3>
          <p className="feature-description">
            Access live market data and instant analysis to stay ahead of market movements
          </p>
        </div>

        <div className="feature-card">
          <FileText className="feature-icon" />
          <h3 className="feature-title">Historical Data</h3>
          <p className="feature-description">
            Deep dive into comprehensive historical data to identify patterns and trends
          </p>
        </div>

        <div className="feature-card">
          <Clock className="feature-icon" />
          <h3 className="feature-title">Future Predictions</h3>
          <p className="feature-description">
            Anticipate market opportunities with our advanced forecasting models
          </p>
        </div>
      </div>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Prediction Accuracy</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">1</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5</div>
            <div className="stat-label">Data Points Analyzed</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homeind;