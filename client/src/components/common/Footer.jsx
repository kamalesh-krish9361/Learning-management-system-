import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Award, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shadow-glow-violet">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Aura<span className="text-amber-400">LMS</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering global learners with in-demand technical skills, hands-on architectural code challenges, verified certificates, and career mentorship.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> ISO Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 font-medium">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Accredited Curriculum
              </span>
            </div>
          </div>

          {/* Column 1: Learning paths */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Curriculum</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses?category=cat-web" className="hover:text-amber-400 transition-colors">Web Development</Link></li>
              <li><Link to="/courses?category=cat-ai" className="hover:text-amber-400 transition-colors">AI & Machine Learning</Link></li>
              <li><Link to="/courses?category=cat-design" className="hover:text-amber-400 transition-colors">UI/UX Design Systems</Link></li>
              <li><Link to="/courses?category=cat-data" className="hover:text-amber-400 transition-colors">Data Science & SQL</Link></li>
              <li><Link to="/courses?category=cat-security" className="hover:text-amber-400 transition-colors">Cybersecurity Defense</Link></li>
              <li><Link to="/courses?category=cat-cloud" className="hover:text-amber-400 transition-colors">Cloud & DevOps</Link></li>
            </ul>
          </div>

          {/* Column 2: Platform roles */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard/student" className="hover:text-violet-400 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/dashboard/instructor" className="hover:text-violet-400 transition-colors">Instructor Studio</Link></li>
              <li><Link to="/dashboard/admin" className="hover:text-violet-400 transition-colors">Admin Governance</Link></li>
              <li><Link to="/courses" className="hover:text-violet-400 transition-colors">Course Marketplace</Link></li>
              <li><Link to="/register" className="hover:text-violet-400 transition-colors">Become an Instructor</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Stay Ahead</h4>
            <p className="text-xs text-slate-400 mb-3">Get notified about new courses, scholarship grants, and tech tutorials.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="your.email@work.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 text-xs border border-slate-700 focus:outline-none focus:border-amber-400"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-violet-600 to-amber-500 rounded-lg text-white hover:opacity-95">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AuraLMS EdTech Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
