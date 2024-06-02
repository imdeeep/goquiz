const express = require('express');
const { createQuiz ,getAllQuizzes,submitQuiz,getQuizById} = require('../controllers/quizController');
const router = express.Router();

router.post('/create', createQuiz);
router.get('/all', getAllQuizzes); 
router.get('/all/:quizId', getQuizById); 
router.post('/submit', submitQuiz); 

module.exports = router;
