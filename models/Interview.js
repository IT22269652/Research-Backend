const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({
  jobPosition: String,
  jobDescription: String,
  questionCount: Number,
  interviewType: [String],
  questions: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Interview", InterviewSchema);