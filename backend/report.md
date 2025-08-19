# Quiz Platform API Documentation

## Overview

This document provides detailed information about all API endpoints, including request formats, response structures, and authentication requirements.

**Base URL:** `http://localhost:5500`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this standard format:

```json
{
  "success": boolean,
  "message": "string",
  "data": object | array,
  "error": "string" // Only present on errors
}
```

---

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "streamId": "64f5a1b2c3d4e5f6g7h8i9j0",
  "institutionId": "64f5a1b2c3d4e5f6g7h8i9j1"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "streamId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "streamName": "Computer Science",
        "streamDescription": "Programming and software development"
      },
      "institutionId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
        "name": "MIT",
        "city": "Cambridge",
        "country": "USA"
      },
      "starsGathered": 0,
      "createdAt": "2024-08-19T10:30:00.000Z",
      "updatedAt": "2024-08-19T10:30:00.000Z"
    }
  }
}
```

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "streamId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "streamName": "Computer Science",
        "streamDescription": "Programming and software development"
      },
      "institutionId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
        "name": "MIT",
        "city": "Cambridge",
        "country": "USA"
      },
      "starsGathered": 85,
      "createdAt": "2024-08-19T10:30:00.000Z",
      "updatedAt": "2024-08-19T10:30:00.000Z"
    }
  }
}
```

### 3. Get User Profile

**Endpoint:** `GET /api/auth/user`

**Authentication:** Required

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "streamId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "streamName": "Computer Science",
        "streamDescription": "Programming and software development"
      },
      "institutionId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
        "name": "MIT",
        "city": "Cambridge",
        "country": "USA"
      },
      "starsGathered": 85,
      "createdAt": "2024-08-19T10:30:00.000Z",
      "updatedAt": "2024-08-19T10:30:00.000Z"
    }
  }
}
```

### 4. Update User Profile

**Endpoint:** `PUT /api/auth/user/update`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Smith",
  "streamId": "64f5a1b2c3d4e5f6g7h8i9j3",
  "institutionId": "64f5a1b2c3d4e5f6g7h8i9j4"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
      "name": "John Smith",
      "email": "john.doe@example.com",
      "streamId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j3",
        "streamName": "Mathematics",
        "streamDescription": "Pure and applied mathematics"
      },
      "institutionId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j4",
        "name": "Stanford University",
        "city": "Stanford",
        "country": "USA"
      },
      "starsGathered": 85,
      "createdAt": "2024-08-19T10:30:00.000Z",
      "updatedAt": "2024-08-19T12:30:00.000Z"
    }
  }
}
```

---

## Quiz Management Endpoints

### 5. Get Quizzes by Stream

**Endpoint:** `GET /api/quizzes/:stream`

**Authentication:** Required

**URL Parameters:**
- `stream` - Stream ID

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quizzes retrieved successfully",
  "data": {
    "quizzes": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
        "quizName": "JavaScript Fundamentals",
        "quizDescription": "Test your knowledge of JavaScript basics",
        "totalPoints": 45,
        "numberOfQuestions": 4,
        "institutionOnly": false,
        "userId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
          "name": "John Teacher",
          "email": "teacher@example.com"
        },
        "streamId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
          "streamName": "Computer Science"
        },
        "institutionId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
          "name": "MIT"
        },
        "createdAt": "2024-08-19T10:30:00.000Z",
        "updatedAt": "2024-08-19T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

### 6. Get Quiz by ID

**Endpoint:** `GET /api/quiz/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Quiz ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz retrieved successfully",
  "data": {
    "quiz": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
      "quizName": "JavaScript Fundamentals",
      "quizDescription": "Test your knowledge of JavaScript basics including variables, functions, and objects",
      "totalPoints": 45,
      "numberOfQuestions": 4,
      "institutionOnly": false,
      "isActive": true,
      "userId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
        "name": "John Teacher",
        "email": "teacher@example.com"
      },
      "streamId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "streamName": "Computer Science",
        "streamDescription": "Programming and software development"
      },
      "institutionId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
        "name": "MIT",
        "city": "Cambridge",
        "country": "USA"
      },
      "createdAt": "2024-08-19T10:30:00.000Z",
      "updatedAt": "2024-08-19T10:30:00.000Z"
    }
  }
}
```

