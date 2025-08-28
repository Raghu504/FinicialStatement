import React from "react";
import Header from "./header";
import { ArrowRight } from 'lucide-react';
import './landingpage.css';
import Footer from "./footer.jsx"
function Landing() {
  return (
    <div className="landing-page">
      <div className="background-overlay"></div>
      
      <Header />
      
      <main className="main-content">
        <div className="content-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Financial Statement Predictive Analysis
            </h1>
            
            <p className="hero-description">
              Gain insights into your financial health with our powerful predictive analytics.
              Our platform analyzes financial statements, predicts future income, debt trends, and
              credit scores using advanced machine learning models.
            </p>
            
            <div className="cta-container">
              <button className="cta-button">
                Get Started
                <ArrowRight className="arrow-icon" />
              </button>
              
              <a href="#demo" className="demo-link">
                Watch demo <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Landing;