import { Contact } from '../models/contact.js';
import createError from 'http-errors';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
}) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const filter = {};
  if (type) filter.contactType = type;
  if (typeof isFavourite !== 'undefined')
    filter.isFavourite = isFavourite === 'true';

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(Number(perPage));

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

//Отримати один контакт по ID, що належить користувачу
export async function getContactById(id, userId) {
  const contact = await Contact.findById({ _id: id, userId });

  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  return contact;
}

//Створити контакт для користувача
export const createContact = async (contactData, userId) => {
  return await Contact.create({ ...contactData, userId });
};

//Оновити контакт користувача
export const updateContact = async (id, updateData, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: id, userId },
    updateData,
    { new: true },
  );
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  return contact;
};

//Видалити контакт користувача
export const removeContact = async (id, userId) => {
  const contact = await Contact.findByIdAndDelete({ _id: id, userId });

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  return contact;
};
