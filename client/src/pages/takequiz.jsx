import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Navbar from '@/components/ui/Navbar';
import { Button } from '@/components/ui/button';
import PrivateRoute from '@/components/PrivateRoute';
import { useAuth } from '@/context/authContext';

const TakeQuiz = () => {
    const router = useRouter();
    const { quiz } = router.query;
    const [responses, setResponses] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const { user } = useAuth();
    const [quizData, setQuizData] = useState(null);

    useEffect(() => {
        if (quiz) {
            fetchQuizData(quiz);
        }
    }, [quiz]);

    const fetchQuizData = async (quizId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/quiz/all/${quizId}`);
            setQuizData(response.data);
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        }
    };

    const handleOptionSelect = (questionId, selectedOption) => {
        setResponses(prev => {
            const newResponses = [...prev];
            const index = newResponses.findIndex(response => response.questionId === questionId);
            if (index >= 0) {
                newResponses[index].selectedOption = selectedOption;
            } else {
                newResponses.push({ questionId, selectedOption });
            }
            return newResponses;
        });
    };

    const handleSubmitQuiz = async () => {
        try {
            let score = 0;
            const evaluatedResponses = responses.map(response => {
                const question = quizData.questions.find(q => q._id === response.questionId);
                const isCorrect = question.options.find(option => option._id === response.selectedOption._id).isCorrect;
                if (isCorrect) score += 1;
                return { ...response, isCorrect };
            });

            const userId = user.userId;
            const response = await axios.post('http://localhost:5000/api/quiz/submit', {
                userId,
                quizId: quizData._id,
                responses: evaluatedResponses,
                score,
            });

            router.push({
                pathname: '/submit',
                query: { score, responses: JSON.stringify(evaluatedResponses), quiz: JSON.stringify(quizData) },
            });
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    if (!quizData) {
        return <div>Loading...</div>;
    }

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const selectedOptionForCurrentQuestion = responses.find(response => response.questionId === currentQuestion._id)?.selectedOption;

    return (
        <PrivateRoute>
            <Navbar />
            <div className='w-[95vw] mx-auto'>
                <div className="flex justify-between items-center px-20 mt-5">
                    <div className='flex items-center gap-1'>
                        <h1 className='text-sm text-gray-600'>Topic :</h1>
                        <span className='bg-black py-0 px-1 rounded text-white text-sm'>{quizData.title}</span>
                    </div>
                    <h1 className='text-gray-600 font-semibold border rounded px-2'>{currentQuestionIndex + 1} / {quizData.questions.length}</h1>
                </div>

                <div className='border border-gray-300 p-5 rounded-xl mt-1'>
                    <div className="question">
                        <h1 className='text-gray-600'>
                            <span className='font-semibold'>{currentQuestionIndex + 1}. </span>{currentQuestion.text}
                        </h1>
                    </div>
                    <div className="option flex flex-col gap-2 mt-4">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                className={`text-start border rounded px-2 py-3 w-[40vw] ${selectedOptionForCurrentQuestion === option ? 'bg-black text-white' : 'text-gray-600'}`}
                                onClick={() => handleOptionSelect(currentQuestion._id, option)}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='flex justify-between px-5 py-3'>
                    <Button onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))} disabled={currentQuestionIndex === 0}>Previous</Button>
                    {currentQuestionIndex < quizData.questions.length - 1 ? (
                        <Button onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, quizData.questions.length - 1))}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmitQuiz}>Submit</Button>
                    )}
                </div>
            </div>
        </PrivateRoute>
    );
};

export default TakeQuiz;
