const Profile = require("../models/Profile");
const cloudinary = require("../config/cloudinary");

// Helper: extract Cloudinary public_id from a raw or image upload URL
function extractPublicIdFromRawUrl(url) {
  try {
    if (!url) return null;
    const clean = url.split("?")[0];
    const match = clean.match(/\/(?:image|raw)\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return null;
    return match[1].replace(/\.[^/.]+$/, "");
  } catch (e) {
    return null;
  }
}

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
    // Return clean URLs stored in MongoDB
    const out = profile.toObject ? profile.toObject() : { ...profile };
    if (out.resume) {
      // Append fl_attachment to force browser download with the desired filename
      out.resume = out.resume.replace(
        "/upload/",
        "/upload/fl_attachment:Kazi_Ahammad_Resume/"
      );
    }
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
    if (typeof data.socialLinks === "string")
      data.socialLinks = JSON.parse(data.socialLinks);
    const profile = await Profile.findOneAndUpdate({}, data, {
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

// POST /api/profile/resume — protected
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file",
        error: "Resume file required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio/profile",
      resource_type: "image",
      format: "pdf",
      public_id: `resume_${Date.now()}`,
      pages: true,
    });

    const resumeUrl = result.secure_url;

    const profile = await Profile.findOneAndUpdate(
      {},
      { resume: resumeUrl },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: { resume: resumeUrl },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err.message,
    });
  }
};
