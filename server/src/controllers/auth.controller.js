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
        .json({ success: false, message: 'user already exists!' });
    }

    // determine user role: admin if correct token is provided, otherwise user
    let role = 'user';
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = 'admin';
    }

    // get cloudinary image url if uploaded via multer, otherwise use body string
    const finalProfileImage = req.file ? req.file.path : profileImage || '';

    // create new user
    const user = await User.create({
      name,
      email,
      password,
      profileImage: finalProfileImage,
      role,
    });

    // generate jwt token
    const token = generateToken(user._id);

    // success response
    res.status(201).json({
      success: true,
      message: 'user registered successfully!',
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
      message: 'internal server error!',
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
        message: 'invalid credentials!',
      });
    }

    // generate jwt token
    const token = generateToken(user._id);

    // success response
    res.status(200).json({
      success: true,
      message: 'user logged in successfully!',
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
      message: 'internal server error!',
      error: error.message,
    });
  }
};

// get user profile
export const getUserProfile = async (req, res) => {
  try {
    // find user by token payload id
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'user not found!' });
    }

    // success response
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'internal server error!',
      error: error.message,
    });
  }
};

// update user profile
export const updateUserProfile = async (req, res) => {
  try {
    // find user by id from auth middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'user not found!',
      });
    }

    // destructure properties from request body
    const { name, email, password, profileImage } = req.body;

    // update name
    if (name !== undefined) {
      user.name = name;
    }

    // update email if unique
    if (email !== undefined && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'email already exists!',
        });
      }
      user.email = email;
    }

    // update password
    if (password) {
      user.password = password;
    }

    // update profile image via cloudinary file upload or body string
    if (req.file) {
      user.profileImage = req.file.path;
    } else if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    // save updated user to database
    const updatedUser = await user.save();

    // success response
    res.status(200).json({
      success: true,
      message: 'profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'internal server error!',
      error: error.message,
    });
  }
};
