import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  deleteUser,
  getSystemUsers,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import joiValidate from "../middleware/joiValidate.js";
import { loginSchema, registerSchema } from "../validation/authValidation.js";

const router = express.Router();

router.post("/register", joiValidate(registerSchema), registerUser);
router.post("/login", joiValidate(loginSchema), loginUser);
router.get("/get-user", protect, getCurrentUser);
router.delete("/delete-user", protect, deleteUser);
router.get("/users", getSystemUsers);
export default router;
