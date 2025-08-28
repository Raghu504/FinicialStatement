import React from 'react';
import './homeind.css';
import { useNavigate } from 'react-router-dom';
const Headerind = () => {
  const navigate=useNavigate();
    const handlelogout = () => {
        localStorage.clear(); // Clear local storage
        navigate("/"); // Redirect to home
    };
  return (
    <header className="header4">
      <div className="left-section4">
        <a href='/homeind' className="header-title4">Financial Dashboard</a>
        <nav className="nav-container4">
          <a href="/fileup" className="nav-item4">Predict</a>
          <a href="/features" className="nav-item4">Features</a>
          <a href="/pastdata" className="nav-item4">PastData</a>
          <a href="/future" className="nav-item4">FuturePrediction</a>
          <a href="/contact" className="nav-item4">Contact Us</a>
        </nav>
      </div>
      <button onClick={handlelogout} className="logout-button4">Logout</button>
    </header>
  );
};

export default Headerind;