import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SEED_FILE = path.join(DATA_DIR, 'seedData.json');

class Store {
  constructor() {
    this.data = {
      users: [],
      categories: [],
      courses: [],
      enrollments: [],
      quizSubmissions: [],
      reviews: [],
      discussions: [],
      assignments: []
    };
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('✅ Loaded database from storage file.');
      } else if (fs.existsSync(SEED_FILE)) {
        const seedRaw = fs.readFileSync(SEED_FILE, 'utf-8');
        this.data = JSON.parse(seedRaw);
        this.save();
        console.log('🌱 Seeded database successfully.');
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error initializing store:', err);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  // --- Users ---
  getUsers() { return this.data.users; }
  getUserById(id) { return this.data.users.find(u => u.id === id); }
  getUserByEmail(email) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  addUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }
  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }
  deleteUser(id) {
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.save();
  }

  // --- Categories ---
  getCategories() { return this.data.categories; }
  addCategory(category) {
    this.data.categories.push(category);
    this.save();
    return category;
  }
  updateCategory(id, updates) {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
      this.save();
      return this.data.categories[idx];
    }
    return null;
  }
  deleteCategory(id) {
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    this.save();
  }

  // --- Courses ---
  getCourses() { return this.data.courses; }
  getCourseById(id) { return this.data.courses.find(c => c.id === id || c.slug === id); }
  addCourse(course) {
    this.data.courses.push(course);
    this.save();
    return course;
  }
  updateCourse(id, updates) {
    const idx = this.data.courses.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.courses[idx] = { ...this.data.courses[idx], ...updates };
      this.save();
      return this.data.courses[idx];
    }
    return null;
  }
  deleteCourse(id) {
    this.data.courses = this.data.courses.filter(c => c.id !== id);
    this.save();
  }

  // --- Enrollments ---
  getEnrollments() { return this.data.enrollments; }
  getEnrollmentsByUserId(userId) { return this.data.enrollments.filter(e => e.userId === userId); }
  getEnrollment(userId, courseId) {
    return this.data.enrollments.find(e => e.userId === userId && e.courseId === courseId);
  }
  addEnrollment(enrollment) {
    this.data.enrollments.push(enrollment);
    // increment course enrolledCount
    const course = this.getCourseById(enrollment.courseId);
    if (course) {
      course.enrolledCount = (course.enrolledCount || 0) + 1;
    }
    this.save();
    return enrollment;
  }
  updateEnrollment(id, updates) {
    const idx = this.data.enrollments.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.data.enrollments[idx] = { ...this.data.enrollments[idx], ...updates };
      this.save();
      return this.data.enrollments[idx];
    }
    return null;
  }

  // --- Quiz Submissions ---
  getQuizSubmissions(userId) {
    if (userId) return this.data.quizSubmissions.filter(q => q.userId === userId);
    return this.data.quizSubmissions;
  }
  addQuizSubmission(submission) {
    this.data.quizSubmissions.push(submission);
    this.save();
    return submission;
  }

  // --- Reviews ---
  getReviewsByCourseId(courseId) {
    return this.data.reviews.filter(r => r.courseId === courseId);
  }
  addReview(review) {
    this.data.reviews.push(review);
    // recalculate course rating
    const courseReviews = this.getReviewsByCourseId(review.courseId);
    const avg = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
    const course = this.getCourseById(review.courseId);
    if (course) {
      course.rating = parseFloat(avg.toFixed(1));
      course.reviewsCount = courseReviews.length;
    }
    this.save();
    return review;
  }

  // --- Discussions ---
  getDiscussions(courseId, lessonId) {
    return this.data.discussions.filter(d => d.courseId === courseId && (!lessonId || d.lessonId === lessonId));
  }
  addDiscussion(discussion) {
    this.data.discussions.push(discussion);
    this.save();
    return discussion;
  }
  addDiscussionReply(discussionId, reply) {
    const disc = this.data.discussions.find(d => d.id === discussionId);
    if (disc) {
      if (!disc.replies) disc.replies = [];
      disc.replies.push(reply);
      this.save();
      return disc;
    }
    return null;
  }

  // --- Assignments ---
  getAssignmentsByCourseId(courseId) {
    return this.data.assignments.filter(a => a.courseId === courseId);
  }
  getAssignments() { return this.data.assignments; }
  addAssignment(assignment) {
    this.data.assignments.push(assignment);
    this.save();
    return assignment;
  }
  submitAssignment(assignmentId, submission) {
    const assign = this.data.assignments.find(a => a.id === assignmentId);
    if (assign) {
      if (!assign.submissions) assign.submissions = [];
      assign.submissions.push(submission);
      assign.submissionsCount = assign.submissions.length;
      this.save();
      return assign;
    }
    return null;
  }
  gradeAssignment(assignmentId, submissionId, grade, feedback) {
    const assign = this.data.assignments.find(a => a.id === assignmentId);
    if (assign && assign.submissions) {
      const sub = assign.submissions.find(s => s.id === submissionId);
      if (sub) {
        sub.grade = grade;
        sub.feedback = feedback;
        sub.status = 'graded';
        this.save();
        return sub;
      }
    }
    return null;
  }
}

export const store = new Store();
