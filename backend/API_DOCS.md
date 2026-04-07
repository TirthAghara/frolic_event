# Frolic Event - Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and update with your configuration:
```bash
cp .env.example .env
```

### 3. Start the Server
Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **Method:** POST
- **URL:** `/api/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional: user, admin, institute (default: user)
}
```
- **Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
- **Method:** POST
- **URL:** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Profile (Protected)
- **Method:** GET
- **URL:** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-...",
    "updatedAt": "2024-..."
  }
}
```

#### Update Profile (Protected)
- **Method:** PUT
- **URL:** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```
- **Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### Logout
- **Method:** POST
- **URL:** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "message": "Logged out successfully"
}
```

## File Structure

```
backend/
├── server.js          # Main server file
├── auth.js            # Authentication utilities (token, password hashing)
├── package.json       # Dependencies
├── .env.example       # Environment variables template
├── models/
│   └── User.js        # User schema and model
└── routes/
    └── auth.js        # Authentication routes
```

## Key Features

- ✅ User Registration with password hashing (bcryptjs)
- ✅ User Login with JWT authentication
- ✅ Protected routes with token verification
- ✅ User profile management
- ✅ Role-based user types (user, admin, institute)
- ✅ MongoDB integration with Mongoose
- ✅ CORS enabled for frontend integration

## Security Notes

- Always change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Passwords are hashed using bcryptjs with 10 salt rounds
- JWT tokens expire after 7 days
- Never expose tokens in logs or error messages
