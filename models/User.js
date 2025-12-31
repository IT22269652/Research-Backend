const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ["applicant", "company"] },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },

  // Applicant Specific Fields
  fullName: String,
  nameWithInitials: String,
  birthday: Date,
  gender: String,

  // Company Specific Fields
  companyName: String,
  industry: String,
  registrationNumber: String,
  branchLocation: String,

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
