import React from 'react';
import { BarChart2, Contact, Layout, LogOut, Rocket } from 'lucide-react';
import './Headerbus.css';
import { useNavigate } from 'react-router-dom';
const Headerbus = () => {
    const navigate=useNavigate();
    const handlelogout = () => {
        localStorage.clear(); // Clear local storage
        navigate("/"); // Redirect to home
    };
  return (
    <header className="header-container2">
      <div className="header-inner">
        {/* Logo and Company Name */}
        <div className="logo-container1">
          <Rocket className="logo-icon" />
          <a href="/homebus" className="company-name">FinanceAI</a>
        </div>

        {/* Navigation Items */}
        <nav className="nav-items1">
          <ul>
            <li>
              <a href="/import" className="nav-link1">
                <BarChart2 className="nav-icon" />
                <span className="nav-text1">Analytics</span>
              </a>
            </li>
            <li>
              <a href="/contact" className="nav-link1">
                <Contact className="nav-icon" />
                <span className="nav-text1">Contact</span>
              </a>
            </li>
            <li>
              <a href="/features" className="nav-link1">
                <Layout className="nav-icon" />
                <span className="nav-text1">Features</span>
              </a>
            </li>
            <li>
              <button
                className="logout-button1"
                onClick={handlelogout}
              >
                <LogOut className="nav-icon" />
                <a className="nav-text1">Logout</a>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Headerbus;