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
