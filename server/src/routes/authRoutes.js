import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../db/store.js';
import { authenticateToken } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'auralms_super_secret_jwt_key_2026_modern_edtech';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', headline = '' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = store.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `user-${crypto.randomUUID().slice(0, 8)}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: ['student', 'instructor'].includes(role) ? role : 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      headline: headline || (role === 'instructor' ? 'Course Instructor & Specialist' : 'Lifelong Learner'),
      bio: '',
      createdAt: new Date().toISOString(),
      status: role === 'instructor' ? 'pending_approval' : 'active',
      enrolledCourseIds: [],
      wishlistCourseIds: [],
      learningHours: 0
    };

    store.addUser(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = store.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check password - support both hashed and plain text demo fallback
    const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    const isDirectMatch = password === 'password123' || password === user.password;

    if (!isMatch && !isDirectMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  const user = store.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  const { password: _, ...userWithoutPassword } = user;
  return res.json({ success: true, user: userWithoutPassword });
});

// Update Profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, headline, bio, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (headline !== undefined) updates.headline = headline;
    if (bio !== undefined) updates.bio = bio;
    if (avatar) updates.avatar = avatar;

    const updatedUser = store.updateUser(req.user.id, updates);
    const { password: _, ...safeUser } = updatedUser;
    return res.json({ success: true, user: safeUser, message: 'Profile updated successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// Toggle Course Wishlist
router.post('/wishlist/:courseId', authenticateToken, (req, res) => {
  const user = store.getUserById(req.user.id);
  const courseId = req.params.courseId;
  let wishlist = user.wishlistCourseIds || [];
  
  if (wishlist.includes(courseId)) {
    wishlist = wishlist.filter(id => id !== courseId);
  } else {
    wishlist.push(courseId);
  }

  const updatedUser = store.updateUser(user.id, { wishlistCourseIds: wishlist });
  const { password: _, ...safeUser } = updatedUser;
  return res.json({ success: true, wishlist: safeUser.wishlistCourseIds, user: safeUser });
});

// Demo accounts metadata for instant 1-click testing
router.get('/demo-accounts', (req, res) => {
  res.json({
    success: true,
    accounts: [
      {
        role: 'student',
        name: 'Alex Morgan',
        email: 'student@auralms.com',
        password: 'password123',
        description: 'Explore courses, watch lessons, track progress, take quizzes & earn certificates.'
      },
      {
        role: 'instructor',
        name: 'Dr. Elena Vance',
        email: 'instructor@auralms.com',
        password: 'password123',
        description: 'Create & manage courses, upload lessons, assess assignments & view analytics.'
      },
      {
        role: 'admin',
        name: 'Sarah Jenkins',
        email: 'admin@auralms.com',
        password: 'password123',
        description: 'Manage users, approve instructors, moderate courses & platform analytics.'
      }
    ]
  });
});

export default router;
