require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// 🔹 Version for CI/CD visibility
const VERSION = process.env.APP_VERSION || "v1";

app.use(cors());
app.use(express.json());

// 🔹 DB connection
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

  // 🔹 Create table if not exists
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50)
    )
  `, (err) => {
    if (err) {
      console.log("❌ Table creation failed:", err.message);
    } else {
      console.log("✅ Table ready");
    }
  });

  // 🔹 Insert version (for CI/CD tracking)
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

// 🔹 Root route (health + version)
app.get("/", (req, res) => {
  res.send(`API running - ${VERSION}`);
});

// 🔹 Main API
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log("❌ DB error:", err.message);
      return res.status(500).send("db error");
    }
    res.json(result);
  });
});

// 🔹 Start server
app.listen(3000, () => {
  console.log(`🚀 Server running on port 3000 | Version: ${VERSION}`);
});