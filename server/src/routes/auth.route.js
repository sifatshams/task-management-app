import express from 'express';

const authRoute = express.Router();

// auth routes
authRoute.post('/register', registerUser); // register user
authRoute.post('/login', loginUser); // login user
authRoute.get('/profile', protect, getUserProfile); // get user profile
authRoute.put('/profile', protect, updateUserProfile); // update user profile

export default authRoute;
