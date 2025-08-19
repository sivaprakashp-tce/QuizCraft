# Quiz Platform Backend

A comprehensive backend API for a quizzing platform built with Node.js, Express.js, and MongoDB.

## Features

- 🔐 JWT-based authentication and authorization
- 👥 Role-based access control (Student, Teacher, Admin)
- 📚 Quiz and question management
- 📊 Attempt tracking and scoring
- 🏆 Leaderboards and statistics
- 🏫 Institution and stream management
- 🛡️ Security middleware and rate limiting
- 📝 Comprehensive error handling and logging
- ✅ Input validation and sanitization

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd quizproject/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.development.local
   ```
   Edit `.env.development.local` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_URI=mongodb://localhost:27017/quizplatform
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Run the application:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

The API provides comprehensive endpoints for managing a quiz platform:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get user profile
- `PUT /api/auth/user/update` - Update user profile

### Quiz Management
- `GET /api/quizzes/:stream` - Get quizzes by stream
- `GET /api/quiz/:id` - Get quiz details
- `GET /api/quiz/questions/:quizId` - Get quiz questions
- `POST /api/quiz` - Create quiz (Teacher/Admin)
- `PUT /api/quiz/:id` - Update quiz (Teacher/Admin)
- `DELETE /api/quiz/:id` - Delete quiz (Teacher/Admin)
- `GET /api/teacher/quizzes` - Get teacher's quizzes

### Question Management
- `POST /api/question` - Create question (Teacher/Admin)
- `GET /api/question/:id` - Get question details
- `PUT /api/question/:id` - Update question (Teacher/Admin)
- `DELETE /api/question/:id` - Delete question (Teacher/Admin)
- `GET /api/quiz/questions` - Get questions by quiz

### Quiz Attempts
- `POST /api/quiz/attended` - Submit quiz attempt
- `GET /api/quiz/attended/:userId` - Get user attempts
- `GET /api/quiz/attempts/:quizId` - Get quiz attempts (Teacher/Admin)
- `GET /api/quiz/attempts/summary/:quizId` - Get quiz statistics

### Institution Management
- `GET /api/institutions` - Get all institutions
- `GET /api/institution/:id` - Get institution details
- `POST /api/institution` - Create institution (Admin)
- `PUT /api/institution/:id` - Update institution (Admin)
- `DELETE /api/institution/:id` - Delete institution (Admin)

### Stream Management
- `GET /api/streams` - Get all streams
- `GET /api/stream/:streamId` - Get stream details
- `POST /api/stream` - Create stream (Teacher/Admin)
- `PUT /api/stream/:streamId` - Update stream (Admin)
- `DELETE /api/stream/:streamId` - Delete stream (Admin)

### Statistics & Leaderboards
- `GET /api/stars/:userId` - Get user stars and stats
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/stream/:streamId` - Get stream leaderboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

### User
- Name, Email, Password (encrypted)
- Stream ID, Institution ID
- Stars Gathered, Role
- Timestamps

### Quiz
- User ID, Stream ID, Institution ID
- Quiz Name, Description
- Total Points, Number of Questions
- Institution Only flag
- Timestamps

### Question
- Quiz ID, Question Text
- Options array, Correct Answer
- Points Awarded, Question Type
- Timestamps

### Attempt
- Quiz ID, User ID
- Answers Recorded array
- Score, Percentage, Time Spent
- Date of Attempt
- Timestamps

### Institution
- Name, Address, City, Country
- Timestamps

### Stream
- Stream Name, Description
- Timestamps

## Security Features

- JWT authentication with secure token handling
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Helmet for security headers
- Role-based access control

## Error Handling

The application includes comprehensive error handling:
- Custom error classes with error codes
- Development vs production error responses
- Structured error logging
- Mongoose validation error handling
- 404 and global error handlers

## Logging

Winston logging with:
- Console and file transport
- Error and combined logs
- Timestamp and stack trace inclusion
- Environment-based log levels

## Project Structure

```
backend/
├── config/
│   └── env.js              # Environment configuration
├── controllers/            # Request handlers
│   ├── authController.js
│   ├── quizController.js
│   ├── questionController.js
│   ├── attemptController.js
│   ├── institutionController.js
│   ├── streamController.js
│   └── miscController.js
├── database/
│   └── mongodb.js          # Database connection
├── middlewares/            # Custom middleware
│   ├── auth.js            # Authentication & authorization
│   └── errorHandler.js    # Error handling
├── models/                # Mongoose models
│   ├── User.js
│   ├── Quiz.js
│   ├── Question.js
│   ├── Attempt.js
│   ├── Institution.js
│   └── Stream.js
├── routes/                # Route definitions
│   ├── authRoutes.js
│   ├── quizRoutes.js
│   ├── questionRoutes.js
│   ├── attemptRoutes.js
│   ├── institutionRoutes.js
│   ├── streamRoutes.js
│   └── miscRoutes.js
├── utils/                 # Utility functions
│   ├── auth.js           # JWT utilities
│   ├── validation.js     # Validation helpers
│   └── logger.js         # Winston logger
├── logs/                 # Log files
├── .env.example          # Environment variables template
├── index.js              # Main application file
└── package.json          # Dependencies and scripts
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
