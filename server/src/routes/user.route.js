import express from 'express';
import { adminOnly, protect } from '../middlewares/auth.middleware.js';
import { deleteUser, getUserById, getUsers } from '../controllers/user.controller.js';

const userRoute = express.Router();

// user management routes
userRoute.get('/', protect, adminOnly, getUsers); // get users (admin only)
userRoute.get('/:id', protect, getUserById); // get a specific user
userRoute.delete('/:id', protect, adminOnly, deleteUser); // delete user (admin only)

export default userRoute;
