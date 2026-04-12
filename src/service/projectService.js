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
export const getProjectMembersService = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { members: userId }],
  }).populate("members", "name email role");

  if (!project) {
    const error = new Error("Project not found or access denied");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  return project.members;
};

export const addProjectMemberService = async (projectId, memberId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
  });

  if (!project) {
    const error = new Error(
      "Project not found or only the owner can add members",
    );
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  const member = await User.findById(memberId).select("_id name email role");
  if (!member) {
    const error = new Error("Member user not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  if (String(project.owner) === String(memberId)) {
    const error = new Error("Project owner is already part of the project");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

  const alreadyMember = project.members.some(
    (existingMemberId) => String(existingMemberId) === String(memberId),
  );

  if (alreadyMember) {
    const error = new Error("User is already a project member");
    error.statusCode = StatusCodes.CONFLICT;
    throw error;
  }

  project.members.push(memberId);
  await project.save();

  return getProjectByIdService(projectId, userId);
};

export const removeProjectMemberService = async (
  projectId,
  memberId,
  userId,
) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
  });

  if (!project) {
    const error = new Error(
      "Project not found or only the owner can remove members",
    );
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  if (String(project.owner) === String(memberId)) {
    const error = new Error("Project owner cannot be removed from members");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

  const memberExists = project.members.some(
    (existingMemberId) => String(existingMemberId) === String(memberId),
  );

  if (!memberExists) {
    const error = new Error("User is not a member of this project");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  project.members = project.members.filter(
    (existingMemberId) => String(existingMemberId) !== String(memberId),
  );

  await project.save();

  return getProjectByIdService(projectId, userId);
};