### 7. Get Quiz Questions

**Endpoint:** `GET /api/quiz/questions/:quizId`

**Authentication:** Required

**URL Parameters:**
- `quizId` - Quiz ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz questions retrieved successfully",
  "data": {
    "questions": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j6",
        "quizId": "64f5a1b2c3d4e5f6g7h8i9j5",
        "question": "What is the correct way to declare a variable in JavaScript?",
        "options": ["var x = 5;", "variable x = 5;", "declare x = 5;", "x := 5;"],
        "pointsAwarded": 10,
        "questionType": "multiple-choice",
        "createdAt": "2024-08-19T10:30:00.000Z",
        "updatedAt": "2024-08-19T10:30:00.000Z"
      }
    ],
    "quizInfo": {
      "id": "64f5a1b2c3d4e5f6g7h8i9j5",
      "name": "JavaScript Fundamentals",
      "description": "Test your knowledge of JavaScript basics",
      "totalPoints": 45,
      "numberOfQuestions": 4
    }
  }
}
```

### 8. Create Quiz

**Endpoint:** `POST /api/quiz`

**Authentication:** Required

**Request Body:**
```json
{
  "quizName": "Advanced JavaScript",
  "quizDescription": "Test your advanced JavaScript knowledge including closures, promises, and async/await",
  "institutionOnly": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "quiz": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j7",
      "quizName": "Advanced JavaScript",
      "quizDescription": "Test your advanced JavaScript knowledge including closures, promises, and async/await",
      "totalPoints": 0,
      "numberOfQuestions": 0,
      "institutionOnly": false,
      "isActive": true,
      "userId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
        "name": "John Teacher",
        "email": "teacher@example.com"
      },
      "streamId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "streamName": "Computer Science"
      },
      "institutionId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
        "name": "MIT"
      },
      "createdAt": "2024-08-19T12:30:00.000Z",
      "updatedAt": "2024-08-19T12:30:00.000Z"
    }
  }
}
```

### 9. Update Quiz

**Endpoint:** `PUT /api/quiz/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Quiz ID

**Request Body:**
```json
{
  "quizName": "Advanced JavaScript Concepts",
  "quizDescription": "Updated description for advanced JavaScript concepts",
  "institutionOnly": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz updated successfully",
  "data": {
    "quiz": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j7",
      "quizName": "Advanced JavaScript Concepts",
      "quizDescription": "Updated description for advanced JavaScript concepts",
      "totalPoints": 0,
      "numberOfQuestions": 0,
      "institutionOnly": true,
      "isActive": true,
      "userId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
        "name": "John Teacher",
        "email": "teacher@example.com"
      },
      "streamId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "streamName": "Computer Science"
      },
      "institutionId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
        "name": "MIT"
      },
      "createdAt": "2024-08-19T12:30:00.000Z",
      "updatedAt": "2024-08-19T13:30:00.000Z"
    }
  }
}
```

### 10. Delete Quiz

**Endpoint:** `DELETE /api/quiz/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Quiz ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz and all associated data deleted successfully"
}
```

### 11. Get Teacher's Quizzes

**Endpoint:** `GET /api/teacher/quizzes`

**Authentication:** Required

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Teacher quizzes retrieved successfully",
  "data": {
    "quizzes": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
        "quizName": "JavaScript Fundamentals",
        "quizDescription": "Test your knowledge of JavaScript basics",
        "totalPoints": 45,
        "numberOfQuestions": 4,
        "institutionOnly": false,
        "isActive": true,
        "streamId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
          "streamName": "Computer Science"
        },
        "institutionId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
          "name": "MIT"
        },
        "createdAt": "2024-08-19T10:30:00.000Z",
        "updatedAt": "2024-08-19T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

