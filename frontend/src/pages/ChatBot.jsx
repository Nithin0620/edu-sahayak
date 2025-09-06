import { useState, useRef, useEffect, useDebugValue } from 'react';
import { Send, MessageCircle, Bot, User, ChevronDown, Menu, X, Clock, Plus } from 'lucide-react';
import useAuthStore from '../ZustandStore/Auth';
import chaptersData from '../data/chapters_per_subject.json';
import { useChatStore } from '../ZustandStore/chatStore';
import { useYoutubeStore } from '../ZustandStore/Yt-SearchStore';
import {toast} from "react-hot-toast"
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Enhanced LaTeX and Markdown Message Renderer Component
const LaTeXMessageRenderer = ({ content }) => {
  const renderContent = (text) => {
    // First handle LaTeX expressions
    const parts = text.split(/(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    
    return parts.map((part, index) => {
      // Block math delimiters
      if (part.startsWith('\\[') && part.endsWith('\\]')) {
        const math = part.slice(2, -2);
        return (
          <div key={index} className="my-2">
            <BlockMath math={math} />
          </div>
        );
      }
      
      // Display math delimiters
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2);
        return (
          <div key={index} className="my-2">
            <BlockMath math={math} />
          </div>
        );
      }
      
      // Inline math delimiters
      if ((part.startsWith('\\(') && part.endsWith('\\)')) || 
          (part.startsWith('$') && part.endsWith('$') && part.length > 2)) {
        const math = part.startsWith('\\(') ? part.slice(2, -2) : part.slice(1, -1);
        return <InlineMath key={index} math={math} />;
      }
      
      // Process regular text for Markdown
      return <span key={index}>{renderMarkdown(part)}</span>;
    });
  };

  const renderMarkdown = (text) => {
    // Split by lines to handle different markdown elements
    const lines = text.split('\n');
    const elements = [];
    let currentParagraph = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeBlockLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          elements.push(
            <pre key={`code-${i}`} className="bg-gray-100 p-3 rounded-md my-2 overflow-x-auto">
              <code className={`language-${codeBlockLanguage}`}>
                {codeBlockContent.join('\n')}
              </code>
            </pre>
          );
          inCodeBlock = false;
          codeBlockContent = [];
          codeBlockLanguage = '';
        } else {
          // Start of code block
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`para-${i}`} className="mb-2">
                {renderInlineElements(currentParagraph.join(' '))}
              </p>
            );
            currentParagraph = [];
          }
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${i}`} className="mb-2">
              {renderInlineElements(currentParagraph.join(' '))}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h1 key={`h1-${i}`} className="text-2xl font-bold mb-2 mt-4">
            {renderInlineElements(line.slice(2))}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${i}`} className="mb-2">
              {renderInlineElements(currentParagraph.join(' '))}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h2 key={`h2-${i}`} className="text-xl font-bold mb-2 mt-3">
            {renderInlineElements(line.slice(3))}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${i}`} className="mb-2">
              {renderInlineElements(currentParagraph.join(' '))}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg font-bold mb-2 mt-2">
            {renderInlineElements(line.slice(4))}
          </h3>
        );
      } 
      // Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${i}`} className="mb-2">
              {renderInlineElements(currentParagraph.join(' '))}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <li key={`li-${i}`} className="ml-4 mb-1">
            {renderInlineElements(line.slice(2))}
          </li>
        );
      }
      // Empty lines
      else if (line.trim() === '') {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${i}`} className="mb-2">
              {renderInlineElements(currentParagraph.join(' '))}
            </p>
          );
          currentParagraph = [];
        }
      }
      // Regular text
      else {
        currentParagraph.push(line);
      }
    }

    // Handle remaining paragraph
    if (currentParagraph.length > 0) {
      elements.push(
        <p key="final-para" className="mb-2">
          {renderInlineElements(currentParagraph.join(' '))}
        </p>
      );
    }

    return elements;
  };

  const renderInlineElements = (text) => {
    // Handle inline code
    let parts = text.split(/(`[^`]+`)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-gray-100 px-1 py-0.5 rounded text-sm">
            {part.slice(1, -1)}
          </code>
        );
      }
      
      // Handle bold text
      part = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      part = part.replace(/__(.*?)__/g, '<strong>$1</strong>');
      
      // Handle italic text
      part = part.replace(/\*(.*?)\*/g, '<em>$1</em>');
      part = part.replace(/_(.*?)_/g, '<em>$1</em>');
      
      // Handle links
      part = part.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    });
  };

  return <div className="latex-content">{renderContent(content)}</div>;
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your AI study assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const messagesEndRef = useRef(null);
  const messegeRef = useRef(null);

  // Zustand stores
  const { 
    sessions, 
    currentSessionId, 
    loading: chatLoading, 
    error: chatError,
    sendMessage,
    fetchSessions,
    fetchMessagesBySessionId,
    SidebarLoading,
    
  } = useChatStore();


  // useEffect(()=>{
  //   handleChatSelect(isSessionSelected._id)
  // },isSessionSelected)
  
  
  const { 
    videos, 
    loading: youtubeLoading, 
    error: youtubeError,
    fetchYoutubeVideos
  } = useYoutubeStore();

  const user = useAuthStore();
  const userClass = user?.user?.profile?.class || '6';
  // console.log(user)
  // console.log(userClass)

  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    messegeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Get subjects for user's class
   const getSubjectsForClass = () => {
    const classData = chaptersData[userClass];
    return classData ? Object.keys(classData) : [];
  };
  
  // Get chapters for selected subject
  const getChaptersForSubject = () => {
    if (!selectedSubject) return [];
    const classData = chaptersData[userClass];
    return classData?.[selectedSubject] || [];
  };

  // Start new chat
  const startNewChat = () => {
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: 'Hello! I\'m your AI study assistant. How can I help you today?',
        timestamp: new Date()
      }
    ]);
    useChatStore.setState({ currentSessionId: null });
    setIsSidebarOpen(false);
  };

  // Handle sending message

