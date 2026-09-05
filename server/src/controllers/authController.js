import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/env.js';

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  targetRole: user.targetRole,
  profileImage: user.profileImage,
  leetcodeUrl: user.leetcodeUrl || '',
  githubUrl: user.githubUrl || '',
  degree: user.degree || 'B.Tech Computer Science & Engineering',
  currentYear: user.currentYear || '3rd Year',
  currentSemester: user.currentSemester || 'Semester 6',
  university: user.university || 'Delhi Technological University (DTU)',
  isUgcVerified: user.isUgcVerified ?? true,
  createdAt: user.createdAt,
});

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400);
      throw new Error('An account with this email address already exists.');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      targetRole: targetRole || 'Full Stack Engineer',
      profileImage: null,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password.');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileImage = async (req, res, next) => {
  try {
    const { profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User account not found.');
    }

    user.profileImage = profileImage || null;
    await user.save();

    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate academic and developer profile info
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const {
      leetcodeUrl,
      githubUrl,
      degree,
      currentYear,
      currentSemester,
      university,
      isUgcVerified,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User account not found.');
    }

    if (leetcodeUrl !== undefined) user.leetcodeUrl = leetcodeUrl.trim();
    if (githubUrl !== undefined) user.githubUrl = githubUrl.trim();
    if (degree !== undefined) user.degree = degree.trim();
    if (currentYear !== undefined) user.currentYear = currentYear.trim();
    if (currentSemester !== undefined) user.currentSemester = currentSemester.trim();
    if (university !== undefined) user.university = university.trim();
    if (isUgcVerified !== undefined) user.isUgcVerified = Boolean(isUgcVerified);

    await user.save();

    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide your registered email address.');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(404);
      throw new Error('No user account found with this email address.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpire = otpExpire;
    await user.save();

    console.log(`[EMAIL OTP PROCTOR] Password Reset OTP for ${user.email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: `6-digit OTP generated and sent to ${user.email}. Expires in 10 minutes.`,
      otp,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400);
      throw new Error('Please provide email, 6-digit OTP, and new password.');
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetOtp: otp.toString(),
      resetOtpExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired OTP verification code.');
    }

    user.passwordHash = newPassword;
    user.resetOtp = null;
    user.resetOtpExpire = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
