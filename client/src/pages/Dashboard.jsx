import { useEffect, useState } from 'react';
import api from '../api/axios';
import FileCard from '../components/FileCard';
import UploadZone from '../components/UploadZone';
import ShareModal from '../components/ShareModal';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [own, setOwn] = useState([]);
  const [shared, setShared] = useState([]);
  const [tab, setTab] = useState('own');
  const [shareFile, setShareFile] = useState(null);
  const [storage, setStorage] = useState({ used: 0, limit: 1 });

  const load = async () => {
    const { data } = await api.get('/files');
    setOwn(data.own);
    setShared(data.shared);
    const me = await api.get('/auth/me');
    setStorage({ used: me.data.storageUsed, limit: me.data.storageLimit });
  };
  useEffect(() => { load(); }, []);

  const download = async (id) => {
    try {
      const res = await api.get(`/files/${id}/download`, { responseType: 'blob' });
      const disposition = res.headers['content-disposition'];
      const match = disposition?.match(/filename="?([^";]+)"?/);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = match?.[1] || 'file';
      a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Download failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this file?')) return;
    try { await api.delete(`/files/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const pct = Math.min(100, (storage.used / storage.limit) * 100);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Storage</span>
          <span className="text-slate-500">
            {(storage.used / 1024 / 1024).toFixed(2)} / {(storage.limit / 1024 / 1024).toFixed(0)} MB
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded">
          <div className="h-2 bg-blue-600 rounded" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <UploadZone onUploaded={load} />

      <div className="flex gap-2">
        <button onClick={() => setTab('own')} className={`btn ${tab === 'own' ? 'btn-primary' : 'btn-ghost'}`}>My Files ({own.length})</button>
        <button onClick={() => setTab('shared')} className={`btn ${tab === 'shared' ? 'btn-primary' : 'btn-ghost'}`}>Shared with me ({shared.length})</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(tab === 'own' ? own : shared).map(f => (
          <FileCard
            key={f._id}
            file={f}
            isOwner={tab === 'own'}
            onDownload={download}
            onDelete={del}
            onShare={setShareFile}
          />
        ))}
        {(tab === 'own' ? own : shared).length === 0 && (
          <p className="col-span-full text-center text-slate-500 py-8">
            {tab === 'own' ? 'No files yet. Upload one above!' : 'Nothing shared with you yet.'}
          </p>
        )}
      </div>

      {shareFile && (
        <ShareModal file={shareFile} onClose={() => setShareFile(null)} onShared={load} />
      )}
    </div>
  );
}
