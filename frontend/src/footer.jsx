import React from "react";
import "./footer.css"
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h2>About Us</h2>
          <p>
            We connect tutors and tutees seamlessly, fostering an environment where learning and teaching thrive.  
            Our platform ensures that education becomes accessible and impactful.
          </p>
        </div>

        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/tutormain">Tutor Dashboard</a></li>
            <li><a href="/tuteemain">Tutee Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/book">Book a Tutor</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://facebook.com"><FaFacebook /></a>
            <a href="https://twitter.com"><FaTwitter /></a>
            <a href="https://linkedin.com"><FaLinkedin /></a>
            <a href="mailto:support@tutoring.com"><FaEnvelope /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Tutor-Tutee Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
