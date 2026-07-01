const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String }, // short description
  longDescription: { type: String },
  coverImage: { type: String }, // Cloudinary URL
  images: [String], // gallery
  techStack: [String],
  liveUrl: { type: String },
  githubClient: { type: String },
  githubServer: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  category: { type: String, enum: ['fullstack', 'frontend', 'backend', 'iot', 'other'], default: 'other' },
  status: { type: String, enum: ['completed', 'in-progress', 'archived'], default: 'completed' },
}, { timestamps: true });

// Auto-generate slug from title before saving
projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
