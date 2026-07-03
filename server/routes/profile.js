const router = require('express').Router();
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware');
const { getProfile, updateProfile, uploadAvatar, updateResume } = require('../controllers/profileController');

// Multer middleware for avatar (images) — default temp file handling
const avatarUploadMiddleware = multer({ dest: '/tmp/' });

router.get('/', getProfile);
router.put('/', verifyToken, updateProfile);
router.post('/avatar', verifyToken, avatarUploadMiddleware.single('avatar'), uploadAvatar);
router.put('/resume', verifyToken, updateResume);

module.exports = router;
