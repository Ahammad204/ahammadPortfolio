const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const verifyToken = require('../middleware/authMiddleware');
const { submitContact, getContacts, markRead, deleteContact } = require('../controllers/contactController');

// 3 submissions per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many messages', error: 'Rate limit exceeded. Try again later.' },
});

// Public
router.post('/', contactLimiter, submitContact);

// Protected
router.get('/', verifyToken, getContacts);
router.patch('/:id/read', verifyToken, markRead);
router.delete('/:id', verifyToken, deleteContact);

module.exports = router;
