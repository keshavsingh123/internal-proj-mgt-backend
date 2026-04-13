import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  getTasksByProject,
} from "../controller/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import joiValidate from "../middleware/joiValidate.js";
import {
  updateTaskSchema,
  updateTaskStatusSchema,
  createTaskSchema,
} from "../validation/taskValidation.js";

const router = express.Router();

router.use(protect);
router
  .route("/:projectId")
  .get(getTasksByProject)
  .post(joiValidate(createTaskSchema), createTask);
router.get("/get-task/:taskId", getTaskById);
router.put("/update-task/:taskId", joiValidate(updateTaskSchema), updateTask);
router.put(
  "/update-task-status/:taskId",
  joiValidate(updateTaskStatusSchema),
  updateTaskStatus,
);
router.delete("/delete-task/:taskId", deleteTask);

export default router;