---

## Question Management Endpoints

### 12. Create Question

**Endpoint:** `POST /api/question`

**Authentication:** Required

**Request Body:**
```json
{
  "quizId": "64f5a1b2c3d4e5f6g7h8i9j5",
  "question": "Which method is used to add an element to the end of an array?",
  "options": ["append()", "push()", "add()", "insert()"],
  "correctAnswer": 1,
  "pointsAwarded": 10,
  "questionType": "multiple-choice"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Question created successfully",
  "data": {
    "question": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j8",
      "quizId": "64f5a1b2c3d4e5f6g7h8i9j5",
      "question": "Which method is used to add an element to the end of an array?",
      "options": ["append()", "push()", "add()", "insert()"],
      "correctAnswer": 1,
      "pointsAwarded": 10,
      "questionType": "multiple-choice",
      "createdAt": "2024-08-19T13:30:00.000Z",
      "updatedAt": "2024-08-19T13:30:00.000Z"
    }
  }
}
```

### 13. Get Question by ID

**Endpoint:** `GET /api/question/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Question ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Question retrieved successfully",
  "data": {
    "question": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j8",
      "quizId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
        "quizName": "JavaScript Fundamentals",
        "userId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
          "name": "John Teacher",
          "email": "teacher@example.com"
        }
      },
      "question": "Which method is used to add an element to the end of an array?",
      "options": ["append()", "push()", "add()", "insert()"],
      "correctAnswer": 1,
      "pointsAwarded": 10,
      "questionType": "multiple-choice",
      "createdAt": "2024-08-19T13:30:00.000Z",
      "updatedAt": "2024-08-19T13:30:00.000Z"
    },
    "isOwner": true
  }
}
```

### 14. Update Question

**Endpoint:** `PUT /api/question/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Question ID

**Request Body:**
```json
{
  "question": "Which method is used to add an element to the end of an array in JavaScript?",
  "options": ["append()", "push()", "add()", "insert()"],
  "correctAnswer": 1,
  "pointsAwarded": 15
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Question updated successfully",
  "data": {
    "question": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j8",
      "quizId": "64f5a1b2c3d4e5f6g7h8i9j5",
      "question": "Which method is used to add an element to the end of an array in JavaScript?",
      "options": ["append()", "push()", "add()", "insert()"],
      "correctAnswer": 1,
      "pointsAwarded": 15,
      "questionType": "multiple-choice",
      "createdAt": "2024-08-19T13:30:00.000Z",
      "updatedAt": "2024-08-19T14:30:00.000Z"
    }
  }
}
```

### 15. Delete Question

**Endpoint:** `DELETE /api/question/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Question ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Question deleted successfully"
}
```

### 16. Get Questions by Quiz

**Endpoint:** `GET /api/quiz/questions`

**Authentication:** Required

**Query Parameters:**
- `quizId` (optional) - Quiz ID to filter questions

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Questions retrieved successfully",
  "data": {
    "questions": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j8",
        "quizId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
          "quizName": "JavaScript Fundamentals",
          "userId": {
            "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
            "name": "John Teacher",
            "email": "teacher@example.com"
          }
        },
        "question": "Which method is used to add an element to the end of an array?",
        "options": ["append()", "push()", "add()", "insert()"],
        "pointsAwarded": 10,
        "questionType": "multiple-choice",
        "createdAt": "2024-08-19T13:30:00.000Z",
        "updatedAt": "2024-08-19T13:30:00.000Z"
      }
    ]
  }
}
```

---

## Quiz Attempt Endpoints

### 17. Submit Quiz Attempt

**Endpoint:** `POST /api/quiz/attended`

**Authentication:** Required

