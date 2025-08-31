import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Hash } from 'lucide-react';
import useAuthStore from '../ZustandStore/Auth';

const OtpVerificationPage = () => {
   const [otp, setOtp] = useState('');
   const navigate = useNavigate();

   const { signup, sendOTP, formData } = useAuthStore();

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData) {
         alert('Missing signup data. Please go back and fill the form again.');
         navigate('/signup');
         return;
      }

      const finalData = {
         ...formData,
         otp,
      };
      console.log(finalData)
      signup(finalData, navigate);
   };

   const handleResend = () => {
      if (formData?.email) {
         sendOTP(formData.email, navigate);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">
         <div>
            <div className="flex justify-center">
               <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
               Verify your Email
            </h2>
            <p className="mt-2 text-center text-sm text-blue-100">
               Enter the OTP sent to your email
            </p>
         </div>

         <div className="bg-white rounded-lg shadow-xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
               <div>
               <label className="block text-sm font-medium text-gray-700">Email</label>
               <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                     type="email"
                     value={formData?.email || ''}
                     disabled
                     className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
               </div>
               </div>

               <div>
               <label className="block text-sm font-medium text-gray-700">OTP</label>
               <div className="mt-1 relative">
                  <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                     name="otp"
                     type="text"
                     required
                     value={otp}
                     onChange={(e) => setOtp(e.target.value)}
                     className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md"
                     placeholder="Enter OTP"
                  />
               </div>
               </div>

               <div>
               <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
               >
                  Verify & Signup
               </button>
               </div>

               <div className="text-center">
               <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline mt-2"
                  onClick={handleResend}
               >
                  Resend OTP
               </button>
               </div>
            </form>
         </div>
         </div>
      </div>
   );
};

export default OtpVerificationPage;
