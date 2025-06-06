import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  name: String,
  phoneNumber: String,
  email: String,
  isFavourite: Boolean,
  contactType: String,
  createdAt: String,
  updatedAt: String,
});
export const Contact = mongoose.model('Contact', contactSchema);
