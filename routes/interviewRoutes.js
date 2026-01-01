const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Interview = require("../models/Interview");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate", async (req, res) => {
  try {
    const { jobPosition, jobDescription, questionCount, type } = req.body;

    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    const prompt = `
Generate ${questionCount} interview questions for a ${jobPosition}.
Job Description: ${jobDescription}
Interview Types: ${type.join(", ")}

Return ONLY a JSON array of strings.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const questions = JSON.parse(
      text.replace(/```json|```/g, "").trim()
    );

    const interview = await Interview.create({
      jobPosition,
      jobDescription,
      questionCount,
      interviewType: type,
      questions,
    });

    res.json({ success: true, id: interview._id });

  } catch (err) {
    console.error("❌ Gemini Error FULL:", err);
    res.status(500).json({ success: false, message: "Gemini failed" });
  }
});

router.get("/:id", async (req, res) => {
  const data = await Interview.findById(req.params.id);
  res.json(data);
});

module.exports = router;
