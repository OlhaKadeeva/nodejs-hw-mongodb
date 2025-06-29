import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return next(createError(401, 'Unauthorized'));
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(createError(401, 'Access token expired'));
      }
      return next(createError(401, 'Invalid token'));
    }
    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createError(401, 'Session not found');
    }

    const user = await User.findOne(payload.userId);
    if (!user) throw createError(401, 'User not found');

    req.user = user;
    req.session = session;

    next();
  } catch (err) {
    next(err);
  }
};
