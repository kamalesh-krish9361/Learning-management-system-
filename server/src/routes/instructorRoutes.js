import express from 'express';
import { store } from '../db/store.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get instructor dashboard overview
router.get('/overview', authenticateToken, requireRole('instructor', 'admin'), (req, res) => {
  try {
    const allCourses = store.getCourses();
    const myCourses = allCourses.filter(c => c.instructorId === req.user.id || req.user.role === 'admin');
    const myCourseIds = myCourses.map(c => c.id);

    const allEnrollments = store.getEnrollments();
    const courseEnrollments = allEnrollments.filter(e => myCourseIds.includes(e.courseId));

    // Total unique students
    const uniqueStudents = new Set(courseEnrollments.map(e => e.userId));

    // Total Revenue calculation
    const totalRevenue = myCourses.reduce((sum, c) => {
      const enrollCount = courseEnrollments.filter(e => e.courseId === c.id).length;
      return sum + (enrollCount * (c.isFree ? 0 : c.price));
    }, 0);

    // Recent enrollments enriched
    const recentEnrollments = courseEnrollments.slice(-8).reverse().map(e => {
      const user = store.getUserById(e.userId);
      const course = myCourses.find(c => c.id === e.courseId);
      return {
        id: e.id,
        studentName: user ? user.name : 'Student',
        studentEmail: user ? user.email : '',
        studentAvatar: user ? user.avatar : '',
        courseTitle: course ? course.title : '',
        progress: e.progress,
        enrolledAt: e.enrolledAt,
        status: e.status
      };
    });

    // Assignments
    const allAssignments = store.getAssignments();
    const myAssignments = allAssignments.filter(a => myCourseIds.includes(a.courseId));

    return res.json({
      success: true,
      stats: {
        totalCourses: myCourses.length,
        totalStudents: uniqueStudents.size || myCourses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0),
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageRating: 4.9,
        completionRate: 78
      },
      courses: myCourses,
      recentEnrollments,
      assignments: myAssignments
    });
  } catch (err) {
    console.error('Instructor overview error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load instructor data.' });
  }
});

// Grade student assignment
router.post('/assignments/:assignmentId/grade/:submissionId', authenticateToken, requireRole('instructor', 'admin'), (req, res) => {
  const { assignmentId, submissionId } = req.params;
  const { grade, feedback } = req.body;

  const result = store.gradeAssignment(assignmentId, submissionId, Number(grade), feedback);
  if (!result) {
    return res.status(404).json({ success: false, message: 'Assignment or submission not found.' });
  }

  return res.json({ success: true, submission: result, message: 'Assignment graded successfully!' });
});

export default router;
