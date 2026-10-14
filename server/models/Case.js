// server/models/Case.js
import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    analysisType: {
      type: String,
      required: true,
      enum: ['message', 'url'],
      index: true,
    },
    originalInput: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      index: true,
    },
    threatCategory: {
      type: String,
      required: true,
      trim: true,
    },
    confidence: {
      type: Number,
      default: 85,
      min: 0,
      max: 100,
    },
    indicators: {
      type: [String],
      default: [],
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
    recommendedAction: {
      type: String,
      required: true,
      trim: true,
    },
    engineMode: {
      type: String,
      default: 'rule-based-fallback',
      enum: ['ai', 'rule-based-fallback'],
    },
    processingTimeMs: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Case = mongoose.model('Case', caseSchema);
