require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ✅ Version injected from Docker build (or fallback)
const VERSION = process.env.APP_VERSION || "v1";

app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB connection failed");
    console.log(err.message);
    return;
  }

  console.log("✅ DB connected");

  // Create table
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50)
    )
  `);

  // Insert version (every deploy)
  db.query(
    "INSERT INTO users(name) VALUES (?)",
    [VERSION],
    (err) => {
      if (err) {
        console.log("❌ Insert failed:", err.message);
      } else {
        console.log(`✅ Inserted version: ${VERSION}`);
      }
    }
  );
});

// Root route
app.get("/", (req, res) => {
  res.send(`API running - ${VERSION}`);
});

// API route
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log("❌ DB error:", err.message);
      return res.status(500).send("db error");
    }
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log(`🚀 Server running | Version: ${VERSION}`);
});
