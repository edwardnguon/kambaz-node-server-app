import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: String,
  title: String,
  type: { type: String, enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"], default: "MULTIPLE_CHOICE" },
  points: { type: Number, default: 1 },
  question: String,
  choices: [{
    _id: String,
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: Boolean, // For TRUE_FALSE
  blanks: [{
    _id: String,
    text: String
  }], // For FILL_IN_BLANK - possible correct answers
});

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, default: "Unnamed Quiz" },
    course: String,
    description: { type: String, default: "" },
    quizType: { type: String, enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"], default: "Graded Quiz" },
    assignmentGroup: { type: String, enum: ["Quizzes", "Exams", "Assignments", "Project"], default: "Quizzes" },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    hasTimeLimit: { type: Boolean, default: true },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "Immediately" },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: String,
    availableDate: String,
    untilDate: String,
    published: { type: Boolean, default: false },
    questions: [questionSchema],
    points: { type: Number, default: 0 },
  },
  { collection: "quizzes" }
);

export default quizSchema;
