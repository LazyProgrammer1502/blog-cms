import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public pages
import Home         from './pages/Home';
import PostPage     from './pages/PostPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage   from './pages/SearchPage';

// Admin pages
import AdminLogin      from './pages/admin/AdminLogin';
import AdminLayout     from './components/admin/AdminLayout';
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminPosts      from './pages/admin/AdminPosts';
import PostEditor      from './pages/admin/PostEditor';
import AdminCategories from './pages/admin/AdminCategories';
import AdminComments   from './pages/admin/AdminComments';

// Public layout wrapper
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public routes */}
          <Route path="/"              element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/blog/:slug"    element={<PublicLayout><PostPage /></PublicLayout>} />
          <Route path="/category/:slug" element={<PublicLayout><CategoryPage /></PublicLayout>} />
          <Route path="/search"        element={<PublicLayout><SearchPage /></PublicLayout>} />

          {/* Admin auth */}
          <Route path="/admin/login"   element={<AdminLogin />} />

          {/* Admin protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin"                    element={<AdminDashboard />} />
              <Route path="/admin/posts"              element={<AdminPosts />} />
              <Route path="/admin/posts/new"          element={<PostEditor />} />
              <Route path="/admin/posts/:id/edit"     element={<PostEditor />} />
              <Route path="/admin/categories"         element={<AdminCategories />} />
              <Route path="/admin/comments"           element={<AdminComments />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
