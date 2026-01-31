import { create } from "zustand";
import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://edu-sahayak-ykp2.onrender.com";

export const useQuizStore = create((set, get) => ({
  quizzes: [],
  loading: false,
  error: null,
  sessionId: null,
  completedQuizzes: [],

  setSessionId: (id) => set({ sessionId: id }),

  // 🚀 Generate quiz (calls your backend API)
  generateQuiz: async ({ sessionId, class_num, subject, chapter }) => {
    try {
      console.log("sessionId, class_num, subject, chapter", sessionId, class_num, subject, chapter);
      set({ loading: true, error: null });

      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/quiz/generate-quiz`,
        { sessionId, class_num, subject, chapter },
      );

      const { quiz, sessionId: newSessionId } = res.data;

      set((state) => ({
        quizzes: quiz || [],
        sessionId: newSessionId || state.sessionId,
        loading: false,
      }));
    } catch (err) {
      console.error("Quiz generate error:", err);
      set({
        error: err.response?.data?.message || "Failed to generate quiz",
        loading: false,
      });
    }
  },

  // 📥 Fetch all saved quizzes
  fetchQuizzes: async () => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/quiz/getallquiz`,{
        withCredentials:true
      }
      );

      set({
        quizzes: res.data.quizzes || [],
        completedQuizzes: res.data.completedQuizzes || [],
        loading: false,
      });
    } catch (err) {
      console.error("Quiz fetch error:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch quizzes",
        loading: false,
      });
    }
  },

  submitQuiz: async ({ quizId, answers }) => {
    try {
      console.log("Submitting quiz:", quizId);
      set({ loading: true, error: null });
      const token = localStorage.getItem("token");
      
      const res = await axios.post(
        `${BASE_URL}/api/quiz/submitquiz`,
        { quizId, answers },{
        withCredentials:true
      }
      );
      
      // After successful submission, refresh the quizzes to update the lists
      const { fetchQuizzes } = get();
      await fetchQuizzes();
      
      set({ loading: false });
      return res.data;
    } catch (err) {
      console.error("Quiz submit error:", err);
      if (err.response) {
        console.error("Backend error response:", err.response.data);
      }
      set({
        error: err.response?.data?.message || "Failed to submit quiz",
        loading: false,
      });
      return err.response?.data || null;
    }
  },
}));
