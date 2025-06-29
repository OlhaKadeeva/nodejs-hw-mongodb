import createError from 'http-errors';
import mongoose from 'mongoose';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
} from '../services/contacts.js';

export async function handleGetAllContacts(req, res) {
  const userId = req.user._id;
  const contacts = await getAllContacts({ ...req.query, userId });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

// Отримати контакт по ID
export async function handleGetContactById(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

// Створити новий контакт
export async function handleCreateContact(req, res) {
  const { name, phoneNumber, contactType } = req.body;
  const userId = req.user._id;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields');
  }

  const newContact = await createContact(req.body, userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

// Оновити контакт
export async function handleUpdateContact(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const updatedContact = await updateContact(contactId, req.body, userId);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

// Видалити контакт
export async function handleDeleteContact(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const deleted = await removeContact(contactId, userId);

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).end();
}
