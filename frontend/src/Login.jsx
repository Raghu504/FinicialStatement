import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "./images/logopre.png"; // Ensure the logo image is in the src folder

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { username, password };

    try {
      const res = await axios.post("http://localhost:4000/login", data, {
        withCredentials: true,
      });

      if (res.data.status === "success") {
        localStorage.setItem("emailz", JSON.stringify({ email: res.data.email }));
        alert(res.data.id);

        if (res.data.role === "individual") {
          navigate("/homeind");
        } else if (res.data.role === "business") {
          navigate("/homebus");
        }
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error("Error during login", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="main1">
      <div className="form-container">
        <div className="logo-container1">
          <img src={logo} alt="Logo" className="logo1" />
        </div>
        <h3 className="login">Login</h3>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="email"
            placeholder="Enter your email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="form-button" type="submit">Submit</button>
          <p className="form-text">
            Don’t have an account? <a className="form-link" href="/signup">Signup</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
