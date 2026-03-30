require("dotenv").config()

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASS,
 database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed, continuing without DB");
    console.log(err.message);
  } else {
    console.log("DB connected");

    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50)
      )
    `, (err) => {
      if (err) {
        console.log("Table creation failed:", err.message);
      } else {
        console.log("Table ready");
      }
    });

    db.query(`
      INSERT INTO users(name)
      SELECT 'test'
      WHERE NOT EXISTS (SELECT * FROM users)
    `);
  }
});

app.get("/api/users",(req,res)=>{
 db.query("SELECT * FROM users",(err,result)=>{
  if(err){
   console.log(err)
   res.status(500).send("db error")
  }else{
   res.json(result)
  }
 })
})

app.listen(3000,()=>{
 console.log("server running")
})
