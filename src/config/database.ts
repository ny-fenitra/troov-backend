import mongoose from 'mongoose';

export default async () => {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/troov');

    console.log('MongoDB connected');
};
