import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './admin/AdminLayout';

// Public pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminProjects from './pages/admin/AdminProjects';
import ProjectForm from './pages/admin/ProjectForm';
import AdminSkills from './pages/admin/AdminSkills';
import AdminExperience from './pages/admin/AdminExperience';
import AdminEducation from './pages/admin/AdminEducation';
import AdminMessages from './pages/admin/AdminMessages';

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {/* Only show public navbar on non-admin routes */}
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? '' : 'min-h-screen'}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin login (public, no layout) */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected admin routes with sidebar layout */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id/edit" element={<ProjectForm />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="education" element={<AdminEducation />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
          </Route>
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
