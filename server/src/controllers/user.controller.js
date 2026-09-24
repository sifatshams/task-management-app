import Task from '../models/task.model.js';
import User from '../models/user.model.js';

// get all users including admins with task counts
export const getUsers = async (req, res) => {
  try {
    // fetch all users without role restrictions
    const users = await User.find().select('-password').lean();

    // attach task counts concurrently
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const [pendingTasks, inProgressTasks, completedTasks] =
          await Promise.all([
            Task.countDocuments({ assignedTo: user._id, status: 'Pending' }),
            Task.countDocuments({
              assignedTo: user._id,
              status: 'In Progress',
            }),
            Task.countDocuments({ assignedTo: user._id, status: 'Completed' }),
          ]);

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

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found!' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};
