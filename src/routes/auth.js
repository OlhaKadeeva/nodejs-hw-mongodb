import express from 'express';
import { registerController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../schemas/userValidation.js';
import { resetPassword } from '../controllers/auth.js';
import { resetPasswordSchema } from '../schemas/resetPasswordSchema.js';
import { login } from '../controllers/auth.js';
import { refresh } from '../controllers/auth.js';
import { logout } from '../controllers/auth.js';
import { sendResetPasswordEmail } from '../controllers/auth.js';
import { resetEmailSchema } from '../schemas/resetEmailSchema.js';

const router = express.Router();

router.post('/login', login);

router.post('/register', validateBody(registerSchema), registerController);

router.post('/refresh', refresh);

router.post('/logout', logout);

router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  sendResetPasswordEmail,
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema), // схема с token и password
  resetPassword,
);

export default router;
