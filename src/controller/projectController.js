import { StatusCodes } from "http-status-codes";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createProjectService,
  deleteProjectService,
  getProjectByIdService,
  getProjectsService,
  updateProjectService,
  removeProjectMemberService,
  getProjectMembersService,
  addProjectMemberService,
} from "../service/projectService.js";

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await getProjectsService(req.user._id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Projects retrieved successfully",
    projects,
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await getProjectByIdService(
    req.params.projectId,
    req.user._id,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project retrieved successfully",
    project,
  });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await createProjectService(req.body, req.user._id);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Project created successfully",
    project,
  });
});
export const updateProject = asyncHandler(async (req, res) => {
  const project = await updateProjectService(
    req.params.projectId,
    req.body,
    req.user._id,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project updated successfully",
    project,
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const result = await deleteProjectService(req.params.projectId, req.user._id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project deleted successfully",
    ...result,
  });
});
export const getProjectMembers = asyncHandler(async (req, res) => {
  const members = await getProjectMembersService(
    req.params.projectId,
    req.user._id,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    members,
  });
});

export const addProjectMember = asyncHandler(async (req, res) => {
  const project = await addProjectMemberService(
    req.params.projectId,
    req.body.memberId,
    req.user._id,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Member added successfully",
    project,
  });
});

export const removeProjectMember = asyncHandler(async (req, res) => {
  const project = await removeProjectMemberService(
    req.params.projectId,
    req.params.memberId,
    req.user._id,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Member removed successfully",
    project,
  });
});
