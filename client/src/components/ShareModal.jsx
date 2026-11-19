import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ShareModal({ file, onClose, onShared }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [permission, setPermission] = useState('view');

  useEffect(() => {
    api.get('/files/users/list').then(r => setUsers(r.data));
  }, []);

  const toggle = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const submit = async () => {
    try {
      await api.post(`/files/${file._id}/share`, { userIds: selected, permission });
      toast.success('Shared!');
      onShared?.(); onClose();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-1">Share "{file.originalName}"</h3>
        <p className="text-sm text-slate-500 mb-4">Select users to share with</p>

        <select value={permission} onChange={(e) => setPermission(e.target.value)} className="input mb-3">
          <option value="view">Can view</option>
          <option value="download">Can download</option>
        </select>

        <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
          {users.length === 0 && <p className="text-sm text-slate-500">No other users yet.</p>}
          {users.map(u => (
            <label key={u._id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
              <input type="checkbox" checked={selected.includes(u._id)} onChange={() => toggle(u._id)} />
              <span className="text-sm">{u.name} <span className="text-slate-400">({u.email})</span></span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={submit} disabled={!selected.length} className="btn btn-primary">Share</button>
        </div>
      </div>
    </div>
  );
}
