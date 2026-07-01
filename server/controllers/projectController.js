const Project = require('../models/Project');
const cloudinary = require('../config/cloudinary');

// GET /api/projects — public, paginated, filterable
exports.getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, featured, category, status } = req.query;
    const filter = {};
    if (featured === 'true') filter.featured = true;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Project.find(filter).sort({ order: 1 }).skip(skip).limit(Number(limit)),
      Project.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/projects/:slug — public
exports.getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ success: false, message: 'Not found', error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /api/projects — protected
exports.createProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.coverImage) {
      const result = await cloudinary.uploader.upload(req.files.coverImage[0].path, { folder: 'portfolio/projects' });
      data.coverImage = result.secure_url;
    }
    if (req.files?.images) {
      const uploads = await Promise.all(req.files.images.map(f => cloudinary.uploader.upload(f.path, { folder: 'portfolio/projects' })));
      data.images = uploads.map(u => u.secure_url);
    }
    if (typeof data.techStack === 'string') data.techStack = JSON.parse(data.techStack);
    const project = await Project.create(data);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Create failed', error: err.message });
  }
};

// PUT /api/projects/:id — protected
exports.updateProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.coverImage) {
      const result = await cloudinary.uploader.upload(req.files.coverImage[0].path, { folder: 'portfolio/projects' });
      data.coverImage = result.secure_url;
    }
    if (req.files?.images) {
      const uploads = await Promise.all(req.files.images.map(f => cloudinary.uploader.upload(f.path, { folder: 'portfolio/projects' })));
      data.images = uploads.map(u => u.secure_url);
    }
    if (typeof data.techStack === 'string') data.techStack = JSON.parse(data.techStack);

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Not found', error: 'Project not found' });
    Object.assign(project, data);
    await project.save(); // triggers slug pre-save hook
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};

// DELETE /api/projects/:id — protected
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Not found', error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
  }
};

// PATCH /api/projects/:id/order — protected
exports.updateOrder = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { order: req.body.order }, { new: true });
    if (!project) return res.status(404).json({ success: false, message: 'Not found', error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};
