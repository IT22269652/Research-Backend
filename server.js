const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Route Files
const apiRoutes = require("./routes/apiRoutes"); // For Quiz/AI
const authRoutes = require("./routes/authRoutes"); // For Login/Signup/Profile

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Register Routes
app.use("/api", apiRoutes); // Base URL for AI features
app.use("/api/auth", authRoutes); // Base URL for Auth (creates /api/auth/login)

// Test Route
app.get("/", (req, res) => {
  res.send("AI Career Guide Backend is Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
