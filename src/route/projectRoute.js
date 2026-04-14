import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
  addProjectMember,
  removeProjectMember,
  getProjectMembers,
} from "../controller/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import joiValidate from "../middleware/joiValidate.js";
import {
  createProjectSchema,
  updateProjectSchema,
  addProjectMemberSchema,
} from "../validation/projectValidation.js";
import projectTaskRoutes from "./projectTaskRoute.js";
import projectMessageRoutes from "./messageRoute.js";
const router = express.Router();

router.use(protect);
router.use("/:projectId/tasks", projectTaskRoutes);
router.use("/:projectId/messages", projectMessageRoutes);

router
  .route("/")
  .get(getProjects)
  .post(joiValidate(createProjectSchema), createProject);

router
  .route("/:projectId")
  .get(getProjectById)
  .put(joiValidate(updateProjectSchema), updateProject)
  .delete(deleteProject);

router
  .route("/:projectId/members")
  .get(getProjectMembers)
  .post(joiValidate(addProjectMemberSchema), addProjectMember);

router.route("/:projectId/members/:memberId").delete(removeProjectMember);

export default router;
