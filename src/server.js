import express from 'express';
import logger from 'morgan';
import router from './routes/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());

// Роуты
app.use('/contacts', router);

// Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
