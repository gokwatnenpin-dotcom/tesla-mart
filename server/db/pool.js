const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For hosted services (Railway, Supabase, Render, Neon) that require SSL:
  ssl: process.env.DATABASE_URL && process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

pool.on("connect", () => {
  console.log("  ✅ PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("  ❌ PostgreSQL error:", err.message);
});

module.exports = pool;
