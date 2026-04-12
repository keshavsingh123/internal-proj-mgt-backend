import { StatusCodes } from "http-status-codes";
import Project from "../model/Project.js";

export const getProjectsService = async (userId) => {
  const projects = await Project.find({
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", "name email")
    .populate("members", "name email")
    .sort({ createdAt: -1 });

  return projects;
};

export const getProjectByIdService = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", "name email")
    .populate("members", "name email");

  if (!project) {
    const error = new Error("Project not found or access denied");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  return project;
};

export const createProjectService = async ({ name, description }, userId) => {
  const project = await Project.create({
    name: name.trim(),
    description: description?.trim() || "",
    owner: userId,
    members: [userId],
  });

  return getProjectByIdService(project._id, userId);
};

export const updateProjectService = async (projectId, payload, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
  });
  if (!project) {
    const error = new Error(
      "Project not found or only the owner can update it",
    );
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  if (payload.name !== undefined) project.name = payload.name.trim();
  if (payload.description !== undefined)
    project.description = payload.description.trim();
  if (payload.status !== undefined) project.status = payload.status;

  await project.save();

  return getProjectByIdService(project._id, userId);
};

export const deleteProjectService = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
  });
  if (!project) {
    const error = new Error(
      "Project not found or only the owner can delete it",
    );
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  await project.deleteOne();

  return { projectId };
};
