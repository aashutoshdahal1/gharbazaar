const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { pool, testConnection } = require("./config/db");
const setupDatabase = require("./scripts/setupDatabase"); // 👈 Your DB setup script
const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/properties");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

// ✅ Ensure DB is created before server starts
async function startServer() {
  try {
    await setupDatabase(); // 👈 Run DB creation/setup
    await testConnection(); // 👈 Confirm connection

    app.listen(PORT, () => {
      console.log(`✅ Server started at port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
