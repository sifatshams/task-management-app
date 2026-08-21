import express from 'express';
import { getUserById, getUsers } from '../controllers/user.controller.js';
import { adminOnly, protect } from '../middlewares/auth.middleware.js';

const userRoute = express.Router();

// user management routes
userRoute.get('/', protect, adminOnly, getUsers); // get users (admin only)
userRoute.get('/:id', protect, getUserById); // get a specific user

export default userRoute;
