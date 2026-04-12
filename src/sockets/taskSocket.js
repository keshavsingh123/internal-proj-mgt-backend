import Project from "../model/Project.js";

const getProjectRoomName = (projectId) => `project:${projectId}`;

export const registerTaskSocketEvents = (io, socket) => {
  socket.on("project:join", async ({ projectId }) => {
    if (!projectId || !socket.user?._id) return;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: socket.user._id }, { members: socket.user._id }],
    });

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
};

export const emitProjectEvent = (io, projectId, eventName, payload) => {
  io.to(getProjectRoomName(projectId)).emit(eventName, payload);
};
