import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Search,
  Heart,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleDemoSwitch = async (role) => {
    await quickDemoLogin(role);
    setDemoDropdownOpen(false);
    if (role === 'student') navigate('/dashboard/student');
    else if (role === 'instructor') navigate('/dashboard/instructor');
    else if (role === 'admin') navigate('/dashboard/admin');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'instructor') return '/dashboard/instructor';
    return '/dashboard/student';
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 transition-all duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shadow-glow-violet group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-700 via-purple-700 to-amber-600 bg-clip-text text-transparent">
                  Aura<span className="text-slate-900 font-black">LMS</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-violet-600 -mt-1">
                  Modern EdTech
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                to="/courses"
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname === '/courses'
                    ? 'text-violet-700 bg-violet-50 font-bold'
                    : 'text-slate-600 hover:text-violet-700 hover:bg-slate-100/70'
                }`}
              >
                Explore Courses
              </Link>
              {isAuthenticated && (
                <Link
                  to={getDashboardPath()}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    location.pathname.startsWith('/dashboard')
                      ? 'text-violet-700 bg-violet-50 font-bold'
                      : 'text-slate-600 hover:text-violet-700 hover:bg-slate-100/70'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {user?.role === 'admin' ? 'Admin Portal' : user?.role === 'instructor' ? 'Instructor Studio' : 'My Learning'}
                </Link>
              )}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search web dev, AI, UI/UX, Python..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder-slate-400 rounded-full border border-slate-200/80 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
              />
            </form>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Role Switcher Badge */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-500/10 to-violet-500/10 text-amber-900 border border-amber-300/60 hover:bg-amber-100/60 transition-all"
                title="Switch test persona instantly"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Demo: <strong className="capitalize">{user ? user.role : 'Guest'}</strong></span>
                <ChevronDown className="w-3 h-3 text-amber-700" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Instant 1-Click Role Switcher
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('student')}
                    className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-violet-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Student Account</div>
                      <div className="text-[11px] text-slate-500">Alex Morgan (Enrolled, Quizzes)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('instructor')}
                    className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-violet-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Instructor Account</div>
                      <div className="text-[11px] text-slate-500">Dr. Elena Vance (Course Builder)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-violet-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Platform Admin</div>
                      <div className="text-[11px] text-slate-500">Sarah Jenkins (Full Control)</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated Actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Wishlist Icon */}
                <Link
                  to="/dashboard/student?tab=wishlist"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors relative"
                  title="My Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {user?.wishlistCourseIds?.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {user.wishlistCourseIds.length}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/30"
                    />
                    <span className="hidden sm:inline text-xs font-bold text-slate-800 pr-1">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="text-sm font-bold text-slate-900 truncate">{user?.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                        <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-800">
                          {user?.role}
                        </div>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <User className="w-4 h-4" />
                        Account Settings
                      </Link>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-violet-700 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl text-white bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:shadow-glow-violet transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 rounded-lg border border-slate-200"
            />
          </form>
          <div className="flex flex-col gap-1 pt-2">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-violet-50 rounded-lg"
            >
              Explore Courses
            </Link>
            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-violet-50 rounded-lg"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
