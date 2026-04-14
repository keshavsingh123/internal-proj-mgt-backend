import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../model/user.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.userId,
      isDelete: 1,
    }).select("-password");

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User not found or deleted",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
