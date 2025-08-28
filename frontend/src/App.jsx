import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./landing";
import FileUpload from "./fileupload";
import Login from "./Login";
import Signup from "./signup";
import Homeind from "./Homeind";
import RatiosPage from "./RatiosPage";
import RatioPage from "./RatioPage";
import Pastdata from "./PastData"
import Futurepred from "./futurepre";
import Landingbus from "./Landingbus";
import Businessupload from "./businessupload";
import Analysis from "./analysisbus";
import Fullanalysis from "./fullanalysis";
import Kpis from "./KPI";
import Sales from "./sales";
import Cashflow from "./cashflow";
import Trend from "./trend"
import Profit from "./profit";
import Contactus from "./contactus";
import Feature from "./feature";
function App() {
  const [ratios, setRatios] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homeind" element={<Homeind />} />
        <Route path="/fileup" element={<FileUpload setRatios={setRatios} />} />
        {/* <Route path="/predict" element={<All />} /> */}
        <Route path="/ratios" element={<RatiosPage ratios={ratios} />} />
        <Route path="/ratio/:ratio" element={<RatioPage />} />
        <Route path="/pastdata" element={<Pastdata />} />
        <Route path="/future" element={<Futurepred />} />
        <Route path="/homebus" element={<Landingbus />} />
        <Route path="/import" element={<Businessupload />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/fullanalysis" element={<Fullanalysis />} />
        <Route path="/kpis" element={<Kpis />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/homebus" element={<Landingbus />} />
        <Route path="/cashflow" element={<Cashflow />} />
        <Route path="/trend" element={<Trend />} />
        <Route path="/profit" element={<Profit />} />
        <Route path="/about" element={<Contactus />} />
        <Route path="/features" element={<Feature />} />
        <Route path="/contact" element={<Contactus />} />
      </Routes>
    </Router>
  );
}

export default App;
