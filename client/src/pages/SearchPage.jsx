import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { postService } from '../api/services';
import PostCard from '../components/blog/PostCard';
import { PostListSkeleton } from '../components/blog/PostSkeleton';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    setLoading(true);
    postService.search(q)
      .then(({ data }) => setPosts(data.posts))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-gray-600">Home</Link>
          <span>›</span>
          <span>Search</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {q ? `Results for "${q}"` : 'Search'}
        </h1>
        {!loading && q && (
          <p className="text-gray-400 mt-2">{posts.length} result{posts.length !== 1 ? 's' : ''} found</p>
        )}
      </div>

      {loading ? (
        <PostListSkeleton count={6} />
      ) : !q ? (
        <p className="text-gray-400">Enter a search term to find posts.</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-semibold text-gray-700">No results found</p>
          <p className="text-gray-400 mt-2">Try different keywords</p>
          <Link to="/" className="btn-secondary mt-6 inline-block">Browse all posts</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
      )}
    </div>
  );
}
