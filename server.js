import "./src/config/env.js";
import http from "http";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import { initializeSocket } from "./src/sockets/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);
    await initializeSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
