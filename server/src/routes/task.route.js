import express from 'express';
import {
  createTask,
  deleteTask,
  getDashboardData,
  getTaskById,
  getTasks,
  getUserDashboardData,
  updateTask,
  updateTaskChecklist,
  updateTaskStatus,
} from '../controllers/task.controller.js';
import { adminOnly, protect } from '../middlewares/auth.middleware.js';

const taskRoute = express.Router();

// task management routes
taskRoute.get('/dashboard-data', protect, getDashboardData);
taskRoute.get('/user-dashboard-data', protect, getUserDashboardData);
taskRoute.get('/', protect, getTasks); // get all users (admin: all, user: assigned)
taskRoute.get('/:id', protect, getTaskById); // get task by id
taskRoute.post('/', protect, adminOnly, createTask); // create a task (admin only)
taskRoute.put('/:id', protect, updateTask); // update task details
taskRoute.delete('/:id', protect, adminOnly, deleteTask); // delete a task (admin only)
taskRoute.put('/:id/status', protect, updateTaskStatus); // update task status
taskRoute.put('/:id/todo', protect, updateTaskChecklist); // update task checklist

export default taskRoute;
