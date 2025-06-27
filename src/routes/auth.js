import express from 'express';
import { registerController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../schemas/userValidation.js';
import { login } from '../controllers/auth.js';
import { refresh } from '../controllers/auth.js';
import { logout } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);

router.post('/register', validateBody(registerSchema), registerController);

router.post('/refresh', refresh);

router.post('/logout', logout);

export default router;
