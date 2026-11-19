import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      nav('/');
    } catch (e) { toast.error(e.response?.data?.message || 'Register failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="card p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Create account</h1>
        <input className="input" placeholder="Name" required
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password (min 6)" type="password" minLength={6} required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={busy} className="btn btn-primary w-full">
          {busy ? 'Creating...' : 'Sign Up'}
        </button>
        <p className="text-sm text-center text-slate-500">
          Have an account? <Link to="/login" className="text-blue-600 font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
}
