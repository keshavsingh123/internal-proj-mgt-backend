const getProjectRoomName = (projectId) => `project:${projectId}`;

export const registerTaskSocketEvents = (io, socket) => {
  socket.on("project:join", ({ projectId }) => {
    if (!projectId) return;
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
