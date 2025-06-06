import { Contact } from '../models/contact.js';

export async function getAllContacts() {
  // return Contact.find();

  const contact = await Contact.find();
  console.log(contact);
  return contact;
}
export async function getContactById(id) {
  // return Contact.findById(id);

  const contact = await Contact.findById(id);
  return contact;
}
