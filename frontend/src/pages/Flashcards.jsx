import { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  RotateCw,
  ChevronDown,
} from "lucide-react";
import chaptersData from "../data/chapters_per_subject.json";
import { useFlashcardStore } from "../ZustandStore/flashcardStore";
import useAuthStore from "../ZustandStore/Auth";

const Flashcards = () => {
  const { user } = useAuthStore();
  const {
    loading,
    error,
    flashcardSets,
    generateFlashcards,
    fetchAllFlashcards,
    clearError,
  } = useFlashcardStore();

  const [selectedSet, setSelectedSet] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Form state
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [count, setCount] = useState("3");
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);

  const userClass = user?.profile?.class || "10";

  const getSubjectsForClass = () => {
    const classData = chaptersData[userClass];
    return classData ? Object.keys(classData) : [];
  };

  const getChaptersForSubject = () => {
    if (!selectedSubject) return [];
    const classData = chaptersData[userClass];
    return classData?.[selectedSubject] || [];
  };

  const handleCardFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNextCard = () => {
    if (selectedSet && currentCard < selectedSet.cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  const handleSetSelect = (set) => {
    setSelectedSet(set);
    setCurrentCard(0);
    setShowAnswer(false);
  };

  // Load flashcards on component mount
  useEffect(() => {
    fetchAllFlashcards();
  }, []);

  // Handle flashcard generation
  const handleGenerateFlashcards = async () => {
    if (!selectedSubject || !selectedChapter || !count) {
      return;
    }

    setGenerating(true);
    try {
      await generateFlashcards({
        count,
        class_num: userClass,
        subject: selectedSubject,
        chapter: selectedChapter,
      });

      // Clear form after successful generation
      setSelectedSubject("");
      setSelectedChapter("");
      setCount("3");
    } catch (error) {
      console.error("Failed to generate flashcards:", error);
    } finally {
      setGenerating(false);
    }
  };

  if (selectedSet) {
    const card = selectedSet.cards[currentCard];

    return (
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <button
            onClick={() => setSelectedSet(null)}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Sets
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Flashcard Set</h1>
          <p className="text-gray-600 mt-2">
            Card {currentCard + 1} of {selectedSet.cards.length}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 min-h-96 flex flex-col justify-center">
            <div className="text-center">
              <div className="mb-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {showAnswer ? "Answer" : "Question"}
                </h2>
              </div>

              <div className="text-lg text-gray-700 mb-8">
                {showAnswer ? card.answer : card.question}
              </div>

              <button
                onClick={handleCardFlip}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <RotateCw className="h-5 w-5" />
                <span>Flip Card</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevCard}
              disabled={currentCard === 0}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {selectedSet.cards.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentCard ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextCard}
              disabled={currentCard === selectedSet.cards.length - 1}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Flashcards
        </h1>
        <p className="text-gray-600 mt-2">
          Create and study with digital flashcards
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Generate New Flashcard Set - Class {userClass}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Subject Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span
                className={
                  selectedSubject ? "text-gray-900" : "text-gray-500"
                }
              >
                {selectedSubject || "Select Subject"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {isSubjectDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {getSubjectsForClass().map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setSelectedChapter("");
                      setIsSubjectDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 capitalize"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chapter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
              disabled={!selectedSubject}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <span
                className={
                  selectedChapter ? "text-gray-900" : "text-gray-500"
                }
              >
                {selectedChapter || "Select Chapter"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {isChapterDropdownOpen && selectedSubject && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {getChaptersForSubject().map((chapter) => (
                  <button
                    key={chapter}
                    onClick={() => {
                      setSelectedChapter(chapter);
                      setIsChapterDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 text-sm"
                  >
                    {chapter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Count Input */}
          <select
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3">3 Cards</option>
            <option value="5">5 Cards</option>
            <option value="10">10 Cards</option>
            <option value="15">15 Cards</option>
          </select>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button
              onClick={clearError}
              className="ml-2 text-red-800 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        <button
          onClick={handleGenerateFlashcards}
          disabled={
            generating ||
            loading ||
            !selectedSubject ||
            !selectedChapter
          }
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-5 w-5" />
          <span>
            {generating ? "Generating..." : "Generate New Set"}
          </span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-blue-600">Loading flashcards...</p>
        </div>
      )}

      {/* Flashcard Sets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {flashcardSets.map((set, index) => (
          <div
            key={set._id || index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Flashcard Set #{index + 1}
            </h3>
            <p className="text-sm text-gray-600 mb-4">Auto-generated</p>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{set.cards?.length || 0} cards</span>
              <span>Recent</span>
            </div>

            <button
              onClick={() => handleSetSelect(set)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Study Set
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && flashcardSets.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No flashcard sets yet
          </h3>
          <p className="text-gray-500">Generate your first set to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Flashcards;