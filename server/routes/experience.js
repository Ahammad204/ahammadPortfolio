const router = require('express').Router();
const verifyToken = require('../middleware/authMiddleware');
const { getExperiences, createExperience, updateExperience, deleteExperience, updateOrder } = require('../controllers/experienceController');

router.get('/', getExperiences);

router.post('/', verifyToken, createExperience);
router.put('/:id', verifyToken, updateExperience);
router.delete('/:id', verifyToken, deleteExperience);
router.patch('/:id/order', verifyToken, updateOrder);

module.exports = router;
