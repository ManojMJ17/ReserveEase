# Restaurant Reservation Management System Backend

This is the backend foundation for a production-ready Restaurant Reservation Management System, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **TypeScript**: Configured with strict compiler settings, targeting ES2022 and ES Modules.
- **Robust Error Handling**: Standardized `ApiError` and `ApiResponse` utilities with a global error handler middleware.
- **Validation**: Ready for request validation using `express-validator`.
- **Database Hookups**: Pre-configured MongoDB connection using Mongoose.
- **Environment Variables**: Centralized environment configuration via `src/config/env.ts`.

## Folder Structure

```text
backend/
├── src/
│   ├── config/       # App configurations (db connection, environment variables)
│   ├── constants/    # Fixed enums and constant values (roles, time slots)
│   ├── controllers/  # API Controllers (thin, orchestrate service calls)
│   ├── middleware/   # Express middlewares (auth, error handler, validation)
│   ├── models/       # Mongoose models/schemas
│   ├── routes/       # API Routes definition
│   ├── services/     # Business logic layer
│   ├── validators/   # Request schemas and validation criteria
│   ├── utils/        # Reusable utility helpers (ApiError, ApiResponse, asyncHandler)
│   ├── types/        # TypeScript custom types/interfaces definitions
│   ├── seeds/        # Database seed scripts
│   ├── app.ts        # Express application configuration
│   └── server.ts     # Main server entry point
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```

### 3. Run Development Server
Uses `tsx watch` for hot-reloading:
```bash
npm run dev
```

### 4. Build for Production
Compiles TypeScript into JavaScript inside the `dist` folder:
```bash
npm run build
```

### 5. Run in Production
Starts the server using the compiled files:
```bash
npm run start
```