**Request Body:**
```json
{
  "quizId": "64f5a1b2c3d4e5f6g7h8i9j5",
  "answers": [
    {
      "questionId": "64f5a1b2c3d4e5f6g7h8i9j6",
      "selectedAnswer": 0
    },
    {
      "questionId": "64f5a1b2c3d4e5f6g7h8i9j8",
      "selectedAnswer": 1
    }
  ],
  "timeSpent": 1200
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Quiz attempt submitted successfully",
  "data": {
    "attempt": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j9",
      "score": 20,
      "totalPossibleScore": 20,
      "percentage": 100,
      "timeSpent": 1200,
      "dateOfAttempt": "2024-08-19T15:30:00.000Z",
      "quiz": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
        "quizName": "JavaScript Fundamentals",
        "quizDescription": "Test your knowledge of JavaScript basics"
      },
      "answersRecorded": [
        {
          "questionId": "64f5a1b2c3d4e5f6g7h8i9j6",
          "selectedAnswer": 0,
          "isCorrect": true,
          "pointsEarned": 10
        },
        {
          "questionId": "64f5a1b2c3d4e5f6g7h8i9j8",
          "selectedAnswer": 1,
          "isCorrect": true,
          "pointsEarned": 10
        }
      ]
    }
  }
}
```

### 18. Get User Attempts

**Endpoint:** `GET /api/quiz/attended/:userId`

**Authentication:** Required

**URL Parameters:**
- `userId` - User ID

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User attempts retrieved successfully",
  "data": {
    "attempts": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j9",
        "score": 20,
        "totalPossibleScore": 20,
        "percentage": 100,
        "timeSpent": 1200,
        "dateOfAttempt": "2024-08-19T15:30:00.000Z",
        "quizId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
          "quizName": "JavaScript Fundamentals",
          "quizDescription": "Test your knowledge of JavaScript basics",
          "streamId": {
            "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
            "streamName": "Computer Science"
          }
        },
        "userId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
          "name": "Alice Student",
          "email": "student1@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

### 19. Get Quiz Attempts

**Endpoint:** `GET /api/quiz/attempts/:quizId`

**Authentication:** Required

**URL Parameters:**
- `quizId` - Quiz ID

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz attempts retrieved successfully",
  "data": {
    "attempts": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j9",
        "score": 20,
        "totalPossibleScore": 20,
        "percentage": 100,
        "timeSpent": 1200,
        "dateOfAttempt": "2024-08-19T15:30:00.000Z",
        "userId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j3",
          "name": "Alice Student",
          "email": "student1@example.com",
          "starsGathered": 85
        }
      }
    ],
    "quiz": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
      "quizName": "JavaScript Fundamentals",
      "totalPoints": 45,
      "numberOfQuestions": 4
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

### 20. Get Specific User Quiz Attempt

**Endpoint:** `GET /api/quiz/attempts/:userId/:quizId`

**Authentication:** Required

