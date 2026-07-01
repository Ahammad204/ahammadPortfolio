import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { submitContact } from "../api/contact";
import { useProfile } from "../hooks/usePortfolio";
import SectionHeading from "../components/SectionHeading";

/**
 * EmailJS Setup Instructions:
 * 1. Go to https://emailjs.com → create free account
 * 2. Email Services → Add Service → Gmail → connect your Gmail → copy Service ID
 * 3. Email Templates → Create Template → design your email
 *    Template variables to use: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
 *    Set "To Email" as your Gmail in the template settings
 * 4. Account → API Keys → copy Public Key
 * 5. Paste all three into .env as:
 *    VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *    VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *    VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
 */

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { data } = useProfile();
  const profile = data?.data;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  // Initialize EmailJS once on component mount
  useEffect(() => {
    document.title = "Contact | Portfolio";
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const onSubmit = async (values) => {
    try {
      // Step 1: Save to DB via API (this is the critical operation)
      await submitContact(values);

      // Step 2: Send email via EmailJS (fire and forget — non-blocking)
      // If EmailJS fails, it won't affect the user experience
      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            from_name: values.name,
            from_email: values.email,
            subject: values.subject,
            message: values.message,
          },
        )
        .catch((err) => console.error("EmailJS error:", err));

      // Step 3: Success feedback (only depends on DB save)
      toast.success("Message sent! I will get back to you soon.");
      reset();
    } catch (err) {
      // This catch is for DB save failure only
      toast.error("Failed to send. Please try again.");
      console.error("Contact submit error:", err);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <SectionHeading
          title="Contact Me"
          subtitle="Let's discuss your next project"
        />
        <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {profile?.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-white hover:text-primary"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            )}
            {profile?.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">{profile.location}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <input
                  {...register("name")}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-dark-100 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-dark-100 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <input
                {...register("subject")}
                placeholder="Subject"
                className="w-full px-4 py-3 bg-dark-100 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div>
              <textarea
                {...register("message")}
                rows={6}
                placeholder="Your Message"
                className="w-full px-4 py-3 bg-dark-100 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.message.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
