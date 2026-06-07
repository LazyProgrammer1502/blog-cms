import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService, categoryService } from '../api/services';
import PostCard from '../components/blog/PostCard';
import { PostListSkeleton } from '../components/blog/PostSkeleton';
import Pagination from '../components/ui/Pagination';

export default function CategoryPage() {
  const { slug } = useParams();
  const [posts,    setPosts]    = useState([]);
  const [category, setCategory] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,    setTotal]    = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      postService.getAll({ category: slug, page, limit: 9 }),
      categoryService.getOne(slug),
    ])
      .then(([postsRes, catRes]) => {
        setPosts(postsRes.data.posts);
        setTotalPages(postsRes.data.totalPages);
        setTotal(postsRes.data.total);
        setCategory(catRes.data.category);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, page]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-gray-600">Home</Link>
          <span>›</span>
          <span>Category</span>
        </div>
        {category && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-4 h-4 rounded-full" style={{ background: category.color }} />
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            </div>
            {category.description && (
              <p className="text-gray-500">{category.description}</p>
            )}
            <p className="text-sm text-gray-400 mt-2">{total} posts</p>
          </>
        )}
      </div>

      {loading ? (
        <PostListSkeleton count={9} />
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">No posts in this category yet.</p>
          <Link to="/" className="btn-secondary mt-4 inline-block">Back to home</Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
          <Pagination currentPage={page} totalPages={totalPages}
            onPageChange={p => { setPage(p); window.scrollTo(0, 0); }} />
        </>
      )}
    </div>
  );
}
