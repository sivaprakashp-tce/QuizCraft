import mongoose from 'mongoose';

const streamSchema = new mongoose.Schema({
    streamName: {
        type: String,
        required: [true, 'Stream name is required'],
        trim: true,
        unique: true
    },
    streamDescription: {
        type: String,
        required: [true, 'Stream description is required'],
        trim: true
    }
}, {
    timestamps: true
});

streamSchema.index({ streamName: 1 });

export default mongoose.model('Stream', streamSchema);
