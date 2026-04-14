import { StatusCodes } from "http-status-codes";
import Message from "../model/message.js";
import Project from "../model/project.js";
import {
  buildPaginationMeta,
  getPaginationOptions,
} from "../utils/pagination.js";

const verifyProjectAccess = async (projectId, userId) => {
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

export const getProjectMessagesService = async (
  projectId,
  userId,
  queryParams,
) => {
  await verifyProjectAccess(projectId, userId);

  const { page, limit, skip } = getPaginationOptions(queryParams);

  const query = {
    project: projectId,
    isDelete: 1,
  };

  const [messages, total] = await Promise.all([
    Message.find(query)
      .populate("sender", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments(query),
  ]);

  return {
    messages: messages.reverse(),
    pagination: buildPaginationMeta({ page, limit, total }),
  };
};

export const createProjectMessageService = async (projectId, text, userId) => {
  await verifyProjectAccess(projectId, userId);

  const message = await Message.create({
    project: projectId,
    sender: userId,
    text: text.trim(),
    isDelete: 1,
  });

  const populatedMessage = await Message.findById(message._id).populate(
    "sender",
    "name email",
  );

  return populatedMessage;
};
