import express from 'express';
import { store } from '../db/store.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Admin Dashboard stats & overview
router.get('/overview', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const users = store.getUsers();
    const courses = store.getCourses();
    const enrollments = store.getEnrollments();
    const categories = store.getCategories();

    const studentsCount = users.filter(u => u.role === 'student').length;
    const instructorsCount = users.filter(u => u.role === 'instructor').length;

    // Platform revenue
    const totalPlatformRevenue = courses.reduce((sum, c) => {
      return sum + ((c.enrolledCount || 0) * (c.isFree ? 0 : c.price));
    }, 0);

    return res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalStudents: studentsCount,
        totalInstructors: instructorsCount,
        totalCourses: courses.length,
        totalEnrollments: enrollments.length + courses.reduce((s, c) => s + (c.enrolledCount || 0), 0),
        totalRevenue: Math.round(totalPlatformRevenue),
        activeCategories: categories.length
      },
      recentUsers: users.slice(-8).reverse().map(u => {
        const { password: _, ...safe } = u;
        return safe;
      }),
      courses: courses.map(c => ({
        id: c.id,
        title: c.title,
        category: c.category,
        instructor: c.instructor ? c.instructor.name : 'Unknown',
        price: c.price,
        isFree: c.isFree,
        enrolledCount: c.enrolledCount,
        rating: c.rating,
        status: c.status || 'published'
      }))
    });
  } catch (err) {
    console.error('Admin overview error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load admin overview.' });
  }
});

// Get all users
router.get('/users', authenticateToken, requireRole('admin'), (req, res) => {
  const users = store.getUsers().map(u => {
    const { password: _, ...safe } = u;
    return safe;
  });
  return res.json({ success: true, users });
});

// Update user role or status (e.g. approve instructor)
router.put('/users/:id', authenticateToken, requireRole('admin'), (req, res) => {
  const { role, status } = req.body;
  const updates = {};
  if (role) updates.role = role;
  if (status) updates.status = status;

  const updatedUser = store.updateUser(req.params.id, updates);
  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { password: _, ...safe } = updatedUser;
  return res.json({ success: true, user: safe, message: 'User updated successfully!' });
});

// Delete user
router.delete('/users/:id', authenticateToken, requireRole('admin'), (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own admin account.' });
  }

  store.deleteUser(req.params.id);
  return res.json({ success: true, message: 'User account removed.' });
});

// Manage Categories
router.post('/categories', authenticateToken, requireRole('admin'), (req, res) => {
  const { name, description, icon = 'BookOpen', color = 'from-violet-600 to-indigo-600' } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name required.' });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newCat = {
    id: `cat-${crypto.randomUUID().slice(0, 6)}`,
    name,
    slug,
    description: description || '',
    icon,
    color,
    badgeColor: 'bg-violet-100 text-violet-800',
    courseCount: 0
  };

  store.addCategory(newCat);
  return res.status(201).json({ success: true, category: newCat, message: 'Category created!' });
});

router.delete('/categories/:id', authenticateToken, requireRole('admin'), (req, res) => {
  store.deleteCategory(req.params.id);
  return res.json({ success: true, message: 'Category deleted.' });
});

export default router;
