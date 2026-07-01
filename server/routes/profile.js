const router = require('express').Router();
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware');
const { getProfile, updateProfile, uploadAvatar, uploadResume } = require('../controllers/profileController');

// Multer middleware for avatar (images) — default temp file handling
const avatarUploadMiddleware = multer({ dest: '/tmp/' });

// Multer middleware for resume uploads — ensure temp file keeps .pdf extension
// and validate file type
const resumeStorage = multer.diskStorage({
	destination: '/tmp/',
	filename: (req, file, cb) => {
		// Force a .pdf extension on the temp file to ensure Cloudinary detects format
		cb(null, `resume_${Date.now()}.pdf`);
	},
});

// File filter to accept only PDFs
const resumeFileFilter = (req, file, cb) => {
	const mime = file.mimetype;
	const ext = file.originalname.toLowerCase().endsWith('.pdf');
	if ((mime === 'application/pdf' || mime === 'application/octet-stream') && ext) {
		cb(null, true);
	} else {
		cb(new Error('Only PDF files are allowed'), false);
	}
};

const resumeUploadMiddleware = multer({
	storage: resumeStorage,
	fileFilter: resumeFileFilter,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

router.get('/', getProfile);
router.put('/', verifyToken, updateProfile);
router.post('/avatar', verifyToken, avatarUploadMiddleware.single('avatar'), uploadAvatar);
router.post('/resume', verifyToken, resumeUploadMiddleware.single('resume'), uploadResume);

module.exports = router;
