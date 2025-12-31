const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Debug check to ensure controller is loaded
if (!aiController.generateQuiz)
  console.error("❌ ERROR: generateQuiz function is missing in aiController!");

// --- 1. QUIZ GENERATION ROUTE ---
// Changed from '/quiz' to '/generate-quiz' to match your Frontend fetch call
router.post("/generate-quiz", aiController.generateQuiz);

// --- 2. ANALYZE ROUTE ---
router.post("/analyze", aiController.analyzeAnswer);

module.exports = router;
