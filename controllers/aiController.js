const axios = require("axios");
require("dotenv").config();

// 1. CONFIGURATION
// This reads the URL you just pasted into your .env file
const COLAB_API_URL = process.env.COLAB_API_URL;

// --- CONTROLLER 1: Generate Quiz ---
exports.generateQuiz = async (req, res) => {
  const { topics } = req.body;

  if (!topics || topics.length === 0) {
    return res.status(400).json({ error: "No topics provided" });
  }

  // Check if the URL exists
  if (!COLAB_API_URL) {
    console.error("❌ ERROR: COLAB_API_URL is missing in .env");
    return res
      .status(500)
      .json({ error: "Server configuration error. Colab URL missing." });
  }

  try {
    console.log(`🔄 Sending request to Colab Server: ${COLAB_API_URL}...`);

    // 2. Send Request to Your Colab Server
    const response = await axios.post(`${COLAB_API_URL}/generate-quiz`, {
      topics: topics,
    });

    // 3. Extract the Text
    let aiText = response.data.generated_text || "";
    console.log("✅ Colab Response Preview:", aiText.substring(0, 100) + "...");

    // 4. Clean the Output (Remove markdown if present)
    aiText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON array specifically
    const jsonStart = aiText.indexOf("[");
    const jsonEnd = aiText.lastIndexOf("]");

    if (jsonStart !== -1 && jsonEnd !== -1) {
      aiText = aiText.substring(jsonStart, jsonEnd + 1);
    }

    // 5. Parse and Send to Frontend
    const quizData = JSON.parse(aiText);
    res.json({ questions: quizData });
  } catch (error) {
    console.error("❌ Colab Connection Error:", error.message);

    // Friendly error message if Colab is disconnected
    if (error.code === "ECONNREFUSED" || error.response?.status === 404) {
      return res.status(502).json({
        error:
          "Cannot connect to AI Model. Please ensure the Colab notebook is running.",
      });
    }

    res.status(500).json({ error: "Failed to generate questions." });
  }
};

// --- CONTROLLER 2: Analyze Answer ---
exports.analyzeAnswer = async (req, res) => {
  res.json({ message: "Analysis feature coming soon" });
};
