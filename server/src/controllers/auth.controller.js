import User from '../models/user.model.js';

// register user
export const registerUser = async (req, res) => {
  try {
    // destructure data from req body
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;

    // check user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists!' });
    }

    // detarmine user role: admin if correct token is provided, otherwise user
    let role = 'user';
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = 'admin';
    }

    // create new user
    const user = await User.create({
      name,
      email,
      password,
      profileImage,
      role,
    });

    // success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

// login user
export const loginUser = async (req, res) => {};

// * private
// get user profile
export const getUserProfile = async (req, res) => {};

// update user profile
export const updateUserProfile = async (req, res) => {};
