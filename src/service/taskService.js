import { StatusCodes } from "http-status-codes";
import Project from "../model/project.js";
import Task from "../model/task.js";
import { emitToProjectRoom } from "../sockets/index.js";
import pick from "../utils/pick.js";
import {
  buildPaginationMeta,
  getPaginationOptions,
} from "../utils/pagination.js";

const ensureProjectAccess = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDelete: 1,
    $or: [{ owner: userId }, { members: userId }],
  });

  if (!project) {
    const error = new Error("Project not found or access denied");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  return project;
};

const populateTask = async (taskId) => {
  return Task.findOne({
    _id: taskId,
    isDelete: 1,
  })
    .populate("assignee", "name email role isDelete")
    .populate("createdBy", "name email role isDelete");
};

export const getTasksByProjectService = async (
  projectId,
  userId,
  queryParams,
) => {
  await ensureProjectAccess(projectId, userId);

  const filters = pick(queryParams, ["status", "priority", "search"]);
  const { page, limit, skip } = getPaginationOptions(queryParams);

  const query = {
    project: projectId,
    isDelete: 1,
  };

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.search) query.title = { $regex: filters.search, $options: "i" };

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate("assignee", "name email role isDelete")
      .populate("createdBy", "name email role isDelete")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(query),
  ]);

  return {
    tasks,
    pagination: buildPaginationMeta({ page, limit, total }),
  };
};

export const getTaskByIdService = async (taskId, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    isDelete: 1,
  });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  await ensureProjectAccess(task.project, userId);

  return populateTask(task._id);
};

export const createTaskService = async (projectId, payload, userId) => {
  await ensureProjectAccess(projectId, userId);

  const task = await Task.create({
    project: projectId,
    title: payload.title.trim(),
    description: payload.description?.trim() || "",
    status: payload.status || "todo",
    priority: payload.priority || "medium",
    assignee: payload.assignee || null,
    createdBy: userId,
    dueDate: payload.dueDate || null,
    isDelete: 1,
  });

  const populatedTask = await populateTask(task._id);
  emitToProjectRoom(projectId, "task:created", populatedTask);

  return populatedTask;
};

export const updateTaskService = async (taskId, payload, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    isDelete: 1,
  });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  await ensureProjectAccess(task.project, userId);

  if (String(task.createdBy) !== String(userId)) {
    const error = new Error("Only the task creator can update this task");
    error.statusCode = StatusCodes.FORBIDDEN;
    throw error;
  }

  if (payload.title !== undefined) task.title = payload.title.trim();
  if (payload.description !== undefined)
    task.description = payload.description.trim();
  if (payload.priority !== undefined) task.priority = payload.priority;
  if (payload.status !== undefined) task.status = payload.status;
  if (payload.assignee !== undefined) task.assignee = payload.assignee || null;
  if (payload.dueDate !== undefined) task.dueDate = payload.dueDate || null;

  await task.save();

  const populatedTask = await populateTask(task._id);
  emitToProjectRoom(String(task.project), "task:updated", populatedTask);

  return populatedTask;
};

export const updateTaskStatusService = async (taskId, status, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    isDelete: 1,
  });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  await ensureProjectAccess(task.project, userId);

  task.status = status;
  await task.save();

  const populatedTask = await populateTask(task._id);
  emitToProjectRoom(String(task.project), "task:statusChanged", populatedTask);

  return populatedTask;
};

export const deleteTaskService = async (taskId, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    isDelete: 1,
  });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  await ensureProjectAccess(task.project, userId);

  if (String(task.createdBy) !== String(userId)) {
    const error = new Error("Only the task creator can delete this task");
    error.statusCode = StatusCodes.FORBIDDEN;
    throw error;
  }

  task.isDelete = 0;
  await task.save();

  emitToProjectRoom(String(task.project), "task:deleted", { taskId });

  return { taskId };
};
