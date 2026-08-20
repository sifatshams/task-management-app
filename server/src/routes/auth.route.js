import express from 'express';
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const authRoute = express.Router();

// auth routes
authRoute.post('/register', registerUser); // register user
authRoute.post('/login', loginUser); // login user
authRoute.get('/profile', protect, getUserProfile); // get user profile
authRoute.put('/profile', protect, updateUserProfile); // update user profile

// image uploads
authRoute.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: 'No img file uploaded!' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

export default authRoute;
