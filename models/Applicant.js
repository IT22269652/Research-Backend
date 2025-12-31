const mongoose = require("mongoose");

const ApplicantSchema = new mongoose.Schema({
  // You can use Name or Student ID
  studentName: { type: String, default: "Unknown Candidate" },
  skillsSelected: [String],

  // Quiz Results
  quizScore: { type: Number, required: true },
  quizTotalQuestions: { type: Number, default: 10 },

  // Confidence Results
  confidenceScore: { type: Number, required: true },

  // Final Calculation
  finalRank: { type: String }, // A, B, C
  averageScore: { type: Number },

  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Applicant", ApplicantSchema);
