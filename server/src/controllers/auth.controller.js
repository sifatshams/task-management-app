import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.util.js';

// register user
export const registerUser = async (req, res) => {
  try {
    // destructure data from req body
    const { name, email, password, profileImage, adminInviteToken } = req.body;

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

    // generate jwt token
    const token = generateToken(user._id);

    // success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token,
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
export const loginUser = async (req, res) => {
  try {
    // get email and password from request body
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });

    // check user exists and password is correct
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials!',
      });
    }

    // generate jwt token
    const token = generateToken(user._id);

    // success response
    res.status(200).json({
      success: true,
      message: 'User logged in successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token,
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

// * private
// get user profile
export const getUserProfile = async (req, res) => {
  try {
    // find user
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found!' });
    }

    // success response
    res.json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      error: error.message,
    });
  }
};

// update user profile
export const updateUserProfile = async (req, res) => {};
