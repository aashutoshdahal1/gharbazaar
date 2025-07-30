const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { pool, testConnection } = require("./config/db");
const authRoutes = require("./routes/auth");

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
  console.log(`server started at port ${PORT}`);
  // Test database connection
  await testConnection();
});
