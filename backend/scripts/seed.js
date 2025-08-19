import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { DB_URI } from '../config/env.js';
import User from '../models/User.js';
import Institution from '../models/Institution.js';
import Stream from '../models/Stream.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import logger from '../utils/logger.js';

const seedDatabase = async () => {
    try {
        // Connect to database
        await mongoose.connect(DB_URI);
        logger.info('Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Institution.deleteMany({});
        await Stream.deleteMany({});
        await Quiz.deleteMany({});
        await Question.deleteMany({});
        logger.info('Cleared existing data');

        // Create institutions
        const institutions = await Institution.create([
            {
                name: 'MIT',
                address: '77 Massachusetts Ave',
                city: 'Cambridge',
                country: 'USA'
            },
            {
                name: 'Stanford University',
                address: '450 Serra Mall',
                city: 'Stanford',
                country: 'USA'
            },
            {
                name: 'University of Oxford',
                address: 'University Offices, Wellington Square',
                city: 'Oxford',
                country: 'UK'
            }
        ]);
        logger.info(`Created ${institutions.length} institutions`);

        // Create streams
        const streams = await Stream.create([
            {
                streamName: 'Computer Science',
                streamDescription: 'Programming, algorithms, software engineering, and computer systems'
            },
            {
                streamName: 'Mathematics',
                streamDescription: 'Pure and applied mathematics, statistics, and mathematical modeling'
            },
            {
                streamName: 'Physics',
                streamDescription: 'Classical and quantum physics, thermodynamics, and electromagnetism'
            },
            {
                streamName: 'Engineering',
                streamDescription: 'Mechanical, electrical, civil, and chemical engineering disciplines'
            },
            {
                streamName: 'Business',
                streamDescription: 'Management, finance, marketing, and entrepreneurship'
            }
        ]);
        logger.info(`Created ${streams.length} streams`);

        // Create users
        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                streamId: streams[0]._id,
                institutionId: institutions[0]._id,
                starsGathered: 0
            },
            {
                name: 'John Teacher',
                email: 'teacher@example.com',
                password: 'teacher123',
                streamId: streams[0]._id,
                institutionId: institutions[0]._id,
                starsGathered: 150
            },
            {
                name: 'Alice Student',
                email: 'student1@example.com',
                password: 'student123',
                streamId: streams[0]._id,
                institutionId: institutions[0]._id,
                starsGathered: 75
            },
            {
                name: 'Bob Student',
                email: 'student2@example.com',
                password: 'student123',
                streamId: streams[1]._id,
                institutionId: institutions[1]._id,
                starsGathered: 85
            },
            {
                name: 'Carol Math Teacher',
                email: 'mathteacher@example.com',
                password: 'teacher123',
                streamId: streams[1]._id,
                institutionId: institutions[1]._id,
                starsGathered: 200
            }
        ]);
        logger.info(`Created ${users.length} users`);

        // Find teacher users
        const teacherUser = users.find(u => u.email === 'teacher@example.com');
        const mathTeacher = users.find(u => u.email === 'mathteacher@example.com');

        // Create quizzes
        const quizzes = await Quiz.create([
            {
                userId: teacherUser._id,
                streamId: streams[0]._id,
                institutionId: institutions[0]._id,
                quizName: 'JavaScript Fundamentals',
                quizDescription: 'Test your knowledge of JavaScript basics including variables, functions, and objects',
                institutionOnly: false
            },
            {
                userId: teacherUser._id,
                streamId: streams[0]._id,
                institutionId: institutions[0]._id,
                quizName: 'Data Structures Quiz',
                quizDescription: 'Comprehensive quiz on arrays, linked lists, stacks, and queues',
                institutionOnly: true
            },
            {
                userId: mathTeacher._id,
                streamId: streams[1]._id,
                institutionId: institutions[1]._id,
                quizName: 'Calculus Basics',
                quizDescription: 'Fundamental concepts of differential and integral calculus',
                institutionOnly: false
            }
        ]);
        logger.info(`Created ${quizzes.length} quizzes`);

        // Create questions for JavaScript quiz
        const jsQuestions = await Question.create([
            {
                quizId: quizzes[0]._id,
                question: 'What is the correct way to declare a variable in JavaScript?',
                options: ['var x = 5;', 'variable x = 5;', 'declare x = 5;', 'x := 5;'],
                correctAnswer: 0,
                pointsAwarded: 10
            },
            {
                quizId: quizzes[0]._id,
                question: 'Which method is used to add an element to the end of an array?',
                options: ['append()', 'push()', 'add()', 'insert()'],
                correctAnswer: 1,
                pointsAwarded: 10
            },
            {
                quizId: quizzes[0]._id,
                question: 'What does the "this" keyword refer to in JavaScript?',
                options: ['The current function', 'The global object', 'The current object', 'The parent object'],
                correctAnswer: 2,
                pointsAwarded: 15
            },
            {
                quizId: quizzes[0]._id,
                question: 'Which of the following is NOT a JavaScript data type?',
                options: ['string', 'boolean', 'integer', 'undefined'],
                correctAnswer: 2,
                pointsAwarded: 10
            }
        ]);

        // Create questions for Data Structures quiz
        const dsQuestions = await Question.create([
            {
                quizId: quizzes[1]._id,
                question: 'What is the time complexity of accessing an element in an array by index?',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correctAnswer: 0,
                pointsAwarded: 15
            },
            {
                quizId: quizzes[1]._id,
                question: 'Which data structure follows LIFO principle?',
                options: ['Queue', 'Stack', 'Array', 'Linked List'],
                correctAnswer: 1,
                pointsAwarded: 10
            },
            {
                quizId: quizzes[1]._id,
                question: 'In a singly linked list, each node contains:',
                options: ['Data only', 'Pointer only', 'Data and pointer to next node', 'Data and pointers to both next and previous nodes'],
                correctAnswer: 2,
                pointsAwarded: 10
            }
        ]);

        // Create questions for Calculus quiz
        const calcQuestions = await Question.create([
            {
                quizId: quizzes[2]._id,
                question: 'What is the derivative of x²?',
                options: ['x', '2x', 'x²', '2x²'],
                correctAnswer: 1,
                pointsAwarded: 10
            },
            {
                quizId: quizzes[2]._id,
                question: 'What is the integral of 1/x dx?',
                options: ['ln|x| + C', 'x + C', '1/x² + C', 'x² + C'],
                correctAnswer: 0,
                pointsAwarded: 15
            },
            {
                quizId: quizzes[2]._id,
                question: 'The limit of sin(x)/x as x approaches 0 is:',
                options: ['0', '1', '∞', 'undefined'],
                correctAnswer: 1,
                pointsAwarded: 20
            }
        ]);

        logger.info(`Created ${jsQuestions.length + dsQuestions.length + calcQuestions.length} questions`);

        // Update quiz statistics
        for (const quiz of quizzes) {
            await quiz.updateQuizStats();
        }

        logger.info('✅ Database seeded successfully!');
        logger.info('\n📊 Seeded Data Summary:');
        logger.info(`   • ${institutions.length} institutions`);
        logger.info(`   • ${streams.length} streams`);
        logger.info(`   • ${users.length} users`);
        logger.info(`   • ${quizzes.length} quizzes`);
        logger.info(`   • ${jsQuestions.length + dsQuestions.length + calcQuestions.length} questions`);
        
        logger.info('\n👥 Test Accounts:');
        logger.info('   • Admin: admin@example.com / admin123');
        logger.info('   • Teacher: teacher@example.com / teacher123');
        logger.info('   • Math Teacher: mathteacher@example.com / teacher123');
        logger.info('   • Student 1: student1@example.com / student123');
        logger.info('   • Student 2: student2@example.com / student123');

    } catch (error) {
        logger.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        logger.info('Disconnected from MongoDB');
        process.exit(0);
    }
};

// Run the seed script
seedDatabase();
