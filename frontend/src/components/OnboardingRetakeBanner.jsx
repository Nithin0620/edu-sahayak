import { useState, useEffect } from 'react';
import { Calendar, RefreshCcw, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../ZustandStore/Auth';

const OnboardingRetakeBanner = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [canRetake, setCanRetake] = useState(false);

  useEffect(() => {
    if (!user?.createdAt) return;

    const calculateDaysRemaining = () => {
      const accountCreatedDate = new Date(user.createdAt);
      const lastRetakeDate = user.profile?.onboardingRetakeDate 
        ? new Date(user.profile.onboardingRetakeDate)
        : accountCreatedDate;
      
      const today = new Date();
      const oneMonthFromLastRetake = new Date(lastRetakeDate);
      oneMonthFromLastRetake.setMonth(oneMonthFromLastRetake.getMonth() + 1);
      
      const timeDiff = oneMonthFromLastRetake.getTime() - today.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      setDaysRemaining(Math.max(0, days));
      setCanRetake(days <= 0);
    };

    calculateDaysRemaining();
    const interval = setInterval(calculateDaysRemaining, 1000 * 60 * 60); // Update every hour
    
    return () => clearInterval(interval);
  }, [user]);

  const handleRetakeClick = () => {
    navigate('/onboarding-retake');
  };

  const formatAccountCreatedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user?.createdAt) return null;

  return (
    <div className={`rounded-lg p-6 mb-6 border-l-4 ${
      canRetake 
        ? 'bg-green-50 border-green-400' 
        : 'bg-blue-50 border-blue-400'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {canRetake ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
            )}
            <h3 className={`text-lg font-semibold ${
              canRetake ? 'text-green-800' : 'text-blue-800'
            }`}>
              {canRetake ? 'Onboarding Retake Available!' : 'Onboarding Retake'}
            </h3>
          </div>
          
          <p className={`text-sm mb-3 ${
            canRetake ? 'text-green-700' : 'text-blue-700'
          }`}>
            {canRetake 
              ? 'You can now retake your onboarding assessment to update your learning profile based on your progress.'
              : `You'll be able to retake your onboarding assessment in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`
            }
          </p>
          
          {/* <div className="flex items-center text-xs text-gray-600 mb-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Account created: {formatAccountCreatedDate(user.createdAt)}</span>
          </div> */}

          {user.profile?.onboardingRetakeDate && (
            <div className="flex items-center text-xs text-gray-600 mb-4">
              <RefreshCcw className="h-4 w-4 mr-1" />
              <span>Last retake: {formatAccountCreatedDate(user.profile.onboardingRetakeDate)}</span>
            </div>
          )}

          {!canRetake && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.max(0, 100 - (daysRemaining / 30) * 100)}%` 
                }}
              ></div>
            </div>
          )}
        </div>

        <div className="ml-4">
          <button
            onClick={handleRetakeClick}
            disabled={!canRetake}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              canRetake
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <RefreshCcw className="h-4 w-4" />
            <span>{canRetake ? 'Retake Now' : `${daysRemaining} days left`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingRetakeBanner;
