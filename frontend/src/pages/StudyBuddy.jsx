import { useState, useRef, useEffect } from 'react';
import { Users, Search, Plus, MessageCircle, Star, Bot, User, Send, Menu, X } from 'lucide-react';

const StudyBuddy = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatGroup, setActiveChatGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const messegeRef = useRef(null);

  const studyGroups = [
    {
      id: 1,
      name: 'Math Masters',
      subject: 'Mathematics',
      members: 12,
      description: 'Advanced calculus and algebra study group',
      rating: 4.8,
      isJoined: true
    },
    {
      id: 2,
      name: 'Science Explorers',
      subject: 'Physics',
      members: 8,
      description: 'Physics concepts and problem solving',
      rating: 4.6,
      isJoined: false
    },
    {
      id: 3,
      name: 'Chemistry Lab',
      subject: 'Chemistry',
      members: 15,
      description: 'Organic and inorganic chemistry discussions',
      rating: 4.9,
      isJoined: false
    },
    {
      id: 4,
      name: 'English Literature Club',
      subject: 'English',
      members: 20,
      description: 'Classic literature analysis and discussions',
      rating: 4.7,
      isJoined: true
    }
  ];

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinGroup = (group) => {
    setActiveChatGroup(group);
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Welcome to ${group.name}! I'm here to help you with ${group.subject}. Feel free to ask any questions about the topics we're studying.`,
        timestamp: new Date()
      }
    ]);
  };

  const handleBackToGroups = () => {
    setActiveChatGroup(null);
    setMessages([]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: `Thanks for your question about "${inputMessage}". As members of ${activeChatGroup.name}, we can discuss this topic together. Let me help you understand this better.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const LaTeXMessageRenderer = ({ content }) => {
    return <div>{content}</div>;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // If chat is active, show chat interface
  if (activeChatGroup) {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-4">
          <button
            onClick={handleBackToGroups}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Study Groups</span>
          </button>
        </div>

        <div className="flex bg-white rounded-lg shadow-md h-[500px] relative overflow-hidden">
          {/* Sidebar */}
          <div className={`absolute inset-y-0 left-0 z-50 w-84 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } border-r border-gray-200`}>
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Group Members</h2>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Members List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-center py-4">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{activeChatGroup.members} members online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Overlay for Mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-40"
              onClick={toggleSidebar}
            />
          )}

          {/* Chat Section */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-blue-500 transition-colors"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{activeChatGroup.name}</h3>
                    <p className="text-sm text-blue-100">{activeChatGroup.subject} Study Group</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{activeChatGroup.members} members</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      <div className="flex-1">
                        <div className="text-sm">
                          <LaTeXMessageRenderer content={message.content} />
                        </div>
                        <p style={{ maxHeight: '400px' }} ref={messegeRef} className={`text-xs mt-1 ${
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
                  placeholder="Ask questions or discuss with group members..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">StudyBuddy</h1>
        <p className="text-gray-600 mt-2">Connect with peers and join study groups</p>
      </div>

      {/* Search and Create */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search study groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Study Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">{group.rating}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{group.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {group.subject}
              </span>
              <span className="text-sm text-gray-500">
                {group.members} members
              </span>
            </div>
            
            <div className="flex space-x-2">
              {group.isJoined ? (
                <>
                  <button 
                    onClick={() => handleJoinGroup(group)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Enter Group
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleJoinGroup(group)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Join Group
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* My Groups Section */}
      <div className="mt-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">My Study Groups</h2>
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="space-y-4">
            {studyGroups.filter(group => group.isJoined).map((group) => (
              <div key={group.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.members} members</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleJoinGroup(group)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Enter Group
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyBuddy;