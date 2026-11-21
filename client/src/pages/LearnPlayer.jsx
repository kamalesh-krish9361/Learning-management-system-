import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CertificateModal } from '../components/common/CertificateModal';
import {
  Play,
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  MessageSquare,
  Award,
  Sparkles,
  Send,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

export const LearnPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'resources' | 'discussion'
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // New discussion state
  const [discTitle, setDiscTitle] = useState('');
  const [discMessage, setDiscMessage] = useState('');
  const [replyMessages, setReplyMessages] = useState({});

  // Certificate modal state
  const [certificateData, setCertificateData] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const fetchLearningData = async () => {
      setLoading(true);
      try {
        const [courseRes, enrollRes] = await Promise.all([
          api.courses.getById(id),
          api.enrollments.checkEnrollment(id)
        ]);

        if (courseRes.success) {
          setCourse(courseRes.course);
          
          // Determine initial lesson
          const modules = courseRes.course.modules || [];
          let targetLesson = null;

          if (enrollRes.success && enrollRes.enrollment) {
            setEnrollment(enrollRes.enrollment);
            const lastId = enrollRes.enrollment.lastAccessedLessonId;
            
            // Search for lastAccessedLessonId
            for (const mod of modules) {
              const found = mod.lessons?.find(l => l.id === lastId);
              if (found) { targetLesson = found; break; }
            }
          }

          if (!targetLesson && modules.length > 0 && modules[0].lessons?.length > 0) {
            targetLesson = modules[0].lessons[0];
          }

          setCurrentLesson(targetLesson);
        }
      } catch (err) {
        console.error('Error fetching player data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [id]);

  // Load discussions when lesson changes
  useEffect(() => {
    if (course && currentLesson) {
      api.discussions.getForCourse(course.id, currentLesson.id)
        .then(res => { if (res.success) setDiscussions(res.discussions); })
        .catch(console.error);
    }
  }, [course, currentLesson]);

  const allLessons = [];
  if (course?.modules) {
    course.modules.forEach(m => {
      if (m.lessons) allLessons.push(...m.lessons);
    });
  }

  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const isLessonCompleted = enrollment?.completedLessonIds?.includes(currentLesson?.id);

  const handleToggleComplete = async () => {
    if (!currentLesson || !course) return;
    try {
      const willComplete = !isLessonCompleted;
      const res = await api.enrollments.updateProgress(course.id, currentLesson.id, willComplete);
      if (res.success) {
        setEnrollment(res.enrollment);
      }
    } catch (err) {
      console.error('Progress update error:', err);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentLessonIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLesson(allLessons[currentLessonIndex - 1]);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!discTitle.trim() || !discMessage.trim()) return;

    try {
      const res = await api.discussions.create(course.id, {
        title: discTitle,
        message: discMessage,
        lessonId: currentLesson?.id
      });
      if (res.success) {
        setDiscussions([res.discussion, ...discussions]);
        setDiscTitle('');
        setDiscMessage('');
      }
    } catch (err) {
      alert('Failed to post discussion.');
    }
  };

  const handleReplyDiscussion = async (discussionId) => {
    const message = replyMessages[discussionId];
    if (!message || !message.trim()) return;

    try {
      const res = await api.discussions.reply(course.id, discussionId, message);
      if (res.success) {
        setDiscussions(discussions.map(d => d.id === discussionId ? res.discussion : d));
        setReplyMessages(prev => ({ ...prev, [discussionId]: '' }));
      }
    } catch (err) {
      alert('Failed to reply.');
    }
  };

  const handleViewCertificate = async () => {
    try {
      const res = await api.enrollments.getCertificate(course.id);
      if (res.success) {
        setCertificateData(res.certificate);
        setShowCertificate(true);
      }
    } catch (err) {
      alert('Complete all lessons and quiz to view certificate!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const progressPercent = enrollment?.progress || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* 1. Player Top Header */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to={`/courses/${course?.id}`}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Course Syllabus</span>
          </Link>
          <div className="h-4 w-px bg-slate-800"></div>
          <h1 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-xs sm:max-w-md">
            {course?.title}
          </h1>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-slate-400 font-bold">{progressPercent}% Completed</span>
            <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-amber-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {progressPercent === 100 && (
            <button
              onClick={handleViewCertificate}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-glow-orange flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Certificate</span>
            </button>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800"
            title="Toggle Curriculum Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. Main Player Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Video Area + Notes/Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Responsive Video Container */}
          <div className="w-full bg-black flex items-center justify-center aspect-video max-h-[65vh]">
            {currentLesson?.videoUrl ? (
              <video
                key={currentLesson.id}
                src={currentLesson.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={course?.thumbnail}
              />
            ) : (
              <div className="text-slate-500 text-xs">Video content loading...</div>
            )}
          </div>

          {/* Action Bar Below Video */}
          <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-violet-400 font-bold uppercase tracking-wider">
                Current Lesson
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {currentLesson?.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleComplete}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isLessonCompleted
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md'
                }`}
              >
                {isLessonCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                <span>{isLessonCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex === 0}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Previous Lesson"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === allLessons.length - 1}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Next Lesson"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation: Overview, Resources, Discussion */}
          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-3 text-xs sm:text-sm font-bold">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
                  activeTab === 'notes'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Notes & Guide</span>
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
                  activeTab === 'resources'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Resources ({currentLesson?.resources?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
                  activeTab === 'discussion'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Q&A Discussion ({discussions.length})</span>
              </button>
            </div>

            {/* Tab 1: Lesson Notes */}
            {activeTab === 'notes' && (
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                <p>{currentLesson?.content || 'No specific notes recorded for this lesson.'}</p>
                
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-xs text-amber-400">💡 Instructor Pro-Tip</div>
                  <p className="text-xs text-slate-400">
                    Always practice coding alongside the video. Create a local branch to test edge cases, and run your tests before marking the module as complete!
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Downloadable Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                {currentLesson?.resources?.length > 0 ? (
                  currentLesson.resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-950 text-violet-400 flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{res.name}</div>
                          <div className="text-[10px] text-slate-400">{res.size} • {res.type?.toUpperCase()}</div>
                        </div>
                      </div>
                      <a
                        href={res.downloadUrl}
                        download
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-violet-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 py-6 text-center">
                    No downloadable assets for this lecture. Check earlier lectures for boilerplate bundles!
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Q&A Discussion */}
            {activeTab === 'discussion' && (
              <div className="space-y-6">
                
                {/* Ask Question Form */}
                <form onSubmit={handleCreateDiscussion} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-white">Ask a Question on this Lesson</div>
                  <input
                    type="text"
                    placeholder="Subject title (e.g. Question on React state flow)"
                    value={discTitle}
                    onChange={(e) => setDiscTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  />
                  <textarea
                    rows={2}
                    placeholder="Describe your question or code error..."
                    value={discMessage}
                    onChange={(e) => setDiscMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Question</span>
                  </button>
                </form>

                {/* Discussions List */}
                <div className="space-y-4">
                  {discussions.map((d) => (
                    <div key={d.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={d.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={d.userName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{d.userName}</div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(d.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-violet-400">{d.title}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{d.message}</p>

                      {/* Replies */}
                      {d.replies?.length > 0 && (
                        <div className="pl-4 border-l-2 border-violet-500/40 space-y-2 mt-3">
                          {d.replies.map((rep) => (
                            <div key={rep.id} className="p-3 rounded-xl bg-slate-950 text-xs space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-200">{rep.userName}</span>
                                {rep.isInstructor && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    Instructor
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 leading-relaxed">{rep.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Reply to this thread..."
                          value={replyMessages[d.id] || ''}
                          onChange={(e) => setReplyMessages({ ...replyMessages, [d.id]: e.target.value })}
                          className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-violet-500"
                        />
                        <button
                          onClick={() => handleReplyDiscussion(d.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-violet-600 text-white text-xs font-bold transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Right: Collapsible Curriculum & Quiz Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 lg:w-96 bg-slate-900 border-l border-slate-800 overflow-y-auto shrink-0 p-5 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                Curriculum Navigator
              </div>
              <div className="text-sm font-black text-white mt-1">
                Course Progress: {progressPercent}%
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Quiz Banner Link */}
            {course?.quiz && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-violet-500/20 to-purple-500/20 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Certification Assessment</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Complete the exam with {course.quiz.passingScore}% or higher to unlock your official diploma.
                </p>
                <Link
                  to={`/quiz/${course.id}`}
                  className="block w-full py-2 rounded-xl text-center text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition-colors"
                >
                  Take Final Quiz
                </Link>
              </div>
            )}

            {/* Modules List */}
            <div className="space-y-4">
              {course?.modules?.map((mod, mIdx) => (
                <div key={mod.id} className="space-y-2">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{mod.title}</span>
                  </div>

                  <div className="space-y-1">
                    {mod.lessons?.map((les) => {
                      const isCurrent = les.id === currentLesson?.id;
                      const isDone = enrollment?.completedLessonIds?.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          onClick={() => setCurrentLesson(les)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                            isCurrent
                              ? 'bg-violet-600 text-white font-bold shadow-md'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {isDone ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 ml-2 shrink-0">{les.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </aside>
        )}

      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          certificate={certificateData}
          onClose={() => setShowCertificate(false)}
        />
      )}

    </div>
  );
};
