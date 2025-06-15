import createError from 'http-errors';
import mongoose from 'mongoose';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
} from '../services/contacts.js';

// GET /contacts
export async function handleGetAllContacts(req, res) {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

// GET /contacts/:contactId
export async function handleGetContactById(req, res) {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

// POST /contacts
export async function handleCreateContact(req, res) {
  const { name, phoneNumber, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields');
  }

  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

// PATCH /contacts/:contactId
export async function handleUpdateContact(req, res) {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const updatedContact = await updateContact(contactId, req.body);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

// DELETE /contacts/:contactId
export async function handleDeleteContact(req, res) {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact ID format');
  }

  const deleted = await removeContact(contactId);

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send(); // Успешное удаление — пустой ответ
}
