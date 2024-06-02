const Quiz = require('../models/Quiz');
const UserQuizResponse = require('../models/UserQuizResponse');

exports.createQuiz = async (req, res) => {
    try {
        const { title, questions,userId,createdBy } = req.body;

        const quiz = new Quiz({
            title,
            userId,
            questions,
            createdBy,
        });

        await quiz.save();

        res.status(201).json({ message: 'Quiz created successfully', quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;

        const quizzes = await Quiz.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Quiz.countDocuments();

        res.status(200).json({
            quizzes,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getQuizById = async (req, res) => {
    const quizId = req.params.quizId
    try {
        const quiz = await Quiz.findOne({quizId});
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const { userId, quizId, responses, score } = req.body;

        const userQuizResponse = new UserQuizResponse({
            userId,
            quizId,
            responses,
            score,
        });

        await userQuizResponse.save();

        res.status(201).json({ message: 'Quiz submitted successfully', score, evaluatedResponses: responses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


