import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Upload, Plus, Trash2 } from "lucide-react";
import { useProfile } from "../../hooks/usePortfolio";
import { updateProfile, uploadAvatar, updateResume } from "../../api/profile";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name: z.string().min(1, "Required"),
  tagline: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  location: z.string().optional(),
  availability: z.boolean().optional(),
  openToWork: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  "socialLinks.github": z.string().optional(),
  "socialLinks.linkedin": z.string().optional(),
  "socialLinks.twitter": z.string().optional(),
  "socialLinks.youtube": z.string().optional(),
  "socialLinks.website": z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutDescription: z.string().optional(),
});

export default function AdminProfile() {
  const { data, isLoading } = useProfile();
  const profile = data?.data;
  const qc = useQueryClient();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [savingResume, setSavingResume] = useState(false);
  const [aboutImagePreview, setAboutImagePreview] = useState(null);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [highlights, setHighlights] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        tagline: profile.tagline || "",
        bio: profile.bio || "",
        email: profile.email || "",
        phone: profile.phone || "",
        whatsapp: profile.whatsapp || "",
        location: profile.location || "",
        availability: profile.availability ?? true,
        openToWork: profile.openToWork ?? false,
        seoTitle: profile.seoTitle || "",
        seoDescription: profile.seoDescription || "",
        "socialLinks.github": profile.socialLinks?.github || "",
        "socialLinks.linkedin": profile.socialLinks?.linkedin || "",
        "socialLinks.twitter": profile.socialLinks?.twitter || "",
        "socialLinks.youtube": profile.socialLinks?.youtube || "",
        "socialLinks.website": profile.socialLinks?.website || "",
        aboutTitle: profile.aboutTitle || "",
        aboutDescription: profile.aboutDescription || "",
      });
      setAvatarPreview(profile.avatar);
      setResumeUrl(profile.resume || "");
      setAboutImagePreview(profile.aboutImage || null);
      setHighlights(
        profile.aboutHighlights?.length
          ? profile.aboutHighlights
          : [{ value: "", label: "" }]
      );
    }
  }, [profile, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        socialLinks: {
          github: values["socialLinks.github"],
          linkedin: values["socialLinks.linkedin"],
          twitter: values["socialLinks.twitter"],
          youtube: values["socialLinks.youtube"],
          website: values["socialLinks.website"],
        },
        aboutHighlights: highlights.filter((h) => h.value.trim() || h.label.trim()),
      };
      Object.keys(payload)
        .filter((k) => k.startsWith("socialLinks."))
        .forEach((k) => delete payload[k]);
      await updateProfile(payload);
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadAvatar(file);
      setAvatarPreview(data.data.avatar);
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Avatar updated");
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const handleResumeSave = async () => {
    if (!resumeUrl.trim()) {
      toast.error("Please enter a Google Drive link");
      return;
    }
    setSavingResume(true);
    try {
      await updateResume(resumeUrl.trim());
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Resume link updated");
    } catch {
      toast.error("Failed to save resume link");
    }
    setSavingResume(false);
  };

  const handleAboutImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAbout(true);
    try {
      const { data } = await uploadAvatar(file);
      const aboutImageUrl = data.data.avatar;
      await updateProfile({ aboutImage: aboutImageUrl });
      setAboutImagePreview(aboutImageUrl);
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("About image updated");
    } catch {
      toast.error("Upload failed");
    }
    setUploadingAbout(false);
  };

  const addHighlight = () => {
    setHighlights([...highlights, { value: "", label: "" }]);
  };

  const removeHighlight = (index) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const updateHighlight = (index, field, val) => {
    const updated = [...highlights];
    updated[index] = { ...updated[index], [field]: val };
    setHighlights(updated);
  };

  if (isLoading) return <div className="text-gray-500">Loading...</div>;

  const inputCls =
    "w-full px-3 py-2 bg-[#1a1e2a] border border-[#2a2f3d] rounded-lg text-white text-sm focus:outline-none focus:border-primary";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1";

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar & Resume */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#1a1e2a] border border-[#2a2f3d]">
            <p className={labelCls}>Avatar</p>
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
            )}
            <label className="inline-flex items-center gap-2 px-3 py-2 text-xs bg-[#2a2f3d] rounded-lg cursor-pointer hover:bg-[#333a4a] transition-colors">
              <Upload size={14} /> Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <div className="p-4 rounded-xl bg-[#1a1e2a] border border-[#2a2f3d]">
            <p className={labelCls}>Resume (Google Drive Link)</p>
            {profile?.resume && (
              <div className="mb-2">
                <span className="text-xs text-green-400 mr-3">
                  ✅ Resume linked
                </span>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View / Download CV
                </a>
              </div>
            )}
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              className={`${inputCls} mb-2`}
            />
            <button
              onClick={handleResumeSave}
              disabled={savingResume}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-white"
            >
              {savingResume ? "Saving..." : "Save Link"}
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name</label>
              <input {...register("name")} className={inputCls} />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Tagline</label>
              <input {...register("tagline")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input {...register("email")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input {...register("phone")} placeholder="+880..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp</label>
              <input {...register("whatsapp")} placeholder="+880..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input {...register("location")} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Bio</label>
            <textarea
              {...register("bio")}
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="border-t border-[#2a2f3d] pt-4">
            <p className="text-sm font-medium text-gray-300 mb-3">
              About Section
            </p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>About Title</label>
                <input
                  {...register("aboutTitle")}
                  placeholder="About Me"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>About Image</label>
                {aboutImagePreview && (
                  <img
                    src={aboutImagePreview}
                    alt="About"
                    className="w-20 h-20 rounded-lg object-cover mb-2"
                  />
                )}
                <label className="inline-flex items-center gap-2 px-3 py-2 text-xs bg-[#2a2f3d] rounded-lg cursor-pointer hover:bg-[#333a4a] transition-colors">
                  <Upload size={14} /> {aboutImagePreview ? "Change Image" : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAboutImageUpload}
                    disabled={uploadingAbout}
                  />
                </label>
              </div>
              <div>
                <label className={labelCls}>About Description</label>
                <textarea
                  {...register("aboutDescription")}
                  rows={5}
                  placeholder="Write about yourself, your programming journey, interests, hobbies..."
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className={labelCls}>Highlight Stats</label>
                <div className="space-y-2">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={h.value}
                        onChange={(e) => updateHighlight(i, "value", e.target.value)}
                        placeholder="e.g. 5+"
                        className={`${inputCls} flex-1`}
                      />
                      <input
                        value={h.label}
                        onChange={(e) => updateHighlight(i, "label", e.target.value)}
                        placeholder="e.g. Years Experience"
                        className={`${inputCls} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlight(i)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-primary hover:bg-[#2a2f3d] rounded-lg transition-colors"
                  >
                    <Plus size={14} /> Add Highlight
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>SEO Title</label>
              <input {...register("seoTitle")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>SEO Description</label>
              <input {...register("seoDescription")} className={inputCls} />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                {...register("availability")}
                className="accent-primary"
              />{" "}
              Available
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                {...register("openToWork")}
                className="accent-primary"
              />{" "}
              Open to Work
            </label>
          </div>
          <div className="border-t border-[#2a2f3d] pt-4">
            <p className="text-sm font-medium text-gray-300 mb-3">
              Social Links
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>GitHub</label>
                <input
                  {...register("socialLinks.github")}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>LinkedIn</label>
                <input
                  {...register("socialLinks.linkedin")}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Twitter</label>
                <input
                  {...register("socialLinks.twitter")}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>YouTube</label>
                <input
                  {...register("socialLinks.youtube")}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <input
                  {...register("socialLinks.website")}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
