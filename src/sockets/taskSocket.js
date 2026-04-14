import Project from "../model/project.js";
import { createProjectMessageService } from "../service/messageService.js";

const getProjectRoomName = (projectId) => `project:${projectId}`;

const verifyProjectAccess = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    isDelete: 1,
    $or: [{ owner: userId }, { members: userId }],
  });

  return project;
};

export const registerTaskSocketEvents = (io, socket) => {
  socket.on("project:join", async ({ projectId }) => {
    if (!projectId || !socket.user?._id) return;

    const project = await verifyProjectAccess(projectId, socket.user._id);

    if (!project) {
      socket.emit("project:error", {
        message: "Project not found or access denied",
      });
      return;
    }

    socket.join(getProjectRoomName(projectId));
  });

  socket.on("project:leave", ({ projectId }) => {
    if (!projectId) return;
    socket.leave(getProjectRoomName(projectId));
  });

  socket.on("chat:send", async ({ projectId, text }) => {
    try {
      if (!projectId || !text?.trim() || !socket.user?._id) return;

      const project = await verifyProjectAccess(projectId, socket.user._id);

      if (!project) {
        socket.emit("project:error", {
          message: "Project not found or access denied",
        });
        return;
      }

      const message = await createProjectMessageService(
        projectId,
        text,
        socket.user._id,
      );

      io.to(getProjectRoomName(projectId)).emit("chat:new", message);
    } catch (error) {
      socket.emit("chat:error", {
        message: error.message || "Unable to send message",
      });
    }
  });
};

export const emitProjectEvent = (io, projectId, eventName, payload) => {
  io.to(getProjectRoomName(projectId)).emit(eventName, payload);
};
