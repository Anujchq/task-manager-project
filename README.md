# Task Manager - Full Stack Application

A full-stack task management application built using React, Node.js, and Express.

## Features
- Add tasks
- Edit tasks
- Delete tasks
- Toggle completion
- Search tasks
- Filter tasks
- Dark mode
- Task statistics
- Overdue task highlighting

## Tech Stack
Frontend: React, CSS, Axios  
Backend: Node.js, Express

## What Works
- Full CRUD operations for tasks (Create, Read, Update, Delete)
- Task filtering and search
- Task status toggle (active/completed)
- Dark mode feature
- Overdue task highlighting
- Backend API with Express and file-based storage

## What Can Be Improved
- Database can be upgraded from JSON file to MongoDB/PostgreSQL
- Authentication system can be added (login/signup)
- Better UI animations and mobile responsiveness improvements
- Pagination for large task lists

## How to Run Project
### Backend
```bash
cd server
npm install
npm run dev

### Frontend
cd client
npm install
npm run dev

## Known Limitations

- The backend currently uses a JSON file (`tasks.json`) for data storage instead of a database.
- When deployed on free hosting platforms, newly added or updated tasks may occasionally require a page refresh to immediately reflect changes.
- In a production environment, this would be replaced with a database such as MongoDB or PostgreSQL.

## Author
Anuj Chamoli
