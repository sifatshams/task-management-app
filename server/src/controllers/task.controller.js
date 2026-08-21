import Task from '../models/task.model.js';

// get all tasks (admin: all, user: only assigned tasks)
export const getTasks = async (req, res) => {
  try {
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
