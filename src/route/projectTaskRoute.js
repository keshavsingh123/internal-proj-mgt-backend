import express from "express";
import { createTask, getTasksByProject } from "../controller/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequiredFields from "../middleware/validate.js";

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(getTasksByProject)
  .post(validateRequiredFields(["title"]), createTask);

export default router;
