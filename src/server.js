import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import contactsRouter from './routes/contactsRouter.js';
import {
  handleGetAllContacts,
  handleGetContactById,
} from './controllers/contactsController.js';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use('/contacts', contactsRouter);

  // app.get('/contacts', handleGetAllContacts);
  app.get('/contacts', async (req, res) => {
    const contacts = await handleGetAllContacts();
    res.status(200).json({
      data: contacts,
    });
  });

  // app.get('/contacts/:contactId', handleGetContactById);
  app.get('/contacts/:contactsId', async (req, res, next) => {
    const { contactsId } = req.params;
    const contacts = await handleGetContactById(contactsId);

    // Відповідь, якщо контакт не знайдено
    if (!contacts) {
      res.status(404).json({
        message: 'Not found',
      });
      return;
    }

    // Відповідь, якщо контакт знайдено
    res.status(200).json({
      data: contacts,
    });
  });

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
