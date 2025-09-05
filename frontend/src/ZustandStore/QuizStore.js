import { create } from "zustand";
import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://edu-sahayak.onrender.com";

export const useQuizStore = create((set, get) => ({
  quizzes: [],
  
  loading: false,
  error: null,
  sessionId: null,
  completedQuizzes : [],

  setSessionId: (id) => set({ sessionId: id }),

  // 🚀 Generate quiz (calls your backend API)
  generateQuiz: async ({ sessionId, class_num, subject, chapter }) => {
    try {
      console.log("sessionId, class_num, subject, chapter",sessionId, class_num, subject, chapter);
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
      const res = await axios.get(`${BASE_URL}/api/quiz/getallquiz`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        quizzes: res.data.quizzes || [],
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
}));
