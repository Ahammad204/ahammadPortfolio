const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String },
  bio: { type: String }, // long text
  avatar: { type: String }, // Cloudinary URL
  resume: { type: String }, // Cloudinary URL
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    youtube: String,
    website: String,
  },
  email: { type: String },
  location: { type: String },
  availability: { type: Boolean, default: true },
  openToWork: { type: Boolean, default: false },
  seoTitle: { type: String },
  seoDescription: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
