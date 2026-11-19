import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">SecureShare</Link>
        {user && (
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-slate-700 hover:text-blue-600">Admin</Link>
            )}
            <span className="text-sm text-slate-600">Hi, {user.name}</span>
            <button
              onClick={() => { logout(); nav('/login'); }}
              className="btn btn-ghost text-sm"
            >Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
