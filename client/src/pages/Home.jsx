import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CourseCard } from '../components/common/CourseCard';
import {
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Star,
  Play,
  ShieldCheck,
  TrendingUp,
  Laptop,
  GraduationCap
} from 'lucide-react';

export const Home = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, catRes] = await Promise.all([
          api.courses.getAll({ sort: 'popular' }),
          api.courses.getCategories()
        ]);
        if (cRes.success) setCourses(cRes.courses);
        if (catRes.success) setCategories(catRes.categories);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  const featuredCourses = courses.filter(c => c.isFeatured).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-violet-100/40 via-amber-50/20 to-slate-50">
        
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl -z-10 animate-pulse-glow"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100/90 text-violet-800 border border-violet-200 text-xs font-bold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Next-Generation Career Learning Platform</span>
              </div>

              {/* Exact user requested headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Learn New Skills. <br />
                <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                  Unlock Your Future.
                </span>
              </h1>

              {/* Exact user requested subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Explore expert-led courses, develop in-demand skills, and achieve your learning goals with one powerful platform.
              </p>

              {/* Course Search Bar */}
              <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0 relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4" />
                <input
                  type="text"
                  placeholder="What would you like to master today? (e.g. Full Stack, AI, UI/UX...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white border border-slate-200 shadow-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-slate-900"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-violet-600 to-amber-500 hover:shadow-glow-violet transition-all"
                >
                  Search
                </button>
              </form>

              {/* Exact user requested buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/courses"
                  className="px-6 py-3.5 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:shadow-glow-violet transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-2xl font-extrabold text-sm text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-violet-600" />
                  <span>Start Learning</span>
                </Link>
              </div>

              {/* Quick Trust Checklist */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Certificates
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hands-on Quizzes
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Prior Experience Needed
                </span>
              </div>
            </div>

            {/* Right Visual Card Stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                
                {/* Main Hero Card */}
                <div className="rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-2xl p-3 relative">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                    alt="Students learning together"
                    className="w-full h-64 sm:h-72 object-cover rounded-2xl"
                  />
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span className="text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                        Interactive Player
                      </span>
                      <span className="text-amber-500 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" /> 4.95 (2,400+ reviews)
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-slate-900">
                      Full-Stack Web & Deep Learning Specialization
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <span>28 Modules • 52 Hours</span>
                      <span className="font-bold text-emerald-600">Active Mentorship</span>
                    </div>
                  </div>
                </div>

                {/* Floating Achievement Badge 1 */}
                <div className="absolute -top-5 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-glow-orange">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">Accredited Diploma</div>
                    <div className="text-[11px] text-slate-500">Shareable on LinkedIn</div>
                  </div>
                </div>

                {/* Floating Active Learners Badge 2 */}
                <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-glow-violet">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">58,000+ Students</div>
                    <div className="text-[11px] text-emerald-600 font-bold">● 1,420 Enrolling this week</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
              58,000+
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">Active Students</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              120+
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">Industry Mentors</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              98.4%
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">Completion Success</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-600 to-amber-500 bg-clip-text text-transparent">
              4.92 ★
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">Average Course Rating</div>
          </div>
        </div>
      </section>

      {/* 3. Popular Learning Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-extrabold text-violet-700 mb-1">
              Top Curricula
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popular Learning Categories
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-xs sm:text-sm font-bold text-violet-700 hover:text-amber-600 transition-colors flex items-center gap-1.5"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/courses?category=${cat.id}`}
              className="group p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-card-hover hover:border-violet-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-violet-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>{cat.courseCount} Courses</span>
                <ArrowRight className="w-4 h-4 text-violet-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-extrabold text-amber-600 mb-1">
              Hand-Picked Excellence
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Flagship Courses
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-xs sm:text-sm font-bold text-violet-700 hover:text-amber-600 transition-colors flex items-center gap-1.5"
          >
            <span>View All ({courses.length}) Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 5. Why Choose AuraLMS */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Transformative Learning
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Why Learn With AuraLMS?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Engineered from the ground up for ambitious builders who want verifiable skill outcomes, not just passive video watching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white shadow-glow-violet">
                <Play className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Interactive Video Player</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamless video streaming, module-by-module navigation, downloadable PDF resources, and lesson note synchronization.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-glow-orange">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Automated Quizzes & Grades</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test your understanding with timed multiple-choice assessments, instant score breakdowns, and question explanations.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Verified Certificates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earn cryptographic certificates of completion with unique verification IDs, instantly printable and shareable with employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Top Instructors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs uppercase tracking-widest font-extrabold text-violet-700">
            World-Class Mentors
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Learn From Industry Leaders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Our instructors are principal software architects, AI researchers, and senior design directors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-5">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
              alt="Dr. Elena Vance"
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-violet-500/30"
            />
            <div className="space-y-1 flex-1">
              <h3 className="font-extrabold text-slate-900 text-base">Dr. Elena Vance</h3>
              <div className="text-xs text-violet-700 font-semibold">Lead Systems Architect</div>
              <p className="text-xs text-slate-500 line-clamp-2">
                12+ years building distributed applications and mentoring 50,000+ developers globally.
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-600 font-bold">
                <span className="text-amber-500 flex items-center gap-1">★ 4.9 Rating</span>
                <span>• 18,450 Students</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-5">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
              alt="Marcus Sterling"
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-500/30"
            />
            <div className="space-y-1 flex-1">
              <h3 className="font-extrabold text-slate-900 text-base">Marcus Sterling</h3>
              <div className="text-xs text-amber-600 font-semibold">AI Researcher & Deep Learning Engineer</div>
              <p className="text-xs text-slate-500 line-clamp-2">
                Pioneering neural transformer models and applied PyTorch computer vision pipelines.
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-600 font-bold">
                <span className="text-amber-500 flex items-center gap-1">★ 4.8 Rating</span>
                <span>• 12,890 Students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Student Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-50/60 via-white to-amber-50/60 border border-slate-200 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Student Success Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Loved by 50,000+ Learners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "The Full Stack curriculum took me from junior to senior engineer in six months. The security and JWT breakdown is second to none."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Alex Morgan"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Alex Morgan</div>
                  <div className="text-[10px] text-slate-500">Frontend Engineer at Vercel</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "Marcus's deep learning explanations made transformers click in my head immediately. Passing the quiz and getting certified was huge!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                  alt="Devon Taylor"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Devon Taylor</div>
                  <div className="text-[10px] text-slate-500">ML Specialist at Stripe</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "The UI/UX design tokens and Figma auto-layout modules completely elevated our product design process. Truly top-tier content."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Samantha Reed"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Samantha Reed</div>
                  <div className="text-[10px] text-slate-500">Lead Product Designer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl p-10 sm:p-16 bg-gradient-to-r from-violet-700 via-purple-700 to-amber-600 text-white shadow-xl text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-sm sm:text-base text-violet-100 leading-relaxed">
              Join thousands of developers, designers, and innovators gaining career-defining certifications on AuraLMS today.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses"
              className="px-8 py-3.5 rounded-2xl font-black text-sm bg-white text-slate-900 hover:bg-slate-100 shadow-lg transition-transform transform hover:scale-105"
            >
              Start Exploring Courses
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-violet-900/40 text-white hover:bg-violet-900/60 border border-white/20 transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
