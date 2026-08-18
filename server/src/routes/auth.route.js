import express from 'express';
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const authRoute = express.Router();

// auth routes
authRoute.post('/register', registerUser); // register user
authRoute.post('/login', loginUser); // login user
authRoute.get('/profile', protect, getUserProfile); // get user profile
authRoute.put('/profile', protect, updateUserProfile); // update user profile

export default authRoute;
