import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/common/Sidebar';
import { StatsCard } from '../components/common/StatsCard';
import { CourseCard } from '../components/common/CourseCard';
import { CertificateModal } from '../components/common/CertificateModal';
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight,
  TrendingUp,
  Heart,
  FileCheck
} from 'lucide-react';

export const StudentDashboard = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const { user } = useAuth();

  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Certificate Modal State
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [enrRes, cRes, qRes] = await Promise.all([
          api.enrollments.getMyEnrollments(),
          api.courses.getAll(),
          api.quizzes.getMyHistory()
        ]);

        if (enrRes.success) setEnrollments(enrRes.enrollments);
        if (cRes.success) setCourses(cRes.courses);
        if (qRes.success) setQuizHistory(qRes.history);
      } catch (err) {
        console.error('Error fetching student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const inProgressEnrollments = enrollments.filter(e => e.progress < 100);
  const completedEnrollments = enrollments.filter(e => e.progress === 100);

  // Continue Learning course (first in-progress or first enrolled)
  const activeCourseEnrollment = inProgressEnrollments[0] || enrollments[0];

  // Wishlisted courses
  const wishlistCourses = courses.filter(c => user?.wishlistCourseIds?.includes(c.id));

  // Weekly activity data simulation
  const weeklyHours = [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 5.0 },
    { day: 'Wed', hours: 2.0 },
    { day: 'Thu', hours: 6.5 },
    { day: 'Fri', hours: 4.0 },
    { day: 'Sat', hours: 7.5 },
    { day: 'Sun', hours: 4.5 }
  ];
  const maxHours = Math.max(...weeklyHours.map(d => d.hours));

  const badges = [
    { id: 'b1', name: 'Fast Learner', desc: 'Completed 5 lessons in 24 hours', icon: Flame, color: 'from-amber-500 to-orange-500' },
    { id: 'b2', name: 'Quiz Master', desc: 'Scored 100% on a certification exam', icon: Award, color: 'from-violet-600 to-purple-600' },
    { id: 'b3', name: 'Code Architect', desc: 'Enrolled in full stack curriculum', icon: GraduationCap, color: 'from-emerald-500 to-teal-600' },
    { id: 'b4', name: 'Pioneer', desc: 'Consistent 7-day study streak', icon: CheckCircle2, color: 'from-fuchsia-600 to-pink-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Role Sidebar */}
        <Sidebar role="student" />

        {/* Right Dashboard Area */}
        <main className="flex-1 space-y-8 min-w-0">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl -z-10"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-400 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Welcome Back, Student
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {user?.name || 'Alex Morgan'}
                  </h1>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                    {user?.headline || 'Computer Science Student & Aspiring Full Stack Dev'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-300">Daily Streak</div>
                  <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 fill-amber-400" /> 7 Days
                  </div>
                </div>
                <Link
                  to="/courses"
                  className="px-5 py-2.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-violet-600 to-amber-500 text-white hover:opacity-95 shadow-md shrink-0"
                >
                  Explore Catalog
                </Link>
              </div>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsCard
              title="Enrolled Courses"
              value={enrollments.length}
              subtitle="Curriculum tracks"
              icon={BookOpen}
              gradient="from-violet-600 to-indigo-600"
            />
            <StatsCard
              title="In Progress"
              value={inProgressEnrollments.length}
              subtitle="Active study streams"
              icon={Clock}
              gradient="from-amber-500 to-orange-600"
            />
            <StatsCard
              title="Completed"
              value={completedEnrollments.length}
              subtitle="Certificates awarded"
              icon={CheckCircle2}
              gradient="from-emerald-500 to-teal-600"
            />
            <StatsCard
              title="Learning Hours"
              value={`${user?.learningHours || 42.5}h`}
              subtitle="Dedicated clock time"
              icon={GraduationCap}
              gradient="from-purple-600 to-pink-600"
              trend="+14% this week"
            />
          </div>

          {/* Tab 1: OVERVIEW */}
          {currentTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Continue Learning + Weekly Chart Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Active Course Card (7 cols) */}
                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                      <span className="uppercase tracking-wider text-violet-700">Continue Learning</span>
                      <span className="text-amber-500 font-extrabold">{activeCourseEnrollment?.progress || 0}% Done</span>
                    </div>

                    {activeCourseEnrollment?.course ? (
                      <div>
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                          {activeCourseEnrollment.course.title}
                        </h2>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {activeCourseEnrollment.course.subtitle}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Enroll in a course to start your learning journey.</p>
                    )}
                  </div>

                  {activeCourseEnrollment?.course && (
                    <div className="space-y-4">
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-600 to-amber-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${activeCourseEnrollment.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-violet-600" />
                          <span>{activeCourseEnrollment.course.duration}</span>
                        </div>
                        <Link
                          to={`/learn/${activeCourseEnrollment.course.id}`}
                          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-violet-700 transition-colors flex items-center gap-1.5"
                        >
                          <span>Resume Lesson</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Weekly Study Activity Chart (5 cols) */}
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">Weekly Learning Activity</h3>
                      <p className="text-[11px] text-slate-500">Hours spent studying this week</p>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      33 hrs Total
                    </span>
                  </div>

                  {/* Interactive Visual Bar Chart */}
                  <div className="flex items-end justify-between gap-2 h-36 pt-4">
                    {weeklyHours.map((item, idx) => {
                      const heightPercent = Math.round((item.hours / maxHours) * 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-violet-700">
                            {item.hours}h
                          </div>
                          <div
                            className="w-full rounded-t-xl bg-gradient-to-t from-violet-600 to-purple-500 group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300"
                            style={{ height: `${heightPercent}%` }}
                          ></div>
                          <span className="text-[10px] font-bold text-slate-500">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* My Enrolled Courses Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Enrolled Courses ({enrollments.length})
                  </h3>
                  <Link to="/courses" className="text-xs font-bold text-violet-700 hover:text-amber-600">
                    Find More Courses
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {enrollments.map((enr) => (
                    <CourseCard
                      key={enr.id}
                      course={enr.course}
                      isEnrolled={true}
                      userProgress={enr.progress}
                    />
                  ))}
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Achievement Badges</h3>
                    <p className="text-xs text-slate-500">Milestones unlocked throughout your studies</p>
                  </div>
                  <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full">
                    4 Unlocked
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {badges.map((b) => {
                    const Icon = b.icon;
                    return (
                      <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${b.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{b.name}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{b.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: WISHLIST */}
          {currentTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Saved Wishlist Courses</h2>
              {wishlistCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {wishlistCourses.map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl border text-center space-y-3">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800">Your wishlist is empty</h3>
                  <p className="text-xs text-slate-500">Save courses you're interested in taking later.</p>
                  <Link to="/courses" className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white">
                    Explore Catalog
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: CERTIFICATES & GRADES */}
          {currentTab === 'certificates' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Official Certificates & Examination Records</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedEnrollments.map((enr) => (
                  <div key={enr.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          ✓ Completed 100%
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{enr.certificateId}</span>
                      </div>
                      <h3 className="font-black text-slate-900 text-base">{enr.course.title}</h3>
                      <p className="text-xs text-slate-500">Instructor: {enr.course.instructor?.name}</p>
                    </div>

                    <button
                      onClick={async () => {
                        const res = await api.enrollments.getCertificate(enr.courseId);
                        if (res.success) {
                          setSelectedCertificate(res.certificate);
                        }
                      }}
                      className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-violet-600 to-amber-500 text-white shadow-md flex items-center justify-center gap-2 hover:opacity-95"
                    >
                      <Award className="w-4 h-4" />
                      <span>View & Download Certificate</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Quiz Submissions Table */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900">Quiz History & Score Records</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                        <th className="pb-3">Course</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Score</th>
                        <th className="pb-3">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {quizHistory.map((q) => (
                        <tr key={q.id}>
                          <td className="py-3 font-bold text-slate-800">{q.courseTitle}</td>
                          <td className="py-3 text-slate-500">{new Date(q.submittedAt).toLocaleDateString()}</td>
                          <td className="py-3 font-extrabold text-violet-700">{q.score}%</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              q.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {q.passed ? 'Passed' : 'Failed'}
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

        </main>
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};
