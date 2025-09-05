import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "../ZustandStore/QuizStore";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizzes, submitQuiz, loading } = useQuizStore();

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    const quiz = quizzes.find(q => q._id === quizId);
    if (quiz) {
      setCurrentQuiz(quiz);
    } else {
      navigate("/quizzes");
    }
  }, [quizId, quizzes, navigate]);

  if (!currentQuiz) return <div>Loading...</div>;

  const currentQuestion = currentQuiz.quiz[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(String.fromCharCode(97 + optionIndex)); // Convert to a, b, c, d
  };

  const handleNext = async () => {
    // Validate answer
    const isCorrect = currentQuestion.answer.includes(selectedAnswer);
    if (isCorrect) setScore(score + 1);

    // Store answer
    const updatedAnswers = [
      ...answers,
      {
        questionId: currentQuestion._id,
        selectedAnswer,
        isCorrect
      }
    ];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < currentQuiz.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      setQuizCompleted(true);
      setSubmitting(true);
      // Only send the number of correct answers
      const correctCount = updatedAnswers.filter(a => a.isCorrect).length;
      const payload = {
        quizId,
        answers: correctCount
      };
      const result = await submitQuiz(payload);
      setSubmitResult(result);
      setSubmitting(false);
    }
  };

  if (quizCompleted) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-xl mb-4">
          Your score: {Math.round((score / currentQuiz.quiz.length) * 100)}%
        </p>
        {submitting && (
          <p className="text-blue-600 mb-4">Submitting your answers...</p>
        )}
        {submitResult && (
          <div className="mb-4 text-green-600">
            Quiz submitted successfully!
          </div>
        )}
        <button
          onClick={() => navigate("/quizzes")}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {currentQuiz.quiz.length}
        </p>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{
              width: `${((currentQuestionIndex + 1) / currentQuiz.quiz.length) * 100}%`
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-3 rounded ${
                selectedAnswer === String.fromCharCode(97 + index)
                  ? "bg-blue-100 border-blue-500"
                  : "bg-gray-50 hover:bg-gray-100"
              } border transition-colors`}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer || submitting}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
        >
          {currentQuestionIndex === currentQuiz.quiz.length - 1
            ? submitting ? "Submitting..." : "Finish"
            : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuizAttempt;
// export default QuizAttempt;
