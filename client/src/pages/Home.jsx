import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  ExternalLink,
  Github,
  MapPin,
  Calendar,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useProfile,
  useSkills,
  useProjects,
  useExperience,
} from "../hooks/usePortfolio";
import { submitContact } from "../api/contact";
import SectionHeading from "../components/SectionHeading";
import Badge from "../components/Badge";
import Skeleton from "../components/Skeleton";
import ErrorState from "../components/ErrorState";
import { formatDate } from "../lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Home() {
  useEffect(() => {
    document.title = "Portfolio | Full Stack Developer";
  }, []);

  return (
    <div>
      <HeroSection />
      <SkillsSection />
      <FeaturedProjects />
      <ExperienceSection />
      <ContactSection />
    </div>
  );
}

// function HeroSection() {
//   const { data, isLoading } = useProfile();
//   const profile = data?.data;

//   return (
//     <section className="section-padding pt-32 md:pt-40">
//       <div className="container-custom">
//         {isLoading ? (
//           <div className="space-y-4">
//             <Skeleton className="h-12 w-72" />
//             <Skeleton className="h-6 w-96" />
//             <Skeleton className="h-4 w-full max-w-xl" />
//           </div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="grid md:grid-cols-2 gap-96 items-center"
//           >
//             {/* Avatar */}
//             {profile?.avatar && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="order-1 md:order-2"
//               >
//                 <img
//                   src={profile.avatar}
//                   alt={profile.name}
//                   className="w-full max-w-md rounded-lg object-cover shadow-lg"
//                 />
//               </motion.div>
//             )}

//             {/* Hero Text */}
//             <div className="order-1 md:order-1 w-full">
//               {profile?.availability && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.3 }}
//                   className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-green-500/30 bg-green-500/10"
//                 >
//                   <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
//                   <span className="text-sm text-green-400">
//                     Available for work
//                   </span>
//                 </motion.div>
//               )}
//               <h1 className="text-2xl sm:text-xl md:text-4xl lg:text-6xl font-bold text-white leading-tight ">
//                 Hi, I'm{" "}
//                 <span className="text-primary whitespace-nowrap mt-10">
//                   {profile?.name || "Developer"}
//                 </span>
//               </h1>
//               <p className="mt-4 text-xl md:text-2xl text-gray-400 ">
//                 {profile?.tagline ||
//                   "Full Stack Developer crafting modern web experiences"}
//               </p>
//               <p className="mt-4 text-gray-500 max-w-xl leading-relaxed">
//                 {profile?.bio ||
//                   "Passionate about building scalable applications with clean code and great user experiences."}
//               </p>
//               <div className="mt-8 flex flex-wrap gap-4">
//                 <a
//                   href="#projects"
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
//                 >
//                   View Work <ArrowRight size={18} />
//                 </a>
//                 <a
//                   href="#contact"
//                   className="inline-flex items-center gap-2 px-6 py-3 border border-dark-300 text-gray-300 font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
//                 >
//                   Contact Me
//                 </a>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// }

function HeroSection() {
  const { data, isLoading } = useProfile();
  const profile = data?.data;

  return (
    <section className="section-padding pt-32 md:pt-40">
      <div className="container-custom">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-72" />
            <Skeleton className="h-6 w-96" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-12"
          >
            {/* Hero Text */}
            <div className="flex-1 max-w-xl">
              {profile?.availability && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-green-500/30 bg-green-500/10"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400">
                    Available for work
                  </span>
                </motion.div>
              )}

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Hi, I'm <br />
                <span className="text-primary">
                  {profile?.name || "Developer"}
                </span>
              </h1>

              <p className="mt-4 text-lg md:text-xl text-gray-400">
                {profile?.tagline ||
                  "Full Stack Developer crafting modern web experiences"}
              </p>
              <p className="mt-4 text-gray-500 max-w-xl leading-relaxed">
                {profile?.bio ||
                  "Passionate about building scalable applications with clean code and great user experiences."}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View Work <ArrowRight size={18} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-dark-300 text-gray-300 font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
                >
                  Contact Me
                </a>
                {profile?.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200"
                  >
                    <Download size={16} />
                    Download CV
                  </a>
                )}
              </div>
            </div>

            {/* Avatar */}
            {profile?.avatar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-shrink-0"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-72 h-72 md:w-80 md:h-80 rounded-full object-cover shadow-lg"
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function SkillsSection() {
  const { data, isLoading, isError } = useSkills();
  const grouped = data?.data;

  return (
    <section id="skills" className="section-padding">
      <div className="container-custom">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="Tools and technologies I work with daily"
        />
        {isError && <ErrorState message="Failed to load skills" />}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {grouped &&
              Object.entries(grouped).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4 capitalize">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skills.map((skill, i) => (
                      <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-dark-100 border border-dark-300/50"
                      >
                        <span className="text-lg font-mono text-primary">
                          {skill.icon || "⚡"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {skill.name}
                          </p>
                          <div className="mt-1 h-1.5 bg-dark-300 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: i * 0.05 }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {skill.proficiency}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedProjects() {
  const { data, isLoading, isError } = useProjects({
    featured: true,
    limit: 3,
  });
  const projects = data?.data;

  return (
    <section id="projects" className="section-padding bg-dark-100/50">
      <div className="container-custom">
        <SectionHeading
          title="Featured Projects"
          subtitle="Selected work I'm proud of"
        />
        {isError && <ErrorState message="Failed to load projects" />}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects?.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-xl overflow-hidden bg-dark-100 border border-dark-300/50 hover:border-primary/50 transition-all"
                >
                  <div className="aspect-video overflow-hidden bg-dark-200">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl font-bold">
                        {project.title[0]}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.techStack?.slice(0, 4).map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Details →
                      </Link>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-white"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {project.githubClient && (
                        <a
                          href={project.githubClient}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-white"
                        >
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                View All Projects <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ExperienceSection() {
  const { data, isLoading, isError } = useExperience();
  const experiences = data?.data;

  return (
    <section id="experience" className="section-padding">
      <div className="container-custom">
        <SectionHeading title="Experience" subtitle="My professional journey" />
        {isError && <ErrorState message="Failed to load experience" />}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-dark-300" />
            {experiences?.map((exp, i) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-4 mb-10 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 mt-1.5 ring-4 ring-dark" />
                {/* Content */}
                <div
                  className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pl-8" : "md:pr-8 md:text-right"}`}
                >
                  <div className="p-5 rounded-lg bg-dark-100 border border-dark-300/50">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Calendar size={12} />
                      <span>
                        {formatDate(exp.startDate)} —{" "}
                        {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold">{exp.role}</h3>
                    <p className="text-primary text-sm">{exp.company}</p>
                    {exp.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={10} />
                        {exp.location}
                      </p>
                    )}
                    {exp.description && (
                      <p className="mt-2 text-sm text-gray-400">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values) => {
    try {
      await submitContact(values);
      toast.success("Message sent! I'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section id="contact" className="section-padding bg-dark-100/50">
      <div className="container-custom">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a project in mind? Let's talk."
        />
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto space-y-5"
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
                placeholder="Email Address"
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
              rows={5}
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
            className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
