const Certification = require('../models/Certification');
const cloudinary = require('../config/cloudinary');

// GET /api/certifications — public
exports.getCertifications = async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = {};
    if (featured === 'true') filter.featured = true;

    const certifications = await Certification.find(filter).sort({ order: 1 });
    res.json({ success: true, data: certifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /api/certifications — protected
exports.createCertification = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'portfolio/certifications' });
      data.image = result.secure_url;
    }
    const certification = await Certification.create(data);
    res.status(201).json({ success: true, data: certification });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Create failed', error: err.message });
  }
};

// PUT /api/certifications/:id — protected
exports.updateCertification = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'portfolio/certifications' });
      data.image = result.secure_url;
    }
    const certification = await Certification.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!certification) return res.status(404).json({ success: false, message: 'Not found', error: 'Certification not found' });
    res.json({ success: true, data: certification });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};

// DELETE /api/certifications/:id — protected
exports.deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) return res.status(404).json({ success: false, message: 'Not found', error: 'Certification not found' });
    res.json({ success: true, message: 'Certification deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
  }
};

// PATCH /api/certifications/:id/order — protected
exports.updateOrder = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndUpdate(req.params.id, { order: req.body.order }, { new: true });
    if (!certification) return res.status(404).json({ success: false, message: 'Not found', error: 'Certification not found' });
    res.json({ success: true, data: certification });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};
