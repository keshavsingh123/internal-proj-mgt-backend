import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
} from "../controller/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import joiValidate from "../middleware/joiValidate.js";
import {
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../validation/taskValidation.js";

const router = express.Router();

router.use(protect);

router.get("/:taskId", getTaskById);
router.put("/:taskId", joiValidate(updateTaskSchema), updateTask);
router.patch(
  "/:taskId/status",
  joiValidate(updateTaskStatusSchema),
  updateTaskStatus,
);
router.delete("/:taskId", deleteTask);

export default router;
