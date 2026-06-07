const PostCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-48 bg-gray-100 rounded-xl mb-4" />
    <div className="h-3 bg-gray-100 rounded w-20 mb-2" />
    <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-100 rounded w-full mb-1" />
    <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
    <div className="flex gap-2">
      <div className="h-3 bg-gray-100 rounded w-24" />
      <div className="h-3 bg-gray-100 rounded w-16" />
    </div>
  </div>
);

export const PostListSkeleton = ({ count = 6 }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => <PostCardSkeleton key={i} />)}
  </div>
);

export default PostCardSkeleton;
