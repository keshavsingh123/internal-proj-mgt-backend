import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
} from "../controller/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequiredFields from "../middleware/validate.js";

const router = express.Router();

router.use(protect);

router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.patch(
  "/:taskId/status",
  validateRequiredFields(["status"]),
  updateTaskStatus,
);
router.delete("/:taskId", deleteTask);

export default router;
