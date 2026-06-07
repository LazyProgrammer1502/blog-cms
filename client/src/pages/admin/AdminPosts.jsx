import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../api/services';
import { formatDate } from '../../utils/time';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  published: { bg: '#ecfdf5', color: '#059669' },
  draft:     { bg: '#fffbeb', color: '#d97706' },
  archived:  { bg: '#f9fafb', color: '#6b7280' },
};

export default function AdminPosts() {
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await postService.getAdmin(filter ? { status: filter } : {});
      setPosts(data.posts);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleToggleStatus = async (post) => {
    const next = post.status === 'published' ? 'draft' : 'published';
    try {
      await postService.toggleStatus(post._id, next);
      toast.success(`Post ${next}`);
      fetchPosts();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    setDeleting(post._id);
    try {
      await postService.remove(post._id);
      toast.success('Post deleted');
      fetchPosts();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  return (
    <div style={{ padding: '24px 16px', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Posts</h1>
        <Link to="/admin/posts/new"
          style={{ background: '#111827', color: 'white', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
          + New Post
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', padding: 4, borderRadius: 12, width: 'fit-content', marginBottom: 20 }}>
        {['', 'published', 'draft', 'archived'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '6px 14px', borderRadius: 9, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
              background: filter === s ? 'white' : 'transparent',
              color: filter === s ? '#111827' : '#6b7280',
              boxShadow: filter === s ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Posts — card list on mobile, table on desktop */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 64, background: '#f3f4f6', borderRadius: 10 }} />)}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📝</p>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>No posts yet</p>
            <Link to="/admin/posts/new"
              style={{ background: '#111827', color: 'white', padding: '8px 16px', borderRadius: 10, fontSize: 13, textDecoration: 'none', display: 'inline-block', marginTop: 12 }}>
              Create your first post
            </Link>
          </div>
        ) : (
          <div>
            {posts.map((post, idx) => (
              <div key={post._id}
                style={{ padding: '16px 20px', borderBottom: idx < posts.length - 1 ? '1px solid #f9fafb' : 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>

                {/* Top row — title + status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                      {post.category && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: post.category.color }}>{post.category.name}</span>
                      )}
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>{post.readTime} min</span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>{post.views?.toLocaleString()} views</span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, textTransform: 'capitalize', flexShrink: 0, ...(STATUS_COLORS[post.status] || STATUS_COLORS.archived) }}>
                    {post.status}
                  </span>
                </div>

                {/* Actions row */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link to={`/admin/posts/${post._id}/edit`}
                    style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Edit</Link>
                  <button onClick={() => handleToggleStatus(post)}
                    style={{ fontSize: 12, color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                    {post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link to={`/blog/${post.slug}`} target="_blank"
                    style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none' }}>View ↗</Link>
                  <button onClick={() => handleDelete(post)} disabled={deleting === post._id}
                    style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {deleting === post._id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
