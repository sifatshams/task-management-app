import Task from '../models/task.model.js';
import User from '../models/user.model.js';

// get all users (admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').lean();

    // add task counts to each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: 'Pending',
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: 'In Progress',
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: 'Completed',
        });

        return {
          ...user,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      }),
    );

    // response
    return res.status(200).json({
      success: true,
      users: usersWithTaskCounts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

export const getUserById = (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

export const deleteUser = (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};
