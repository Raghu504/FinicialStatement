import React from "react";
import Headerbus from "./headerbis";
import "./Landingbus.css";
import { TrendingUp, Users, Globe2, Award } from 'lucide-react';

function Landingbus() {
  return (
    <div className="landing-container">
      <Headerbus />
      <div className="content-wrapper">
        <section className="hero-section">
          <h1 className="hero-title">
            Transform Your Financial Future<br />
            With Expert Business Solutions
          </h1>
          <p className="hero-subtitle">
            Unlock growth opportunities and maximize your business potential with our
            comprehensive financial services and expert guidance.
          </p>
          <div className="cta-container">
            <button className="cta-button primary-cta">
              Get Started Now
            </button>
            <button className="cta-button secondary-cta">
              Learn More
            </button>
          </div>
        </section>

        <div className="stats-container">
          <div className="stat-item">
            <TrendingUp size={32} color="#3b82f6" />
            <div className="stat-number">95%</div>
            <div className="stat-label">Growth Rate</div>
          </div>
          <div className="stat-item">
            <Users size={32} color="#3b82f6" />
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Clients</div>
          </div>
          <div className="stat-item">
            <Globe2 size={32} color="#3b82f6" />
            <div className="stat-number">50+</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-item">
            <Award size={32} color="#3b82f6" />
            <div className="stat-number">25+</div>
            <div className="stat-label">Years Experience</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landingbus;