const mongoose = require('mongoose');

const scheduledInterviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  candidateName: {
    type: String,
    required: true,
    trim: true
  },
  candidateEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 60
  },
  meetingLink: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true // Uncomment this if you have user authentication
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
scheduledInterviewSchema.index({ date: 1, userId: 1 });
scheduledInterviewSchema.index({ candidateEmail: 1 });

module.exports = mongoose.model('ScheduledInterview', scheduledInterviewSchema);