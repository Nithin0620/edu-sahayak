import { useEffect, useState } from "react";
import { Brain, Award, Play, Check } from "lucide-react";
import { useQuizStore } from "../ZustandStore/QuizStore"; // adjust the path

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState("available");

  const {
    quizzes = [],             // ✅ default to []
    completedQuizzes = [],    // ✅ default to []
    availableQuizzes = [],    // ✅ default to []
    fetchQuizzes,
    sessionId,
    setSessionId,
    loading,
    error,
  } = useQuizStore();

  // ✅ Fetch quizzes when sessionId is set
  useEffect(() => {
    if (sessionId) {
      fetchQuizzes(sessionId);
    }
  }, [sessionId, fetchQuizzes]);

  // ✅ Temporary: set a sessionId if not set
  useEffect(() => {
    if (!sessionId) {
      setSessionId("test-session-123"); // replace with real session id
    }
  }, [sessionId, setSessionId]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-600 mt-2">
          Test your knowledge and track your progress
        </p>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-blue-600">Loading quizzes...</p>}
      {error && <p className="text-red-600">⚠️ {error}</p>}

      {/* Stats Cards */}
      {!loading && quizzes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedQuizzes.length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedQuizzes.length > 0
                    ? Math.round(
                        completedQuizzes.reduce(
                          (acc, quiz) => acc + (quiz.score || 0),
                          0
                        ) / completedQuizzes.length
                      )
                    : 0}
                  %
                </p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("available")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "available"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Available Quizzes ({availableQuizzes?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "completed"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Completed ({completedQuizzes?.length || 0})
            </button>
          </nav>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {(activeTab === "available" ? availableQuizzes : completedQuizzes)?.map(
          (quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                    quiz.difficulty
                  )}`}
                >
                  {quiz.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{quiz.subject}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Questions</span>
                  <span>{quiz.questions}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Duration</span>
                  <span>{quiz.duration} min</span>
                </div>
                {quiz.completed && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Score</span>
                    <span className="font-semibold text-green-600">
                      {quiz.score}%
                    </span>
                  </div>
                )}
              </div>

              <button
                className={`w-full px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2 ${
                  quiz.completed
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors`}
              >
                {quiz.completed ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Review Quiz</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Start Quiz</span>
                  </>
                )}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Quizzes;
