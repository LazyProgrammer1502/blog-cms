import { useState, useEffect } from 'react';
import { categoryService } from '../../api/services';
import toast from 'react-hot-toast';

const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#84CC16'];
const EMPTY  = { name: '', description: '', color: '#3B82F6' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [form,       setForm]       = useState(EMPTY);
  const [editId,     setEditId]     = useState(null);
  const [saving,     setSaving]     = useState(false);

  const load = () => {
    categoryService.getAll()
      .then(({ data }) => setCategories(data.categories))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const startEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, description: cat.description || '', color: cat.color });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name required');
    setSaving(true);
    try {
      if (editId) {
        await categoryService.update(editId, form);
        toast.success('Category updated');
      } else {
        await categoryService.create(form);
        toast.success('Category created');
      }
      cancelEdit();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"?`)) return;
    try {
      await categoryService.remove(cat._id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories</h1>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          {editId ? 'Edit category' : 'New category'}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Name *</label>
              <input type="text" className="input text-sm" placeholder="e.g. Technology"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
              <input type="text" className="input text-sm" placeholder="Optional description"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                    form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                  style={{ background: c }} />
              ))}
              <input type="color" value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="w-7 h-7 rounded-full cursor-pointer border-0" title="Custom color" />
              <span className="text-xs text-gray-400 ml-1">Preview:</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: form.color + '20', color: form.color }}>
                {form.name || 'Category'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {editId && (
              <button type="button" onClick={cancelEdit} className="btn-secondary text-sm py-2 px-4">
                Cancel
              </button>
            )}
            <button type="submit" disabled={saving} className="btn-primary text-sm py-2 px-4">
              {saving ? 'Saving…' : editId ? 'Save changes' : 'Create category'}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 animate-pulse space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-2xl mb-2">🏷️</p>
            <p>No categories yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Posts</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(cat => (
                <tr key={cat._id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{cat.postCount}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-xs">{cat.description || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => startEdit(cat)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                      <button onClick={() => handleDelete(cat)}
                        className="text-xs text-red-400 hover:text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
