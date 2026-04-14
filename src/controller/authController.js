import { StatusCodes } from "http-status-codes";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getCurrentUserService,
  loginUserService,
  registerUserService,
  softDeleteUserService,
  getSystemUsersService,
} from "../service/authService.js";
import pick from "../utils/pick.js";

export const registerUser = asyncHandler(async (req, res) => {
  const result = await registerUserService(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "User registered successfully",
    ...result,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const result = await loginUserService(req.body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "LogedIn successfully",
    ...result,
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.user._id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User retrieved successfully",
    user,
  });
});
export const getSystemUsers = asyncHandler(async (req, res) => {
  const options = pick(req.query, ["page", "limit", "search", "projectId"]);
  const result = await getSystemUsersService(options);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Users retrieved successfully",
    ...result,
  });
});
export const deleteUser = asyncHandler(async (req, res) => {
  const result = await softDeleteUserService(req.user._id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User deleted successfully",
    ...result,
  });
});
