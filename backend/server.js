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
