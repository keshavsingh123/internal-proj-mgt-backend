import { StatusCodes } from "http-status-codes";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createTaskService,
  deleteTaskService,
  getTaskByIdService,
  getTasksByProjectService,
  updateTaskService,
  updateTaskStatusService,
} from "../service/taskService.js";

export const getTasksByProject = asyncHandler(async (req, res) => {
  const tasks = await getTasksByProjectService(
    req.params.projectId,
    req.user._id,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    tasks,
  });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await getTaskByIdService(req.params.taskId, req.user._id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Task retrieved successfully",

    task,
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await createTaskService(
    req.params.projectId,
    req.body,
    req.user._id,
  );

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await updateTaskService(
    req.params.taskId,
    req.body,
    req.user._id,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Task updated successfully",
    task,
  });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await updateTaskStatusService(
    req.params.taskId,
    req.body.status,
    req.user._id,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Task status updated successfully",
    task,
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const result = await deleteTaskService(req.params.taskId, req.user._id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Task deleted successfully",
    ...result,
  });
});
