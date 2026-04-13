# MERN Practical Backend

This project implements the practical from the provided lab manual:

- JWT authentication
- Password hashing with `bcryptjs`
- Protected product creation route
- Image upload with `multer`
- Mock payment API

## Setup

1. Install dependencies:
   `npm install`
2. Start MongoDB locally.
3. Update `.env` if needed.
4. Run the server:
   `npm start`

## API Flow

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `POST /api/products` with `Authorization: Bearer <token>` and form-data image upload
4. `GET /api/products`
5. `POST /api/payment`
