import Task from '../models/task.model.js';

// get all tasks (admin: all, user: only assigned tasks)
export const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const isAdmin = req.user.role === 'admin';

    // base query setup
    const filter = {};
    if (status) filter.status = status;
    if (!isAdmin) filter.assignedTo = req.user._id;

    // Fetch tasks with lean() for faster execution
    const rawTasks = await Task.find(filter)
      .populate('assignedTo', 'name email profileImage')
      .sort({ createdAt: -1 })
      .lean();

    // map through plain JS objects to compute completed checklist count
    const tasks = rawTasks.map((task) => {
      const completedTodoCount = task.todoCheckList
        ? task.todoCheckList.filter((item) => item.completed).length
        : 0;

      return {
        ...task,
        completedTodoCount,
      };
    });

    // summary query base filter
    const summaryFilter = isAdmin ? {} : { assignedTo: req.user._id };

    // single aggregation query for all status counts
    const statusCounts = await Task.aggregate([
      { $match: summaryFilter },
      {
        $group: {
          _id: null,
          all: { $sum: 1 },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] },
          },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
          },
        },
      },
    ]);

    // fallback counts if database is empty
    const statusSummary = statusCounts[0] || {
      all: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
    };
    delete statusSummary._id;

    // success response
    res.status(200).json({
      success: true,
      tasks,
      statusSummary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

// get task by id
export const getTaskById = async (req, res) => {
  try {
    // destructure the id
    const { id } = req.params;

    const task = await Task.findById(id).populate(
      'assignedTo',
      'name email profileImage',
    );
    // validation
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: 'Task not found!' });
    }

    // success responsse
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

// create a new task (admin only)
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy,
      attachments,
      todoCheckList,
    } = req.body;

    // validation
    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: 'assignedTo must be an array of user IDs!',
      });
    }

    // create task
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todoCheckList,
    });

    // success response
    res
      .status(200)
      .json({ success: true, message: 'Task created successfully!', task });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

// update task details
export const updateTask = async (req, res) => {
  try {
    // destructure the id
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      dueDate,
      todoCheckList,
      attachments,
      assignedTo,
    } = req.body;

    const task = await Task.findById(id).populate(
      'assignedTo',
      'name email profileImage',
    );
    // validation
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: 'Task not found!' });
    }

    // update only provided fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (todoCheckList !== undefined) task.todoCheckList = todoCheckList;
    if (attachments !== undefined) task.attachments = attachments;

    // validate assignedTo
    if (assignedTo !== undefined) {
      if (!Array.isArray(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: 'assignedTo must be an array of user IDs',
        });
      }
      task.assignedTo = assignedTo;
    }

    // save update task on db
    const updatedTask = await task.save();

    // success response
    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

// delete task
export const deleteTask = async (req, res) => {
  try {
    // destructure the id
    const { id } = req.params;

    const task = await Task.findById(id);
    // validation
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: 'Task not found!' });
    }

    // delete task
    await task.deleteOne();

    // success response
    res
      .status(200)
      .json({ success: false, message: 'Task deleted successfully!' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

// update task status
export const updateTaskStatus = async (req, res) => {
  try {
    // destructure the id
    const { id } = req.params;

    const task = await Task.findById(id);
    // validation
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: 'Task not found!' });
    }

    // check is assigned
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString(),
    );

    // validation check again
    if (!isAssigned && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized!' });
    }

    // update task
    task.status = req.body.status || task.status;

    // is status completed or not
    if (task.status === 'Completed') {
      task.todoCheckList.forEach((item) => (item.completed = true));
      task.progress = 100;
    } else if (task.status === 'Pending') {
      task.progress = 0;
    }

    // save on db
    await task.save();

    // success response
    res
      .status(200)
      .json({ success: true, message: 'Task status updated!', task });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

// update task cehcklist
export const updateTaskChecklist = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

// Dashboard data (admin only)
export const getDashboardData = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

// Dashboard data (user specific)
export const getUserDashboardData = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};
