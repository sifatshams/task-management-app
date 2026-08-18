import mongoose from 'mongoose';

// create user schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    profileImage: { type: String, default: null },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true, versionKey: false },
);

const User = mongoose.model('User', userSchema);
export default User;
