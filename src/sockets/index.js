import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "../config/redis.js";
import socketAuth from "./socketAuth.js";
import { emitProjectEvent, registerTaskSocketEvents } from "./taskSocket.js";

let ioInstance = null;

export const initializeSocket = async (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  await pubClient.connect();
  await subClient.connect();
  ioInstance.adapter(createAdapter(pubClient, subClient));

  ioInstance.use(socketAuth);

  ioInstance.on("connection", (socket) => {
    registerTaskSocketEvents(ioInstance, socket);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  console.log("Socket.IO initialized successfully");
};

export const getIO = () => ioInstance;

export const emitToProjectRoom = (projectId, eventName, payload) => {
  if (!ioInstance) return;
  emitProjectEvent(ioInstance, projectId, eventName, payload);
};
