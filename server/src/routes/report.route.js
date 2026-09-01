import express from 'express';
import {
  exportTasksReport,
  exportUsersReport,
} from '../controllers/report.controller.js';
import { adminOnly, protect } from '../middlewares/auth.middleware.js';

const reportRoute = express.Router();

reportRoute.get('/export/tasks', protect, adminOnly, exportTasksReport); // export all task as Excel/pdf
reportRoute.get('/export/users', protect, adminOnly, exportUsersReport); // export users task report

export default reportRoute;
