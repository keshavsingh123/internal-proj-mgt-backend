import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controller/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequiredFields from "../middleware/validate.js";
import projectTaskRoutes from "./projectTaskRoute.js";

const router = express.Router();

router.use(protect);
router.use("/:projectId/tasks", projectTaskRoutes);

router
  .route("/")
  .get(getProjects)
  .post(validateRequiredFields(["name"]), createProject);
router
  .route("/:projectId")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;
