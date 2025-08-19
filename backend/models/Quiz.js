import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    streamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream',
        required: [true, 'Stream ID is required']
    },
    institutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        required: [true, 'Institution ID is required']
    },
    quizName: {
        type: String,
        required: [true, 'Quiz name is required'],
        trim: true,
        maxlength: [100, 'Quiz name cannot exceed 100 characters']
    },
    quizDescription: {
        type: String,
        required: [true, 'Quiz description is required'],
        trim: true,
        maxlength: [500, 'Quiz description cannot exceed 500 characters']
    },
    totalPoints: {
        type: Number,
        default: 0,
        min: [0, 'Total points cannot be negative']
    },
    numberOfQuestions: {
        type: Number,
        default: 0,
        min: [0, 'Number of questions cannot be negative']
    },
    institutionOnly: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes
quizSchema.index({ userId: 1 });
quizSchema.index({ streamId: 1 });
quizSchema.index({ institutionId: 1 });
quizSchema.index({ isActive: 1 });
quizSchema.index({ institutionOnly: 1 });

// Update totalPoints and numberOfQuestions when questions are added/removed
quizSchema.methods.updateQuizStats = async function() {
    const Question = mongoose.model('Question');
    const questions = await Question.find({ quizId: this._id });
    
    this.numberOfQuestions = questions.length;
    this.totalPoints = questions.reduce((sum, question) => sum + question.pointsAwarded, 0);
    
    return this.save();
};

export default mongoose.model('Quiz', quizSchema);
