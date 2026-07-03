const router = require('express').Router();
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware');
const { getCertifications, createCertification, updateCertification, deleteCertification, updateOrder } = require('../controllers/certificationController');

const upload = multer({ dest: '/tmp/' });

router.get('/', getCertifications);

router.post('/', verifyToken, upload.single('image'), createCertification);
router.put('/:id', verifyToken, upload.single('image'), updateCertification);
router.delete('/:id', verifyToken, deleteCertification);
router.patch('/:id/order', verifyToken, updateOrder);

module.exports = router;
