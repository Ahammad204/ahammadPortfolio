const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  type: { type: String, enum: ['fulltime', 'internship', 'freelance', 'contract'], default: 'fulltime' },
  location: { type: String },
  description: { type: String },
  responsibilities: [String],
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null }, // null = present
  current: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
