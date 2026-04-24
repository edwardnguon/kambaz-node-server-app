import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: String,
  answer: mongoose.Schema.Types.Mixed, // Can be string, boolean, or array
  isCorrect: Boolean,
  pointsEarned: Number,
});

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: String,
    user: String,
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: Date,
    attemptNumber: { type: Number, default: 1 },
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;
