import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { urlencoded } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoute from './routes/auth.route.js';
import reportRoute from './routes/report.route.js';
import taskRoute from './routes/task.route.js';
import userRoute from './routes/user.route.js';

const app = express();

// for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

// middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    origin: function (origin, callback) {
      // server to server or allowed frontend domains
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(urlencoded({ extended: true }));

// api endpoints
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/reports', reportRoute);

// server uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export default app;
