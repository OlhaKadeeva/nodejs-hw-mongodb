import Joi from 'joi';

export const contactCreateSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(3).max(20).required(),
  isFavourite: Joi.boolean().optional(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(3).max(20).optional(),
  isFavourite: Joi.boolean().optional(),
}).min(1);
