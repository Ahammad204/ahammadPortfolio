import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useCertifications } from '../../hooks/usePortfolio';
import { createCertification, updateCertification } from '../../api/certifications';
import { CERTIFICATION_ISSUERS } from '../../lib/constants';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  issuer: z.string().min(1, 'Required'),
  issueDate: z.string().min(1, 'Required'),
  credentialUrl: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.coerce.number().optional(),
});

export default function CertificationForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data } = useCertifications({});
  const certification = isEdit ? data?.data?.find((c) => c._id === id) : null;
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { order: 0 },
  });

  useEffect(() => {
    if (certification) {
      reset({
        title: certification.title,
        issuer: certification.issuer,
        issueDate: certification.issueDate ? new Date(certification.issueDate).toISOString().split('T')[0] : '',
        credentialUrl: certification.credentialUrl || '',
        featured: certification.featured,
        order: certification.order,
      });
      setImagePreview(certification.image);
    }
  }, [certification, reset]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values) => {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== '') fd.append(k, v);
      });
      if (imageFile) fd.append('image', imageFile);

      if (isEdit) await updateCertification(id, fd);
      else await createCertification(fd);

      qc.invalidateQueries({ queryKey: ['certifications'] });
      toast.success(isEdit ? 'Certification updated' : 'Certification created');
      navigate('/admin/certifications');
    } catch { toast.error('Save failed'); }
  };

  const inputCls = 'w-full px-3 py-2 bg-[#1a1e2a] border border-[#2a2f3d] rounded-lg text-white text-sm focus:outline-none focus:border-primary';
  const labelCls = 'block text-xs font-medium text-gray-400 mb-1';

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">{isEdit ? 'Edit' : 'New'} Certification</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Title *</label><input {...register('title')} className={inputCls} />{errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}</div>
          <div>
            <label className={labelCls}>Issuer *</label>
            <input {...register('issuer')} className={inputCls} list="issuers" placeholder="e.g. Google, AWS" />
            <datalist id="issuers">{CERTIFICATION_ISSUERS.map((i) => <option key={i} value={i} />)}</datalist>
            {errors.issuer && <p className="text-xs text-red-400 mt-1">{errors.issuer.message}</p>}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Issue Date *</label><input type="date" {...register('issueDate')} className={inputCls} />{errors.issueDate && <p className="text-xs text-red-400 mt-1">{errors.issueDate.message}</p>}</div>
          <div><label className={labelCls}>Credential URL</label><input {...register('credentialUrl')} className={inputCls} placeholder="https://..." /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" {...register('featured')} className="accent-primary" /> Featured
          </label>
          <div><label className={labelCls}>Order</label><input type="number" {...register('order')} className={inputCls} /></div>
        </div>
        <div>
          <label className={labelCls}>Certificate Image</label>
          {imagePreview && <img src={imagePreview} alt="Preview" className="w-full max-w-xs h-32 object-cover rounded-lg mb-2" />}
          <input type="file" accept="image/*" onChange={handleImage} className="text-sm text-gray-400" />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => navigate('/admin/certifications')} className="px-6 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
        </div>
      </form>
    </div>
  );
}
