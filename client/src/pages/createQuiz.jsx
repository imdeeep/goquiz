import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/Navbar';
import { useState } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';

const CreateQuizComponent = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correct: '' }]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAddQuestion = () => {
    if (questions.length < 10) {
      setQuestions([...questions, { question: '', options: ['', '', '', ''], correct: '' }]);
    }
  };

  const handleChange = (index, type, value, optionIndex = null) => {
    const newQuestions = [...questions];
    if (type === 'question') {
      newQuestions[index].question = value;
    } else if (type === 'option') {
      newQuestions[index].options[optionIndex] = value;
    } else if (type === 'correct') {
      newQuestions[index].correct = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedQuestions = questions.map(q => ({
      text: q.question,
      options: q.options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx === parseInt(q.correct)
      })),
      answer: q.options[q.correct] 
    }));

    try {
      const response = await axios.post('http://localhost:5000/api/quiz/create', {
        title,
        questions: formattedQuestions,
        userId: user.userId,
        createdBy: user.name
      });
      router.push('/');
      alert("Quiz created successfully")
    } catch (error) {
      setError(error.response?.data?.message || 'Quiz creation failed');
    }
  };

  return (
    <>
      <PrivateRoute>
        <Navbar />
        <div className="p-2 max-w-2xl mx-auto">
          <h1 className="text-xl font-bold mb-2">Create New Quiz</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Quiz Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2 py-1 border rounded"
                required
              />
            </div>
            {questions.map((q, index) => (
              <div key={index} className="mb-4 border p-2 rounded">
                <label className="block text-sm font-medium mb-1">Question {index + 1}</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleChange(index, 'question', e.target.value)}
                  className="w-full px-2 py-1 border rounded mb-2"
                  required
                />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <label className="block text-xs font-medium mb-1">Option {optionIndex + 1}</label>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleChange(index, 'option', e.target.value, optionIndex)}
                        className="w-full px-2 py-1 border rounded"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="mb-1">
                  <label className="block text-xs font-medium mb-1">Correct Answer</label>
                  <select
                    value={q.correct}
                    onChange={(e) => handleChange(index, 'correct', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    required
                  >
                    <option value="">Select correct option</option>
                    {q.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>{`Option ${optionIndex + 1}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {questions.length < 10 && (
              <Button
                type="button"
                onClick={handleAddQuestion}
              >
                Add Question
              </Button>
            )}
            <Button type="submit" className="ml-2">
              Submit Quiz
            </Button>
          </form>
        </div>
      </PrivateRoute>
    </>
  );
};

export default CreateQuizComponent;
