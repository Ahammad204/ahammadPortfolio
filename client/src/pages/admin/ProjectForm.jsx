import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useProject } from '../../hooks/usePortfolio';
import { createProject, updateProject } from '../../api/projects';
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '../../lib/constants';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  longDescription: z.string().optional(),
  challenges: z.string().optional(),
  improvements: z.string().optional(),
  liveUrl: z.string().optional(),
  githubClient: z.string().optional(),
  githubServer: z.string().optional(),
  category: z.string(),
  status: z.string(),
  featured: z.boolean().optional(),
  order: z.coerce.number().optional(),
  techStack: z.string().optional(),
});

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data } = useProject(isEdit ? id : null);
  const project = data?.data;
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category: 'fullstack', status: 'completed', order: 0 },
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description || '',
        longDescription: project.longDescription || '',
        challenges: project.challenges || '',
        improvements: project.improvements || '',
        liveUrl: project.liveUrl || '',
        githubClient: project.githubClient || '',
        githubServer: project.githubServer || '',
        category: project.category,
        status: project.status,
        featured: project.featured,
        order: project.order,
        techStack: project.techStack?.join(', ') || '',
      });
      setCoverPreview(project.coverImage);
    }
  }, [project, reset]);

  const handleCover = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values) => {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === 'techStack') fd.append(k, JSON.stringify(v.split(',').map(s => s.trim()).filter(Boolean)));
        else if (v !== undefined && v !== '') fd.append(k, v);
      });
      if (coverFile) fd.append('coverImage', coverFile);

      if (isEdit) await updateProject(id, fd);
      else await createProject(fd);

      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success(isEdit ? 'Project updated' : 'Project created');
      navigate('/admin/projects');
    } catch { toast.error('Save failed'); }
  };

  const inputCls = 'w-full px-3 py-2 bg-[#1a1e2a] border border-[#2a2f3d] rounded-lg text-white text-sm focus:outline-none focus:border-primary';
  const labelCls = 'block text-xs font-medium text-gray-400 mb-1';

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">{isEdit ? 'Edit' : 'New'} Project</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Title *</label><input {...register('title')} className={inputCls} />{errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}</div>
          <div><label className={labelCls}>Tech Stack (comma-separated)</label><input {...register('techStack')} className={inputCls} placeholder="React, Node.js, MongoDB" /></div>
        </div>
        <div><label className={labelCls}>Short Description *</label><input {...register('description')} className={inputCls} />{errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}</div>
        <div>
          <label className={labelCls}>Long Description (supports multi-line)</label>
          <textarea {...register('longDescription')} rows={6} className={`${inputCls} resize-none`} />
        </div>
        <div>
          <label className={labelCls}>Challenges Faced</label>
          <textarea {...register('challenges')} rows={4} className={`${inputCls} resize-none`} placeholder="Describe the challenges you faced..." />
        </div>
        <div>
          <label className={labelCls}>Improvements & Future Plans</label>
          <textarea {...register('improvements')} rows={4} className={`${inputCls} resize-none`} placeholder="What would you improve or add next..." />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className={labelCls}>Category</label><select {...register('category')} className={inputCls}>{PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className={labelCls}>Status</label><select {...register('status')} className={inputCls}>{PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className={labelCls}>Order</label><input type="number" {...register('order')} className={inputCls} /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className={labelCls}>Live URL</label><input {...register('liveUrl')} className={inputCls} /></div>
          <div><label className={labelCls}>GitHub Client</label><input {...register('githubClient')} className={inputCls} /></div>
          <div><label className={labelCls}>GitHub Server</label><input {...register('githubServer')} className={inputCls} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" {...register('featured')} className="accent-primary" /> Featured
        </label>
        {/* Cover image */}
        <div>
          <label className={labelCls}>Cover Image</label>
          {coverPreview && <img src={coverPreview} alt="Cover" className="w-full max-w-xs h-32 object-cover rounded-lg mb-2" />}
          <input type="file" accept="image/*" onChange={handleCover} className="text-sm text-gray-400" />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => navigate('/admin/projects')} className="px-6 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
        </div>
      </form>
    </div>
  );
}
