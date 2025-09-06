// store/useAuthStore.js
import { create } from 'zustand';
import axios from 'axios';
axios.defaults.withCredentials = true;

const BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:4000/api"  // Change this to match your backend port
  : "https://edu-sahayak.onrender.com/api";

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  formData:null,  

  updateFormData: (newData) => {
    const currentFormData = get().formData || {};
    set({ 
      formData: { 
        ...currentFormData, 
        ...newData 
      } 
    });
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
         await axios.post(`${BASE_URL}/auth/logout`,{
        withCredentials:true
      });
      } catch (e) {
         console.error('Logout error:', e);
      }
      set({ isAuthenticated: false, user: null });
   },


   sendOTP: async (email) => {
      set({ loading: true, error: null });
      try {
         console.log("Sending OTP to:", email);
         const response = await axios.post(`${BASE_URL}/auth/sendotp`, { email },{
        withCredentials:true
      });
         console.log("OTP Response:", response.data);
         
         if (response.data?.success) {
            set({ error: null });
            return true;
         } else {
            set({ error: response.data?.message || 'Failed to send OTP' });
            return false;
         }
      } catch (error) {
         console.error("OTP Error:", error);
         set({ 
            error: error.response?.data?.message || 'Failed to send OTP',
            loading: false 
         });
         return false;
      } finally {
         set({ loading: false });
      }
   },

   signup: async (finalData, navigate) => {
      set({ loading: true, error: null });
      try {
         const response = await axios.post(`${BASE_URL}/auth/signup`, finalData,{
        withCredentials:true
      });
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
         const response = await axios.post(`${BASE_URL}/auth/login`, credentials,{
        withCredentials:true
      });
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

   retakeOnboarding: async (onboardingData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.put(
        `${BASE_URL}/api/auth/retake-onboarding`,
        { onboard: onboardingData },{
        withCredentials:true
      }
        
      );

      if (response.data.success) {
        set((state) => ({
          user: {
            ...state.user,
            profile: {
              ...state.user.profile,
              onboard: onboardingData,
              onboardingRetakeDate: new Date().toISOString()
            }
          },
          loading: false,
        }));
        return true;
      }
    } catch (error) {
      console.error("Retake onboarding error:", error);
      set({
        error: error.response?.data?.message || "Failed to update onboarding",
        loading: false,
      });
      return false;
    }
  },

}));

export default useAuthStore;
