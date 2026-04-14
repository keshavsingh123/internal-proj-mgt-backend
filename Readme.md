# Internal Project Management System – Backend

Backend for a real-time internal project management system built with **Node.js**, **Express**, **MongoDB**, **JWT Authentication**, **Socket.IO**, **Redis**, and **Joi** validation.

This backend supports:

- user authentication
- project CRUD
- task CRUD
- real-time task updates
- project room-based socket communication
- secure route protection
- scalable socket architecture using Redis adapter

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- Socket.IO
- Redis
- Joi
- Helmet
- CORS
- Morgan

## Features

### Authentication

- Register user
- Login user
- Get current user
- JWT-protected routes

### Projects

- Get all projects for logged-in user
- Get project by ID
- Create project
- Update project
- Delete project

### Tasks

- Get tasks by project
- Get task by ID
- Create task
- Update task
- Update task status
- Delete task

### Real-Time

- Join project room
- Leave project room
- Broadcast task changes in real time

## API

### Auth API

# /api/auth

- POST /register → Register user
- POST /login → Login user
- GET /get-user → Get current logged-in user
- GET /users → Get all registered users (search + pagination)
- DELETE /delete-user → Soft delete current user

### Project API

# /api/projects

- GET / → Get all projects (pagination + search)
- POST / → Create project
- GET /:projectId → Get single project
- PUT /:projectId → Update project (owner only)
- DELETE /:projectId → Soft delete project (owner only)

### Project Member API

# /api/projects

- GET /:projectId/members → Get project members
- POST /:projectId/members → Add member (owner only)
- DELETE /:projectId/members/:memberId → Remove member (owner only)

### Task API

# /api/projects/:projectId/tasks

- GET / → Get all tasks of project
- POST / → Create task
- PUT /update-task/:taskId → Update task (only creator)
- PUT /update-task-status/:taskId → Update task status
- DELETE /delete-task/:taskId → Delete task (only creator)

### Chat Api

# /api/projects/:projectId/messages

- GET / → Get project chat messages
- POST / → Send message (REST fallback)

## Socket Events

### Join project room

- socket.emit("project:join", { projectId })

### Leave project room

- socket.emit("project:leave", { projectId })

### Error

- socket.on("project:error", (data) => {})

### Send Message

socket.emit("chat:send", {
projectId,
text
})

### Receive message (real-time)

- socket.on("chat:new", (message) => {})

### Error

socket.on("chat:error", (data) => {})
