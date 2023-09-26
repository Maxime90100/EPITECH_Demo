import mongoose from 'mongoose';

export const SensorData = mongoose.model('SensorData', new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now },
}));