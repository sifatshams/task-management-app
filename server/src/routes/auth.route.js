import express from 'express';
import { upload } from '../config/cloudinary.js';
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const authRoute = express.Router();

// auth routes
authRoute.post('/register', upload.single('image'), registerUser); // register user with avatar upload
authRoute.post('/login', loginUser); // login user
authRoute.get('/profile', protect, getUserProfile); // get user profile
authRoute.put('/profile', protect, upload.single('image'), updateUserProfile); // update user profile with image upload

// standalone image upload route
authRoute.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: 'no image file uploaded!' });
  }

  // req.file.path contains cloudinary secure url
  const imageUrl = req.file.path;

  return res.status(200).json({
    success: true,
    imageUrl,
  });
});

export default authRoute;
