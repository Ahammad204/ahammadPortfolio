import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useProjects } from '../hooks/usePortfolio';
import SectionHeading from '../components/SectionHeading';
import Badge from '../components/Badge';
import Skeleton from '../components/Skeleton';
import ErrorState from '../components/ErrorState';
import { PROJECT_CATEGORIES } from '../lib/constants';
import { cn } from '../lib/utils';

const tabs = ['all', ...PROJECT_CATEGORIES];

export default function Projects() {
  const [category, setCategory] = useState('all');
  const params = category === 'all' ? {} : { category };
  const { data, isLoading, isError } = useProjects(params);
  const projects = data?.data;

  useEffect(() => { document.title = 'Projects | Portfolio'; }, []);

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <SectionHeading title="All Projects" subtitle="A collection of things I've built" />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setCategory(tab)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-full transition-all capitalize',
                category === tab ? 'bg-primary text-white' : 'bg-dark-200 text-gray-400 hover:text-white'
              )}>
              {tab}
            </button>
          ))}
        </div>

        {isError && <ErrorState message="Failed to load projects" />}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
          </div>
        ) : projects?.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No projects found in this category.</p>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project, i) => (
              <motion.div key={project._id} layout initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl overflow-hidden bg-dark-100 border border-dark-300/50 hover:border-primary/50 transition-all">
                <div className="aspect-video overflow-hidden bg-dark-200">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-5xl font-bold">{project.title[0]}</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary">{project.category}</Badge>
                    {project.status === 'in-progress' && <Badge>In Progress</Badge>}
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack?.slice(0, 5).map((tech) => <Badge key={tech}>{tech}</Badge>)}
                  </div>
                  <div className="mt-4 flex items-center gap-3 pt-3 border-t border-dark-300/50">
                    <Link to={`/projects/${project.slug}`} className="text-sm text-primary hover:underline font-medium">View Details →</Link>
                    <div className="ml-auto flex gap-2">
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white"><ExternalLink size={16} /></a>}
                      {project.githubClient && <a href={project.githubClient} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white"><Github size={16} /></a>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
