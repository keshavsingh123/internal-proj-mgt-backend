import express from "express";
import { createTask, getTasksByProject } from "../controller/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import joiValidate from "../middleware/joiValidate.js";
import { createTaskSchema } from "../validation/taskValidation.js";

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(getTasksByProject)
  .post(joiValidate(createTaskSchema), createTask);

export default router;
