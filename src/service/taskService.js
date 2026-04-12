import { StatusCodes } from "http-status-codes";
import Project from "../model/Project.js";
import Task from "../model/Task.js";
import { emitToProjectRoom } from "../sockets/index.js";

const ensureProjectAccess = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
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
  return Task.findById(taskId).populate("assignee", "name email");
};
export const getTasksByProjectService = async (projectId, userId) => {
  await ensureProjectAccess(projectId, userId);

  const tasks = await Task.find({ project: projectId })
    .populate("assignee", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return tasks;
};

export const getTaskByIdService = async (taskId, userId) => {
  const task = await Task.findById(taskId);
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
  });
  const populatedTask = await populateTask(task._id);
  emitToProjectRoom(projectId, "task:created", populatedTask);

  return populatedTask;
};

export const updateTaskService = async (taskId, payload, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  await ensureProjectAccess(task.project, userId);

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
  const task = await Task.findById(taskId);
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
  const task = await Task.findById(taskId);
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }
  await ensureProjectAccess(task.project, userId);

  const projectId = String(task.project);
  await task.deleteOne();

  emitToProjectRoom(projectId, "task:deleted", { taskId });

  return { taskId };
};
