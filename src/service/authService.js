import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import User from "../model/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUserService = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("User already exists with this email");
    error.statusCode = StatusCodes.CONFLICT;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken({ userId: user._id });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const loginUserService = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = StatusCodes.UNAUTHORIZED;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = StatusCodes.UNAUTHORIZED;
    throw error;
  }

  const token = generateToken({ userId: user._id });
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }
  return user;
};
