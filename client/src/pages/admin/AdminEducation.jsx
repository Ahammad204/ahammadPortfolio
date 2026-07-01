import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useEducation } from '../../hooks/usePortfolio';
import { createEducation, updateEducation, deleteEducation } from '../../api/education';
import { formatDate } from '../../lib/utils';
import ConfirmModal from '../../admin/ConfirmModal';

const schema = z.object({
  institution: z.string().min(1, 'Required'),
  degree: z.string().min(1, 'Required'),
  field: z.string().optional(),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  cgpa: z.string().optional(),
  description: z.string().optional(),
});

export default function AdminEducation() {
  const { data, isLoading } = useEducation();
  const items = data?.data;
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { current: false },
  });

  const isCurrent = watch('current');

  const openNew = () => { reset({ institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, cgpa: '', description: '' }); setEditing('new'); };
  const openEdit = (item) => { reset({ ...item, startDate: item.startDate?.slice(0, 10) || '', endDate: item.endDate?.slice(0, 10) || '' }); setEditing(item); };
  const close = () => { setEditing(null); reset(); };

  const onSubmit = async (values) => {
    try {
      const payload = { ...values };
      if (values.current) delete payload.endDate;
      if (editing === 'new') await createEducation(payload);
      else await updateEducation(editing._id, payload);
      qc.invalidateQueries({ queryKey: ['education'] });
      toast.success(editing === 'new' ? 'Added' : 'Updated');
      close();
    } catch { toast.error('Save failed'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteEducation(deleteId); qc.invalidateQueries({ queryKey: ['education'] }); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
    setDeleting(false); setDeleteId(null);
  };

  const inputCls = 'w-full px-3 py-2 bg-[#1a1e2a] border border-[#2a2f3d] rounded-lg text-white text-sm focus:outline-none focus:border-primary';
  const labelCls = 'block text-xs font-medium text-gray-400 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Education</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90"><Plus size={16} /> Add</button>
      </div>

      {editing && (
        <div className="mb-6 p-4 rounded-xl bg-[#1a1e2a] border border-[#2a2f3d]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-white">{editing === 'new' ? 'New' : 'Edit'} Education</h3>
            <button onClick={close} className="text-gray-400 hover:text-white"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div><label className={labelCls}>Institution *</label><input {...register('institution')} className={inputCls} /></div>
              <div><label className={labelCls}>Degree *</label><input {...register('degree')} className={inputCls} /></div>
              <div><label className={labelCls}>Field</label><input {...register('field')} className={inputCls} /></div>
            </div>
            <div className="grid sm:grid-cols-4 gap-3">
              <div><label className={labelCls}>Start Date *</label><input type="date" {...register('startDate')} className={inputCls} /></div>
              <div>
                <label className={labelCls}>End Date</label>
                <input type="date" {...register('endDate')} className={inputCls} disabled={isCurrent} />
                <label className="flex items-center gap-1 mt-1 text-xs text-gray-400"><input type="checkbox" {...register('current')} className="accent-primary" /> Current</label>
              </div>
              <div><label className={labelCls}>CGPA</label><input {...register('cgpa')} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Description</label><textarea {...register('description')} rows={2} className={`${inputCls} resize-none`} /></div>
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
                <p className="text-sm text-white font-medium">{item.degree} {item.field && `in ${item.field}`}</p>
                <p className="text-xs text-gray-500">{item.institution} · {formatDate(item.startDate)} — {item.current ? 'Present' : formatDate(item.endDate)}{item.cgpa && ` · CGPA: ${item.cgpa}`}</p>
              </div>
              <button onClick={() => openEdit(item)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary"><Pencil size={14} /></button>
              <button onClick={() => setDeleteId(item._id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          ))}
          {items?.length === 0 && <p className="text-gray-500 text-center py-8">No education entries yet</p>}
        </div>
      )}

      <ConfirmModal open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
