import { getAllContacts, getContactById } from '../services/contacts.js';
import mongoose from 'mongoose';

export async function handleGetAllContacts(req, res, next) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error('Error getting all contacts:', error.message);
    next(error);
  }
}

export async function handleGetContactById(req, res, next) {
  try {
    // console.log('Params:', req.params);
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}