**URL Parameters:**
- `userId` - User ID
- `quizId` - Quiz ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Attempt retrieved successfully",
  "data": {
    "attempt": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j9",
      "score": 20,
      "totalPossibleScore": 20,
      "percentage": 100,
      "timeSpent": 1200,
      "dateOfAttempt": "2024-08-19T15:30:00.000Z",
      "quizId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
        "quizName": "JavaScript Fundamentals",
        "quizDescription": "Test your knowledge of JavaScript basics",
        "totalPoints": 45,
        "numberOfQuestions": 4
      },
      "userId": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j3",
        "name": "Alice Student",
        "email": "student1@example.com"
      },
      "answersRecorded": [
        {
          "questionId": {
            "_id": "64f5a1b2c3d4e5f6g7h8i9j6",
            "question": "What is the correct way to declare a variable in JavaScript?",
            "options": ["var x = 5;", "variable x = 5;", "declare x = 5;", "x := 5;"],
            "correctAnswer": 0,
            "pointsAwarded": 10
          },
          "selectedAnswer": 0,
          "isCorrect": true,
          "pointsEarned": 10
        }
      ]
    }
  }
}
```

### 21. Get Quiz Attempts Summary

**Endpoint:** `GET /api/quiz/attempts/summary/:quizId`

**Authentication:** Required

**URL Parameters:**
- `quizId` - Quiz ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz attempts summary retrieved successfully",
  "data": {
    "quiz": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
      "quizName": "JavaScript Fundamentals",
      "totalPoints": 45,
      "numberOfQuestions": 4
    },
    "summary": {
      "totalAttempts": 5,
      "averageScore": 32.4,
      "averagePercentage": 72,
      "highestScore": 45,
      "lowestScore": 15,
      "averageTimeSpent": 1350
    },
    "scoreDistribution": [
      { "_id": "A (90-100%)", "count": 1 },
      { "_id": "B (80-89%)", "count": 1 },
      { "_id": "C (70-79%)", "count": 2 },
      { "_id": "D (60-69%)", "count": 1 }
    ]
  }
}
```

---

## Institution Management Endpoints

### 22. Create Institution

**Endpoint:** `POST /api/institution`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Harvard University",
  "address": "Cambridge, MA 02138",
  "city": "Cambridge",
  "country": "USA"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Institution created successfully",
  "data": {
    "institution": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9ja",
      "name": "Harvard University",
      "address": "Cambridge, MA 02138",
      "city": "Cambridge",
      "country": "USA",
      "createdAt": "2024-08-19T16:30:00.000Z",
      "updatedAt": "2024-08-19T16:30:00.000Z"
    }
  }
}
```

### 23. Get Institution by ID

**Endpoint:** `GET /api/institution/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Institution ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Institution retrieved successfully",
  "data": {
    "institution": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9ja",
      "name": "Harvard University",
      "address": "Cambridge, MA 02138",
      "city": "Cambridge",
      "country": "USA",
      "createdAt": "2024-08-19T16:30:00.000Z",
      "updatedAt": "2024-08-19T16:30:00.000Z"
    }
  }
}
```

### 24. Get All Institutions

**Endpoint:** `GET /api/institutions`

**Authentication:** Required

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `search` (optional) - Search term
- `city` (optional) - Filter by city
- `country` (optional) - Filter by country

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Institutions retrieved successfully",
  "data": {
    "institutions": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
        "name": "MIT",
        "address": "77 Massachusetts Ave",
        "city": "Cambridge",
        "country": "USA",
        "createdAt": "2024-08-19T10:30:00.000Z",
        "updatedAt": "2024-08-19T10:30:00.000Z"
      },
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9ja",
        "name": "Harvard University",
        "address": "Cambridge, MA 02138",
        "city": "Cambridge",
        "country": "USA",
        "createdAt": "2024-08-19T16:30:00.000Z",
        "updatedAt": "2024-08-19T16:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "pages": 1
    }
  }
}
```

### 25. Update Institution

**Endpoint:** `PUT /api/institution/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Institution ID

**Request Body:**
```json
{
  "name": "Harvard University",
  "address": "Updated Address, Cambridge, MA 02138",
  "city": "Cambridge",
  "country": "USA"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Institution updated successfully",
  "data": {
    "institution": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9ja",
      "name": "Harvard University",
      "address": "Updated Address, Cambridge, MA 02138",
      "city": "Cambridge",
      "country": "USA",
      "createdAt": "2024-08-19T16:30:00.000Z",
      "updatedAt": "2024-08-19T17:30:00.000Z"
    }
  }
}
```

### 26. Delete Institution

**Endpoint:** `DELETE /api/institution/:id`

**Authentication:** Required

**URL Parameters:**
- `id` - Institution ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Institution deleted successfully"
}
```

---

## Stream Management Endpoints

