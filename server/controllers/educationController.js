const Education = require('../models/Education');

// GET /api/education — public
exports.getEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ startDate: -1 });
    res.json({ success: true, data: education });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /api/education — protected
exports.createEducation = async (req, res) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json({ success: true, data: education });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Create failed', error: err.message });
  }
};

// PUT /api/education/:id — protected
exports.updateEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!education) return res.status(404).json({ success: false, message: 'Not found', error: 'Education not found' });
    res.json({ success: true, data: education });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};

// DELETE /api/education/:id — protected
exports.deleteEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) return res.status(404).json({ success: false, message: 'Not found', error: 'Education not found' });
    res.json({ success: true, message: 'Education deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
  }
};
