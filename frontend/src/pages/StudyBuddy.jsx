import { useState } from 'react';
import { Users, Search, Plus, MessageCircle, Star } from 'lucide-react';

const StudyBuddy = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
                  <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Joined
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
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
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
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