import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      nav('/');
    } catch (e) { toast.error(e.response?.data?.message || 'Login failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="card p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">SecureShare</h1>
        <p className="text-center text-sm text-slate-500">Sign in to continue</p>
        <input className="input" placeholder="Email" type="email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={busy} className="btn btn-primary w-full">
          {busy ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-sm text-center text-slate-500">
          No account? <Link to="/register" className="text-blue-600 font-medium">Register</Link>
        </p>
      </form>
    </div>
  );
}
