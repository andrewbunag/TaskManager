
# Intern Miniproject: Build a Full-Stack Application

Welcome to your first miniproject! 🎉 This is a fun and educational challenge designed to help you get acclimated to working with a .NET backend and a React frontend. You'll be building a simple "Task Manager" application where users can create, read, update, and delete tasks.

## Project Overview

### Backend
- **Framework**: .NET 8.0
- **Purpose**: Provide a REST API for managing tasks.
- **Endpoints**:
  - `GET /tasks`: Retrieve all tasks.
  - `POST /tasks`: Create a new task.
  - `PUT /tasks/{id}`: Update an existing task.
  - `DELETE /tasks/{id}`: Delete a task.

### Frontend
- **Framework**: React
- **Purpose**: Provide a user interface to interact with the backend.
- **Features**:
  - Display a list of tasks.
  - Add new tasks.
  - Edit existing tasks.
  - Delete tasks.

## Requirements

### Backend
1. Implement the REST API using .NET 8.0.
2. Write unit tests for each endpoint using xUnit.
3. Include validation logic for task data (e.g., title cannot be empty).

### Frontend
1. Build the UI using React.
2. Use Axios or Fetch API to interact with the backend.
3. Write unit tests for React components using Jest and React Testing Library.

### Validation Tests
- Example unit tests will be provided for both the backend and frontend. Compare your tests to these examples to ensure correctness.

## Fun Prompt 🎯
Imagine you're building this app for a team of astronauts managing tasks on a space station. Each task is critical to their survival, so your app must be reliable and easy to use. 🚀

## Deliverables
1. A working backend and frontend.
2. Unit tests for both backend and frontend.
3. A short write-up explaining your approach and any challenges you faced.

## Getting Started

### Backend
1. Navigate to the `backend` folder.
2. Run `dotnet new webapi` to create a new .NET project.
3. Implement the endpoints and unit tests.

### Frontend
1. Navigate to the `frontend` folder.
2. Run `npx create-react-app task-manager` to create a new React project.
3. Build the UI and write unit tests.

### Validation Tests
- Check the `validation-tests` folder for example tests.

Good luck, and have fun! 🎉
