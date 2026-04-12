import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequiredFields from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  validateRequiredFields(["name", "email", "password"]),
  registerUser,
);
router.post("/login", validateRequiredFields(["email", "password"]), loginUser);
router.get("/me", protect, getCurrentUser);

export default router;
