import express from "express";
import {
  createProjectMessage,
  getProjectMessages,
} from "../controller/messageController.js";
import joiValidate from "../middleware/joiValidate.js";
import { createMessageSchema } from "../validation/projectValidation.js";
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getProjectMessages)
  .post(joiValidate(createMessageSchema), createProjectMessage);

export default router;
