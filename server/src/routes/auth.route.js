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
authRoute.post('/register', registerUser); // register user
authRoute.post('/login', loginUser); // login user
authRoute.get('/profile', protect, getUserProfile); // get user profile
authRoute.put('/profile', protect, updateUserProfile); // update user profile

// image uploads (using cloudinary)
authRoute.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: 'no image file uploaded!' });
  }

  // req.file.path
  const imageUrl = req.file.path;

  return res.status(200).json({
    success: true,
    imageUrl,
  });
});

export default authRoute;
