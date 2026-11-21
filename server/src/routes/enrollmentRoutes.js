import express from 'express';
import { store } from '../db/store.js';
import { authenticateToken } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Get current user's enrollments
router.get('/my-enrollments', authenticateToken, (req, res) => {
  try {
    const enrollments = store.getEnrollmentsByUserId(req.user.id);
    const enriched = enrollments.map(enr => {
      const course = store.getCourseById(enr.courseId);
      return {
        ...enr,
        course
      };
    }).filter(e => e.course != null);

    return res.json({ success: true, enrollments: enriched });
  } catch (err) {
    console.error('Error fetching enrollments:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch enrollments.' });
  }
});

// Check enrollment status for specific course
router.get('/check/:courseId', authenticateToken, (req, res) => {
  const enrollment = store.getEnrollment(req.user.id, req.params.courseId);
  return res.json({ success: true, isEnrolled: !!enrollment, enrollment });
});

// Enroll in a course
router.post('/enroll/:courseId', authenticateToken, (req, res) => {
  try {
    const course = store.getCourseById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const existing = store.getEnrollment(req.user.id, course.id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course.', enrollment: existing });
    }

    // Determine first lesson
    let firstLessonId = null;
    if (course.modules && course.modules.length > 0 && course.modules[0].lessons && course.modules[0].lessons.length > 0) {
      firstLessonId = course.modules[0].lessons[0].id;
    }

    const newEnrollment = {
      id: `enr-${crypto.randomUUID().slice(0, 8)}`,
      userId: req.user.id,
      courseId: course.id,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedLessonIds: [],
      lastAccessedLessonId: firstLessonId,
      status: 'in_progress',
      certificateIssued: false
    };

    store.addEnrollment(newEnrollment);

    // Update user enrolledCourseIds
    const user = store.getUserById(req.user.id);
    if (user) {
      const enrolledIds = user.enrolledCourseIds || [];
      if (!enrolledIds.includes(course.id)) {
        enrolledIds.push(course.id);
        store.updateUser(user.id, { enrolledCourseIds: enrolledIds });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course!',
      enrollment: newEnrollment
    });
  } catch (err) {
    console.error('Error enrolling:', err);
    return res.status(500).json({ success: false, message: 'Failed to enroll in course.' });
  }
});

// Update lesson progress (mark complete / uncomplete)
router.post('/progress', authenticateToken, (req, res) => {
  try {
    const { courseId, lessonId, completed = true } = req.body;
    if (!courseId || !lessonId) {
      return res.status(400).json({ success: false, message: 'Course ID and Lesson ID are required.' });
    }

    let enrollment = store.getEnrollment(req.user.id, courseId);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Not enrolled in this course.' });
    }

    const course = store.getCourseById(courseId);
    let completedLessonIds = enrollment.completedLessonIds || [];

    if (completed) {
      if (!completedLessonIds.includes(lessonId)) {
        completedLessonIds.push(lessonId);
      }
    } else {
      completedLessonIds = completedLessonIds.filter(id => id !== lessonId);
    }

    // Calculate total lessons in course
    let totalLessonsCount = 0;
    if (course && course.modules) {
      course.modules.forEach(m => {
        if (m.lessons) totalLessonsCount += m.lessons.length;
      });
    }
    if (totalLessonsCount === 0) totalLessonsCount = course?.totalLessons || 1;

    const progressPercentage = Math.min(100, Math.round((completedLessonIds.length / totalLessonsCount) * 100));
    const isCompleted = progressPercentage === 100;

    const updates = {
      completedLessonIds,
      progress: progressPercentage,
      lastAccessedLessonId: lessonId,
      status: isCompleted ? 'completed' : 'in_progress'
    };

    if (isCompleted && !enrollment.certificateIssued) {
      updates.certificateIssued = true;
      updates.certificateId = `CERT-AURA-${Date.now().toString().slice(-6)}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
      updates.completedAt = new Date().toISOString();
    }

    const updated = store.updateEnrollment(enrollment.id, updates);

    // Increase user learning hours slightly
    const user = store.getUserById(req.user.id);
    if (user && completed) {
      store.updateUser(user.id, {
        learningHours: parseFloat(((user.learningHours || 0) + 0.35).toFixed(1))
      });
    }

    return res.json({
      success: true,
      enrollment: updated,
      isCompleted,
      progress: progressPercentage,
      message: completed ? 'Lesson completed!' : 'Lesson unmarked.'
    });
  } catch (err) {
    console.error('Error updating progress:', err);
    return res.status(500).json({ success: false, message: 'Failed to update progress.' });
  }
});

// Get Certificate details
router.get('/certificate/:courseId', authenticateToken, (req, res) => {
  const enrollment = store.getEnrollment(req.user.id, req.params.courseId);
  if (!enrollment || !enrollment.certificateIssued) {
    return res.status(404).json({ success: false, message: 'Certificate not earned yet.' });
  }

  const course = store.getCourseById(req.params.courseId);
  const user = store.getUserById(req.user.id);

  return res.json({
    success: true,
    certificate: {
      id: enrollment.certificateId,
      recipientName: user.name,
      courseTitle: course.title,
      instructorName: course.instructor.name,
      issueDate: enrollment.completedAt || enrollment.enrolledAt,
      grade: 'Distinction (100% Curriculum Completed)'
    }
  });
});

export default router;
