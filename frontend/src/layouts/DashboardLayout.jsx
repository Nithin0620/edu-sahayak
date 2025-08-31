import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import useAuthStore from '../ZustandStore/Auth';

const DashboardLayout = ({ children }) => {

  const {isAuthenticated} = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 min-h-screen relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;