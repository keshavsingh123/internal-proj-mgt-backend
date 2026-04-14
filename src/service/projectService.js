import { StatusCodes } from "http-status-codes";
import Project from "../model/project.js";
import User from "../model/user.js";
import pick from "../utils/pick.js";
import {
  buildPaginationMeta,
  getPaginationOptions,
} from "../utils/pagination.js";

export const getProjectsService = async (userId, queryParams) => {
  const filters = pick(queryParams, ["search"]);
  const { page, limit, skip } = getPaginationOptions(queryParams);

  const query = {
    isDelete: 1,
    $or: [{ owner: userId }, { members: userId }],
  };

  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" };
  }

  const [projects, total] = await Promise.all([
    Project.find(query)
      .populate("owner", "name email role isDelete")
      .populate("members", "name email role isDelete")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Project.countDocuments(query),
  ]);

  return {
    projects,
    pagination: buildPaginationMeta({ page, limit, total }),
  };
};

export const getProjectByIdService = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDelete: 1,
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", "name email role isDelete")
    .populate("members", "name email role isDelete");

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
    isDelete: 1,
  });

  return getProjectByIdService(project._id, userId);
};

export const updateProjectService = async (projectId, payload, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
    isDelete: 1,
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
    isDelete: 1,
  });

  if (!project) {
    const error = new Error(
      "Project not found or only the owner can delete it",
    );
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  project.isDelete = 0;
  await project.save();

  return { projectId: project._id };
};

export const getProjectMembersService = async (
  projectId,
  userId,
  queryParams,
) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);

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

  const memberQuery = {
    _id: { $in: project.members },
    isDelete: 1,
  };

  const [members, total] = await Promise.all([
    User.find(memberQuery)
      .select("name email role isDelete createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(memberQuery),
  ]);

  return {
    members,
    pagination: buildPaginationMeta({ page, limit, total }),
  };
};

export const addProjectMemberService = async (projectId, memberId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
    isDelete: 1,
  });

  if (!project) {
    const error = new Error(
      "Project not found or only the owner can add members",
    );
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  const member = await User.findOne({
    _id: memberId,
    isDelete: 1,
  }).select("_id name email role");

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
    isDelete: 1,
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
