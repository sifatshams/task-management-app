import express from 'express';
import { adminOnly, protect } from '../middlewares/auth.middleware.js';
import { deleteUser, getUserById, getUsers } from '../controllers/user.controller.js';

const userRoute = express.Router();

// user management routes
userRoute.get('/', protect, adminOnly, getUsers); // get users (admin only)
userRoute.get('/:id', protect, getUserById); // get a specific user

export default userRoute;