### 27. Create Stream

**Endpoint:** `POST /api/stream`

**Authentication:** Required

**Request Body:**
```json
{
  "streamName": "Data Science",
  "streamDescription": "Machine learning, statistics, and data analysis"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Stream created successfully",
  "data": {
    "stream": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9jb",
      "streamName": "Data Science",
      "streamDescription": "Machine learning, statistics, and data analysis",
      "createdAt": "2024-08-19T17:30:00.000Z",
      "updatedAt": "2024-08-19T17:30:00.000Z"
    }
  }
}
```

### 28. Get All Streams

**Endpoint:** `GET /api/streams`

**Authentication:** Required

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)
- `search` (optional) - Search term

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Streams retrieved successfully",
  "data": {
    "streams": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "streamName": "Computer Science",
        "streamDescription": "Programming, algorithms, software engineering, and computer systems",
        "createdAt": "2024-08-19T10:30:00.000Z",
        "updatedAt": "2024-08-19T10:30:00.000Z"
      },
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9jb",
        "streamName": "Data Science",
        "streamDescription": "Machine learning, statistics, and data analysis",
        "createdAt": "2024-08-19T17:30:00.000Z",
        "updatedAt": "2024-08-19T17:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 2,
      "pages": 1
    }
  }
}
```

### 29. Get Stream by ID

**Endpoint:** `GET /api/stream/:streamId`

**Authentication:** Required

**URL Parameters:**
- `streamId` - Stream ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stream retrieved successfully",
  "data": {
    "stream": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "streamName": "Computer Science",
      "streamDescription": "Programming, algorithms, software engineering, and computer systems",
      "createdAt": "2024-08-19T10:30:00.000Z",
      "updatedAt": "2024-08-19T10:30:00.000Z"
    },
    "statistics": {
      "totalQuizzes": 3,
      "totalUsers": 12
    }
  }
}
```

### 30. Update Stream

**Endpoint:** `PUT /api/stream/:streamId`

**Authentication:** Required

**URL Parameters:**
- `streamId` - Stream ID

**Request Body:**
```json
{
  "streamName": "Advanced Data Science",
  "streamDescription": "Advanced machine learning, deep learning, and big data analytics"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stream updated successfully",
  "data": {
    "stream": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9jb",
      "streamName": "Advanced Data Science",
      "streamDescription": "Advanced machine learning, deep learning, and big data analytics",
      "createdAt": "2024-08-19T17:30:00.000Z",
      "updatedAt": "2024-08-19T18:30:00.000Z"
    }
  }
}
```

### 31. Delete Stream

**Endpoint:** `DELETE /api/stream/:streamId`

**Authentication:** Required

**URL Parameters:**
- `streamId` - Stream ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stream deleted successfully"
}
```

---

## Statistics & Leaderboard Endpoints

### 32. Get User Stars

**Endpoint:** `GET /api/stars/:userId`

**Authentication:** Required

**URL Parameters:**
- `userId` - User ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User stars and statistics retrieved successfully",
  "data": {
    "user": {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j3",
      "name": "Alice Student",
      "email": "student1@example.com",
      "starsGathered": 85,
      "stream": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
        "streamName": "Computer Science"
      },
      "institution": {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
        "name": "MIT"
      }
    },
    "statistics": {
      "totalAttempts": 5,
      "averageScore": 82.4,
      "bestScore": 95.5
    }
  }
}
```

### 33. Get Global Leaderboard

**Endpoint:** `GET /api/leaderboard`

