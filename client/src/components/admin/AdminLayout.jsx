import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin',            label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/posts',      label: 'Posts',     icon: '📝' },
  { to: '/admin/posts/new',  label: 'New Post',  icon: '✏️' },
  { to: '/admin/categories', label: 'Categories',icon: '🏷️' },
  { to: '/admin/comments',   label: 'Comments',  icon: '💬' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* ── Desktop sidebar — fixed left, hidden on mobile ── */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100vh',
        width: 224, background: 'white', borderRight: '1px solid #f3f4f6',
        display: 'flex', flexDirection: 'column', zIndex: 30,
      }} className="desktop-sidebar">

        <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
          <NavLink to="/" style={{ fontWeight: 700, fontSize: 14, color: '#111827', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <span>✍️</span> The Blog
          </NavLink>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Admin Panel</p>
        </div>

        <nav style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 12, fontSize: 14,
                fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s',
                background: isActive ? '#111827' : 'transparent',
                color: isActive ? 'white' : '#4b5563',
              })}>
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: 12, borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#4b5563', flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#ef4444', borderRadius: 12, border: 'none', background: 'none', cursor: 'pointer' }}>
            → Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile top navbar ── */}
      <header style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0,
        height: 56, background: 'white', borderBottom: '1px solid #f3f4f6',
        zIndex: 40, alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
      }} className="mobile-header">
        <span style={{ fontWeight: 700, fontSize: 15 }}>✍️ Admin</span>
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ padding: 8, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* ── Mobile dropdown menu — slides DOWN from top navbar ── */}
      <div style={{
        display: 'none',
        position: 'fixed', top: 56, left: 0, right: 0,
        background: 'white', borderBottom: '1px solid #f3f4f6',
        zIndex: 39, padding: '8px 12px 16px',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.25s ease',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      }} className="mobile-menu">

        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            onClick={() => setMenuOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 12px', borderRadius: 12, fontSize: 14,
              fontWeight: 500, textDecoration: 'none',
              background: isActive ? '#f9fafb' : 'transparent',
              color: isActive ? '#111827' : '#4b5563',
              borderLeft: isActive ? '3px solid #111827' : '3px solid transparent',
              marginBottom: 2,
            })}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div style={{ borderTop: '1px solid #f3f4f6', marginTop: 8, paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#4b5563', flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ width: '100%', textAlign: 'left', padding: '10px 12px', fontSize: 13, color: '#ef4444', borderRadius: 12, border: 'none', background: 'none', cursor: 'pointer' }}>
            → Logout
          </button>
        </div>
      </div>

      {/* Backdrop to close menu */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)}
          style={{ display: 'none', position: 'fixed', inset: 0, zIndex: 38, background: 'rgba(0,0,0,0.2)' }}
          className="mobile-backdrop" />
      )}

      {/* ── Main content ── */}
      <main style={{ marginLeft: 224 }} className="admin-main">
        <Outlet />
      </main>

      <style>{`
        .desktop-sidebar { display: flex !important; }
        .mobile-header   { display: none !important; }
        .mobile-menu     { display: none !important; }
        .mobile-backdrop { display: none !important; }
        .admin-main      { margin-left: 224px !important; }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header   { display: flex !important; }
          .mobile-menu     { display: block !important; }
          .mobile-backdrop { display: block !important; }
          .admin-main      { margin-left: 0 !important; padding-top: 56px; }
        }
      `}</style>
    </div>
  );
}
