import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./fileuploadc.css";
import Headerind from "./headerind";

const FileUpload = ({ setRatios }) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const email = JSON.parse(localStorage.getItem("emailz"))?.email;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (file) {
      console.log(`File selected: ${file.name}`);
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
      const response = await axios.post("http://localhost:4000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setRatios(response.data.ratios);
      navigate("/ratios"); // Redirect to ratios page
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div>
      <Headerind />
    <div className="container">
      <h2>Financial Statement Analysis</h2>
      <p>
        Upload your CSV file containing your financial data to get an in-depth analysis of your <br />
        **Income, Debt, Expenses, Loan Amount, and Investments.**
      </p>

      <div className="upload-box">
        <label className="file-label">
          Choose File
          <input type="file" onChange={handleFileChange} />
        </label>
        {file && <p>Selected file: {file.name}</p>}
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
    </div>
  );
};

export default FileUpload;
