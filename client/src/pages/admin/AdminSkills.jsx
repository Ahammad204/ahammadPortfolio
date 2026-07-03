import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useSkills } from '../../hooks/usePortfolio';
import { createSkill, updateSkill, deleteSkill } from '../../api/skills';
import { SKILL_CATEGORIES } from '../../lib/constants';
import ConfirmModal from '../../admin/ConfirmModal';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  icon: z.string().optional(),
  category: z.string(),
  order: z.coerce.number().optional(),
});

export default function AdminSkills() {
  const { data, isLoading } = useSkills();
  const grouped = data?.data;
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // null | 'new' | skill object
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category: 'frontend', order: 0 },
  });

  const openNew = () => { reset({ name: '', icon: '', category: 'frontend', order: 0 }); setEditing('new'); };
  const openEdit = (skill) => { reset(skill); setEditing(skill); };
  const close = () => { setEditing(null); reset(); };

  const onSubmit = async (values) => {
    try {
      if (editing === 'new') await createSkill(values);
      else await updateSkill(editing._id, values);
      qc.invalidateQueries({ queryKey: ['skills'] });
      toast.success(editing === 'new' ? 'Skill added' : 'Skill updated');
      close();
    } catch { toast.error('Save failed'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteSkill(deleteId);
      qc.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill deleted');
    } catch { toast.error('Delete failed'); }
    setDeleting(false);
    setDeleteId(null);
  };

  const inputCls = 'w-full px-3 py-2 bg-[#1a1e2a] border border-[#2a2f3d] rounded-lg text-white text-sm focus:outline-none focus:border-primary';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Form modal */}
      {editing && (
        <div className="mb-6 p-4 rounded-xl bg-[#1a1e2a] border border-[#2a2f3d]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-white">{editing === 'new' ? 'New Skill' : 'Edit Skill'}</h3>
            <button onClick={close} className="text-gray-400 hover:text-white"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-4 gap-3 items-end">
            <div><input {...register('name')} placeholder="Name" className={inputCls} />{errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}</div>
            <div><input {...register('icon')} placeholder='Icon — e.g. "SiReact", "SiJavascript"' className={inputCls} /></div>
            <div><select {...register('category')} className={inputCls}>{SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-sm text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {isSubmitting ? '...' : 'Save'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="space-y-6">
          {grouped && Object.entries(grouped).map(([cat, skills]) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 capitalize">{cat}</h3>
              <div className="space-y-1">
                {skills.map((s) => (
                  <div key={s._id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#13161d] border border-[#1e2330] group">
                    <span className="text-sm text-gray-500 w-6">{s.order}</span>
                    <span className="text-sm text-white flex-1">{s.name}</span>
                    <button onClick={() => openEdit(s)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(s._id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
