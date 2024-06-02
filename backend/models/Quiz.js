const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const optionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
});

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [optionSchema],
    answer: { type: String, required: true } 
});

const quizSchema = new mongoose.Schema({
    quizId:{type: String, default: uuidv4},
    userId:{type: String, required: true},
    title: { type: String, required: true },
    questions: [questionSchema],
    createdBy: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
