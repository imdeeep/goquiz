const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userQuizResponseSchema = new Schema({
  userId: { type: String, required: true },
  quizId: { type: String, required: true },
  responses: [{
    questionId: { type: Schema.Types.ObjectId, required: true },
    selectedOption: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  }],
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserQuizResponse', userQuizResponseSchema);
