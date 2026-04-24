import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizAttemptsDao() {
  // Find all attempts for a quiz by a user
  function findAttemptsForQuizByUser(quizId, userId) {
    return model.find({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });
  }

  // Find the latest attempt for a quiz by a user
  function findLatestAttempt(quizId, userId) {
    return model.findOne({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });
  }

  // Count attempts for a quiz by a user
  function countAttempts(quizId, userId) {
    return model.countDocuments({ quiz: quizId, user: userId });
  }

  // Create new attempt
  async function createAttempt(quizId, userId) {
    const attemptCount = await countAttempts(quizId, userId);
    const newAttempt = {
      _id: uuidv4(),
      quiz: quizId,
      user: userId,
      answers: [],
      score: 0,
      totalPoints: 0,
      attemptNumber: attemptCount + 1,
      startedAt: new Date(),
    };
    return model.create(newAttempt);
  }

  // Submit attempt with answers
  async function submitAttempt(attemptId, answers, score, totalPoints) {
    return model.updateOne(
      { _id: attemptId },
      {
        $set: {
          answers,
          score,
          totalPoints,
          submittedAt: new Date(),
        },
      }
    );
  }

  // Find attempt by ID
  function findAttemptById(attemptId) {
    return model.findOne({ _id: attemptId });
  }

  return {
    findAttemptsForQuizByUser,
    findLatestAttempt,
    countAttempts,
    createAttempt,
    submitAttempt,
    findAttemptById,
  };
}
