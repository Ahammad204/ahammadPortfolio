const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String }, // e.g. "SiReact"
  category: { type: String, enum: ['frontend', 'backend', 'database', 'languages', 'tools', 'learning', 'other'], default: 'other' },
  proficiency: { type: Number, min: 1, max: 100, default: 50 },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
