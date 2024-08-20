import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  email: { type: String, required: true },
  score: { type: Number, required: true },
  time: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;