import { StatusCodes } from "http-status-codes";

const sendValidationError = (res, message) => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message,
  });
};

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return sendValidationError(res, "Name is required");
  }

  if (!email || !email.trim()) {
    return sendValidationError(res, "Email is required");
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email.trim())) {
    return sendValidationError(res, "Please provide a valid email address");
  }

  if (!password || password.length < 6) {
    return sendValidationError(
      res,
      "Password must be at least 6 characters long",
    );
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return sendValidationError(res, "Email is required");
  }

  if (!password) {
    return sendValidationError(res, "Password is required");
  }

  next();
};

export const validateProjectCreate = (req, res, next) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return sendValidationError(res, "Project name is required");
  }

  next();
};

export const validateTaskCreate = (req, res, next) => {
  const { title, status, priority } = req.body;

  if (!title || !title.trim()) {
    return sendValidationError(res, "Task title is required");
  }

  const allowedStatuses = ["todo", "in_progress", "done"];
  const allowedPriorities = ["low", "medium", "high"];

  if (status && !allowedStatuses.includes(status)) {
    return sendValidationError(res, "Invalid task status");
  }

  if (priority && !allowedPriorities.includes(priority)) {
    return sendValidationError(res, "Invalid task priority");
  }

  next();
};

export const validateTaskStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = ["todo", "in_progress", "done"];

  if (!status) {
    return sendValidationError(res, "Status is required");
  }

  if (!allowedStatuses.includes(status)) {
    return sendValidationError(res, "Invalid task status");
  }

  next();
};
