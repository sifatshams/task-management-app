import Task from '../models/task.model.js';

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};
