import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsService } from '../../api/services';
import { formatDate } from '../../utils/time';

export default function AdminDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsService.get()
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const { stats, recentPosts, topPosts } = data || {};

  return (
    <div style={{ padding: '24px 16px', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>Welcome back!</p>
        </div>
        <Link to="/admin/posts/new"
          style={{ background: '#111827', color: 'white', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
          + New Post
        </Link>
      </div>

      {/* Stats grid — 2 cols on mobile, 4 on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }} className="stats-grid">
        <StatCard label="Total posts"      value={stats?.totalPosts}      icon="📝" />
        <StatCard label="Published"        value={stats?.publishedPosts}  icon="✅" color="#059669" />
        <StatCard label="Total views"      value={stats?.totalViews?.toLocaleString()} icon="👁️" color="#2563eb" />
        <StatCard label="Pending comments" value={stats?.pendingComments} icon="💬" color="#d97706"
          link="/admin/comments?status=pending" />
      </div>

      {/* Two panels — stack on mobile */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Recent posts */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f3f4f6', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Recent posts</h2>
            <Link to="/admin/posts" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentPosts?.map(post => (
              <div key={post._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </p>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{formatDate(post.createdAt)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <StatusBadge status={post.status} />
                  <Link to={`/admin/posts/${post._id}/edit`}
                    style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none' }}>Edit</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top posts */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f3f4f6', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Top posts</h2>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>by views</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topPosts?.map((post, i) => (
              <div key={post._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#d1d5db', width: 20, flexShrink: 0 }}>#{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </p>
                  {post.category && (
                    <p style={{ fontSize: 11, marginTop: 2, color: post.category.color }}>{post.category.name}</p>
                  )}
                </div>
                <span style={{ fontSize: 12, color: '#9ca3af', flexShrink: 0 }}>
                  {post.views?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (min-width: 768px) {
          .dashboard-panels { flex-direction: row !important; }
        }
      `}</style>
    </div>
  );
}

const StatCard = ({ label, value, icon, color, link }) => {
  const content = (
    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #f3f4f6', padding: 16, boxSizing: 'border-box' }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <p style={{ fontSize: 26, fontWeight: 700, margin: '8px 0 2px', color: color || '#111827' }}>
        {value ?? '—'}
      </p>
      <p style={{ fontSize: 12, color: '#6b7280' }}>{label}</p>
    </div>
  );
  return link
    ? <Link to={link} style={{ textDecoration: 'none' }}>{content}</Link>
    : content;
};

const StatusBadge = ({ status }) => {
  const styles = {
    published: { background: '#ecfdf5', color: '#059669' },
    draft:     { background: '#fffbeb', color: '#d97706' },
    archived:  { background: '#f9fafb', color: '#6b7280' },
  };
  return (
    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500, textTransform: 'capitalize', ...(styles[status] || styles.archived) }}>
      {status}
    </span>
  );
};

const DashboardSkeleton = () => (
  <div style={{ padding: 24 }}>
    <div style={{ height: 28, background: '#f3f4f6', borderRadius: 8, width: 160, marginBottom: 24 }} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 24 }}>
      {[1,2,3,4].map(i => <div key={i} style={{ height: 100, background: '#f3f4f6', borderRadius: 14 }} />)}
    </div>
    <div style={{ height: 240, background: '#f3f4f6', borderRadius: 16, marginBottom: 16 }} />
    <div style={{ height: 240, background: '#f3f4f6', borderRadius: 16 }} />
  </div>
);
