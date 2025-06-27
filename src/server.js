import express from 'express';
import morgan from 'morgan';
import router from './routes/contacts.js';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Роуты
app.use('/contacts', router);
app.use('/auth', authRouter);

// Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
