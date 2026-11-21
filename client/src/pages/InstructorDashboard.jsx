import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/common/Sidebar';
import { StatsCard } from '../components/common/StatsCard';
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  PlusCircle,
  FileCheck,
  Star,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  Send
} from 'lucide-react';

export const InstructorDashboard = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create Course Modal State
  const [createModalOpen, setCreateModalOpen] = useState(currentTab === 'create');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newLevel, setNewLevel] = useState('Beginner');
  const [newPrice, setNewPrice] = useState('49.99');
  const [newDuration, setNewDuration] = useState('20 Hours');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Grade Assignment Modal State
  const [gradingAssignment, setGradingAssignment] = useState(null);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState(95);
  const [feedbackInput, setFeedbackInput] = useState('');

  const fetchOverview = async () => {
    try {
      const res = await api.instructor.getOverview();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Instructor overview error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    if (currentTab === 'create') setCreateModalOpen(true);
  }, [currentTab]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Title and description are required.');
      return;
    }

    setCreating(true);
    try {
      const res = await api.courses.create({
        title: newTitle,
        subtitle: newSubtitle || newTitle,
        description: newDescription,
        category: newCategory,
        level: newLevel,
        duration: newDuration,
        price: Number(newPrice) || 0,
        isFree: Number(newPrice) === 0,
        thumbnail: newThumbnail
      });

      if (res.success) {
        alert('Course created successfully!');
        setCreateModalOpen(false);
        setNewTitle('');
        setNewDescription('');
        fetchOverview();
      }
    } catch (err) {
      alert('Error creating course: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await api.courses.delete(courseId);
      if (res.success) {
        fetchOverview();
      }
    } catch (err) {
      alert('Failed to delete course.');
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!gradingAssignment || !gradingSubmission) return;

    try {
      const res = await api.instructor.gradeAssignment(
        gradingAssignment.id,
        gradingSubmission.id,
        gradeInput,
        feedbackInput
      );
      if (res.success) {
        alert('Grade submitted!');
        setGradingSubmission(null);
        fetchOverview();
      }
    } catch (err) {
      alert('Failed to grade assignment.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const courses = data?.courses || [];
  const recentEnrollments = data?.recentEnrollments || [];
  const assignments = data?.assignments || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <Sidebar role="instructor" />

        {/* Right Dashboard Area */}
        <main className="flex-1 space-y-8 min-w-0">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-purple-950 via-violet-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-400 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Instructor Studio & Portal
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {user?.name || 'Dr. Elena Vance'}
                  </h1>
                  <p className="text-xs text-slate-300 mt-1">
                    Manage your curriculum, student evaluations, and track commercial performance.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow-orange hover:opacity-95 flex items-center gap-2 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Course</span>
              </button>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsCard
              title="Active Courses"
              value={stats.totalCourses}
              subtitle="Published curriculum"
              icon={BookOpen}
              gradient="from-violet-600 to-purple-600"
            />
            <StatsCard
              title="Enrolled Students"
              value={stats.totalStudents?.toLocaleString()}
              subtitle="Across all courses"
              icon={Users}
              gradient="from-amber-500 to-orange-600"
              trend="+18% growth"
            />
            <StatsCard
              title="Total Revenue"
              value={`$${stats.totalRevenue?.toLocaleString()}`}
              subtitle="Net course sales"
              icon={DollarSign}
              gradient="from-emerald-500 to-teal-600"
            />
            <StatsCard
              title="Student Rating"
              value={`${stats.averageRating || 4.9} ★`}
              subtitle="Based on student reviews"
              icon={Star}
              gradient="from-purple-600 to-pink-600"
            />
          </div>

          {/* Tab 1: OVERVIEW & COURSES */}
          {(currentTab === 'overview' || currentTab === 'courses') && (
            <div className="space-y-8">
              
              {/* Courses List Table */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-lg text-slate-900 tracking-tight">
                      My Published Courses ({courses.length})
                    </h3>
                    <p className="text-xs text-slate-500">Monitor course status, enrollments, and ratings</p>
                  </div>
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                  >
                    + Add Course
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                        <th className="pb-3">Course</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Students</th>
                        <th className="pb-3">Rating</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {courses.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={c.thumbnail}
                                alt={c.title}
                                className="w-10 h-10 rounded-xl object-cover shrink-0"
                              />
                              <div>
                                <Link to={`/courses/${c.id}`} className="font-extrabold text-slate-900 hover:text-violet-700">
                                  {c.title}
                                </Link>
                                <div className="text-[10px] text-slate-400">{c.duration} • {c.level}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 text-slate-600 font-semibold">{c.category}</td>
                          <td className="py-3.5 font-bold text-slate-900">
                            {c.isFree ? <span className="text-emerald-600 font-extrabold">FREE</span> : `$${c.price}`}
                          </td>
                          <td className="py-3.5 text-slate-600">{c.enrolledCount?.toLocaleString() || 0}</td>
                          <td className="py-3.5 text-amber-500 font-bold">★ {c.rating || 5.0}</td>
                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/courses/${c.id}`}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                                title="View Course Page"
                              >
                                <BookOpen className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteCourse(c.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Delete Course"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Student Enrollments */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-black text-base text-slate-900 tracking-tight">
                  Recent Student Enrollments & Progress
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Course</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Curriculum Progress</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentEnrollments.map((enr) => (
                        <tr key={enr.id}>
                          <td className="py-3 font-bold text-slate-800">{enr.studentName}</td>
                          <td className="py-3 text-slate-600">{enr.courseTitle}</td>
                          <td className="py-3 text-slate-400">{new Date(enr.enrolledAt).toLocaleDateString()}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-violet-600 rounded-full"
                                  style={{ width: `${enr.progress}%` }}
                                ></div>
                              </div>
                              <span className="font-bold text-[11px] text-violet-700">{enr.progress}%</span>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                              {enr.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: EVALUATE ASSIGNMENTS */}
          {currentTab === 'assignments' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-lg text-slate-900 tracking-tight">
                  Student Assignments & Grading Portal
                </h3>
                <p className="text-xs text-slate-500">Evaluate student project repositories and issue scores</p>
              </div>

              <div className="space-y-6">
                {assignments.map((assign) => (
                  <div key={assign.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-violet-700">Course Assignment</div>
                        <h4 className="font-black text-base text-slate-900">{assign.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{assign.description}</p>
                      </div>
                      <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        Max: {assign.totalPoints} pts
                      </span>
                    </div>

                    {/* Submissions */}
                    <div className="border-t border-slate-200 pt-4 space-y-3">
                      <div className="text-xs font-bold text-slate-700">Student Submissions:</div>
                      {assign.submissions?.map((sub) => (
                        <div key={sub.id} className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-xs text-slate-900">{sub.userName}</div>
                            <a
                              href={sub.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-violet-600 hover:underline font-mono"
                            >
                              {sub.repoUrl}
                            </a>
                            <p className="text-[11px] text-slate-500 mt-1 italic">"{sub.notes}"</p>
                          </div>

                          <div className="flex items-center gap-3">
                            {sub.status === 'graded' ? (
                              <div className="text-right">
                                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Graded: {sub.grade}/100
                                </span>
                                <div className="text-[10px] text-slate-400 mt-0.5">"{sub.feedback}"</div>
                              </div>
                            ) : null}

                            <button
                              onClick={() => {
                                setGradingAssignment(assign);
                                setGradingSubmission(sub);
                                setGradeInput(sub.grade || 95);
                                setFeedbackInput(sub.feedback || 'Great implementation!');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-violet-600 transition-colors"
                            >
                              {sub.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE COURSE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 my-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-xl text-slate-900">Create New Course Masterclass</h3>
                <p className="text-xs text-slate-500">Publish your curriculum to the AuraLMS student community</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js & Serverless Architecture"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-violet-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Subtitle / Headline</label>
                <input
                  type="text"
                  placeholder="Brief compelling description of learning outcomes"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Data Science & Analytics">Data Science & Analytics</option>
                    <option value="Cybersecurity Fundamentals">Cybersecurity</option>
                    <option value="Cloud Computing & DevOps">Cloud & DevOps</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Difficulty</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Price ($) (0 = Free)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Course Thumbnail URL</label>
                <input
                  type="url"
                  value={newThumbnail}
                  onChange={(e) => setNewThumbnail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed syllabus, what students will build, and prerequisites..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-amber-500 hover:shadow-glow-violet transition-all"
                >
                  {creating ? 'Publishing...' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADE SUBMISSION MODAL */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Evaluate: {gradingSubmission.userName}</h3>
              <button onClick={() => setGradingSubmission(null)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Score (0 to 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 font-bold text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructor Feedback</label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700"
              >
                Save Grade & Feedback
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
