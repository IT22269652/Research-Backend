const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Interview = require("../models/Interview");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET all interviews
router.get("/", async (req, res) => {
  try {
    const interviews = await Interview.find({}).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, interviews });
  } catch (err) {
    console.error("❌ Error fetching interviews:", err);
    res.status(500).json({ success: false, message: "Failed to fetch interviews" });
  }
});

// Helper function to try multiple model versions
async function generateWithGemini(prompt) {
  const modelNames = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-pro",
    "gemini-1.0-pro"
  ];
  
  let lastError = null;
  
  for (const modelName of modelNames) {
    try {
      console.log(`🤖 Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log(`✅ Success with model: ${modelName}`);
      return text;
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message.split('\n')[0]}`);
      lastError = error;
    }
  }
  
  throw lastError || new Error("All Gemini models failed");
}

// POST - Generate interview questions
router.post("/generate", async (req, res) => {
  try {
    const { jobPosition, jobDescription, questionCount, type } = req.body;

    console.log("📝 Generating questions for:", jobPosition);
    console.log("📊 Question count:", questionCount);
    console.log("🏷️  Types:", type);

    const prompt = `
Generate exactly ${questionCount} interview questions for the position of ${jobPosition}.

Job Description: ${jobDescription}

Interview Types to focus on: ${type.join(", ")}

IMPORTANT: Return ONLY a valid JSON array of strings (questions). No markdown, no code blocks, no explanations.
Format: ["Question 1?", "Question 2?", ...]

Example:
["What is your experience with React?", "How do you handle state management?"]
`;

    console.log("🤖 Calling Gemini API...");
    const text = await generateWithGemini(prompt);
    console.log("📄 Raw response:", text.substring(0, 100) + "...");

    // Clean and parse response
    let questions;
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
      questions = JSON.parse(cleanText);
      
      // Ensure it's an array
      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array");
      }
      
      console.log(`✅ Parsed ${questions.length} questions successfully`);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      console.error("Raw text was:", text);
      
      // Fallback: try to extract questions manually
      questions = text
        .split('\n')
        .filter(line => line.trim().length > 10)
        .map(line => line.replace(/^\d+\.\s*|^[-•]\s*|^"?|"?$/g, '').trim())
        .filter(q => q.length > 0)
        .slice(0, questionCount);
      
      console.log("⚠️  Used fallback parsing, got", questions.length, "questions");
    }

    // Ensure we have the requested number of questions
    if (questions.length < questionCount) {
      console.log(`⚠️  Only got ${questions.length} questions, expected ${questionCount}`);
    }

    // Save to database
    const interview = await Interview.create({
      jobPosition,
      jobDescription,
      questionCount,
      interviewType: type,
      questions,
    });

    console.log("💾 Saved to database with ID:", interview._id);

    res.json({ 
      success: true, 
      id: interview._id,
      message: "Interview created successfully"
    });

  } catch (err) {
    console.error("❌ Error generating interview:", err.message);
    console.error("Full error:", err);
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate questions",
      error: err.message 
    });
  }
});

// GET single interview by ID
router.get("/:id", async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({ 
        success: false, 
        message: "Interview not found" 
      });
    }
    
    res.json({ 
      success: true, 
      interview 
    });
  } catch (err) {
    console.error("❌ Error fetching interview:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch interview" 
    });
  }
});

// DELETE interview by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Interview.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: "Interview not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Interview deleted successfully" 
    });
  } catch (err) {
    console.error("❌ Error deleting interview:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete interview" 
    });
  }
});

module.exports = router;