import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService, categoryService } from '../api/services';
import PostCard from '../components/blog/PostCard';
import { PostListSkeleton } from '../components/blog/PostSkeleton';
import Pagination from '../components/ui/Pagination';

export default function Home() {
  const [posts,      setPosts]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [postsRes, catsRes] = await Promise.all([
          postService.getAll({ page, limit: 9 }),
          categoryService.getAll(),
        ]);
        setPosts(postsRes.data.posts);
        setTotalPages(postsRes.data.totalPages);
        setTotal(postsRes.data.total);
        setCategories(catsRes.data.categories);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  const featured = posts[0];
  const rest     = posts.slice(1);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 16px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#111827', marginBottom: 12 }}>The Blog</h1>
        <p style={{ color: '#6b7280', fontSize: 18, maxWidth: 480, margin: '0 auto' }}>
          Thoughts on development, design, and building things that matter.
        </p>
      </div>

      {loading ? (
        <PostListSkeleton count={9} />
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>📝</p>
          <p style={{ fontSize: 20, fontWeight: 600, color: '#374151' }}>No posts yet</p>
          <p style={{ color: '#9ca3af', marginTop: 8 }}>Check back soon!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Featured post */}
            {featured && (
              <div style={{ marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#9ca3af', display: 'block', marginBottom: 16 }}>
                  Featured
                </span>
                <PostCard post={featured} featured />
              </div>
            )}

            {/* Post grid */}
            {rest.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32 }}>
                {rest.map(post => <PostCard key={post._id} post={post} />)}
              </div>
            )}

            <Pagination currentPage={page} totalPages={totalPages}
              onPageChange={p => { setPage(p); window.scrollTo(0, 0); }} />
          </div>

          {/* Sidebar — hidden on mobile via inline style + media query */}
          <aside style={{ width: 200, flexShrink: 0 }} className="blog-sidebar">
            <div style={{ position: 'sticky', top: 88 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#9ca3af', marginBottom: 16 }}>
                Categories
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {categories.map(cat => (
                  <Link key={cat._id} to={`/category/${cat.slug}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#4b5563' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, display: 'inline-block', flexShrink: 0 }} />
                      {cat.name}
                    </span>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{cat.postCount}</span>
                  </Link>
                ))}
              </div>
              <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid #f3f4f6' }}>
                <p style={{ fontSize: 12, color: '#9ca3af' }}>{total} posts published</p>
              </div>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        .blog-sidebar { display: block; }
        @media (max-width: 768px) {
          .blog-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}
