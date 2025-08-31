import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../store/slices/authSlice';
import { Menu, X, BookOpen, User, LogOut } from 'lucide-react';
import useAuthStore from '../ZustandStore/Auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {logout,isAuthenticated,user} = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleScroll = (section) => {
    // If already on homepage, trigger scroll
    if (window.location.pathname === '/') {
      window.dispatchEvent(new CustomEvent('scrollToSection', { detail: section }));
    } else {
      // Navigate to homepage and pass scroll target via state
      navigate('/', { state: { scrollTo: section } });
    }
  };
  
  // console.log("this is the user in navbar",user);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-[55]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EduSahayak</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Home
                  </Link>
                  <Link
                    onClick={() => handleScroll('about')}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    About
                  </Link>

                  <Link
                    onClick={() => handleScroll('contact')}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Contact
                  </Link>
                  <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className='block px-3 py-2 bg-blue-600 text-white rounded-md text-base font-medium'>
                    Signup
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{user?.name || 'Student'}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium">
                  Home
                </Link>
                <Link
                  onClick={() => handleScroll('about')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  About
                </Link>

                <Link
                  onClick={() => handleScroll('contact')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Contact
                </Link>
                <Link to="/login" className="block px-3 py-2 bg-blue-600 text-white rounded-md text-base font-medium">
                  Login
                </Link>
                <Link to="/signup" className='block px-3 py-2 bg-blue-600 text-white rounded-md text-base font-medium'>
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium">
                  Dashboard
                </Link>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Welcome, {user?.name || 'Student'}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 bg-red-600 text-white rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;