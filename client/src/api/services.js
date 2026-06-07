import api from './axios';

export const postService = {
  getAll:        (params) => api.get('/posts', { params }),
  getOne:        (slug)   => api.get(`/posts/${slug}`),
  search:        (q)      => api.get(`/posts/search?q=${encodeURIComponent(q)}`),
  getAdmin:      (params) => api.get('/posts/admin', { params }),
  create:        (fd)     => api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:        (id, fd) => api.put(`/posts/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove:        (id)     => api.delete(`/posts/${id}`),
  toggleStatus:  (id, status) => api.put(`/posts/${id}/status`, { status }),
  uploadCover:   (fd)     => api.post('/posts/upload-cover', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadImage:   (fd)     => api.post('/posts/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const categoryService = {
  getAll:  ()        => api.get('/categories'),
  getOne:  (slug)    => api.get(`/categories/${slug}`),
  create:  (data)    => api.post('/categories', data),
  update:  (id, d)   => api.put(`/categories/${id}`, d),
  remove:  (id)      => api.delete(`/categories/${id}`),
};

export const commentService = {
  submit:       (slug, data) => api.post(`/comments/${slug}`, data),
  getAll:       (params)     => api.get('/comments', { params }),
  getCounts:    ()           => api.get('/comments/counts'),
  updateStatus: (id, status) => api.put(`/comments/${id}/status`, { status }),
  remove:       (id)         => api.delete(`/comments/${id}`),
};

export const authService = {
  login:     (data) => api.post('/auth/login', data),
  getMe:     ()     => api.get('/auth/me'),
  updateMe:  (data) => api.put('/auth/me', data),
};

export const statsService = {
  get: () => api.get('/stats'),
};
