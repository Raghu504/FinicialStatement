import "./businessupload.css";
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// Import the image if you’re using Webpack or a bundler
import rules from "./images/image.png";
import Headerbus from "./headerbis";
function Businessupload() {
    const navigate=useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
    const handleUpload = async () => {
        if (!selectedFile) return;
    
        const formData = new FormData();
        formData.append('file', selectedFile);
    
        try {
          const response = await axios.post('http://localhost:4000/busupload', formData);
          console.log(response.data);
          alert('File uploaded successfully!');
          navigate("/analysis");
        } catch (error) {
          console.error(error);
          alert('Error uploading file');
        }
      };
    
  return (
    <div>
      <Headerbus />
    <div className="business-upload-container">
      <h1>Import Excel</h1>
      <p>Import your financial data from Excel (.xlsx or .csv)</p>

      <div className="file-input">
        <label htmlFor="fileUpload">Choose a file to upload</label>
        <input type="file" id="fileUpload" onChange={handleFileChange}/>
        <button onClick={handleUpload}>Upload</button>
      </div>

      {/* Display the rules or guidelines image */}
      <img src={rules} alt="Guidelines for file import" />
    </div>
    </div>
  );
}

export default Businessupload;
