# ReserveEase

ReserveEase is a premium restaurant reservation management system designed to streamline guest booking operations and seating allocation. The application features user-friendly booking workflows for dining guests and a comprehensive management console for restaurant administrators.

## Features

### Customer Features
- **Register and Login**: Guest profile creation and secure portal entry.
- **JWT Authentication**: Secure sessions with automatic storage recovery.
- **Book a table**: Form request interface specifying party size, date, and meal period slot.
- **Automatic table allocation**: Algorithmic seating assignments mapped against active table capacities.
- **View reservations**: Guest portal to review upcoming and historical reservation lists.
- **Cancel reservations**: Self-service cancellation policies for upcoming reservations.

### Admin Features
- **Manage reservations**: Full control panel view of all system reservations.
- **Update reservations**: Adjust booking dates, time slots, and guest counts.
- **Cancel reservations**: Destructive override to cancel reservation listings.
- **Manage restaurant tables**: Build, edit, or disable restaurant dining tables and seating capacities.
- **View reservations by date**: Operations overview filtered by daily service dates.
- **Pagination**: Scalable table list loading.

## Tech Stack

### Frontend
| Technology | Key Usage / Libraries |
| :--- | :--- |
| **React** | Application view library (v19) |
| **TypeScript** | Static typing safety |
| **Vite** | Build tool & Development server |
| **Tailwind CSS** | Premium theme styles & layouts |
| **Zustand** | Lightweight client state stores |
| **Axios** | Interceptor-driven HTTP requests |
| **React Hook Form** | Declarative form validations |

### Backend
| Technology | Key Usage / Libraries |
| :--- | :--- |
| **Node.js** | Server environment |
| **Express** | API routing & controllers framework |
| **TypeScript** | Type-safe server schemas |
| **MongoDB Atlas** | NoSQL cloud database instance |
| **Mongoose** | Schema validation and data modeling |
| **JWT** | Stateless authorization tokens |
| **bcrypt** | Hashed password encryption |
| **Express Validator** | Payload schema validations |

## Project Structure

```
ReserveEase/
├── frontend/
├── backend/
└── README.md
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `/backend` folder using the variables described in the **Environment Variables** section.
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `/frontend` folder using the variables described in the **Environment Variables** section.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend Configuration (`/backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Local network port for Express backend server | `5000` |
| `MONGODB_URI` | MongoDB instance connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT hashing | `your-jwt-secret-here` |

### Frontend Configuration (`/frontend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend server URL endpoint | `http://localhost:5000` |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new guest user profile
- `POST /api/auth/login` - Authenticate credentials and retrieve session token
- `GET /api/auth/me` - Fetch authenticated user profile details

### Reservations
- `POST /api/reservations` - Create a table reservation request
- `GET /api/reservations/my` - Fetch all reservations for the logged-in guest
- `DELETE /api/reservations/:id` - Cancel an upcoming reservation

### Admin
- `GET /api/admin/reservations` - Retrieve all bookings (paginated list)
- `GET /api/admin/reservations/date/:date` - View reservation logs by date
- `PATCH /api/admin/reservations/:id` - Modify reservation details (date, slot, count)
- `DELETE /api/admin/reservations/:id` - Cancel reservation entry

### Tables
- `GET /api/tables` - Fetch all configured dining tables
- `POST /api/tables` - Configure a new dining table asset
- `PATCH /api/tables/:id` - Update table capacity or enabled status
- `DELETE /api/tables/:id` - Delete a dining table configuration

## Screenshots

*Note: Screenshots can be added to this section later once local deployment captures are complete.*

### Login

### Customer Dashboard

### Reservations

### Admin Dashboard

### Admin Reservations

### Admin Tables

## Future Improvements

- **Refresh Tokens**: Establish long-term session security.
- **Email Notifications**: Send booking confirmations and cancellation alerts automatically.
- **Restaurant opening hours**: Restrict booking periods dynamically.
- **Availability calendar**: Visual schedule matrix on reservation bookings.
- **Profile management**: User picture updates and profile detail modifications.

## Author

**ReserveEase**  
Restaurant Reservation Management System
