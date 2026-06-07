import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { commentService } from '../../api/services';
import { formatDate } from '../../utils/time';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending:  'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  spam:     'bg-red-50 text-red-600',
};

export default function AdminComments() {
  const [searchParams] = useSearchParams();
  const [comments, setComments] = useState([]);
  const [counts,   setCounts]   = useState({ pending: 0, approved: 0, spam: 0 });
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState(searchParams.get('status') || '');
  const [updating, setUpdating] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [commentsRes, countsRes] = await Promise.all([
        commentService.getAll(filter ? { status: filter } : {}),
        commentService.getCounts(),
      ]);
      setComments(commentsRes.data.comments);
      setCounts(countsRes.data);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await commentService.updateStatus(id, status);
      toast.success(`Marked as ${status}`);
      load();
    } catch {
      toast.error('Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentService.remove(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Comments</h1>

      {/* Counts */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending',  key: 'pending',  color: 'text-amber-600',  bg: 'bg-amber-50'  },
          { label: 'Approved', key: 'approved', color: 'text-emerald-600',bg: 'bg-emerald-50'},
          { label: 'Spam',     key: 'spam',     color: 'text-red-500',    bg: 'bg-red-50'    },
        ].map(s => (
          <button key={s.key} onClick={() => setFilter(filter === s.key ? '' : s.key)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filter === s.key ? `${s.bg} border-current` : 'bg-white border-gray-100 hover:border-gray-200'
            }`}>
            <p className={`text-2xl font-bold ${s.color}`}>{counts[s.key]}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm text-gray-500">
          {filter ? `Showing: ${filter}` : 'Showing: all'}
        </span>
        {filter && (
          <button onClick={() => setFilter('')}
            className="text-xs text-gray-400 hover:text-gray-600">Clear filter ✕</button>
        )}
      </div>

      {/* Comments list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded" />)}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">💬</p>
            <p className="text-gray-400">No comments {filter ? `with status "${filter}"` : ''}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {comments.map(comment => (
              <div key={comment._id} className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                    {comment.name[0]?.toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-gray-900">{comment.name}</span>
                      <span className="text-xs text-gray-400">{comment.email}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[comment.status]}`}>
                        {comment.status}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">{formatDate(comment.createdAt)}</span>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed mb-2">{comment.body}</p>

                    {comment.post && (
                      <p className="text-xs text-gray-400">
                        On:{' '}
                        <Link to={`/blog/${comment.post.slug}`} target="_blank"
                          className="text-blue-500 hover:underline">
                          {comment.post.title}
                        </Link>
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 shrink-0">
                    {comment.status !== 'approved' && (
                      <button onClick={() => handleStatus(comment._id, 'approved')}
                        disabled={updating === comment._id}
                        className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium transition-colors">
                        Approve
                      </button>
                    )}
                    {comment.status !== 'spam' && (
                      <button onClick={() => handleStatus(comment._id, 'spam')}
                        disabled={updating === comment._id}
                        className="text-xs px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg font-medium transition-colors">
                        Spam
                      </button>
                    )}
                    <button onClick={() => handleDelete(comment._id)}
                      className="text-xs px-3 py-1.5 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
