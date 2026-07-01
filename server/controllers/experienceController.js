const Experience = require('../models/Experience');

// GET /api/experience — public, sorted by order
exports.getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 });
    res.json({ success: true, data: experiences });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /api/experience — protected
exports.createExperience = async (req, res) => {
  try {
    if (typeof req.body.responsibilities === 'string') req.body.responsibilities = JSON.parse(req.body.responsibilities);
    const experience = await Experience.create(req.body);
    res.status(201).json({ success: true, data: experience });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Create failed', error: err.message });
  }
};

// PUT /api/experience/:id — protected
exports.updateExperience = async (req, res) => {
  try {
    if (typeof req.body.responsibilities === 'string') req.body.responsibilities = JSON.parse(req.body.responsibilities);
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!experience) return res.status(404).json({ success: false, message: 'Not found', error: 'Experience not found' });
    res.json({ success: true, data: experience });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};

// DELETE /api/experience/:id — protected
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) return res.status(404).json({ success: false, message: 'Not found', error: 'Experience not found' });
    res.json({ success: true, message: 'Experience deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
  }
};

// PATCH /api/experience/:id/order — protected
exports.updateOrder = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, { order: req.body.order }, { new: true });
    if (!experience) return res.status(404).json({ success: false, message: 'Not found', error: 'Experience not found' });
    res.json({ success: true, data: experience });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};
