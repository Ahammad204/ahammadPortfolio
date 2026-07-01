const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  cgpa: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
