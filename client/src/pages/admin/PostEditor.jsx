import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService, categoryService } from '../../api/services';
import RichEditor from '../../components/admin/RichEditor';
import toast from 'react-hot-toast';

const EMPTY = {
  title: '', excerpt: '', content: '', status: 'draft',
  category: '', tags: '', seoTitle: '', seoDesc: '',
  coverPreview: '', coverFile: null,
};

export default function PostEditor() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = !!id;
  const coverRef = useRef();

  const [form,       setForm]       = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [saving,     setSaving]     = useState(false);
  const [loading,    setLoading]    = useState(isEdit);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    categoryService.getAll().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    postService.getAdmin({ limit: 100 })
      .then(({ data }) => {
        const post = data.posts.find(p => p._id === id);
        if (!post) { toast.error('Post not found'); navigate('/admin/posts'); return; }
        setForm({
          title:        post.title || '',
          excerpt:      post.excerpt || '',
          content:      post.content || '',
          status:       post.status || 'draft',
          category:     post.category?._id || '',
          tags:         post.tags?.join(', ') || '',
          seoTitle:     post.seo?.metaTitle || '',
          seoDesc:      post.seo?.metaDescription || '',
          coverPreview: post.coverImage?.url || '',
          coverFile:    null,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set('coverFile', file);
    set('coverPreview', URL.createObjectURL(file));
  };

  const handleSave = async (statusOverride) => {
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.content || form.content === '<p></p>') return toast.error('Content is required');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',   form.title.trim());
      fd.append('excerpt', form.excerpt.trim());
      fd.append('content', form.content);
      fd.append('status',  statusOverride || form.status);
      if (form.category) fd.append('category', form.category);
      fd.append('tags', JSON.stringify(
        form.tags.split(',').map(t => t.trim()).filter(Boolean)
      ));
      fd.append('seo', JSON.stringify({ metaTitle: form.seoTitle, metaDescription: form.seoDesc }));
      if (form.coverFile) fd.append('coverImage', form.coverFile);

      if (isEdit) {
        await postService.update(id, fd);
        toast.success('Post updated');
      } else {
        await postService.create(fd);
        toast.success('Post created');
        navigate('/admin/posts');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ padding: 32, animation: 'pulse 1.5s infinite' }}>
      <div style={{ height: 28, background: '#f3f4f6', borderRadius: 8, width: 200, marginBottom: 24 }} />
      <div style={{ height: 48, background: '#f3f4f6', borderRadius: 8, marginBottom: 16 }} />
      <div style={{ height: 400, background: '#f3f4f6', borderRadius: 12 }} />
    </div>
  );

  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Status */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f3f4f6', padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Status</p>
        <select value={form.status} onChange={e => set('status', e.target.value)}
          style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', background: 'white' }}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Cover image */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f3f4f6', padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Cover image</p>
        {form.coverPreview ? (
          <div>
            <img src={form.coverPreview} alt="Cover"
              style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 8 }} />
            <button type="button" onClick={() => { set('coverPreview', ''); set('coverFile', null); }}
              style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
              Remove
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => coverRef.current?.click()}
            style={{ width: '100%', border: '2px dashed #e5e7eb', borderRadius: 12, padding: '24px 0', fontSize: 13, color: '#9ca3af', background: 'none', cursor: 'pointer' }}>
            Click to upload cover
          </button>
        )}
        <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
      </div>

      {/* Category */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f3f4f6', padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Category</p>
        <select value={form.category} onChange={e => set('category', e.target.value)}
          style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', background: 'white' }}>
          <option value="">No category</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
      </div>

      {/* Tags */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f3f4f6', padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Tags</p>
        <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)}
          placeholder="react, javascript…"
          style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Comma separated</p>
      </div>

      {/* SEO */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f3f4f6', padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 12 }}>SEO</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 6 }}>Meta title (60)</p>
            <input type="text" value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)}
              maxLength={60} placeholder="Defaults to title"
              style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 6 }}>Meta description (160)</p>
            <textarea value={form.seoDesc} onChange={e => set('seoDesc', e.target.value)}
              maxLength={160} rows={3} placeholder="Defaults to excerpt"
              style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>
          {isEdit ? 'Edit post' : 'New post'}
        </h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Mobile settings toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #e5e7eb', background: 'white', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
            className="settings-toggle">
            ⚙️ Settings
          </button>
          <button onClick={() => handleSave('draft')} disabled={saving}
            style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #e5e7eb', background: 'white', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
            Save draft
          </button>
          <button onClick={() => handleSave('published')} disabled={saving}
            style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: '#111827', color: 'white', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setSidebarOpen(false)}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 320, background: '#f9fafb', padding: 20, overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontWeight: 600, fontSize: 15 }}>Post settings</p>
              <button onClick={() => setSidebarOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Two column layout */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Main editor */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="Post title…"
            style={{ width: '100%', fontSize: 28, fontWeight: 700, border: 'none', borderBottom: '1px solid #f3f4f6', paddingBottom: 12, outline: 'none', background: 'transparent', boxSizing: 'border-box' }} />

          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Excerpt</p>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
              rows={2} maxLength={300} placeholder="Brief summary shown on listing pages…"
              style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: 14, resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Content</p>
            <RichEditor content={form.content} onChange={html => set('content', html)} />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div style={{ width: 256, flexShrink: 0 }} className="editor-sidebar">
          <Sidebar />
        </div>
      </div>

      <style>{`
        .settings-toggle { display: none !important; }
        .editor-sidebar { display: block !important; }
        @media (max-width: 900px) {
          .settings-toggle { display: block !important; }
          .editor-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
