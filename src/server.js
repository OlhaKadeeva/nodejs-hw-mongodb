import express from 'express';
import morgan from 'morgan';
import router from './routes/contacts.js';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(cookieParser());

app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
// Конвертация путей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/src/swagger', express.static(path.join(__dirname, 'swagger')));
// Путь к  YAML-файлу
const swaggerDocument = YAML.load(
  path.join(__dirname, '..', 'docs', 'openapi.yaml'),
);

// Подключение документации Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/uploads', express.static(UPLOAD_DIR));
// app.use('/api-docs', swaggerDocs());

// Роуты
app.use('/contacts', router);
app.use('/auth', authRouter);

// Ping для проверки
app.get('/ping', (req, res) => {
  res.send('pong!');
});
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Запуск сервера
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export default app;
