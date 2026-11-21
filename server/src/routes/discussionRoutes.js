import express from 'express';
import { store } from '../db/store.js';
import { authenticateToken } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Get discussions for course/lesson
router.get('/:courseId', (req, res) => {
  const { lessonId } = req.query;
  const discussions = store.getDiscussions(req.params.courseId, lessonId);
  return res.json({ success: true, discussions });
});

// Create new discussion question
router.post('/:courseId', authenticateToken, (req, res) => {
  const { title, message, lessonId } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required.' });
  }

  const newDiscussion = {
    id: `disc-${crypto.randomUUID().slice(0, 8)}`,
    courseId: req.params.courseId,
    lessonId: lessonId || null,
    userId: req.user.id,
    userName: req.user.name,
    userAvatar: req.user.avatar,
    title,
    message,
    createdAt: new Date().toISOString(),
    replies: []
  };

  store.addDiscussion(newDiscussion);
  return res.status(201).json({ success: true, discussion: newDiscussion });
});

// Reply to a discussion
router.post('/:courseId/:discussionId/reply', authenticateToken, (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: 'Reply message cannot be empty.' });
  }

  const reply = {
    id: `rep-${crypto.randomUUID().slice(0, 8)}`,
    userId: req.user.id,
    userName: req.user.name,
    userAvatar: req.user.avatar,
    isInstructor: req.user.role === 'instructor' || req.user.role === 'admin',
    message,
    createdAt: new Date().toISOString()
  };

  const updatedDiscussion = store.addDiscussionReply(req.params.discussionId, reply);
  if (!updatedDiscussion) {
    return res.status(404).json({ success: false, message: 'Discussion thread not found.' });
  }

  return res.status(201).json({ success: true, reply, discussion: updatedDiscussion });
});

export default router;
