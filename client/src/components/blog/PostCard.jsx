import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/time';

export default function PostCard({ post, featured = false }) {
  return (
    <article className={`group ${featured ? 'md:flex gap-8 items-start' : ''}`}>
      {/* Cover image */}
      {post.coverImage?.url && (
        <Link to={`/blog/${post.slug}`}
          className={`block overflow-hidden rounded-xl bg-gray-100 ${featured ? 'md:w-2/5 shrink-0' : 'mb-4'}`}>
          <img
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${featured ? 'h-60' : 'h-48'}`}
          />
        </Link>
      )}

      {/* Content */}
      <div className={featured && post.coverImage?.url ? 'flex-1' : ''}>
        {/* Category badge */}
        {post.category && (
          <Link to={`/category/${post.category.slug}`}
            className="inline-block text-xs font-semibold uppercase tracking-wider mb-2 hover:opacity-80 transition-opacity"
            style={{ color: post.category.color || '#3B82F6' }}>
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <h2 className={`font-bold text-gray-900 leading-snug mb-2 group-hover:text-gray-600 transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {post.author?.avatar ? (
            <img src={post.author.avatar} alt={post.author.name}
              className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium">
              {post.author?.name?.[0]}
            </div>
          )}
          <span>{post.author?.name}</span>
          <span>·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readTime} min read</span>
          {post.views > 0 && <><span>·</span><span>{post.views.toLocaleString()} views</span></>}
        </div>
      </div>
    </article>
  );
}
