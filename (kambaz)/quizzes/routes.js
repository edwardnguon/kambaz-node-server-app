import QuizzesDao from "./dao.js";

export default function QuizRoutes(app, db) {
  const dao = QuizzesDao(db);

  // Get all quizzes for a course
  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  // Get single quiz by ID
  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    res.json(quiz);
  };

  // Create new quiz
  const createQuiz = async (req, res) => {
    const { courseId } = req.params;
    const quiz = { ...req.body, course: courseId };
    const newQuiz = await dao.createQuiz(quiz);
    res.json(newQuiz);
  };

  // Delete quiz
  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.deleteQuiz(quizId);
    res.json(status);
  };

  // Update quiz
  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quizUpdates = req.body;
    const status = await dao.updateQuiz(quizId, quizUpdates);
    res.json(status);
  };

  // Publish/unpublish quiz
  const publishQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { published } = req.body;
    const status = await dao.publishQuiz(quizId, published);
    res.json(status);
  };

  // Add question to quiz
  const addQuestion = async (req, res) => {
    const { quizId } = req.params;
    const question = req.body;
    const quiz = await dao.addQuestion(quizId, question);
    res.json(quiz);
  };

  // Update question
  const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const questionUpdates = req.body;
    const quiz = await dao.updateQuestion(quizId, questionId, questionUpdates);
    res.json(quiz);
  };

  // Delete question
  const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const quiz = await dao.deleteQuestion(quizId, questionId);
    res.json(quiz);
  };

  // Routes
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.put("/api/quizzes/:quizId/publish", publishQuiz);
  app.post("/api/quizzes/:quizId/questions", addQuestion);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
}
