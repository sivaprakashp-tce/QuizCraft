import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: [true, 'Quiz ID is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    answersRecorded: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        selectedAnswer: {
            type: Number,
            required: true,
            min: [0, 'Selected answer index cannot be negative']
        },
        isCorrect: {
            type: Boolean,
            required: true
        },
        pointsEarned: {
            type: Number,
            required: true,
            min: [0, 'Points earned cannot be negative']
        }
    }],
    score: {
        type: Number,
        required: [true, 'Score is required'],
        min: [0, 'Score cannot be negative']
    },
    totalPossibleScore: {
        type: Number,
        required: [true, 'Total possible score is required'],
        min: [0, 'Total possible score cannot be negative']
    },
    percentage: {
        type: Number,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100']
    },
    timeSpent: {
        type: Number, // in seconds
        min: [0, 'Time spent cannot be negative']
    },
    dateOfAttempt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
attemptSchema.index({ quizId: 1 });
attemptSchema.index({ userId: 1 });
attemptSchema.index({ userId: 1, quizId: 1 });
attemptSchema.index({ dateOfAttempt: -1 });
attemptSchema.index({ score: -1 });

// Calculate percentage before saving
attemptSchema.pre('save', function(next) {
    if (this.totalPossibleScore > 0) {
        this.percentage = Math.round((this.score / this.totalPossibleScore) * 100 * 100) / 100;
    } else {
        this.percentage = 0;
    }
    next();
});

// Award stars to user based on performance
attemptSchema.post('save', async function(doc) {
    const User = mongoose.model('User');
    
    let starsAwarded = 0;
    if (doc.percentage >= 90) {
        starsAwarded = 5;
    } else if (doc.percentage >= 80) {
        starsAwarded = 4;
    } else if (doc.percentage >= 70) {
        starsAwarded = 3;
    } else if (doc.percentage >= 60) {
        starsAwarded = 2;
    } else if (doc.percentage >= 50) {
        starsAwarded = 1;
    }
    
    if (starsAwarded > 0) {
        await User.findByIdAndUpdate(doc.userId, {
            $inc: { starsGathered: starsAwarded }
        });
    }
});

export default mongoose.model('Attempt', attemptSchema);
