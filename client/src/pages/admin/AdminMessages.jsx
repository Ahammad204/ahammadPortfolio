import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMessages, markAsRead, deleteMessage } from '../../api/contact';
import { formatDate } from '../../lib/utils';
import ConfirmModal from '../../admin/ConfirmModal';

export default function AdminMessages() {
  const { data, isLoading } = useQuery({ queryKey: ['messages'], queryFn: getMessages });
  const messages = data?.data;
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleRead = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      try { await markAsRead(msg._id); qc.invalidateQueries({ queryKey: ['messages'] }); }
      catch { /* silent */ }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteMessage(deleteId); qc.invalidateQueries({ queryKey: ['messages'] }); toast.success('Deleted'); if (selected?._id === deleteId) setSelected(null); }
    catch { toast.error('Delete failed'); }
    setDeleting(false); setDeleteId(null);
  };

  const unread = messages?.filter(m => !m.isRead).length || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        {unread > 0 && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{unread} unread</span>}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-2 space-y-1 max-h-[70vh] overflow-y-auto">
          {isLoading ? <p className="text-gray-500">Loading...</p> : messages?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages yet</p>
          ) : messages?.map((msg) => (
            <div key={msg._id} onClick={() => handleRead(msg)}
              className={`flex items-start gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${selected?._id === msg._id ? 'bg-primary/10 border border-primary/30' : 'bg-[#13161d] border border-[#1e2330] hover:bg-[#1a1e2a]'}`}>
              {msg.isRead ? <MailOpen size={16} className="text-gray-500 mt-0.5 shrink-0" /> : <Mail size={16} className="text-primary mt-0.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate ${msg.isRead ? 'text-gray-400' : 'text-white font-medium'}`}>{msg.name}</p>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteId(msg._id); }} className="text-gray-500 hover:text-red-400 shrink-0"><Trash2 size={13} /></button>
                </div>
                <p className="text-xs text-gray-500 truncate">{msg.subject || 'No subject'}</p>
                <p className="text-xs text-gray-600 mt-0.5">{formatDate(msg.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="p-5 rounded-xl bg-[#1a1e2a] border border-[#2a2f3d]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{selected.subject || 'No subject'}</h3>
                  <p className="text-sm text-gray-400">From: {selected.name} &lt;{selected.email}&gt;</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.message}</div>
              <div className="mt-4 pt-4 border-t border-[#2a2f3d]">
                <a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline">Reply via email →</a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">Select a message to read</div>
          )}
        </div>
      </div>

      <ConfirmModal open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