const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!inputMessage.trim()) return;

  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: inputMessage,
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  const messageToSend = inputMessage;
  setInputMessage('');
  setIsTyping(true);

  // Fetch from state or props
  const class_num = parseInt(userClass);
  const subject = selectedSubject;
  const chapter = selectedChapter;

  try {
    if (!class_num) {
      toast.error('We need to know which class you are studying in');
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'Please tell me which class you are studying in.',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    if (!subject || !chapter) {
      toast.error('Please select subject and chapter first');
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          type: 'assistant',
          content: 'Please select which subject and chapter you want to study.',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    console.log({
      sessionId: currentSessionId,
      user_input: messageToSend,
      class_num,
      subject,
      chapter,
    });

    const response = await sendMessage({
      sessionId: currentSessionId,
      user_input: messageToSend,
      class_num,
      subject,
      chapter,
    });
    console.log("response",response)

    if (response?.success && response?.reply) {
      const botMessage = {
        id: Date.now() + 3,
        type: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };
      fetchSessions();
      setMessages(prev => [...prev, botMessage]);

      // Update session if new
      if (response.sessionId && !currentSessionId) {
        useChatStore.setState({ currentSessionId: response.sessionId });
      }

      fetchSessions();
    } else {
      throw new Error('No response from server');
    }
  } catch (error) {
    console.error("this is the error",error);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 4,
        type: 'assistant',
        content: 'Something went wrong. Please try again.',
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

  

  // Handle chat selection from sidebar
  const handleChatSelect = async (session) => {
    setIsTyping(true);
    try {
      console.log(session)
      await fetchMessagesBySessionId(session._id);
      
      // Get the messages from the store
      const sessionMessages = useChatStore.getState().messages;
      
      // Convert API messages to component format
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
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // if(isChatSelectedFromDashboard){
  //   handleChatSelect(session);
  // }

  // Handle YouTube video fetch
  const handleFetchYoutubeVideos = async (query) => {
    const searchQuery = query || `${selectedSubject} ${selectedChapter}` || 'education';
    await fetchYoutubeVideos(searchQuery);
    setShowVideos(true);
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for recent chats
  const formatChatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter function to get only chat sessions (exclude quiz and flashcard sessions)
  const getChatSessions = () => {
    return sessions.filter(session => {
      const title = session.title?.toLowerCase() || '';
      const type = session.type?.toLowerCase();
      
      // Exclude based on type field or title patterns
      if (type === 'quiz' || type === 'flashcard') {
        return false;
      }
      
      // Also exclude based on title patterns for backward compatibility
      return !title.startsWith('quiz') && !title.startsWith('flashcard');
    });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AI Study Assistant</h1>
        <p className="text-gray-600 mt-2">Get instant help with your studies</p>
      </div>

      {/* Subject and Chapter Selection */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Subject & Chapter (Class {userClass})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subject Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className={selectedSubject ? 'text-gray-900' : 'text-gray-500'}>
                {selectedSubject || 'Select Subject'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {isSubjectDropdownOpen && (
              <div className="absolute z-100 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {getSubjectsForClass().map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setSelectedChapter('');
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
              <span className={selectedChapter ? 'text-gray-900' : 'text-gray-500'}>
                {selectedChapter || 'Select Chapter'}
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
        </div>
      </div>

      <div className="flex bg-white rounded-lg shadow-md h-[500px] relative">
        {/* Sidebar */}
        <div className={`absolute inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Chats</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={startNewChat}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                  title="Start New Chat"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Recent Chats List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {SidebarLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading chats...</p>
                </div>
              ) : getChatSessions().length > 0 ? (
                getChatSessions().map((session) => (
                  <div
                    key={session._id}
                    title={session.title}
                    onClick={() => handleChatSelect(session)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 border ${
                      currentSessionId === session._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.title}
                        </p>
                        {session.chapter && (
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {session.chapter}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatChatDate(session.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent chats</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Chat Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg lg:rounded-tl-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md hover:bg-blue-500 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">EduBot</h3>
                  <p className="text-sm text-blue-100">Your AI Study Assistant</p>
                </div>
              </div>
              {selectedSubject && selectedChapter && (
                <div className="text-right">
                  <p className="text-sm font-medium">{selectedChapter}</p>
                  <p className="text-xs text-blue-100">
                    {selectedSubject} • Class {userClass}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3/4 p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1" >
                      <div className="text-sm">
                        <LaTeXMessageRenderer content={message.content} />
                      </div>
                      <p  style={{ maxHeight: '400px' }} ref={messegeRef} className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                placeholder="Ask me anything about your studies..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={chatLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={chatLoading || !inputMessage.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Videos Section */}
      {showVideos && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Related YouTube Videos</h2>
            <button
              onClick={() => setShowVideos(false)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {youtubeLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading videos...</p>
            </div>
          ) : youtubeError ? (
            <div className="text-center py-8">
              <p className="text-red-500">{youtubeError}</p>
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video, index) => {
                const videoId = getYouTubeVideoId(video.url);
                return (
                  <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={video.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                          {video.channel}
                        </span>
                        <span className="text-xs">{video.views?.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{video.days_old} days ago</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No videos found</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Questions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setInputMessage(
              selectedSubject && selectedChapter 
                ? `Explain key concepts in ${selectedChapter} from ${selectedSubject}` 
                : 'Explain photosynthesis'
            )}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Concept Explanation</h3>
                <p className="text-sm text-gray-600">
                  {selectedSubject && selectedChapter 
                    ? `Understand ${selectedChapter} concepts` 
                    : 'Get detailed explanations'
                  }
                </p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => {
              const query = selectedSubject && selectedChapter 
                ? `${selectedSubject} ${selectedChapter}` 
                : 'education';
              handleFetchYoutubeVideos(query);
            }}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">YouTube Videos</h3>
                <p className="text-sm text-gray-600">
                  {selectedSubject && selectedChapter 
                    ? `Get videos for ${selectedChapter}` 
                    : 'Get educational videos'
                  }
                </p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setInputMessage(
              selectedSubject && selectedChapter 
                ? `Give me flashcards for ${selectedChapter} from ${selectedSubject}` 
                : 'Give me flashcards for mathematics'
            )}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Flashcards</h3>
                <p className="text-sm text-gray-600">
                  {selectedChapter ? `Get flashcards for ${selectedChapter}` : 'Get study flashcards'}
                </p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setInputMessage(
              selectedSubject && selectedChapter 
                ? `Give me a summary of ${selectedChapter} from ${selectedSubject}` 
                : 'Give me practice questions'
            )}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedSubject && selectedChapter ? 'Chapter Summary' : 'Practice Questions'}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedSubject && selectedChapter 
                    ? `Get summary of ${selectedChapter}` 
                    : 'Get practice questions'
                  }
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;