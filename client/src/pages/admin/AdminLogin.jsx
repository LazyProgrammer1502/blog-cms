import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">✍️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your blog</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" className="input" placeholder="admin@blog.com" required
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" className="input" placeholder="••••••••" required
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <button type="submit" disabled={busy}
              className="btn-primary w-full py-2.5">
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
