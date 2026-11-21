import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  Play,
  ShieldCheck,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  ArrowRight,
  MessageSquare,
  Send
} from 'lucide-react';

export const CourseDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [enrolling, setEnrolling] = useState(false);

  // New review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const res = await api.courses.getById(id);
        if (res.success) {
          setCourse(res.course);
          setReviews(res.reviews || []);

          // expand first module by default
          if (res.course.modules && res.course.modules.length > 0) {
            setExpandedModules({ [res.course.modules[0].id]: true });
          }
        }

        if (isAuthenticated) {
          const checkRes = await api.enrollments.checkEnrollment(id);
          if (checkRes.success) {
            setIsEnrolled(checkRes.isEnrolled);
            setEnrollment(checkRes.enrollment);
          }
        }
      } catch (err) {
        console.error('Error loading course details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, isAuthenticated]);

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setEnrolling(true);
    try {
      const res = await api.enrollments.enroll(course.id);
      if (res.success) {
        setIsEnrolled(true);
        setEnrollment(res.enrollment);
        navigate(`/learn/${course.id}`);
      }
    } catch (err) {
      alert(err.message || 'Failed to enroll in course.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.courses.addReview(course.id, { rating, comment });
      if (res.success) {
        setReviews([res.review, ...reviews]);
        setComment('');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-violet-600 border-t-transparent animate-spin mx-auto"></div>
        <p className="mt-4 text-xs font-bold text-slate-500">Loading syllabus & curriculum...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Course not found</h2>
        <Link to="/courses" className="text-sm font-bold text-violet-700 underline">
          Return to course catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Banner Left Info */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {course.level} Level
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Updated 2026
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium max-w-2xl">
                {course.subtitle || course.description}
              </p>

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-amber-400 font-black">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{course.rating?.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({course.reviewsCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-4 h-4 text-violet-400" />
                  <span>{course.enrolledCount?.toLocaleString()} students enrolled</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{course.duration} comprehensive</span>
                </div>
              </div>

              {/* Instructor Capsule */}
              <div className="flex items-center gap-3 pt-3">
                <img
                  src={course.instructor?.avatar}
                  alt={course.instructor?.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-400"
                />
                <div>
                  <div className="text-xs text-slate-400">Created by</div>
                  <div className="text-sm font-bold text-white">{course.instructor?.name}</div>
                </div>
              </div>

            </div>

            {/* Desktop Sticky Card Placeholder in Right Column */}
            <div className="lg:col-span-4 hidden lg:block">
              {/* Handled by the card below */}
            </div>

          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Syllabus, Outcomes, Requirements, Reviews */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Learning Outcomes */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>What You Will Master in This Course</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.learningOutcomes?.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Modules */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Course Curriculum & Lessons
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {course.modules?.length || 0} Modules • {course.totalLessons || 20} Lectures • {course.duration}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const allOpen = {};
                    course.modules?.forEach(m => { allOpen[m.id] = true; });
                    setExpandedModules(allOpen);
                  }}
                  className="text-xs font-bold text-violet-700 hover:text-amber-600 transition-colors"
                >
                  Expand All Modules
                </button>
              </div>

              {/* Module Accordions */}
              <div className="space-y-4">
                {course.modules?.map((module, mIdx) => {
                  const isOpen = expandedModules[module.id];
                  return (
                    <div key={module.id} className="rounded-2xl border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full text-left p-4 sm:p-5 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 font-black text-xs flex items-center justify-center">
                            {mIdx + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-900">{module.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{module.lessons?.length || 0} lessons</span>
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="p-4 sm:p-5 bg-white divide-y divide-slate-100 space-y-1">
                          {module.lessons?.map((lesson, lIdx) => (
                            <div key={lesson.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                              <div className="flex items-center gap-3">
                                <Play className="w-3.5 h-3.5 text-violet-600" />
                                <span className="font-medium text-slate-800">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-400">
                                {lesson.isPreview && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    Free Preview
                                  </span>
                                )}
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Requirements */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Prerequisites & Requirements</h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {course.requirements?.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Student Feedback ({reviews.length})
                </h2>
                <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{course.rating?.toFixed(1)} Course Rating</span>
                </div>
              </div>

              {/* Add review form if enrolled */}
              {isEnrolled && (
                <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-violet-50/50 border border-violet-100 space-y-3">
                  <div className="font-bold text-xs text-violet-900">Share your learning experience</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Rating:</span>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="bg-white border border-slate-200 text-xs rounded-lg px-2 py-1 font-bold"
                    >
                      <option value="5">5 Stars - Outstanding</option>
                      <option value="4">4 Stars - Very Good</option>
                      <option value="3">3 Stars - Good</option>
                      <option value="2">2 Stars - Fair</option>
                      <option value="1">1 Star - Poor</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Write your honest review of the lessons and instructor..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                          alt={rev.userName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                      </div>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    <div className="text-[10px] text-slate-400">{rev.date}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Enrollment Card (Sticky) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden sticky top-24 space-y-6">
              
              {/* Thumbnail / Video Preview */}
              <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden group cursor-pointer">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 text-violet-700 flex items-center justify-center shadow-glow-violet group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 text-center w-full text-[11px] font-bold text-white drop-shadow">
                  Preview Course Syllabus
                </div>
              </div>

              {/* Price & CTA */}
              <div className="p-6 pt-0 space-y-5">
                <div className="flex items-baseline justify-between">
                  {course.isFree || course.price === 0 ? (
                    <span className="text-3xl font-black text-emerald-600">FREE</span>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">${course.price}</span>
                      {course.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">${course.originalPrice}</span>
                      )}
                    </div>
                  )}
                  <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full">
                    Lifetime Access
                  </span>
                </div>

                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800">
                      ✓ You are currently enrolled in this course!
                    </div>
                    <Link
                      to={`/learn/${course.id}`}
                      className="w-full py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:shadow-glow-violet transition-all flex items-center justify-center gap-2"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:shadow-glow-violet transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <span>{enrolling ? 'Enrolling...' : 'Enroll Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Guarantees */}
                <div className="space-y-2.5 pt-2 text-xs text-slate-600 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Official Verified Certificate on Completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-violet-500" />
                    <span>Self-Paced Flexible Schedule</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
