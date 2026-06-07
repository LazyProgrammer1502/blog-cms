import { useState } from 'react';
import { commentService } from '../../api/services';
import toast from 'react-hot-toast';

export default function CommentForm({ postSlug }) {
  const [form, setForm] = useState({ name: '', email: '', body: '' });
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.body) return toast.error('All fields required');
    setBusy(true);
    try {
      await commentService.submit(postSlug, form);
      setSubmitted(true);
      setForm({ name: '', email: '', body: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit comment');
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-semibold text-green-800">Comment submitted!</p>
        <p className="text-sm text-green-600 mt-1">It will appear after moderation.</p>
        <button onClick={() => setSubmitted(false)}
          className="text-sm text-green-700 hover:underline mt-3">
          Leave another comment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
          <input type="text" className="input" placeholder="Your name" required
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
          <input type="email" className="input" placeholder="your@email.com" required
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <p className="text-xs text-gray-400 mt-1">Not published</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment *</label>
        <textarea className="input resize-none" rows={4} placeholder="Share your thoughts..." required
          maxLength={1000} value={form.body}
          onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
        <p className="text-xs text-gray-400 mt-1 text-right">{form.body.length}/1000</p>
      </div>
      <button type="submit" disabled={busy} className="btn-primary">
        {busy ? 'Submitting…' : 'Post comment'}
      </button>
    </form>
  );
}
