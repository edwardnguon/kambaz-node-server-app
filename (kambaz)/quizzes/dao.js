import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizzesDao(db) {
  function findQuizzesForCourse(courseId) {
    return model.find({ course: courseId });
  }

  function findQuizById(quizId) {
    return model.findOne({ _id: quizId });
  }

  function createQuiz(quiz) {
    const newQuiz = {
      ...quiz,
      _id: uuidv4(),
      questions: [],
      points: 0,
    };
    return model.create(newQuiz);
  }

  function deleteQuiz(quizId) {
    return model.deleteOne({ _id: quizId });
  }

  function updateQuiz(quizId, quizUpdates) {
    return model.updateOne({ _id: quizId }, { $set: quizUpdates });
  }

  function publishQuiz(quizId, published) {
    return model.updateOne({ _id: quizId }, { $set: { published } });
  }

  // Question operations
  async function addQuestion(quizId, question) {
    const newQuestion = { ...question, _id: uuidv4() };
    const quiz = await model.findOne({ _id: quizId });
    quiz.questions.push(newQuestion);
    quiz.points = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
    await quiz.save();
    return quiz;
  }

  async function updateQuestion(quizId, questionId, questionUpdates) {
    const quiz = await model.findOne({ _id: quizId });
    const questionIndex = quiz.questions.findIndex(q => q._id === questionId);
    if (questionIndex !== -1) {
      quiz.questions[questionIndex] = { ...quiz.questions[questionIndex].toObject(), ...questionUpdates, _id: questionId };
      quiz.points = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
      await quiz.save();
    }
    return quiz;
  }

  async function deleteQuestion(quizId, questionId) {
    const quiz = await model.findOne({ _id: quizId });
    quiz.questions = quiz.questions.filter(q => q._id !== questionId);
    quiz.points = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
    await quiz.save();
    return quiz;
  }

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    deleteQuiz,
    updateQuiz,
    publishQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
