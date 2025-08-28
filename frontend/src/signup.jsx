import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import logo from "./images/logopre.png"; // Ensure the logo is in the src folder

function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usern, setUsern] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    localStorage.setItem("roles", JSON.stringify({ role }));
    localStorage.setItem("emails", JSON.stringify({ email: username }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setError("");
        try {
            const data = { username: usern, email: username, password, role };
            const res = await axios.post("http://localhost:4000/signup", data);
            
            if (res.data.status === "success") {
                navigate("/login");
            } else {
                alert("An account already exists with this email");
                navigate(res.data.redirect);
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="signup-main">
            <div className="signup-container">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <h3 className="signup-title">SignUp</h3>
                
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input
                        className="signup-input"
                        type="text"
                        placeholder="Enter username"
                        required
                        onChange={(e) => setUsern(e.target.value)}
                        value={usern}
                    />
                    <input
                        className="signup-input"
                        type="email"
                        placeholder="Enter your email"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                    <input
                        className="signup-input"
                        type="password"
                        placeholder="Enter your password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <input
                        className="signup-input"
                        type="password"
                        placeholder="Confirm your password"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />

                    {error && <p className="error-message">{error}</p>}

                    <select
                        className="signup-select"
                        required
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="" disabled selected>
                            Select a Role
                        </option>
                        <option value="individual">Individual</option>
                        <option value="business">Business</option>
                    </select>

                    <button className="signup-submit" type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
