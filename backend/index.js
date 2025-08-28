import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import multer from "multer";
import fs from "fs";
import csv from "csv-parser";
import axios from "axios";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const upload = multer({ dest: "uploads/" });

const port = 4000;

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let financialData = []; // Store parsed CSV data

const db = new pg.Client({
  user: "postgres",
  password: "r@ghu@123",
  database: "minip",
  host: "localhost",
  port: 5432,
});

db.connect();

const saltrounds = 10;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "peddireddyraghuvardhanreddy@gmail.com",
    pass: "kyjw kvgr fcdr sswp",
  },
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const { username: email, password } = req.body;

    const individualQuery = await db.query("SELECT * FROM individual WHERE email=$1", [email]);
    if (individualQuery.rows.length > 0) {
      const user = individualQuery.rows[0];
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return res.json({ status: "success", role: "individual", id: user.id, email });
      }
    }

    const businessQuery = await db.query("SELECT * FROM business WHERE email=$1", [email]);
    if (businessQuery.rows.length > 0) {
      const user = businessQuery.rows[0];
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        console.log("oijhbv");
        return res.json({ status: "success", role: "business", id: user.id, email });
      }
    }

    return res.json({ status: "failure", message: "User not found" });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const tableName = role === "individual" ? "individual" : "business";
    const existingUser = await db.query(`SELECT * FROM ${tableName} WHERE email = $1`, [email]);

    if (existingUser.rows.length > 0) {
      return res.json({ status: "failure", redirect: "/login" });
    }

    bcrypt.hash(password, saltrounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Hashing Error" });
      }

      await db.query(
        `INSERT INTO ${tableName} (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
        [username, email, hash, role]
      );
      res.json({ status: "success", role });
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Retrieve the email from the request body
  const email = req.body.email;
  console.log("Email received:", email);

  const filePath = req.file.path;
  let data = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      // Ensure required fields exist in the CSV row
      if (
        row.income &&
        row.expenses &&
        row.debt &&
        row.credit_score &&
        row.loan_amount &&
        row.loan_approved
      ) {
        data.push({
          email, // include email from the request body
          income: parseFloat(row.income) || 0,
          expenses: parseFloat(row.expenses) || 0,
          debt: parseFloat(row.debt) || 0,
          credit_score: parseFloat(row.credit_score) || 0,
          loan_amount: parseFloat(row.loan_amount) || 0,
          loan_approved: parseInt(row.loan_approved) || 0,
        });
      }
    })
    .on("end", async () => {
      try {
        // Insert each row into the database including the email
        for (const row of data) {
          await db.query(
            `INSERT INTO inddata (email, income, expenses, debt, credit_score, loan_amount, loan_approved) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              row.email,
              row.income,
              row.expenses,
              row.debt,
              row.credit_score,
              row.loan_amount,
              row.loan_approved,
            ]
          );
        }

        // Store the uploaded data in a global variable
        financialData = data;
        console.log("Financial Data:", financialData);

        // Remove the file after processing
        fs.unlinkSync(filePath);

        // Send a response with a success message and list of ratios
        res.json({
          message: "File uploaded and data inserted successfully",
          ratios: [
            "Debt-Income Ratio",
            "Savings Ratio",
            "Expense Ratio",
            "Investment Ratio",
            "Full data Analysis",
          ],
        });
      } catch (err) {
        console.error("Error inserting data into database:", err);
        res.status(500).json({ error: "Error inserting data into the database" });
      }
    });
});

