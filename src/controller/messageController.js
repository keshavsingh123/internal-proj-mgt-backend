import { StatusCodes } from "http-status-codes";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createProjectMessageService,
  getProjectMessagesService,
} from "../service/messageService.js";
import pick from "../utils/pick.js";

export const getProjectMessages = asyncHandler(async (req, res) => {
  const options = pick(req.query, ["page", "limit"]);
  const result = await getProjectMessagesService(
    req.params.projectId,
    req.user._id,
    options,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Messages retrieved successfully",
    ...result,
  });
});

export const createProjectMessage = asyncHandler(async (req, res) => {
  const message = await createProjectMessageService(
    req.params.projectId,
    req.body.text,
    req.user._id,
  );

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Message sent successfully",
    chatMessage: message,
  });
});
