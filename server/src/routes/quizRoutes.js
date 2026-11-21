import express from 'express';
import { store } from '../db/store.js';
import { authenticateToken } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Get quiz for a course
router.get('/course/:courseId', authenticateToken, (req, res) => {
  const course = store.getCourseById(req.params.courseId);
  if (!course || !course.quiz) {
    return res.status(404).json({ success: false, message: 'No quiz found for this course.' });
  }

  // Hide correct answers during quiz taking
  const safeQuestions = course.quiz.questions.map(q => ({
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options
  }));

  return res.json({
    success: true,
    quiz: {
      id: course.quiz.id,
      title: course.quiz.title,
      description: course.quiz.description,
      passingScore: course.quiz.passingScore || 75,
      timeLimitMinutes: course.quiz.timeLimitMinutes || 15,
      questionsCount: safeQuestions.length,
      questions: safeQuestions
    }
  });
});

// Submit quiz and calculate score
router.post('/submit/:courseId', authenticateToken, (req, res) => {
  try {
    const course = store.getCourseById(req.params.courseId);
    if (!course || !course.quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    const { answers = {} } = req.body;
    const questions = course.quiz.questions;
    let correctCount = 0;

    const questionResults = questions.map(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer !== undefined && userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        question: q.question,
        options: q.options,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || ''
      };
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= (course.quiz.passingScore || 75);

    const submission = {
      id: `sub-${crypto.randomUUID().slice(0, 8)}`,
      userId: req.user.id,
      courseId: course.id,
      quizId: course.quiz.id,
      score: scorePercentage,
      passed,
      correctCount,
      totalCount: questions.length,
      answers,
      submittedAt: new Date().toISOString()
    };

    store.addQuizSubmission(submission);

    return res.json({
      success: true,
      result: {
        submissionId: submission.id,
        score: scorePercentage,
        passed,
        passingScore: course.quiz.passingScore || 75,
        correctCount,
        totalQuestions: questions.length,
        breakdown: questionResults
      }
    });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    return res.status(500).json({ success: false, message: 'Failed to process quiz submission.' });
  }
});

// Get user quiz submissions history
router.get('/my-history', authenticateToken, (req, res) => {
  const submissions = store.getQuizSubmissions(req.user.id);
  const enriched = submissions.map(sub => {
    const course = store.getCourseById(sub.courseId);
    return {
      ...sub,
      courseTitle: course ? course.title : 'Course'
    };
  });
  return res.json({ success: true, history: enriched });
});

export default router;
