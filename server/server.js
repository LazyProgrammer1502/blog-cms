const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const morgan        = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit     = require('express-rate-limit');
require('dotenv').config();

const connectDB     = require('./config/db');
const errorHandler  = require('./middleware/errorHandler');

connectDB();

const app = express();

const allowedOrigins = ['http://localhost:5173', process.env.CLIENT_URL].filter(Boolean);

// ── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ── Rate limiting ─────────────────────────────────────────
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  message: { success: false, message: 'Too many login attempts.' },
}));

// ── Parsing ────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' })); // larger limit for rich text content
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/posts',      require('./routes/postRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/comments',   require('./routes/commentRoutes'));
app.use('/api/stats',      require('./routes/statsRoutes'));

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({
  success: true,
  message: 'Blog CMS API running 🚀',
  env: process.env.NODE_ENV,
}));

app.use('*', (req, res) => res.status(404).json({ success: false, message: `${req.originalUrl} not found` }));
app.use(errorHandler);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Blog CMS server on port ${PORT}`));
