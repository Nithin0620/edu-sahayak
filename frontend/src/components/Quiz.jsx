import { useState } from 'react';

const Quiz = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Add error handling for missing questions
  if (!questions || questions.length === 0) {
    return <div className="text-center p-6">Loading quiz questions...</div>;
  }

  const question = questions[currentQuestion];
  
  // Add error handling for invalid question
  if (!question) {
    return <div className="text-center p-6">Error loading question</div>;
  }

  const handleAnswer = (answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score
      const score = questions.reduce((acc, q, index) => {
        return acc + (q.answer[0] === selectedAnswers[index] ? 1 : 0);
      }, 0);
      onComplete(Math.round((score / questions.length) * 100));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <h2 className="text-xl font-semibold">{question.question}</h2>
      </div>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(String.fromCharCode(97 + index))}
            className={`w-full p-4 text-left rounded-lg border ${
              selectedAnswers[currentQuestion] === String.fromCharCode(97 + index)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedAnswers[currentQuestion]}
        className={`mt-8 px-6 py-2 rounded-md text-white font-medium ${
          selectedAnswers[currentQuestion]
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
};

export default Quiz;