app.post("/analyze", async (req, res) => {
  try {
    const ratio  = req.body[0];
    console.log(ratio);
    if (!ratio || financialData.length === 0) {
      return res.status(400).json({ error: "Missing required fields or no data uploaded" });
    }

    const response = await axios.post("http://127.0.0.1:5001/analyze", {
      ratio,
      data: financialData,
    });
    console.log(response.data);
    res.json(response.data);

  } catch (error) {
    console.error("Error analyzing data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/fullanalysis", (req, res) => {
  console.log("Processing Full Data Analysis...");

  const pythonProcess = spawn("python", ["fulldata.py"]);

  pythonProcess.stdin.write(JSON.stringify(financialData));
  pythonProcess.stdin.end();

  let dataBuffer = "";

  pythonProcess.stdout.on("data", (data) => {
      dataBuffer += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
      if (code === 0) {
          try {
              const parsedData = JSON.parse(dataBuffer);
              res.json(parsedData);
          } catch (error) {
              console.error("Error parsing JSON:", error);
              res.status(500).json({ error: "Error parsing data" });
          }
      } else {
          res.status(500).json({ error: "Python script failed" });
      }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload1 = multer({ storage });

app.post("/busupload", upload1.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  return res.status(200).json({
    message: "File uploaded successfully!",
    fileName: req.file.filename,
    filePath: req.file.path,
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/kpis", (req, res) => {
  // Run the Python script
  const pyProcess = spawn("python", [
    path.join(__dirname, "calculate_KPIs.py")
  ]);

  let resultData = "";

  // Collect stdout
  pyProcess.stdout.on("data", (data) => {
    resultData += data.toString();
  });

  // If Python has any errors
  pyProcess.stderr.on("data", (err) => {
    console.error("Python error:", err.toString());
  });

  // On exit
  pyProcess.on("close", (code) => {
    if (code !== 0) {
      return res
        .status(500)
        .json({ error: `Python script exited with code ${code}` });
    }
    try {
      // Parse the JSON
      const jsonData = JSON.parse(resultData);
      console.log(jsonData[0].rows);
      return res.json(jsonData);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return res.status(500).json({ error: "Failed to parse JSON" });
    }
  });
});

app.get("/api/forecast", (req, res) => {
  const pyProcess = spawn("python", [path.join(__dirname, "forecast_sales.py")]);

  let output = "";

  pyProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pyProcess.stderr.on("data", (err) => {
    console.error("Python error:", err.toString());
  });

  pyProcess.on("close", (code) => {
    if (code !== 0) {
      return res
        .status(500)
        .json({ error: `Python script exited with code ${code}` });
    }
    try {
      // Look for our "RESULT:" prefix and extract JSON string after it
      const prefix = "RESULT:";
      const index = output.indexOf(prefix);
      if (index === -1) {
        throw new Error("Result prefix not found in output");
      }
      const jsonString = output.substring(index + prefix.length).trim();
      const jsonData = JSON.parse(jsonString);
      res.json(jsonData);
    } catch (err) {
      console.error("JSON parse error:", err);
      res.status(500).json({ error: "Failed to parse JSON output from Python" });
    }
  });
});
const EXCEL_FILE_PATH = path.join(__dirname, "Fathom_Example_Import_File.xlsx");

// Endpoint to get cash flow metrics
app.get("/api/cash-flow", (req, res) => {
  // Spawn the Python script and pass the Excel file path as an argument
  
  const pythonProcess = spawn("python", ["cashflow.py", EXCEL_FILE_PATH]);

  let outputData = "";
  pythonProcess.stdout.on("data", (chunk) => {
    outputData += chunk.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Python script failed." });
    }
    try {
      const jsonData = JSON.parse(outputData);
      res.json(jsonData);
    } catch (e) {
      console.error("JSON parse error:", e);
      res.status(500).json({ error: "Error parsing JSON from Python." });
    }
  });
});

app.get("/api/revenue", (req, res) => {
  // Spawn the Python script. Make sure "python" is in your PATH.
  const pythonProcess = spawn("python", ["trend.py", EXCEL_FILE_PATH]);

  let outputData = "";
  pythonProcess.stdout.on("data", (chunk) => {
      outputData += chunk.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
      console.error("Python stderr:", data.toString());
  });

  pythonProcess.on("close", (code) => {
      if (code !== 0) {
          return res.status(500).json({ error: "Python script failed." });
      }
      try {
          const jsonData = JSON.parse(outputData);
          res.json(jsonData);
      } catch (err) {
          console.error("JSON parse error:", err);
          res.status(500).json({ error: "Error parsing JSON from Python." });
      }
  });
});

app.get("/api/profit", (req, res) => {
  // Spawn the Python script and pass the Excel file path as argument.
  const pythonProcess = spawn("python", ["profit.py", EXCEL_FILE_PATH]);

  let outputData = "";
  pythonProcess.stdout.on("data", (chunk) => {
      outputData += chunk.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
      console.error("Python stderr:", data.toString());
  });

  pythonProcess.on("close", (code) => {
      if (code !== 0) {
          return res.status(500).json({ error: "Python script failed." });
      }
      try {
          const jsonData = JSON.parse(outputData);
          res.json(jsonData);
      } catch (err) {
          console.error("JSON parse error:", err);
          res.status(500).json({ error: "Error parsing JSON from Python." });
      }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
