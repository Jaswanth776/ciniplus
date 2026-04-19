# Cini Plus - South Indian Movie Ticket Booking System

Full-stack movie booking platform with React frontend, Express backend, and MySQL database.

## Tech Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express.js
- Database: MySQL
- Auth: JWT
- Security: bcrypt password hashing + role-based authorization

## Project Structure

- `client/` React frontend
- `server/` Express backend
  - `controllers/`
  - `routes/`
  - `models/`
  - `middleware/`
  - `config/`

## Setup Instructions

**Deploy the full platform with a single command:**

```bash
docker-compose up -d
```

That's it! 
- The MySQL database will auto-initialize with schemas and demo data.
- The Node.js backend API will start automatically on port 5000.
- The React frontend will start automatically.

Once the containers are running, open your browser and navigate to:
**http://localhost:5173**


## Demo Credentials

- User: `demo.user@example.com` / `demo1234`
- User: `lakshmi.user@example.com` / `demo1234`
- Admin: `admin.user@example.com` / `admin1234`

## Demo Data Included

- Multiple South Indian movies across Telugu, Tamil, Kannada, Malayalam
- Theatres, screens, and generated seat maps
- Food add-ons
- Multiple scheduled shows
- Confirmed bookings for realistic booking history and admin revenue dashboard

## API Endpoints

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`

Movies:
- `GET /api/movies`
- `GET /api/movies/:id`
- `POST /api/movies` (admin)
- `PUT /api/movies/:id` (admin)
- `DELETE /api/movies/:id` (admin)

Shows:
- `GET /api/shows/:movieId`
- `GET /api/shows/seats/:showId`
- `POST /api/shows` (admin)

Bookings:
- `POST /api/bookings`
- `GET /api/bookings/user`

Food:
- `GET /api/food`
- `POST /api/food` (admin)

Admin:
- `GET /api/admin/bookings`
- `GET /api/admin/revenue`

## Security Notes

- Passwords are hashed with bcrypt.
- JWT middleware protects private routes.
- Role-based checks enforce admin-only operations.
- Parameterized MySQL queries prevent SQL injection.
- Input validations implemented in controllers.

## Postman Testing Order

1. Register user/admin
2. Login and capture JWT
3. Add movie (admin token)
4. Create show (admin token)
5. Fetch shows/seats
6. Create booking with seat selection
7. Validate duplicate booking protection
