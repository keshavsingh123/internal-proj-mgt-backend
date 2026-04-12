import { StatusCodes } from "http-status-codes";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getCurrentUserService,
  loginUserService,
  registerUserService,
} from "../service/authService.js";

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
    message: "Login successful",
    ...result,
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.user._id);

  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
});
