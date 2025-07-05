import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  contactType: Joi.string().valid('personal', 'work', 'other').required(),
  isFavourite: Joi.boolean().optional(),
  photo: Joi.string().uri().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
  contactType: Joi.string().valid('personal', 'work', 'other'),
  isFavourite: Joi.boolean(),
  photo: Joi.string().uri(),
}).min(1);
