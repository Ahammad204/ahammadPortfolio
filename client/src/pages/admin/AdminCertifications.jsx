import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useCertifications } from '../../hooks/usePortfolio';
import { deleteCertification } from '../../api/certifications';
import ConfirmModal from '../../admin/ConfirmModal';
import { formatDate } from '../../lib/utils';

export default function AdminCertifications() {
  const { data, isLoading } = useCertifications({});
  const certifications = data?.data;
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCertification(deleteId);
      qc.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification deleted');
    } catch { toast.error('Delete failed'); }
    setDeleting(false);
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Certifications</h1>
        <Link to="/admin/certifications/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
          <Plus size={16} /> New Certification
        </Link>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : (
        <div className="overflow-x-auto rounded-xl border border-[#2a2f3d]">
          <table className="w-full text-sm">
            <thead className="bg-[#1a1e2a] text-gray-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Issuer</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2f3d]">
              {certifications?.map((c) => (
                <tr key={c._id} className="hover:bg-[#1a1e2a]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.image && <img src={c.image} alt="" className="w-10 h-10 rounded object-cover" />}
                      <div>
                        <p className="text-white font-medium">{c.title}</p>
                        {c.featured && <span className="text-xs text-yellow-400">★ Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{c.issuer}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{formatDate(c.issueDate)}</td>
                  <td className="px-4 py-3 text-gray-400">{c.order}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/certifications/${c._id}/edit`} className="p-1.5 text-gray-400 hover:text-primary"><Pencil size={15} /></Link>
                      <button onClick={() => setDeleteId(c._id)} className="p-1.5 text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {certifications?.length === 0 && <p className="text-center text-gray-500 py-8">No certifications yet</p>}
        </div>
      )}

      <ConfirmModal open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
