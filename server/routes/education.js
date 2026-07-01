const router = require('express').Router();
const verifyToken = require('../middleware/authMiddleware');
const { getEducation, createEducation, updateEducation, deleteEducation } = require('../controllers/educationController');

router.get('/', getEducation);

router.post('/', verifyToken, createEducation);
router.put('/:id', verifyToken, updateEducation);
router.delete('/:id', verifyToken, deleteEducation);

module.exports = router;
