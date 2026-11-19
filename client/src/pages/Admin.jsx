import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Admin() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});

  const load = async () => {
    const [u, l, s] = await Promise.all([
      api.get('/admin/users'),
      api.get('/admin/logs'),
      api.get('/admin/stats'),
    ]);
    setUsers(u.data); setLogs(l.data); setStats(s.data);
  };
  useEffect(() => { load(); }, []);

  const toggleRole = async (id) => {
    try { await api.patch(`/admin/users/${id}/role`); toast.success('Role updated'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4"><p className="text-sm text-slate-500">Users</p><p className="text-3xl font-bold">{stats.userCount || 0}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Files</p><p className="text-3xl font-bold">{stats.fileCount || 0}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Storage Used</p><p className="text-3xl font-bold">{((stats.totalBytes || 0) / 1024 / 1024).toFixed(1)} MB</p></div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('users')} className={`btn ${tab === 'users' ? 'btn-primary' : 'btn-ghost'}`}>Users</button>
        <button onClick={() => setTab('logs')} className={`btn ${tab === 'logs' ? 'btn-primary' : 'btn-ghost'}`}>Activity Logs</button>
      </div>

      {tab === 'users' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Role</th><th className="text-left p-3">Storage</th><th className="p-3">Action</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-slate-600">{u.email}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100'}`}>{u.role}</span></td>
                  <td className="p-3 text-slate-600">{(u.storageUsed / 1024 / 1024).toFixed(2)} MB</td>
                  <td className="p-3 text-right">
                    <button onClick={() => toggleRole(u._id)} className="btn btn-ghost text-xs">Toggle Role</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'logs' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr><th className="text-left p-3">Time</th><th className="text-left p-3">User</th><th className="text-left p-3">Action</th><th className="text-left p-3">File</th></tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l._id} className="border-t">
                  <td className="p-3 text-slate-500">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="p-3">{l.user?.name || '-'}</td>
                  <td className="p-3"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{l.action}</span></td>
                  <td className="p-3 text-slate-600">{l.file?.originalName || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
