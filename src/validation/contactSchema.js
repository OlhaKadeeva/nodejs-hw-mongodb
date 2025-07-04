import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be valid',
    }),
  contactType: Joi.string().valid('personal', 'business', 'other').required(),
  photo: Joi.string().uri().optional(), // якщо  дозволяєm передавати фото вручну
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .messages({
      'string.pattern.base': 'Phone number must be valid',
    }),
  contactType: Joi.string().valid('personal', 'business', 'other'),
  photo: Joi.string().uri(),
}).min(1); // хоча б одне поле обов'язкове при оновленні
