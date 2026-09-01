import ExcelJS from 'exceljs';
import Task from '../models/task.model.js';
import User from '../models/user.model.js';

// export all task as Excel/pdf (admin only)
export const exportTasksReport = async (req, res) => {
  try {
    // find the task
    const tasks = await Task.find().populate('assignedTo', 'name email').lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks Report');

    worksheet.columns = [
      { header: 'Task ID', key: 'id', width: 25 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Priority', key: 'priority', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Due Date', key: 'dueDate', width: 20 },
      { header: 'Assigned To', key: 'assignedTo', width: 30 },
    ];

    // make the header row standout
    worksheet.getRow(1).font = { bold: true };

    tasks.forEach((task) => {
      const assignedTo = Array.isArray(task.assignedTo)
        ? task.assignedTo
            .map((user) => `${user.name} (${user.email})`)
            .join(', ')
        : '';

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate
          ? task.dueDate.toISOString().split('T')[0]
          : 'N/A', // guards against tasks without a due date
        assignedTo: assignedTo || 'Unassigned',
      });
    });

    const fileName = `tasks_report_${Date.now()}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting tasks!',
      error: error.message,
    });
  }
};

// export users task report (admin only)
export const exportUsersReport = async (req, res) => {
  try {
    // database level aggregation for optimal performance
    const usersReport = await User.aggregate([
      {
        $lookup: {
          from: 'tasks', // mongo collection name for Tasks
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'tasks',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          taskCount: { $size: '$tasks' },
          pendingTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'Pending'] },
              },
            },
          },
          inProgressTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'In Progress'] },
              },
            },
          },
          completedTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'Completed'] },
              },
            },
          },
        },
      },
    ]);

    // validation
    if (!usersReport.length) {
      return res.status(404).json({ message: 'No users found to export' });
    }

    // initialize workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'TaskManager';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('User Task Report', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    // define columns
    worksheet.columns = [
      { header: 'User Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Total Assigned Tasks', key: 'taskCount', width: 22 },
      { header: 'Pending Tasks', key: 'pendingTasks', width: 18 },
      { header: 'In Progress Tasks', key: 'inProgressTasks', width: 20 },
      { header: 'Completed Tasks', key: 'completedTasks', width: 18 },
    ];

    // Header styling & auto filter
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      };
    });
    worksheet.autoFilter = { from: 'A1', to: 'F1' };

    // populate rows & add conditional formatting
    usersReport.forEach((user) => {
      const row = worksheet.addRow(user);

      // Highlight green if user has completed all assigned tasks
      if (user.taskCount > 0 && user.completedTasks === user.taskCount) {
        row.getCell('completedTasks').font = {
          color: { argb: 'FF107C10' },
          bold: true,
        };
      }
    });

    // stream file to client response
    const fileName = `users_report_${Date.now()}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting tasks!',
      error: error.message,
    });
  }
};
