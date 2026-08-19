import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// create an middleware for protect routes
export const protect = async (req, res, next) => {
  let token;

  // get token from cookie or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token!',
    });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user from database
    req.user = await User.findById(decoded.id).select('-password');

    // token is valid but user no longer exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists!',
      });
    }

    // go to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired!',
    });
  }
};
// only access admin
export const adminOnly = async (req, res, next) => {
  try {
    // checking if the user exists
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized!' });
    }

    // admin validatin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only!' });
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
