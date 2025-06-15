import Contact from '../models/contact';

// Получить все контакты
export async function getAllContacts() {
  const contact = await Contact.find();
  return contact;
}

// Получить контакт по ID
export async function getContactById(id) {
  const contact = await Contact.findById(id);
  return contact;
}

// Создать новый контакт
export const createContact = (body) => Contact.create(body);

// Обновить контакт
export const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

// Удалить контакт
export const removeContact = (id) => Contact.findByIdAndDelete(id);
