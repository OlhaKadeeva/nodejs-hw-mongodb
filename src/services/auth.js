import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';

//Генерація токенів і терміну дії
const createTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: '30d',
  });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хв

  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ); // 30 днів

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

// Реєстрація нового користувача
export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

//Логін користувача
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Invalid: email or password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createError(401, 'Invalid email or password');

  await Session.deleteOne({ userId: user._id });

  const {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = createTokens(user._id);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

//Оновлення сесії (refresh)
export const refreshSession = async (oldRefreshToken) => {
  if (!oldRefreshToken) throw createError(401, 'No refresh token');

  let payload;
  try {
    payload = jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET);
  } catch {
    throw createError(401, 'Invalid or expired refresh token');
  }

  const session = await Session.findOne({ refreshToken: oldRefreshToken });
  if (!session) throw createError(401, 'Session not found');

  await Session.deleteOne({ _id: session._id });

  const {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = createTokens(payload.userId);

  await Session.create({
    userId: payload.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

//Вихід користувача (logout)
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) throw createError(401, 'No refresh token');
  await Session.deleteOne({ refreshToken });
};
