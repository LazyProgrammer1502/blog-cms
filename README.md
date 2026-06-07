<div align="center">

# 📝 Blog CMS — Full-Stack MERN Blog Platform

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TipTap](https://img.shields.io/badge/TipTap-Rich_Editor-6366f1?style=flat-square)](https://tiptap.dev)

[**Live Demo →**](https://your-blog.vercel.app) &nbsp;|&nbsp; [**Admin Panel →**](https://your-blog.vercel.app/admin)

A full-stack blog CMS with a rich text editor, admin panel, comment moderation, SEO fields, and Cloudinary image uploads.

</div>

---

## 📸 Screenshots

> *(Add screenshots after deploying)*

---

## ✨ Features

### Public Blog
- Paginated post listing with featured post hero
- Category filtering with color-coded badges
- Full-text search across title, content, and tags
- Single post page with rich HTML content
- Read time calculator (auto-calculated from word count)
- View counter per post
- Slug-based URLs (`/blog/how-to-learn-react`)
- Comment section (pending moderation before showing)
- Related posts by category

### Admin Panel
- Secure login (JWT — admin only)
- Dashboard with stats: total posts, published, total views, pending comments
- Recent posts + top posts by views
- **TipTap rich text editor** — bold, italic, headings, lists, blockquote, code blocks, links, inline images
- Cover image upload (Cloudinary — 1200×630 crop)
- Content image upload directly from the editor toolbar
- Draft / Publish / Archive workflow
- SEO meta title + description per post (max 60/160 chars)
- Category management with color picker
- Comment moderation — approve / mark as spam / delete
- Mobile-responsive admin with top dropdown navigation

### Technical
- JWT authentication with bcrypt password hashing
- Role-based access: `admin` | `author`
- Auto slug generation with uniqueness check (`my-post`, `my-post-1`, `my-post-2`)
- MongoDB text index for full-text search
- Automatic read time calculation on every save (strips HTML, counts words, divides by 200 wpm)
- Rate limiting on all routes
- NoSQL injection prevention
- Cloudinary for all image storage (covers, content images, avatars)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS |
| **Rich Editor** | TipTap v2 (StarterKit, Image, Link, Placeholder, CharacterCount) |
| **Backend** | Node.js, Express.js, JWT, bcryptjs |
| **Database** | MongoDB Atlas, Mongoose |
| **File Storage** | Cloudinary |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 🗂 Project Structure

```
blog-cms/
├── client/                          # React + Vite frontend
│   └── src/
│       ├── api/
│       │   ├── axios.js             # Axios instance + JWT interceptor
│       │   └── services.js          # All API call functions
│       ├── components/
│       │   ├── admin/               # AdminLayout, RichEditor (TipTap)
│       │   ├── blog/                # PostCard, PostSkeleton, CommentForm
│       │   ├── layout/              # Navbar (mobile hamburger), Footer
│       │   └── ui/                  # Pagination, ProtectedRoute
│       ├── context/
│       │   └── AuthContext.jsx      # Admin auth state
│       ├── pages/
│       │   ├── Home.jsx             # Featured + grid + category sidebar
│       │   ├── PostPage.jsx         # Full post + comments + related
│       │   ├── CategoryPage.jsx     # Filtered post grid
│       │   ├── SearchPage.jsx       # Full-text search results
│       │   └── admin/
│       │       ├── AdminLogin.jsx
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminPosts.jsx
│       │       ├── PostEditor.jsx   # TipTap editor + sidebar settings
│       │       ├── AdminCategories.jsx
│       │       └── AdminComments.jsx
│       └── utils/time.js
│
└── server/                          # Node.js + Express backend
    ├── config/
    │   ├── db.js                    # MongoDB connection
    │   └── cloudinary.js            # Cover + content + avatar upload configs
    ├── controllers/
    │   ├── authController.js        # Register, login, profile
    │   ├── postController.js        # CRUD + search + view counter + image upload
    │   ├── categoryController.js    # CRUD with slug generation
    │   ├── commentController.js     # Submit (public) + moderation (admin)
    │   └── statsController.js       # Dashboard numbers
    ├── middleware/
    │   ├── auth.js                  # protect + adminOnly
    │   └── errorHandler.js
    ├── models/
    │   ├── User.js                  # role: admin | author
    │   ├── Post.js                  # readTime auto-calc, text index, SEO fields
    │   ├── Category.js              # slug, color, postCount
    │   └── Comment.js               # status: pending | approved | spam
    ├── routes/
    └── utils/
        ├── asyncHandler.js
        ├── slugify.js               # Unique slug generator
        └── generateToken.js
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- [MongoDB Atlas](https://mongodb.com/atlas) account (free)
- [Cloudinary](https://cloudinary.com) account (free)

### 1. Clone the repo
```bash
git clone https://github.com/LazyProgrammer1502/blog-cms.git
cd blog-cms
```

### 2. Setup the server
```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:
```env
PORT=5003
NODE_ENV=development
MONGO_URI=mongodb+srv://...
JWT_SECRET=any_long_random_string
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev    # starts on :5003
```

### 3. Setup the client
```bash
cd ../client
npm install
npm run dev    # starts on :5173
```

### 4. Create your first admin account
```bash
POST http://localhost:5003/api/auth/register
{
  "name": "Admin",
  "email": "admin@blog.com",
  "password": "your_password",
  "role": "admin"
}
```

Then go to `http://localhost:5173/admin/login` and sign in.

---

## 🌐 Deployment

### Backend → Render
1. New Web Service → connect repo → **Root Directory:** `server`
2. Build: `npm install` | Start: `npm start`
3. Add all env variables from `.env.example`
4. Deploy — copy URL e.g. `https://blog-cms-api.onrender.com`

### Frontend → Vercel
1. New Project → connect repo → **Root Directory:** `client`
2. Add environment variable:
   ```
   VITE_API_URL = https://blog-cms-api.onrender.com
   ```
3. Deploy — copy URL e.g. `https://blog-cms.vercel.app`
4. Go back to Render → add `CLIENT_URL = https://blog-cms.vercel.app`

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/posts` | — | List published posts (paginated) |
| GET | `/api/posts/search?q=` | — | Full-text search |
| GET | `/api/posts/:slug` | — | Single post + comments + related |
| GET | `/api/posts/admin` | admin | All posts including drafts |
| POST | `/api/posts` | admin | Create post (multipart) |
| PUT | `/api/posts/:id` | admin | Update post |
| PUT | `/api/posts/:id/status` | admin | Toggle draft/published/archived |
| DELETE | `/api/posts/:id` | admin | Delete post |
| POST | `/api/posts/upload-image` | admin | Upload content image for editor |
| GET | `/api/categories` | — | All categories |
| POST | `/api/categories` | admin | Create category |
| POST | `/api/comments/:postSlug` | — | Submit comment (goes to pending) |
| GET | `/api/comments` | admin | All comments for moderation |
| PUT | `/api/comments/:id/status` | admin | Approve / spam / pending |
| GET | `/api/stats` | admin | Dashboard stats |

---

## 👨‍💻 Author

**Muhammad Faizan**

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blue?style=flat-square)](https://muhammad-faizan-portfolio.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-LazyProgrammer1502-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/LazyProgrammer1502)

---

<div align="center">
  <sub>Built as a portfolio project to demonstrate full-stack MERN development with content management</sub>
</div>
