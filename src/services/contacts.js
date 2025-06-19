import { Contact } from '../models/contact.js';

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

export async function getContactById(id) {
  const contact = await Contact.findById(id);
  return contact;
}

export const createContact = (body) => Contact.create(body);

export const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const removeContact = (id) => Contact.findByIdAndDelete(id);
