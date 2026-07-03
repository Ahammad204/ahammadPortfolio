import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  MapPin,
  Calendar,
  Download,
  GraduationCap,
  Award,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageCircle,
  Code2,
  Briefcase,
  Heart,
  Server,
  Wrench,
  Layers,
  Database,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useProfile,
  useSkills,
  useProjects,
  useExperience,
  useEducation,
  useCertifications,
} from "../hooks/usePortfolio";
import { submitContact } from "../api/contact";
import SectionHeading from "../components/SectionHeading";
import Badge from "../components/Badge";
import SkillIcon from "../components/SkillIcon";
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
      <AboutSection />
      <SkillsSection />
      <EducationSection />
      <FeaturedProjects />
      <ExperienceSection />
      <CertificationsSection />
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
              {profile?.socialLinks && (
                <div className="mt-6 flex gap-4">
                  {profile.socialLinks.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {profile.socialLinks.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  {profile.socialLinks.twitter && (
                    <a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                  {profile.socialLinks.youtube && (
                    <a
                      href={profile.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Youtube size={20} />
                    </a>
                  )}
                  {profile.socialLinks.website && (
                    <a
                      href={profile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Globe size={20} />
                    </a>
                  )}
                </div>
              )}
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

function AnimatedStat({ value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || isNaN(value)) return;
    const duration = 1500;
    const startTime = Date.now();
    let frame;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <p ref={ref} className="text-2xl md:text-3xl font-bold text-primary">
      {count}{suffix}
    </p>
  );
}

function AboutSection() {
  const { data, isLoading } = useProfile();
  const profile = data?.data;
  const [activeTab, setActiveTab] = useState(0);

  if (isLoading) return null;

  const title = profile?.aboutTitle || "About Me";
  const description = profile?.aboutDescription || profile?.bio || "";
  const highlights = profile?.aboutHighlights || [];
  const programmingJourney = profile?.programmingJourney || "";
  const workEnjoy = profile?.workEnjoy || "";
  const hobbiesInterests = profile?.hobbiesInterests || "";

  if (
    !description &&
    highlights.length === 0 &&
    !programmingJourney &&
    !workEnjoy &&
    !hobbiesInterests
  )
    return null;

  const tabs = [
    { icon: Code2, label: "Programming Journey", text: programmingJourney },
    { icon: Briefcase, label: "Work I Enjoy", text: workEnjoy },
    { icon: Heart, label: "Hobbies & Interests", text: hobbiesInterests },
  ].filter((t) => t.text);

  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <SectionHeading title={title} subtitle="A little bit about myself" />
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Row: Bio + Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bio Card */}
            {description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2 relative rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-8 group overflow-hidden"
              >
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent" />
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs font-mono text-primary tracking-wider uppercase">
                    who i am
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-primary/20 to-transparent" />
                </div>
                <div className="space-y-4">
                  {description.split("\n").filter(Boolean).map((para, i) => (
                    <p key={i} className="text-gray-300 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Highlights Card */}
            {highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col justify-center"
              >
                <span className="text-xs font-mono text-primary tracking-wider uppercase mb-5 text-center">
                  quick facts
                </span>
                <div className="grid grid-cols-2 gap-4">
                  {highlights.map((h, i) => {
                    const numeric = parseInt(h.value);
                    const suffix = isNaN(numeric) ? "" : h.value.slice(String(numeric).length);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                        className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/5"
                      >
                        {isNaN(numeric) ? (
                          <p className="text-2xl md:text-3xl font-bold text-primary">{h.value}</p>
                        ) : (
                          <AnimatedStat value={numeric} suffix={suffix} />
                        )}
                        <p className="text-xs text-gray-500 mt-1 leading-tight uppercase tracking-wide">
                          {h.label}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Tabs Section */}
          {tabs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl overflow-hidden"
            >
              {/* Tab Buttons */}
              <div className="flex border-b border-white/5">
                {tabs.map((tab, i) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(i)}
                      className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all duration-300 relative ${
                        activeTab === i
                          ? "text-primary"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="hidden sm:inline">{tab.label}</span>
                      {activeTab === i && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {tabs.map(
                    (tab, i) =>
                      activeTab === i && (
                        <motion.div
                          key={tab.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-300 leading-relaxed">
                            {tab.text}
                          </p>
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const { data, isLoading, isError } = useSkills();
  const grouped = data?.data;
  const [activeTab, setActiveTab] = useState(0);

  const categories = grouped ? Object.keys(grouped) : [];
  const categoryMeta = {
    frontend: { icon: Code2, label: "Frontend" },
    backend: { icon: Server, label: "Backend" },
    database: { icon: Database, label: "Database & ORM" },
    languages: { icon: Code2, label: "Programming Languages" },
    tools: { icon: Wrench, label: "Tools" },
    learning: { icon: BookOpen, label: "Currently Learning" },
    other: { icon: Layers, label: "Other" },
  };

  const tabs = categories.map((cat) => ({
    key: cat,
    label: categoryMeta[cat]?.label || cat,
    icon: categoryMeta[cat]?.icon || Layers,
    skills: grouped[cat] || [],
  }));

  const activeSkills = tabs[activeTab]?.skills || [];

  return (
    <section id="skills" className="section-padding">
      <div className="container-custom">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="Tools and technologies I work with daily"
        />
        {isError && <ErrorState message="Failed to load skills" />}
        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 mb-8 justify-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton className="w-28 h-28 rounded-xl" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : tabs.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            {/* Tab Buttons */}
            <div className="flex justify-center gap-2 mb-10">
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === i
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {tabs.map(
                (tab, i) =>
                  activeTab === i && (
                    <motion.div
                      key={tab.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                    >
                      {tab.skills.map((skill, j) => (
                        <motion.div
                          key={skill._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: j * 0.04 }}
                          className="flex flex-col items-center group"
                        >
                          <div className="w-28 h-28 rounded-xl bg-dark-100/80 border border-dark-300/50 flex items-center justify-center group-hover:border-primary/40 group-hover:shadow-[0_0_20px_-5px] group-hover:shadow-primary/30 transition-all duration-300">
                            <SkillIcon name={skill.icon} size={48} className="text-primary" />
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-3 text-center group-hover:text-white transition-colors duration-300">
                            {skill.name}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EducationSection() {
  const { data, isLoading, isError } = useEducation();
  const educations = data?.data;

  return (
    <section id="education" className="section-padding bg-dark-100/50">
      <div className="container-custom">
        <SectionHeading title="Education" subtitle="My academic background" />
        {isError && <ErrorState message="Failed to load education" />}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-dark-300" />
            {educations?.map((edu, i) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-4 mb-10 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 mt-1.5 ring-4 ring-dark" />
                <div
                  className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pl-8" : "md:pr-8 md:text-right"}`}
                >
                  <div className="p-5 rounded-lg bg-dark-100 border border-dark-300/50">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Calendar size={12} />
                      <span>
                        {formatDate(edu.startDate)} —{" "}
                        {edu.current
                          ? "Present"
                          : edu.endDate
                            ? formatDate(edu.endDate)
                            : "Present"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-primary" />
                      <h3 className="text-white font-semibold">
                        {edu.degree}
                        {edu.field ? ` in ${edu.field}` : ""}
                      </h3>
                    </div>
                    <p className="text-primary text-sm">{edu.institution}</p>
                    {edu.cgpa && (
                      <p className="text-xs text-gray-400 mt-1">
                        CGPA: {edu.cgpa}
                      </p>
                    )}
                    {edu.description && (
                      <p className="mt-2 text-sm text-gray-400">
                        {edu.description}
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

function CertificationsSection() {
  const { data, isLoading, isError } = useCertifications({});
  const allCertifications = data?.data || [];
  const [showAll, setShowAll] = useState(false);
  const visibleCount = 3;
  const hasMore = allCertifications.length > visibleCount;
  const visibleCerts = showAll ? allCertifications : allCertifications.slice(0, visibleCount);

  return (
    <section id="certifications" className="section-padding bg-dark-100/50">
      <div className="container-custom">
        <SectionHeading
          title="Certifications"
          subtitle="Credentials and achievements I've earned"
        />
        {isError && <ErrorState message="Failed to load certifications" />}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCerts.map((cert, i) => (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group rounded-2xl border border-dark-300/50 bg-dark-100/80 backdrop-blur p-6 flex flex-col hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    {cert.image ? (
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Award size={24} className="text-primary" />
                      </div>
                    )}
                    {cert.featured && (
                      <span className="text-[10px] font-medium text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm leading-snug mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-primary text-sm mb-2">{cert.issuer}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    {formatDate(cert.issueDate)}
                  </p>
                  <div className="mt-auto">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                      >
                        View Credential <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  {showAll ? (
                    <>Show Less <ChevronUp size={16} /></>
                  ) : (
                    <>Show More ({allCertifications.length - visibleCount}) <ChevronDown size={16} /></>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ContactSection() {
  const { data } = useProfile();
  const profile = data?.data;
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

  const inputCls =
    "w-full px-4 py-3 bg-dark-100 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors";

  return (
    <section id="contact" className="section-padding bg-dark-100/50">
      <div className="container-custom">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a project in mind? Let's talk."
        />
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Contact Information
              </h3>
              <p className="text-gray-400">
                Feel free to reach out through any of the following channels.
              </p>
            </div>
            <div className="space-y-5">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-dark-100 border border-dark-300/50 hover:border-primary/50 transition-colors group"
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-white group-hover:text-primary transition-colors">
                      {profile.email}
                    </p>
                  </div>
                </a>
              )}
              {profile?.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-dark-100 border border-dark-300/50 hover:border-primary/50 transition-colors group"
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                    <p className="text-white group-hover:text-primary transition-colors">
                      {profile.phone}
                    </p>
                  </div>
                </a>
              )}
              {profile?.whatsapp && (
                <a
                  href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-dark-100 border border-dark-300/50 hover:border-primary/50 transition-colors group"
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">WhatsApp</p>
                    <p className="text-white group-hover:text-primary transition-colors">
                      {profile.whatsapp}
                    </p>
                  </div>
                </a>
              )}
              {!profile?.email && !profile?.phone && !profile?.whatsapp && (
                <p className="text-gray-500 text-sm">
                  Contact information not configured yet.
                </p>
              )}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <input
                  {...register("name")}
                  placeholder="Your Name"
                  className={inputCls}
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
                  className={inputCls}
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
                className={inputCls}
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
                className={`${inputCls} resize-none`}
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
      </div>
    </section>
  );
}
