import oauth2Client from '../services/googleAuth.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

// Генерація URL для авторизації через Google
export const getGoogleAuthUrl = async (req, res, next) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    });

    res.json({ url });
  } catch (error) {
    next(error);
  }
};

// Обробка callback після логіну з Google
export const handleGoogleAuthCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res
        .status(400)
        .json({ message: 'Authorization code is required' });
    }

    // Обмінюємо code на токени
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Отримуємо інформацію про користувача
    const { data: profile } = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    const { email, name, picture } = profile;

    // Перевіряємо чи існує користувач
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        password: uuidv4(), // випадковий пароль
        avatarURL: picture,
        verified: true,
      });
    }

    // Генеруємо токен
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    user.token = token;
    await user.save();

    // Відповідь у форматі JSON (бо фронтенду немає)
    res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        email: user.email,
        name: user.name,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};
