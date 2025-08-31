// store/useAuthStore.js
import { create } from 'zustand';
import axios from 'axios';
axios.defaults.withCredentials = true;

const BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:4000/api"
  : "/api";

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  formData:null,

  setFormDatainStore :(data)=>{
   set({formData:data});
  },

  loginStart: () => set({ loading: true, error: null }),
  loginSuccess: (user) => set({ isAuthenticated: true, user, loading: false }),
  loginFailure: (error) => set({ loading: false, error }),

   checkAuth: async () => {
      try {
         const response = await axios.get(`${BASE_URL}/auth/check`, {
            withCredentials: true,
         });

         const { success, data } = response.data;

         if (success && data) {
            console.log("✅ Authenticated user:", data); // Debug
            set({
            isAuthenticated: true,
            user: data,
            });
         } else {
            console.warn("⚠️ Auth check failed without 401:", response.data);
            set({ isAuthenticated: false, user: null });
         }
      } 
      catch (error) {
         if (error.response?.status === 401) {
            console.log("🚫 User is not logged in.");
         } else {
            console.error("❌ Unexpected error in checkAuth:", error);
         }
         set({ isAuthenticated: false, user: null });
      } finally {
         set({ loading: false });
      }
   },



   logout: async () => {
      try {
         await axios.post(`${BASE_URL}/auth/logout`);
      } catch (e) {
         console.error('Logout error:', e);
      }
      set({ isAuthenticated: false, user: null });
   },


   sendOTP: async (email, navigate) => {
      set({ loading: true, error: null });
      try {
         const response = await axios.post(`${BASE_URL}/auth/sendotp`, { email });
         if (response.data?.success) {
            navigate('/verify-email'); 
            return success;
         }
      } catch (error) {
         set({ error: error.response?.data?.message || 'Failed to send OTP' });
         return error;
      } finally {
         set({ loading: false });
      }
   },

   signup: async (finalData, navigate) => {
      set({ loading: true, error: null });
      try {
         const response = await axios.post(`${BASE_URL}/auth/signup`, finalData);
         console.log(response)
         if (response.data?.success) {
         get().loginSuccess(response.data.data);
         navigate('/'); 
         }
      } catch (error) {
         set({ error: error.response?.data?.message || 'Signup failed' });
      } finally {
         set({ loading: false });
      }
   },

   login: async (credentials, navigate) => {
      set({ loading: true, error: null });
      try {
         const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
         if (response.data?.success) {
            get().loginSuccess(response.data.data);
            navigate('/'); 
         }
      } catch (error) {
         console.error("Login error:", error.response?.data);
         set({ error: error.response?.data?.message || 'Login failed' });
      } finally {
         set({ loading: false });
      }
      },

}));

export default useAuthStore;
