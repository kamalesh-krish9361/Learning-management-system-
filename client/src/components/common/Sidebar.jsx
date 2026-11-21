import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Award,
  Heart,
  BarChart3,
  Users,
  PlusCircle,
  FileCheck,
  FolderTree,
  Settings,
  HelpCircle
} from 'lucide-react';

export const Sidebar = ({ role = 'student' }) => {
  const studentLinks = [
    { to: '/dashboard/student', label: 'My Learning Overview', icon: GraduationCap, end: true },
    { to: '/courses', label: 'Browse Catalog', icon: BookOpen },
    { to: '/dashboard/student?tab=wishlist', label: 'Saved Wishlist', icon: Heart },
    { to: '/dashboard/student?tab=certificates', label: 'Certificates & Grades', icon: Award },
    { to: '/profile', label: 'Profile & Preferences', icon: Settings },
  ];

  const instructorLinks = [
    { to: '/dashboard/instructor', label: 'Studio Analytics', icon: BarChart3, end: true },
    { to: '/dashboard/instructor?tab=courses', label: 'Manage Courses', icon: BookOpen },
    { to: '/dashboard/instructor?tab=create', label: 'Create New Course', icon: PlusCircle },
    { to: '/dashboard/instructor?tab=assignments', label: 'Evaluate Assignments', icon: FileCheck },
    { to: '/profile', label: 'Instructor Profile', icon: Settings },
  ];

  const adminLinks = [
    { to: '/dashboard/admin', label: 'Platform Executive', icon: BarChart3, end: true },
    { to: '/dashboard/admin?tab=users', label: 'Manage Users & Roles', icon: Users },
    { to: '/dashboard/admin?tab=courses', label: 'Curriculum & Moderation', icon: BookOpen },
    { to: '/dashboard/admin?tab=categories', label: 'Category Architecture', icon: FolderTree },
    { to: '/profile', label: 'System Settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : role === 'instructor' ? instructorLinks : studentLinks;

  const roleLabels = {
    student: { title: 'Student Portal', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    instructor: { title: 'Instructor Studio', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
    admin: { title: 'Admin Command', badge: 'bg-amber-100 text-amber-800 border-amber-200' }
  };

  const currentRole = roleLabels[role] || roleLabels.student;

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-6">
      
      {/* Role Pill Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-800">{currentRole.title}</div>
          <div className="text-[11px] text-slate-500">Navigation Hub</div>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${currentRole.badge}`}>
          {role}
        </span>
      </div>

      {/* Nav List */}
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm shadow-violet-500/20'
                    : 'text-slate-600 hover:text-violet-700 hover:bg-violet-50/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Pro Help Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-violet-500/10 to-purple-500/10 border border-amber-200/50">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Need Guidance?</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug">
          Explore course syllabi, assignments, or ask in the community discussions.
        </p>
      </div>
    </aside>
  );
};
