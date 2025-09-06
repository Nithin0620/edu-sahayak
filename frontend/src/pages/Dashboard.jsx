import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import axios from "axios";
import {
  BookOpen,
  Users,
  Brain,
  CreditCard,
  TrendingUp,
  Clock,
  Award,
  X,
  CheckCircle,
} from "lucide-react";
import useAuthStore from "../ZustandStore/Auth";
import { useNavigate } from "react-router-dom";
import chaptersData from "../data/chapters_per_subject.json";
import { useChatStore } from "../ZustandStore/chatStore";
import { MessageCircle } from "lucide-react";
import { formatChatDate } from "../../utility/formatChatDate";
// import { dasboardChatClickHandler } from './ChatBot';
import QuizBarChart from "../components/QuizBarChart";

const Dashboard = () => {
  const cardsRef = useRef(null);
  const statsRef = useRef(null);
  const [score, setScore] = useState([2, 10, 4, 3, 10]);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Modal state
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedChapters, setCompletedChapters] = useState({});

  // Get subjects based on user's class
  const getUserSubjects = () => {
    const userClass = user.profile.class || "1";
    const classData = chaptersData[userClass];

    if (!classData) return [];

    return Object.keys(classData).map((subject) => ({
      name: subject,
      chapters: classData[subject],
    }));
  };

  const userSubjects = getUserSubjects();

  const handleScore = async () => {
    try {
      console.log("Fetching quiz scores...");
      const response = await axios.get(
        "http://localhost:4000/api/score/getuserquizscore",
        { withCredentials: true } // ⬅️ needed if you use cookies/JWT
      );
      console.log("Quiz Scores Response:", response.data);
      setScore(response.data); // this should be your [4,7,9,...] array
    } catch (e) {
      console.error("Error fetching scores:", e.message);
    }
  };

  useEffect(() => {
    handleScore();
  }, []);
  // Subject colors for variety
  const subjectColors = [
    { bg: "bg-blue-100", text: "text-blue-600", progress: "bg-blue-600" },
    { bg: "bg-green-100", text: "text-green-600", progress: "bg-green-600" },
    { bg: "bg-purple-100", text: "text-purple-600", progress: "bg-purple-600" },
    { bg: "bg-orange-100", text: "text-orange-600", progress: "bg-orange-600" },
    { bg: "bg-pink-100", text: "text-pink-600", progress: "bg-pink-600" },
    { bg: "bg-indigo-100", text: "text-indigo-600", progress: "bg-indigo-600" },
    { bg: "bg-yellow-100", text: "text-yellow-600", progress: "bg-yellow-600" },
    { bg: "bg-red-100", text: "text-red-600", progress: "bg-red-600" },
    { bg: "bg-teal-100", text: "text-teal-600", progress: "bg-teal-600" },
    { bg: "bg-cyan-100", text: "text-cyan-600", progress: "bg-cyan-600" },
  ];

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubject(null);
  };

  const toggleChapterCompletion = (subjectName, chapterIndex) => {
    setCompletedChapters((prev) => {
      const subjectKey = subjectName;
      const currentCompleted = prev[subjectKey] || [];
      const isCompleted = currentCompleted.includes(chapterIndex);

      if (isCompleted) {
        return {
          ...prev,
          [subjectKey]: currentCompleted.filter(
            (index) => index !== chapterIndex
          ),
        };
      } else {
        return {
          ...prev,
          [subjectKey]: [...currentCompleted, chapterIndex],
        };
      }
    });
  };

  const getProgressPercentage = (subject) => {
    const completedForSubject = completedChapters[subject.name] || [];
    return Math.round(
      (completedForSubject.length / subject.chapters.length) * 100
    );
  };

  const { fetchSessions, sessions } = useChatStore();

  const handleRecentChatClick = async (session) => {
    // setIsSessionSelected(session)
    // dasboardChatClickHandler(session);
    navigate("/chatbot");
  };

  useEffect(() => {
    fetchSessions(); // Load recent chats
    gsap.fromTo(
      cardsRef.current.children,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.3,
        ease: "back.out(1.7)",
      }
    );
    if (isAuthenticated) navigate("/dashboard");
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome Back, Student!
        </h1>
        <p className="text-gray-600 mt-2">
          Ready to continue your learning journey?
        </p>
      </div>

      <div className="grid grid-cols-1 mb-5 md:grid-cols-2 gap-8">
        {/* Recent Chats */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Recent Chats
          </h2>

          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.slice(0, 3).map((session) => (
                <div
                  key={session._id}
                  onClick={() => handleRecentChatClick(session)}
                  title={session.title}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 cursor-pointer flex items-start space-x-4 transition-all duration-200"
                >
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {session.chapter}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatChatDate(session.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent chats yet.</p>
          )}
        </div>

        {/* Quiz Performance Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Quiz Performance
          </h2>
          <div className="h-72">
            <QuizBarChart scores={score} />
          </div>
        </div>
      </div>

      {/* Learning Resources Grid */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Your Subjects - Class {user?.profile?.class || "Not set"}
        </h2>
        {userSubjects.length > 0 ? (
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {userSubjects.map((subject, index) => {
              const colorScheme = subjectColors[index % subjectColors.length];
              const progressPercentage = getProgressPercentage(subject);

              return (
                <div
                  key={subject.name}
                  onClick={() => handleSubjectClick(subject)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div
                    className={`${colorScheme.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                  >
                    <BookOpen className={`h-6 w-6 ${colorScheme.text}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                    {subject.name.replace(/[-_]/g, " ")}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {subject.chapters.length} chapters available
                  </p>
                  <div className="bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`${colorScheme.progress} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {progressPercentage}% Complete
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No subjects found for your class. Please update your class
              information.
            </p>
          </div>
        )}
      </div>

      {/* Chapter Modal */}
      {isModalOpen && selectedSubject && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl mt-15">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 capitalize truncate">
                  {selectedSubject.name.replace(/[-_]/g, " ")}
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                  {getProgressPercentage(selectedSubject)}% Complete •{" "}
                  {selectedSubject.chapters.length} Chapters
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4 flex-shrink-0"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm text-gray-500">
                  {completedChapters[selectedSubject.name]?.length || 0} of{" "}
                  {selectedSubject.chapters.length}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${getProgressPercentage(selectedSubject)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Chapters List */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {selectedSubject.chapters.map((chapter, index) => {
                  const isCompleted =
                    completedChapters[selectedSubject.name]?.includes(index);

                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() =>
                        toggleChapterCompletion(selectedSubject.name, index)
                      }
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isCompleted
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 hover:border-green-400"
                        }`}
                      >
                        {isCompleted && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span
                        className={`flex-1 text-sm leading-relaxed ${
                          isCompleted
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {chapter}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Click on chapters to mark them as complete
                </span>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
