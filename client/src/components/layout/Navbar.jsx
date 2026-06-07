import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryService } from '../../api/services';

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [query,      setQuery]      = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <header style={{ borderBottom: '1px solid #f3f4f6', background: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link to="/" style={{ fontWeight: 700, fontSize: 20, color: '#111827', textDecoration: 'none' }}>
            ✍️ The Blog
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="desktop-nav">
            {categories.slice(0, 4).map(cat => (
              <Link key={cat._id} to={`/category/${cat.slug}`}
                style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {searchOpen ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search…" autoFocus
                  style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', fontSize: 13, width: 160, outline: 'none' }} />
                <button type="button" onClick={() => setSearchOpen(false)}
                  style={{ fontSize: 12, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)}
                style={{ padding: 8, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}>
                🔍
              </button>
            )}
            <Link to="/admin" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}
              className="desktop-admin">
              Admin
            </Link>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ padding: 8, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18 }}
              className="mobile-menu-btn">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div style={{ borderTop: '1px solid #f3f4f6', padding: '12px 0', background: 'white' }}
            className="mobile-menu">
            {categories.map(cat => (
              <Link key={cat._id} to={`/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', fontSize: 15, color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f9fafb' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, display: 'inline-block' }} />
                {cat.name}
              </Link>
            ))}
            <form onSubmit={handleSearch} style={{ padding: '10px 4px' }}>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search posts…"
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, outline: 'none' }} />
            </form>
            <Link to="/admin" onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '10px 4px', fontSize: 14, color: '#9ca3af', textDecoration: 'none' }}>
              Admin Panel →
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .desktop-nav { display: flex !important; }
        .desktop-admin { display: block !important; }
        .mobile-menu-btn { display: none !important; }
        .mobile-menu { display: block; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-admin { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
