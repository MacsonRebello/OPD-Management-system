const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "opd_system"
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err.message);
    setTimeout(() => db.connect(), 2000);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

// Handle connection errors after initial connection
db.on("error", (err) => {
  console.log("DB Error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    db.connect();
  }
  if (err.code === "ER_CON_COUNT_ERROR") {
    db.connect();
  }
  if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
    db.connect();
  }
});

module.exports = db;
