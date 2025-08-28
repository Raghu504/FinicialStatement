import React from "react";
import { useNavigate } from "react-router-dom";
import logoImage from './images/logopre.png'; 
import './Contactus.css'; // Import the CSS file

function Contactus() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    };

    return (
        <div className="contact-container">
            <div className="logo-v2" onClick={handleClick}>
                <img src={logoImage} alt="Logo" className="logo-image-v2" />
            </div>
            <h1 className="contact-heading">Contact Us</h1>
            <p className="contact-text">If you have any questions, feel free to reach out to us!</p>
            <p className="contact-email">Email: contact@mywebsite.com</p>
            <p className="contact-phone">Phone: +123 456 7890</p>
        </div>
    );
}

export default Contactus;