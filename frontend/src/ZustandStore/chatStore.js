import { create } from 'zustand'
import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:4000/api/chat"
  : "https://edu-sahayak-ykp2.onrender.com/api/chat";


export const useChatStore = create((set, get) => ({
  sessions: [],
  messages: [],
  currentSessionId: null,
  loading: false,
  SidebarLoading:false,
  error: null,
  // isChatSelectedFromDashboard:false,
  // session:null,
  // isSessionSelected:null,

  sendMessage: async ({ sessionId, user_input, class_num, subject, chapter }) => {
    set({ loading: true, error: null });
    console.log("sessionId,",sessionId);

    try {
      // console.log("before calling api",{sessionId,
      //   user_input,
      //   class_num,
      //   subject,
      //   chapter,})
      const response = await axios.post(`${BASE_URL}/message`, {
        sessionId,
        user_input,
        class_num,
        subject,
        chapter,
      },{
        withCredentials:true
      });

      if (response.data?.success) {
        return response.data; // Return the full object with reply & messages
      }

    } catch (err) {
      set({ error: err.message || 'Failed to send message' });
      return null;

    } finally {
      set({ loading: false });
    }
  },

  fetchSessions: async () => {
    set({ SidebarLoading: true, error: null })

    try {
      const response = await axios.get(`${BASE_URL}/sessions`,{
        withCredentials:true
      })

      set({ sessions: response.data?.data || [] })
    }
    catch (err) {
      set({ error: err.message || 'Failed to fetch sessions' })
    } 
    finally{
      set({SidebarLoading:false});
    }
  },

  fetchMessagesBySessionId: async (sessionId) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get(`${BASE_URL}/messages/${sessionId}`,{
        withCredentials:true
      })
      // console.log("response",response)

      set({ 
        messages: response.data?.messages || [],
        currentSessionId: sessionId
      })
    } 
    catch (err) {
      set({ error: err.message || 'Failed to fetch messages' })
    } 
    finally {
      set({ loading: false })
    }
  },

  // setIsSessionSelected : (sessionID)=>{
  //   try{
  //     set({isSessionSelected:sessionID})
  //     console.log(isSessionSelected)
  //   }
  //   catch(e){
  //     console.log(e)
  //   }
  // }
  // setisChatSelectedFromDashboard: (session) => {
  //   set({ isChatSelectedFromDashboard: true },{session:session});
  //   setTimeout(() => {
  //     set({ isChatSelectedFromDashboard: false },{session:null});
  //   }, 10);
  // }

}))
