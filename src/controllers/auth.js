import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { sendResetEmail } from '../services/emailService.js';

// Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { accessToken, refreshToken } = await loginUser({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 днів
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh session
export const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({
        status: 401,
        message: 'No refresh token provided',
      });
    }

    const { accessToken, refreshToken } = await refreshSession(oldRefreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// Register
export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered an user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(201).end();
    }

    await logoutUser(refreshToken);

    res.clearCookie('refreshToken'); // Видаляємо cookie

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// Send reset password email
export const sendResetPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found!');

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    try {
      await sendResetEmail(user.email, token, user.name);
    } catch {
      throw createError(
        500,
        'Failed to send the email, please try again later.',
      );
    }

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) throw createError(404, 'User not found!');

    user.password = await bcrypt.hash(password, 10);

    if (!password) {
      throw createError(400, 'Password is required.');
    }
    await user.save();

    //  видалити всі сесії
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
