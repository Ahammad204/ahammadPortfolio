import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProject } from '../hooks/usePortfolio';
import Badge from '../components/Badge';
import Skeleton from '../components/Skeleton';
import ErrorState from '../components/ErrorState';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useProject(slug);
  const project = data?.data;
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (project) document.title = `${project.title} | Portfolio`;
  }, [project]);

  if (isLoading) return (
    <div className="pt-24 pb-20 container-custom">
      <Skeleton className="h-8 w-48 mb-8" />
      <Skeleton className="h-96 w-full mb-6" />
      <Skeleton className="h-6 w-72 mb-4" />
      <Skeleton className="h-32 w-full" />
    </div>
  );

  if (isError || !project) return (
    <div className="pt-24 pb-20 container-custom">
      <ErrorState message="Project not found" />
      <div className="text-center mt-4">
        <Link to="/projects" className="text-primary hover:underline">← Back to projects</Link>
      </div>
    </div>
  );

  const allImages = [project.coverImage, ...(project.images || [])].filter(Boolean);

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        {/* Back link */}
        <Link to="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Projects
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h1>
            <Badge variant="primary">{project.category}</Badge>
            <Badge>{project.status}</Badge>
          </div>

          {/* Image gallery */}
          {allImages.length > 0 && (
            <div className="mb-8">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-dark-200">
                <img src={allImages[activeImg]} alt={project.title} className="w-full h-full object-cover" />
                {allImages.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg((p) => (p - 1 + allImages.length) % allImages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-dark/70 rounded-full text-white hover:bg-dark">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setActiveImg((p) => (p + 1) % allImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-dark/70 rounded-full text-white hover:bg-dark">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-primary' : 'border-dark-300'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="text-lg text-gray-300 mb-4">{project.description}</p>
              {project.longDescription && (
                <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed whitespace-pre-line">
                  {project.longDescription}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tech stack */}
              <div className="p-5 rounded-xl bg-dark-100 border border-dark-300/50">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((tech) => <Badge key={tech} variant="primary">{tech}</Badge>)}
                </div>
              </div>

              {/* Links */}
              <div className="p-5 rounded-xl bg-dark-100 border border-dark-300/50 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Links</h3>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors">
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
                {project.githubClient && (
                  <a href={project.githubClient} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors">
                    <Github size={16} /> Client Repository
                  </a>
                )}
                {project.githubServer && (
                  <a href={project.githubServer} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors">
                    <Github size={16} /> Server Repository
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
