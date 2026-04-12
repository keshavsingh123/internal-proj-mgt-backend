import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import joiValidate from "../middleware/joiValidate.js";
import { loginSchema, registerSchema } from "../validation/authValidation.js";

const router = express.Router();

router.post("/register", joiValidate(registerSchema), registerUser);
router.post("/login", joiValidate(loginSchema), loginUser);
router.get("/get-user", protect, getCurrentUser);

export default router;
