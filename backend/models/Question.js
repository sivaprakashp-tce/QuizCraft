import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: [true, 'Quiz ID is required']
    },
    question: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true,
        maxlength: [1000, 'Question cannot exceed 1000 characters']
    },
    options: [{
        type: String,
        required: [true, 'Option text is required'],
        trim: true,
        maxlength: [200, 'Option cannot exceed 200 characters']
    }],
    correctAnswer: {
        type: Number,
        required: [true, 'Correct answer index is required'],
        min: [0, 'Correct answer index cannot be negative']
    },
    pointsAwarded: {
        type: Number,
        required: [true, 'Points awarded is required'],
        min: [1, 'Points awarded must be at least 1'],
        default: 1
    },
    questionType: {
        type: String,
        enum: ['multiple-choice', 'true-false'],
        default: 'multiple-choice'
    }
}, {
    timestamps: true
});

// Indexes
questionSchema.index({ quizId: 1 });

// Validation for options length
questionSchema.pre('save', function(next) {
    if (this.questionType === 'multiple-choice' && this.options.length < 2) {
        return next(new Error('Multiple choice questions must have at least 2 options'));
    }
    if (this.questionType === 'true-false' && this.options.length !== 2) {
        return next(new Error('True/false questions must have exactly 2 options'));
    }
    if (this.correctAnswer >= this.options.length) {
        return next(new Error('Correct answer index is out of range'));
    }
    next();
});

// Update quiz stats after save
questionSchema.post('save', async function(doc) {
    const Quiz = mongoose.model('Quiz');
    const quiz = await Quiz.findById(doc.quizId);
    if (quiz) {
        await quiz.updateQuizStats();
    }
});

// Update quiz stats after remove
questionSchema.post('deleteOne', { document: true, query: false }, async function(doc) {
    const Quiz = mongoose.model('Quiz');
    const quiz = await Quiz.findById(doc.quizId);
    if (quiz) {
        await quiz.updateQuizStats();
    }
});

export default mongoose.model('Question', questionSchema);
