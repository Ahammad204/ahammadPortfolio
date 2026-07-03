const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String },
  bio: { type: String },
  avatar: { type: String },
  resume: { type: String },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    youtube: String,
    website: String,
  },
  aboutTitle: { type: String },
  aboutImage: { type: String },
  aboutDescription: { type: String },
  aboutHighlights: [{
    value: String,
    label: String,
  }],
  email: { type: String },
  phone: { type: String },
  whatsapp: { type: String },
  location: { type: String },
  availability: { type: Boolean, default: true },
  openToWork: { type: Boolean, default: false },
  seoTitle: { type: String },
  seoDescription: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
