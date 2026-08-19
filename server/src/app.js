import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { urlencoded } from 'express';
import authRoute from './routes/auth.route.js';

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  }),
);
app.use(urlencoded({ extended: true }));

// api endpoint's
app.use('/api/auth', authRoute);

export default app;