**Authentication:** Required

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)
- `streamId` (optional) - Filter by stream
- `institutionId` (optional) - Filter by institution

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Global leaderboard retrieved successfully",
  "data": {
    "leaderboard": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
        "name": "John Teacher",
        "email": "teacher@example.com",
        "starsGathered": 150,
        "totalAttempts": 8,
        "averageScore": 88.75,
        "bestScore": 98.5,
        "stream": "Computer Science",
        "institution": "MIT",
        "rank": 1
      },
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j3",
        "name": "Alice Student",
        "email": "student1@example.com",
        "starsGathered": 85,
        "totalAttempts": 5,
        "averageScore": 82.4,
        "bestScore": 95.5,
        "stream": "Computer Science",
        "institution": "MIT",
        "rank": 2
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 2,
      "pages": 1
    }
  }
}
```

### 34. Get Stream Leaderboard

**Endpoint:** `GET /api/leaderboard/stream/:streamId`

**Authentication:** Required

**URL Parameters:**
- `streamId` - Stream ID

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stream leaderboard retrieved successfully",
  "data": {
    "leaderboard": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
        "name": "John Teacher",
        "email": "teacher@example.com",
        "starsGathered": 150,
        "streamAttempts": 8,
        "streamAverageScore": 88.75,
        "streamBestScore": 98.5,
        "institution": "MIT",
        "rank": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
}
```

### 35. Get Dashboard Statistics

**Endpoint:** `GET /api/dashboard/stats`

**Authentication:** Required

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "userStats": {
      "totalAttempts": 5,
      "averageScore": 82.4,
      "bestScore": 95.5,
      "totalPointsEarned": 412,
      "starsGathered": 85,
      "globalRank": 2
    },
    "recentAttempts": [
      {
        "_id": "64f5a1b2c3d4e5f6g7h8i9j9",
        "quizId": {
          "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
          "quizName": "JavaScript Fundamentals"
        },
        "score": 45,
        "percentage": 100,
        "dateOfAttempt": "2024-08-19T15:30:00.000Z"
      }
    ],
    "availableQuizzes": 12
  }
}
```

---

## Public Endpoints

### 36. Health Check

**Endpoint:** `GET /health`

**Authentication:** Not required

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-08-19T18:30:00.000Z",
  "environment": "development"
}
```

### 37. API Documentation

**Endpoint:** `GET /api`

**Authentication:** Not required

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz Platform API",
  "version": "1.0.0",
  "documentation": {
    "auth": {
      "POST /api/auth/register": "User registration",
      "POST /api/auth/login": "User login",
      "GET /api/auth/user": "Get user profile",
      "PUT /api/auth/user/update": "Update user profile"
    }
  }
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

### Common Error Codes

- `MISSING_TOKEN` - No authorization token provided
- `INVALID_TOKEN` - Token is invalid or malformed
- `TOKEN_EXPIRED` - Token has expired
- `USER_NOT_FOUND` - User does not exist
- `MISSING_FIELDS` - Required fields are missing
- `INVALID_EMAIL` - Email format is invalid
- `WEAK_PASSWORD` - Password doesn't meet requirements
- `USER_EXISTS` - User with email already exists
- `INVALID_CREDENTIALS` - Email or password is incorrect
- `ACCESS_DENIED` - User doesn't have permission
- `VALIDATION_ERROR` - Input validation failed
- `DUPLICATE_FIELD` - Duplicate value for unique field
- `INVALID_ID` - Invalid ObjectId format
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Rate Limiting

### Authentication Endpoints
- **Limit:** 5 requests per 15 minutes per IP
- **Applies to:** `/api/auth/register`, `/api/auth/login`

### General Endpoints
- **Limit:** 100 requests per 15 minutes per IP
- **Applies to:** All other endpoints

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Pagination starts from page 1
3. Default pagination limit is 10-20 items depending on the endpoint
4. All request/response bodies should be in JSON format
5. Include `Content-Type: application/json` header for requests with body
6. ObjectIds are 24-character hexadecimal strings
7. Stars are automatically awarded based on quiz performance:
   - 90-100%: 5 stars
   - 80-89%: 4 stars
   - 70-79%: 3 stars
   - 60-69%: 2 stars
   - 50-59%: 1 star
   - <50%: 0 stars
