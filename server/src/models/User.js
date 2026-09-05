import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    targetRole: {
      type: String,
      default: 'Full Stack Engineer',
      trim: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    leetcodeUrl: {
      type: String,
      default: '',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    degree: {
      type: String,
      default: 'B.Tech Computer Science & Engineering',
      trim: true,
    },
    currentYear: {
      type: String,
      default: '3rd Year',
      trim: true,
    },
    currentSemester: {
      type: String,
      default: 'Semester 6',
      trim: true,
    },
    university: {
      type: String,
      default: 'Delhi Technological University (DTU)',
      trim: true,
    },
    isUgcVerified: {
      type: Boolean,
      default: true,
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
