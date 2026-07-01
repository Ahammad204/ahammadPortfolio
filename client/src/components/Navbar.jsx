import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const links = [
  { to: '/', label: 'Home' },
  { to: '/#skills', label: 'Skills', anchor: true },
  { to: '/projects', label: 'Projects' },
  { to: '/#experience', label: 'Experience', anchor: true },
  { to: '/#contact', label: 'Contact', anchor: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const handleClick = (link) => {
    setOpen(false);
    if (link.anchor && pathname === '/') {
      const el = document.querySelector(link.to.replace('/', ''));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-dark-300/50">
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-white">
          <span className="text-primary">&lt;</span>Dev<span className="text-primary">/&gt;</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={() => handleClick(link)}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.to ? 'text-primary' : 'text-gray-300'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-300 hover:text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-dark-300/50 bg-dark-100"
          >
            <ul className="container-custom py-4 space-y-3">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => handleClick(link)}
                    className={cn(
                      'block py-2 text-sm font-medium transition-colors',
                      pathname === link.to ? 'text-primary' : 'text-gray-300'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
