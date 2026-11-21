import express from 'express';
import { store } from '../db/store.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Get all courses with search, filters, and sort
router.get('/', (req, res) => {
  try {
    let courses = store.getCourses();
    const { category, level, price, search, sort } = req.query;

    // Filter by category
    if (category && category !== 'all') {
      courses = courses.filter(c => 
        (c.categoryId && c.categoryId.toLowerCase() === category.toLowerCase()) ||
        (c.category && c.category.toLowerCase() === category.toLowerCase())
      );
    }

    // Filter by level
    if (level && level !== 'all') {
      courses = courses.filter(c => c.level && c.level.toLowerCase() === level.toLowerCase());
    }

    // Filter by price
    if (price === 'free') {
      courses = courses.filter(c => c.isFree || c.price === 0);
    } else if (price === 'paid') {
      courses = courses.filter(c => !c.isFree && c.price > 0);
    }

    // Search query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.instructor && c.instructor.name.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sort === 'popular') {
      courses.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0));
    } else if (sort === 'rating') {
      courses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'price-low') {
      courses.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price-high') {
      courses.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      // Default to featured or newest
      courses.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return res.json({ success: true, count: courses.length, courses });
  } catch (err) {
    console.error('Error fetching courses:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
  }
});

// Get Categories
router.get('/categories', (req, res) => {
  const categories = store.getCategories();
  res.json({ success: true, categories });
});

// Get single course by ID or slug
router.get('/:id', (req, res) => {
  const course = store.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }
  const reviews = store.getReviewsByCourseId(course.id);
  return res.json({ success: true, course, reviews });
});

// Create course (Instructor or Admin)
router.post('/', authenticateToken, requireRole('instructor', 'admin'), (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      level = 'Beginner',
      duration = '10 Hours',
      price = 0,
      isFree = false,
      thumbnail,
      learningOutcomes = [],
      requirements = [],
      modules = []
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const courseId = `course-${crypto.randomUUID().slice(0, 8)}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCourse = {
      id: courseId,
      title,
      slug,
      subtitle: subtitle || title,
      description,
      category: category || 'General',
      categoryId: `cat-${(category || 'web').toLowerCase().replace(/\s+/g, '-')}`,
      level,
      duration,
      totalLessons: modules.reduce((acc, m) => acc + (m.lessons ? m.lessons.length : 0), 0) || 1,
      rating: 5.0,
      reviewsCount: 0,
      enrolledCount: 0,
      price: isFree ? 0 : Number(price) || 0,
      originalPrice: isFree ? 0 : (Number(price) ? Number(price) * 1.5 : 99.99),
      isFree: Boolean(isFree || Number(price) === 0),
      isFeatured: false,
      status: 'published',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
      banner: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
      instructorId: req.user.id,
      instructor: {
        id: req.user.id,
        name: req.user.name,
        title: 'Course Instructor',
        avatar: req.user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        rating: 4.9,
        studentsCount: 1
      },
      learningOutcomes: learningOutcomes.length ? learningOutcomes : [
        'Understand the core foundations and modern workflows',
        'Build real-world projects from scratch',
        'Master best industry practices and tooling'
      ],
      requirements: requirements.length ? requirements : ['No prior experience required.'],
      modules: modules.length ? modules : [
        {
          id: `mod-${crypto.randomUUID().slice(0, 6)}`,
          title: 'Module 1: Getting Started & Course Introduction',
          duration: '1h 30m',
          lessons: [
            {
              id: `les-${crypto.randomUUID().slice(0, 6)}`,
              title: 'Welcome & Curriculum Overview',
              duration: '10:00',
              type: 'video',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              isPreview: true,
              content: 'Welcome to the course! In this lesson we review what you will achieve.',
              resources: []
            }
          ]
        }
      ],
      quiz: null
    };

    store.addCourse(newCourse);
    return res.status(201).json({ success: true, course: newCourse, message: 'Course created successfully!' });
  } catch (err) {
    console.error('Error creating course:', err);
    return res.status(500).json({ success: false, message: 'Failed to create course.' });
  }
});

// Update course
router.put('/:id', authenticateToken, (req, res) => {
  const course = store.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  // Only the instructor or admin can edit
  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Not authorized to edit this course.' });
  }

  const updatedCourse = store.updateCourse(course.id, req.body);
  return res.json({ success: true, course: updatedCourse, message: 'Course updated successfully!' });
});

// Delete course
router.delete('/:id', authenticateToken, (req, res) => {
  const course = store.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this course.' });
  }

  store.deleteCourse(course.id);
  return res.json({ success: true, message: 'Course removed successfully.' });
});

// Add Review
router.post('/:id/reviews', authenticateToken, (req, res) => {
  const course = store.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found.' });
  }

  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ success: false, message: 'Rating and comment are required.' });
  }

  const newReview = {
    id: `rev-${crypto.randomUUID().slice(0, 8)}`,
    courseId: course.id,
    userId: req.user.id,
    userName: req.user.name,
    userAvatar: req.user.avatar,
    rating: Number(rating),
    date: new Date().toISOString().split('T')[0],
    comment
  };

  store.addReview(newReview);
  return res.status(201).json({ success: true, review: newReview, message: 'Review submitted successfully!' });
});

export default router;
