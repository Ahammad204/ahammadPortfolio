const Profile = require("../models/Profile");
const cloudinary = require("../config/cloudinary");

// GET /api/profile — public
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile)
      return res
        .status(404)
        .json({
          success: false,
          message: "Profile not found",
          error: "No profile exists",
        });
    const out = profile.toObject ? profile.toObject() : { ...profile };
    res.json({ success: true, data: out });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// PUT /api/profile — protected
exports.updateProfile = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.socialLinks === "string") {
      try {
        data.socialLinks = JSON.parse(data.socialLinks);
      } catch (e) {
        console.error("Failed to parse socialLinks:", e);
      }
    }
    const profile = await Profile.findOneAndUpdate({}, { $set: data }, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json({ success: true, data: profile });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Update failed", error: err.message });
  }
};

// POST /api/profile/avatar — protected
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({
          success: false,
          message: "No file",
          error: "Avatar file required",
        });
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio/profile",
    });
    const profile = await Profile.findOneAndUpdate(
      {},
      { avatar: result.secure_url },
      { new: true, upsert: true },
    );
    res.json({ success: true, data: { avatar: profile.avatar } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Upload failed", error: err.message });
  }
};

// PUT /api/profile/resume — protected
exports.updateResume = async (req, res) => {
  try {
    const { resumeUrl } = req.body;
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "No URL",
        error: "Resume URL required",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      {},
      { resume: resumeUrl },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: { resume: profile.resume },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
};
