const router = require('express').Router();
const verifyToken = require('../middleware/authMiddleware');
const { getSkills, createSkill, updateSkill, deleteSkill, updateOrder } = require('../controllers/skillController');

router.get('/', getSkills);

router.post('/', verifyToken, createSkill);
router.put('/:id', verifyToken, updateSkill);
router.delete('/:id', verifyToken, deleteSkill);
router.patch('/:id/order', verifyToken, updateOrder);

module.exports = router;
