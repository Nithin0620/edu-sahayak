import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:4000/api/requirement"
  : "/api/requirement";


export const useFlashcardStore = create((set) => ({
  loading: false,
  error: null,
  cards: [],

   fetchFlashcardsQuestions: async (query) => {
      set({ loading: true, error: null });
      try {
         const response = await axios.get(`${BASE_URL}/flashcards`, {
         params: { query } 
         });

         if (response.data?.success) {
         set({
            cards: response.data.data.results,
            loading: false,
         });
         } else {
         set({
            error: response.data.message || 'Failed to fetch flashcards',
            loading: false,
         });
         }
      } catch (error) {
         set({
         error: error.response?.data?.message || error.message,
         loading: false,
         });
      }
   }
}));