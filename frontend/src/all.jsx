// import React, { useState } from "react";
// import FileUpload from "./fileupload"; // Ensure correct import
// import ChartDisplay from "./ChartDisplay";
// import InsightsPanel from "./InsightsPanel";

// function All() {
//     const [selectedRatio, setSelectedRatio] = useState(null);
//     const [chartData, setChartData] = useState(null);
//     const [insights, setInsights] = useState(null);

//     // Handle ratio selection from FileUpload
//     const handleRatioSelect = async (ratio) => {
//         setSelectedRatio(ratio);
//         alert("fcgh");
//         try {
//             const response = await fetch("http://localhost:4000/upload", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ ratio }),
//             });
//             alert("gghty");
//             if (!response.ok) throw new Error("Failed to fetch prediction");
//             alert("kjhgf");
//             const data = await response.json();
//             setChartData(data.chart || []);
//             setInsights(data.insights || {});
//         } catch (error) {
//             console.error("Error fetching prediction:", error);
//         }
//     };

//     return (
//         <div className="app-container">
//             <h1>Financial Analysis Dashboard</h1>
//             <FileUpload onSelectRatio={handleRatioSelect} />
//             {selectedRatio && <ChartDisplay chartData={chartData} />}
//             {selectedRatio && <InsightsPanel insights={insights} />}
//         </div>
//     );
// }

// export default All;
