import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../api/services';
import CommentForm from '../components/blog/CommentForm';
import PostCard from '../components/blog/PostCard';
import { formatDate } from '../utils/time';
import toast from 'react-hot-toast';

export default function PostPage() {
  const { slug }  = useParams();
  const navigate  = useNavigate();
  const [post,     setPost]     = useState(null);
  const [comments, setComments] = useState([]);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    postService.getOne(slug)
      .then(({ data }) => {
        setPost(data.post);
        setComments(data.comments);
        setRelated(data.related);
      })
      .catch(() => { toast.error('Post not found'); navigate('/'); })
      .finally(() => setLoading(false));
  }, [slug]); // eslint-disable-line

  if (loading) return <PostSkeleton />;
  if (!post)   return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-gray-600">Home</Link>
        <span>›</span>
        {post.category && (
          <>
            <Link to={`/category/${post.category.slug}`}
              className="hover:text-gray-600" style={{ color: post.category.color }}>
              {post.category.name}
            </Link>
            <span>›</span>
          </>
        )}
        <span className="text-gray-500 truncate">{post.title}</span>
      </div>

      {/* Category badge */}
      {post.category && (
        <Link to={`/category/${post.category.slug}`}
          className="inline-block text-xs font-semibold uppercase tracking-wider mb-4 hover:opacity-80"
          style={{ color: post.category.color }}>
          {post.category.name}
        </Link>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-xl text-gray-500 leading-relaxed mb-6">{post.excerpt}</p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {post.author?.avatar ? (
            <img src={post.author.avatar} alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
              {post.author?.name?.[0]}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{post.author?.name}</p>
            {post.author?.bio && (
              <p className="text-xs text-gray-400 line-clamp-1">{post.author.bio}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 ml-auto">
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readTime} min read</span>
          <span>·</span>
          <span>{post.views?.toLocaleString()} views</span>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage?.url && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img src={post.coverImage.url} alt={post.coverImage.alt || post.title}
            className="w-full h-72 object-cover" />
        </div>
      )}

      {/* Content — TipTap HTML output */}
      <div className="prose-content mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12 pt-8 border-t border-gray-100">
          {post.tags.map(tag => (
            <span key={tag}
              className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related posts</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {related.map(p => <PostCard key={p._id} post={p} />)}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="border-t border-gray-100 pt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>

        {comments.length > 0 && (
          <div className="space-y-6 mb-10">
            {comments.map(comment => (
              <div key={comment._id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
                  {comment.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{comment.name}</span>
                    <span className="text-xs text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{comment.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Leave a comment</h3>
          <CommentForm postSlug={post.slug} />
        </div>
      </div>
    </div>
  );
}

const PostSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
    <div className="h-3 bg-gray-100 rounded w-48 mb-8" />
    <div className="h-3 bg-gray-100 rounded w-20 mb-4" />
    <div className="h-8 bg-gray-100 rounded w-3/4 mb-3" />
    <div className="h-8 bg-gray-100 rounded w-1/2 mb-6" />
    <div className="h-72 bg-gray-100 rounded-2xl mb-8" />
    <div className="space-y-3">
      {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-100 rounded" />)}
    </div>
  </div>
);
