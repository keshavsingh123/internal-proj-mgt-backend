import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import User from "../model/user.js";
import generateToken from "../utils/generateToken.js";
import pick from "../utils/pick.js";
import {
  buildPaginationMeta,
  getPaginationOptions,
} from "../utils/pagination.js";
export const registerUserService = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });

  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingUser && existingUser.isDelete === 1) {
    const error = new Error("User already exists with this email");
    error.statusCode = StatusCodes.CONFLICT;
    throw error;
  }

  let user;

  if (existingUser && existingUser.isDelete === 0) {
    existingUser.name = name.trim();
    existingUser.password = hashedPassword;
    existingUser.isDelete = 1;
    await existingUser.save();
    user = existingUser;
  } else {
    user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isDelete: 1,
    });
  }

  const token = generateToken({ userId: user._id });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isDelete: user.isDelete,
    },
    token,
  };
};

export const loginUserService = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
    isDelete: 1,
  });

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
      isDelete: user.isDelete,
    },
    token,
  };
};

export const getCurrentUserService = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    isDelete: 1,
  }).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  return user;
};
export const getSystemUsersService = async (queryParams) => {
  const filters = pick(queryParams, ["search", "projectId"]);
  const { page, limit, skip } = getPaginationOptions(queryParams);

  const query = {
    isDelete: 1,
  };

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("_id name email role isDelete createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: buildPaginationMeta({ page, limit, total }),
  };
};

export const softDeleteUserService = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    isDelete: 1,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  user.isDelete = 0;
  await user.save();

  return { userId: user._id };
};
