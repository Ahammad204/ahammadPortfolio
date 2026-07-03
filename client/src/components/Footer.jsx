import { Github, Linkedin, Twitter, Youtube, Globe } from 'lucide-react';
import { useProfile } from '../hooks/usePortfolio';

export default function Footer() {
  const { data } = useProfile();
  const profile = data?.data;
  const year = new Date().getFullYear();

  const socials = [
    { key: 'github', icon: Github, url: profile?.socialLinks?.github },
    { key: 'linkedin', icon: Linkedin, url: profile?.socialLinks?.linkedin },
    { key: 'twitter', icon: Twitter, url: profile?.socialLinks?.twitter },
    { key: 'youtube', icon: Youtube, url: profile?.socialLinks?.youtube },
    { key: 'website', icon: Globe, url: profile?.socialLinks?.website },
  ].filter((s) => s.url);

  return (
    <footer className="bg-dark-100 border-t border-dark-300/50">
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-white">
              <span className="text-primary">&lt;</span>Dev<span className="text-primary">/&gt;</span>
            </span>
            {profile?.tagline && (
              <p className="mt-1 text-sm text-gray-400">{profile.tagline}</p>
            )}
          </div>
          {socials.length > 0 && (
            <div className="flex gap-4">
              {socials.map(({ key, icon: Icon, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="mt-8 pt-6 border-t border-dark-300/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            &copy; {year} {profile?.name || 'Developer'}. All rights reserved.
          </p>
          <p>Built with React &amp; Node.js</p>
        </div>
      </div>
    </footer>
  );
}
