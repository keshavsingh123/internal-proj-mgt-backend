import jwt from "jsonwebtoken";
import User from "../model/User.js";

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Socket authentication failed: token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new Error("Socket authentication failed: user not found"));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Socket authentication failed"));
  }
};

export default socketAuth;
