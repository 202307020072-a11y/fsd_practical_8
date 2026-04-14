# MERN Practical Project

This repository now contains a complete MERN practical project:

- React frontend in `client/`
- Express and Node.js backend in the root project
- MongoDB database
- JWT authentication
- Product image upload
- Mock payment module

## Folder Structure

- `client/` frontend application
- `models/` Mongoose models
- `routes/` API routes
- `middleware/` backend middleware
- `uploads/` uploaded product images
- `server.js` backend entry point

## Setup

1. Install backend dependencies:
   `npm install`
2. Install frontend dependencies:
   `cd client`
   `npm install`
3. Start MongoDB locally.
4. Use `.env.example` to create your `.env` file if needed.

## Run Commands

- Run backend:
  `npm start`
- Run frontend:
  `npm run client`
- Run both together:
  `npm run fullstack`

## URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Features

1. Register a new user
2. Login and receive JWT token
3. Add a product with image upload
4. View products in the frontend
5. Run a mock payment from the frontend
