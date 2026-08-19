import bcrypt from 'bcryptjs';
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

// ? pre password hashing with bcrypts
userSchema.pre('save', async function () {
  // check if pass is not modified then return...
  if (!this.isModified('password')) return;

  try {
    // generate the salt
    const salt = await bcrypt.genSalt(12);

    // now hash the password
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// ? now compare the password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
