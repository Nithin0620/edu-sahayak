// ✅ This is the core logic moved out

import { useChatStore } from "../src/ZustandStore/chatStore";


export const handleChatSelectUtility = async ({
   session,
   setMessages,
   setIsTyping,
   setIsSidebarOpen,
   fetchMessagesBySessionId
}) => {
   setIsTyping(true);
   const {fetchMessagesBySessionId} = useChatStore();
  try {
    await fetchMessagesBySessionId(session._id);

    const sessionMessages = useChatStore.getState().messages;

    const convertedMessages = [
      {
        id: 1,
        type: 'assistant',
        content: 'Hello! I\'m your AI study assistant. How can I help you today?',
        timestamp: new Date()
      }
    ];

    if (sessionMessages && sessionMessages.length > 0) {
      sessionMessages.forEach((msg, index) => {
        convertedMessages.push({
          id: index + 2,
          type: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: new Date(msg.createdAt || Date.now())
        });
      });
    }

    setMessages(convertedMessages);
    setIsSidebarOpen(false);
    useChatStore.setState({ currentSessionId: session._id }); // ✅ also set current session
  } catch (err) {
    console.error('Error loading chat:', err);
  } finally {
    setIsTyping(false);
  }
};
