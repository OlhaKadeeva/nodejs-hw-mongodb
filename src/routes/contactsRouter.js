import express from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
} from '../controllers/contactsController.js';

const contactsRouter = express.Router();

contactsRouter.get('/', handleGetAllContacts);

contactsRouter.get('/:contactId', handleGetContactById);

export default contactsRouter;
