import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useExperience } from '../../hooks/usePortfolio';
import { createExperience, updateExperience, deleteExperience } from '../../api/experience';
import { EXPERIENCE_TYPES } from '../../lib/constants';
import { formatDate } from '../../lib/utils';
import ConfirmModal from '../../admin/ConfirmModal';

const schema = z.object({
  company: z.string().min(1, 'Required'),
  role: z.string().min(1, 'Required'),
  type: z.string(),
  location: z.string().optional(),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  order: z.coerce.number().optional(),
});

export default function AdminExperience() {
  const { data, isLoading } = useExperience();
  const items = data?.data;
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'fulltime', order: 0, current: false },
  });

  const isCurrent = watch('current');

  const openNew = () => { reset({ company: '', role: '', type: 'fulltime', location: '', description: '', responsibilities: '', startDate: '', endDate: '', current: false, order: 0 }); setEditing('new'); };
  const openEdit = (item) => {
    reset({
      ...item,
      startDate: item.startDate?.slice(0, 10) || '',
      endDate: item.endDate?.slice(0, 10) || '',
      responsibilities: item.responsibilities?.join('\n') || '',
    });
    setEditing(item);
  };
  const close = () => { setEditing(null); reset(); };

  const onSubmit = async (values) => {
    try {
      const payload = { ...values, responsibilities: values.responsibilities?.split('\n').filter(Boolean) || [] };
      if (values.current) delete payload.endDate;
      if (editing === 'new') await createExperience(payload);
      else await updateExperience(editing._id, payload);
      qc.invalidateQueries({ queryKey: ['experience'] });
      toast.success(editing === 'new' ? 'Added' : 'Updated');
      close();
    } catch { toast.error('Save failed'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteExperience(deleteId); qc.invalidateQueries({ queryKey: ['experience'] }); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
    setDeleting(false); setDeleteId(null);
  };

  const inputCls = 'w-full px-3 py-2 bg-[#1a1e2a] border border-[#2a2f3d] rounded-lg text-white text-sm focus:outline-none focus:border-primary';
  const labelCls = 'block text-xs font-medium text-gray-400 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Experience</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90"><Plus size={16} /> Add</button>
      </div>

      {editing && (
        <div className="mb-6 p-4 rounded-xl bg-[#1a1e2a] border border-[#2a2f3d]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-white">{editing === 'new' ? 'New' : 'Edit'} Experience</h3>
            <button onClick={close} className="text-gray-400 hover:text-white"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div><label className={labelCls}>Company *</label><input {...register('company')} className={inputCls} /></div>
              <div><label className={labelCls}>Role *</label><input {...register('role')} className={inputCls} /></div>
              <div><label className={labelCls}>Type</label><select {...register('type')} className={inputCls}>{EXPERIENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div><label className={labelCls}>Location</label><input {...register('location')} className={inputCls} /></div>
              <div><label className={labelCls}>Start Date *</label><input type="date" {...register('startDate')} className={inputCls} /></div>
              <div>
                <label className={labelCls}>End Date</label>
                <input type="date" {...register('endDate')} className={inputCls} disabled={isCurrent} />
                <label className="flex items-center gap-1 mt-1 text-xs text-gray-400"><input type="checkbox" {...register('current')} className="accent-primary" /> Current</label>
              </div>
            </div>
            <div><label className={labelCls}>Description</label><textarea {...register('description')} rows={2} className={`${inputCls} resize-none`} /></div>
            <div><label className={labelCls}>Responsibilities (one per line)</label><textarea {...register('responsibilities')} rows={3} className={`${inputCls} resize-none`} /></div>
            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white text-sm rounded-lg disabled:opacity-50">{isSubmitting ? '...' : 'Save'}</button>
              <button type="button" onClick={close} className="px-4 py-2 text-sm text-gray-400">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="space-y-2">
          {items?.map((item) => (
            <div key={item._id} className="flex items-center gap-4 px-4 py-3 rounded-lg bg-[#13161d] border border-[#1e2330] group">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{item.role} <span className="text-gray-500">at</span> {item.company}</p>
                <p className="text-xs text-gray-500">{formatDate(item.startDate)} — {item.current ? 'Present' : formatDate(item.endDate)} · {item.type}</p>
              </div>
              <button onClick={() => openEdit(item)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary"><Pencil size={14} /></button>
              <button onClick={() => setDeleteId(item._id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          ))}
          {items?.length === 0 && <p className="text-gray-500 text-center py-8">No experience entries yet</p>}
        </div>
      )}

      <ConfirmModal open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
