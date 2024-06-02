import { useRouter } from 'next/router';
import Navbar from '@/components/ui/Navbar';
import React from 'react';
import { Button } from '@/components/ui/button';
import PrivateRoute from '@/components/PrivateRoute';

const Submit = () => {
    const router = useRouter();
    const { score, responses, quiz } = router.query;
    const evaluatedResponses = JSON.parse(responses || '[]');
    const quizData = JSON.parse(quiz || '{}');

    return (
        <PrivateRoute>
            <Navbar />
            <div className='w-[95vw] mx-auto'>
                <div className="flex justify-between items-center px-20 mt-5">
                    <div className='flex items-center gap-1'>
                        <h1 className='text-sm text-gray-600'>Topic :</h1>
                        <span className='bg-black py-0 px-1 rounded text-white text-sm'>{quizData.title}</span>
                    </div>
                    <h1 className='text-gray-600 font-semibold border rounded px-2'>Corrected: {score} / {evaluatedResponses.length}</h1>
                </div>

                <div>
                    {evaluatedResponses.map((response, index) => {
                        const question = quizData.questions.find(q => q._id === response.questionId);
                        const correctOption = question.options.find(o => o.isCorrect).text;
                        return (
                            <div key={index} className='border border-gray-300 p-5 rounded-xl mt-1'>
                                <div className="question">
                                    <h1 className='text-gray-600'>
                                        <span className='font-semibold'>{index + 1}. </span>{question.text}
                                    </h1>
                                </div>
                                <div className="option flex flex-col gap-2 mt-4">
                                    {question.options.map((option, optionIndex) => (
                                        <button
                                            key={optionIndex}
                                            className={`text-start border rounded px-2 py-3 w-[40vw] ${
                                                option.text === response.selectedOption.text
                                                    ? response.isCorrect
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-red-500 text-white'
                                                    : ''
                                            }`}
                                        >
                                            {option.text}
                                        </button>
                                    ))}
                                    {!response.isCorrect && (
                                        <div className="mt-2 text-red-500">
                                            Correct answer: {correctOption}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className='flex justify-end px-5 py-3'>
                    <Button onClick={() => router.push('/')}>Exit</Button>
                </div>
            </div>
        </PrivateRoute>
    );
};
    
export default Submit;
