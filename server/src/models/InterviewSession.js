import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  expectedKeywords: [{
    type: String,
  }],
  answerText: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  feedback: {
    type: String,
    default: '',
  },
  keywords: [{
    type: String,
  }],
  sentiment: {
    type: String,
    default: '',
  },
  visualMetrics: {
    faceDetected: { type: Boolean, default: true },
    presenceScore: { type: Number, default: 90 },
    engagementStatus: { type: String, default: 'Candidate Verified' }
  },
  answeredAt: {
    type: Date,
  },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'Java',
    },
    difficulty: {
      type: String,
      default: 'Intermediate',
    },
    type: {
      type: String,
      enum: ['technical', 'behavioral'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    questions: [questionSchema],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
