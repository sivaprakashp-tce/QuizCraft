import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Institution name is required'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Institution address is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
    }
}, {
    timestamps: true
});

institutionSchema.index({ name: 1, city: 1 });

export default mongoose.model('Institution', institutionSchema);
