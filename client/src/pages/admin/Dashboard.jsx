import { Link } from 'react-router-dom';
import { FolderKanban, Mail, Zap, Briefcase } from 'lucide-react';
import { useProjects, useSkills, useExperience } from '../../hooks/usePortfolio';
import { useQuery } from '@tanstack/react-query';
import { getMessages } from '../../api/contact';

export default function Dashboard() {
  const { data: projectsData } = useProjects({});
  const { data: skillsData } = useSkills();
  const { data: expData } = useExperience();
  const { data: msgData } = useQuery({ queryKey: ['messages'], queryFn: getMessages });

  const unread = msgData?.data?.filter((m) => !m.isRead).length || 0;

  const stats = [
    { label: 'Projects', value: projectsData?.total || 0, icon: FolderKanban, to: '/admin/projects', color: 'text-blue-400' },
    { label: 'Skills', value: skillsData?.data ? Object.values(skillsData.data).flat().length : 0, icon: Zap, to: '/admin/skills', color: 'text-yellow-400' },
    { label: 'Experience', value: expData?.data?.length || 0, icon: Briefcase, to: '/admin/experience', color: 'text-green-400' },
    { label: 'Unread Messages', value: unread, icon: Mail, to: '/admin/messages', color: 'text-purple-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, to, color }) => (
          <Link key={label} to={to}
            className="p-5 rounded-xl bg-[#1a1e2a] border border-[#2a2f3d] hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between">
              <Icon className={`w-8 h-8 ${color}`} />
              <span className="text-3xl font-bold text-white">{value}</span>
            </div>
            <p className="mt-3 text-sm text-gray-400">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
