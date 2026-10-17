import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import routes from './routes';
import prisma from './shared/database/prisma';
import { errorHandler } from './shared/middlewares/error.middleware';

const app: Application = express();

// Trust reverse proxy (required on Render, Heroku, etc. for express-rate-limit)
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const isVercel = /^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(origin);

    if (isLocalhost || isVercel) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Media File Serving
const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'public/uploads');
app.use('/uploads', express.static(uploadDir));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Health Check
app.get('/health', async (req, res) => {
  try {
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      categories: categoryCount,
      products: productCount,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'failed',
      error: error.message,
    });
  }
});

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';
app.use(apiPrefix, routes);

// Global Centralized Error Handler
app.use(errorHandler);

export default app;
