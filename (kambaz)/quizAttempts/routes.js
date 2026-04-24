import QuizAttemptsDao from "./dao.js";
import QuizzesDao from "../quizzes/dao.js";
import { resolveCurrentUser } from "../users/currentUser.js";

export default function QuizAttemptRoutes(app, db) {
  const attemptsDao = QuizAttemptsDao();
  const quizzesDao = QuizzesDao();

  // Get latest attempt for a quiz by current user
  const getLatestAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = await resolveCurrentUser(req);
    const userId = currentUser?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const attempt = await attemptsDao.findLatestAttempt(quizId, userId);
    res.json(attempt);
  };

  // Get all attempts for a quiz by current user
  const getAttempts = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = await resolveCurrentUser(req);
    const userId = currentUser?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const attempts = await attemptsDao.findAttemptsForQuizByUser(quizId, userId);
    res.json(attempts);
  };

  // Get attempt count for a quiz by current user
  const getAttemptCount = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = await resolveCurrentUser(req);
    const userId = currentUser?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const count = await attemptsDao.countAttempts(quizId, userId);
    res.json({ count });
  };

  // Start a new attempt
  const startAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = await resolveCurrentUser(req);
    const userId = currentUser?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Check if user can still attempt
    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const attemptCount = await attemptsDao.countAttempts(quizId, userId);
    if (!quiz.multipleAttempts && attemptCount >= 1) {
      return res.status(400).json({ error: "No more attempts allowed" });
    }
    if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
      return res.status(400).json({ error: "Maximum attempts reached" });
    }

    const attempt = await attemptsDao.createAttempt(quizId, userId);
    res.json(attempt);
  };

  // Submit an attempt
  const submitAttempt = async (req, res) => {
    const { attemptId } = req.params;
    const { answers } = req.body;
    const currentUser = await resolveCurrentUser(req);
    const userId = currentUser?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const attempt = await attemptsDao.findAttemptById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    if (attempt.user !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const quiz = await quizzesDao.findQuizById(attempt.quiz);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Grade the answers
    let score = 0;
    const totalPoints = quiz.points;
    const gradedAnswers = answers.map((ans) => {
      const question = quiz.questions.find((q) => q._id === ans.questionId);
      if (!question) return { ...ans, isCorrect: false, pointsEarned: 0 };

      let isCorrect = false;
      if (question.type === "MULTIPLE_CHOICE") {
        const correctChoice = question.choices.find((c) => c.isCorrect);
        isCorrect = correctChoice && ans.answer === correctChoice._id;
      } else if (question.type === "TRUE_FALSE") {
        isCorrect = ans.answer === question.correctAnswer;
      } else if (question.type === "FILL_IN_BLANK") {
        // Case insensitive comparison
        const userAnswer = (ans.answer || "").toLowerCase().trim();
        isCorrect = question.blanks.some(
          (b) => b.text.toLowerCase().trim() === userAnswer
        );
      }

      const pointsEarned = isCorrect ? question.points : 0;
      score += pointsEarned;

      return { ...ans, isCorrect, pointsEarned };
    });

    await attemptsDao.submitAttempt(attemptId, gradedAnswers, score, totalPoints);
    const updatedAttempt = await attemptsDao.findAttemptById(attemptId);
    res.json(updatedAttempt);
  };

  // Routes
  app.get("/api/quizzes/:quizId/attempts/latest", getLatestAttempt);
  app.get("/api/quizzes/:quizId/attempts", getAttempts);
  app.get("/api/quizzes/:quizId/attempts/count", getAttemptCount);
  app.post("/api/quizzes/:quizId/attempts", startAttempt);
  app.put("/api/attempts/:attemptId/submit", submitAttempt);
}
