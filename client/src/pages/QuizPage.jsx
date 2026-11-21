import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins in seconds

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const [qRes, cRes] = await Promise.all([
          api.quizzes.getByCourse(courseId),
          api.courses.getById(courseId)
        ]);

        if (qRes.success) {
          setQuiz(qRes.quiz);
          setTimeLeft((qRes.quiz.timeLimitMinutes || 15) * 60);
        }
        if (cRes.success) {
          setCourse(cRes.course);
        }
      } catch (err) {
        console.error('Quiz fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId]);

  // Timer countdown
  useEffect(() => {
    if (!quiz || result) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz, result]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (result) return; // Prevent change after submit
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await api.quizzes.submit(courseId, answers);
      if (res.success) {
        setResult(res.result);
        if (res.result.passed) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      alert('Error submitting quiz: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No Assessment Available</h2>
        <p className="text-xs text-slate-500">This course does not currently require an examination.</p>
        <Link to={`/learn/${courseId}`} className="text-xs font-bold text-violet-700 underline">
          Return to learning player
        </Link>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to={`/learn/${courseId}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-violet-700 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course Lectures</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {quiz.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Passing requirement: <strong className="text-violet-700">{quiz.passingScore}%</strong> • Total Questions: {questions.length}
            </p>
          </div>

          {/* Live Timer */}
          {!result && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold text-sm shrink-0 ${
              timeLeft < 180 ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              <Clock className="w-4 h-4 text-violet-600" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Results Banner (If Submitted) */}
        {result && (
          <div className={`p-8 rounded-3xl border text-center space-y-4 animate-in fade-in duration-300 ${
            result.passed
              ? 'bg-gradient-to-br from-emerald-50 via-white to-amber-50 border-emerald-300 shadow-md'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md">
              {result.passed ? (
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Award className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center">
                  <XCircle className="w-8 h-8" />
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Examination Results</div>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                {result.passed ? '🎉 Congratulations! You Passed!' : 'Exam Not Passed Yet'}
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                {result.passed
                  ? `You achieved ${result.score}%, exceeding the ${result.passingScore}% threshold. Your official diploma certificate is now unlocked!`
                  : `You scored ${result.score}%. The passing grade is ${result.passingScore}%. Review the explanations below and retake whenever you are ready.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {result.passed ? (
                <Link
                  to={`/dashboard/student?tab=certificates`}
                  className="px-6 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-600 to-amber-500 text-white shadow-glow-violet hover:opacity-95"
                >
                  View My Certificate & Diploma
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                    setTimeLeft((quiz.timeLimitMinutes || 15) * 60);
                  }}
                  className="px-6 py-3 rounded-2xl font-black text-sm bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Examination</span>
                </button>
              )}
              <Link
                to={`/learn/${courseId}`}
                className="px-5 py-3 rounded-2xl font-bold text-xs bg-slate-200 text-slate-800 hover:bg-slate-300"
              >
                Back to Course
              </Link>
            </div>
          </div>
        )}

        {/* Question Navigation Chips */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = currentQIndex === idx;

            let badgeStyle = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
            if (result) {
              const qResult = result.breakdown?.find(b => b.questionId === q.id);
              if (qResult?.isCorrect) badgeStyle = 'bg-emerald-600 text-white font-bold';
              else badgeStyle = 'bg-rose-500 text-white font-bold';
            } else if (isCurrent) {
              badgeStyle = 'bg-violet-600 text-white font-bold shadow-md';
            } else if (isAnswered) {
              badgeStyle = 'bg-violet-100 text-violet-800 font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQIndex(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-mono shrink-0 transition-all ${badgeStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Question {currentQIndex + 1} of {questions.length}</span>
              <span className="uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                {currentQuestion.type === 'multiple_choice' ? 'Multiple Choice' : 'True or False'}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options?.map((option, optIdx) => {
                const isSelected = answers[currentQuestion.id] === optIdx;

                let optionStyle = 'border-slate-200 hover:border-violet-300 hover:bg-violet-50/30';
                if (result) {
                  const qResult = result.breakdown?.find(b => b.questionId === currentQuestion.id);
                  if (optIdx === qResult?.correctAnswer) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (isSelected && !qResult?.isCorrect) {
                    optionStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-bold';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-violet-600 bg-violet-50 text-violet-900 font-bold ring-2 ring-violet-200';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {result && optIdx === result.breakdown?.find(b => b.questionId === currentQuestion.id)?.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submit */}
            {result && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-violet-600" />
                  <span>Explanation:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {result.breakdown?.find(b => b.questionId === currentQuestion.id)?.explanation}
                </p>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                Previous Question
              </button>

              {currentQIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-violet-700 transition-colors"
                >
                  Next Question
                </button>
              ) : !result ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-violet-600 to-amber-500 text-white hover:shadow-glow-violet transition-all"
                >
                  {submitting ? 'Evaluating...' : 'Submit Assessment'}
                </button>
              ) : null}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
