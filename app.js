import http from "http";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import express from "express";
// import { initializeSocket } from './src/sockets/index.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);
    // await initializeSocket(server)

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
