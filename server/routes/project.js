const router = require('express').Router();
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware');
const { getProjects, getProjectBySlug, createProject, updateProject, deleteProject, updateOrder } = require('../controllers/projectController');

const upload = multer({ dest: '/tmp/' });
const projectUpload = upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'images', maxCount: 10 }]);

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

router.post('/', verifyToken, projectUpload, createProject);
router.put('/:id', verifyToken, projectUpload, updateProject);
router.delete('/:id', verifyToken, deleteProject);
router.patch('/:id/order', verifyToken, updateOrder);

module.exports = router;
