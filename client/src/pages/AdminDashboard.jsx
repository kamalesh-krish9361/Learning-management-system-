import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/common/Sidebar';
import { StatsCard } from '../components/common/StatsCard';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  FolderTree,
  ShieldCheck,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  X
} from 'lucide-react';

export const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [overviewRes, usersRes, catRes] = await Promise.all([
        api.admin.getOverview(),
        api.admin.getUsers(),
        api.courses.getCategories()
      ]);

      if (overviewRes.success) setData(overviewRes);
      if (usersRes.success) setUsersList(usersRes.users);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err) {
      console.error('Admin overview error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.admin.updateUser(userId, { role: newRole });
      if (res.success) {
        setUsersList(usersList.map(u => u.id === userId ? res.user : u));
      }
    } catch (err) {
      alert('Failed to update role.');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const res = await api.admin.updateUser(userId, { status: newStatus });
      if (res.success) {
        setUsersList(usersList.map(u => u.id === userId ? res.user : u));
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you certain you want to delete this user?')) return;
    try {
      const res = await api.admin.deleteUser(userId);
      if (res.success) {
        setUsersList(usersList.filter(u => u.id !== userId));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setCreatingCat(true);
    try {
      const res = await api.admin.createCategory({
        name: newCatName,
        description: newCatDesc
      });
      if (res.success) {
        setCategories([...categories, res.category]);
        setNewCatName('');
        setNewCatDesc('');
      }
    } catch (err) {
      alert('Failed to create category.');
    } finally {
      setCreatingCat(false);
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await api.admin.deleteCategory(catId);
      if (res.success) {
        setCategories(categories.filter(c => c.id !== catId));
      }
    } catch (err) {
      alert('Failed to delete category.');
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
  const recentUsers = data?.recentUsers || [];
  const courses = data?.courses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <Sidebar role="admin" />

        {/* Right Dashboard Area */}
        <main className="flex-1 space-y-8 min-w-0">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Executive Administration Portal
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {user?.name || 'Sarah Jenkins'}
                  </h1>
                  <p className="text-xs text-slate-300 mt-1">
                    System governance, instructor verification, user accounts, and financial performance.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> System Healthy
                </span>
              </div>
            </div>
          </div>

          {/* 5 Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsCard
              title="Platform Users"
              value={stats.totalUsers}
              subtitle={`${stats.totalStudents} Students, ${stats.totalInstructors} Instructors`}
              icon={Users}
              gradient="from-violet-600 to-indigo-600"
            />
            <StatsCard
              title="Total Courses"
              value={stats.totalCourses}
              subtitle={`${stats.activeCategories} Active categories`}
              icon={BookOpen}
              gradient="from-amber-500 to-orange-600"
            />
            <StatsCard
              title="Total Enrollments"
              value={stats.totalEnrollments?.toLocaleString()}
              subtitle="Course access grants"
              icon={TrendingUp}
              gradient="from-emerald-500 to-teal-600"
              trend="+24% MoM"
            />
            <StatsCard
              title="Platform Volume"
              value={`$${stats.totalRevenue?.toLocaleString()}`}
              subtitle="Gross platform sales"
              icon={DollarSign}
              gradient="from-purple-600 to-pink-600"
            />
          </div>

          {/* Tab 1: OVERVIEW */}
          {currentTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Recent User Registrations */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-slate-900 tracking-tight">
                    Recent User Signups & Identities
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">{recentUsers.length} recent</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                        <th className="pb-3">User</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Registered</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentUsers.map((u) => (
                        <tr key={u.id}>
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                              <div>
                                <div className="font-bold text-slate-900">{u.name}</div>
                                <div className="text-[10px] text-slate-400">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-100 text-violet-800">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                              {u.status}
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

          {/* Tab 2: MANAGE USERS */}
          {currentTab === 'users' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-lg text-slate-900 tracking-tight">
                  User Accounts & Role Permissions ({usersList.length})
                </h3>
                <p className="text-xs text-slate-500">Promote to instructor, approve instructor accounts, or suspend users</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Assigned Role</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id}>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-2.5">
                            <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[10px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role Selector */}
                        <td className="py-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-xs"
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5">
                          <select
                            value={u.status}
                            onChange={(e) => handleStatusChange(u.id, e.target.value)}
                            className={`border rounded-lg px-2 py-1 font-bold text-[11px] ${
                              u.status === 'active' || u.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="approved">Approved</option>
                            <option value="pending_approval">Pending Approval</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </td>

                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: MANAGE COURSES */}
          {currentTab === 'courses' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-lg text-slate-900 tracking-tight">
                  Course Catalog Governance ({courses.length})
                </h3>
                <p className="text-xs text-slate-500">Inspect all active courses across every instructor</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                      <th className="pb-3">Course Title</th>
                      <th className="pb-3">Instructor</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Students</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 font-bold text-slate-900">{c.title}</td>
                        <td className="py-3 text-slate-600">{c.instructor}</td>
                        <td className="py-3 text-slate-500">{c.category}</td>
                        <td className="py-3 font-bold text-slate-800">{c.isFree ? 'FREE' : `$${c.price}`}</td>
                        <td className="py-3 text-slate-600">{c.enrolledCount}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: CATEGORY ARCHITECTURE */}
          {currentTab === 'categories' && (
            <div className="space-y-6">
              {/* Add Category Form */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-black text-base text-slate-900">Add New Learning Category</h3>
                <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Category Name (e.g. Quantum Computing)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="p-2.5 rounded-xl border text-xs bg-slate-50"
                  />
                  <input
                    type="text"
                    placeholder="Brief description..."
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="p-2.5 rounded-xl border text-xs bg-slate-50"
                  />
                  <button
                    type="submit"
                    disabled={creatingCat}
                    className="py-2.5 rounded-xl font-bold text-xs bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                  >
                    {creatingCat ? 'Adding...' : 'Add Category'}
                  </button>
                </form>
              </div>

              {/* Existing Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{cat.name}</div>
                      <div className="text-[11px] text-slate-500">{cat.description || 'Curated courses'}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
