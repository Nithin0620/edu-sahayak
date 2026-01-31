import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:4000"
  : "https://edu-sahayak-ykp2.onrender.com";

export const useFlashcardStore = create((set, get) => ({
  loading: false,
  error: null,
  cards: [],
  flashcardSets: [],

  // Generate new flashcards
  generateFlashcards: async ({ count, class_num, subject, chapter, sessionId = "" }) => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/cards/flashcard/generate`,
        {
          sessionId,
          count,
          class_num,
          subject,
          chapter
        }
        ,{
        withCredentials:true
      }
      );

      // Add the new set to existing sets
      set((state) => ({
        flashcardSets: [...state.flashcardSets, response.data],
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Fetch all flashcard sets
  fetchAllFlashcards: async () => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/cards/getallflashcards`,{
        withCredentials:true
      }
      );

      set({
        flashcardSets: response.data || [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));