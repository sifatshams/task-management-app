import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// create an middleware for protect routes
export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.statsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; // extract token
  }

  // if token not found
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, user not found!' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    // if the token is correct but that user is deleted from database
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: 'User no longer exists!' });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Token is invalid or expired!' });
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
