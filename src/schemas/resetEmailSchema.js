import Joi from 'joi';

export const resetEmailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Вимкнено перевірку на домени верхнього рівня, щоб не обмежувати (наприклад, localhost)
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
});
