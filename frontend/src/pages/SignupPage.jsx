import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User } from 'lucide-react';
import useAuthStore from '../ZustandStore/Auth';
import { Loader } from 'lucide-react';
import { MdOutlineClass } from "react-icons/md";



const SignupPage = () => {

   const classArray= [1,2,3,4,5,6,7,8,9,10,11,12]

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      whichClass:'',
   });

   const navigate = useNavigate();
   const { sendOTP ,setFormDatainStore,loading} = useAuthStore();

   const handleChange = (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });

   const handleSubmit = (e) => {
      e.preventDefault();
      if (
         formData.name &&
         formData.email &&
         formData.password &&
         formData.password === formData.confirmPassword
      ) {
         setFormDatainStore(formData);
         const success =sendOTP(formData.email, navigate);
         if(success){
            navigate("/verify-email")
         }
      } else {
         alert("Passwords don't match or fields are empty");
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
               Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-blue-100">
               Sign up to start learning
            </p>
         </div>

         <div className="bg-white rounded-lg shadow-xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
               <div>
               <label className="block text-sm font-medium text-gray-700">Name</label>
               <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                     name="name"
                     type="text"
                     required
                     value={formData.name}
                     onChange={handleChange}
                     className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                     placeholder="Enter your name"
                  />
               </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 relative">
                     <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                     <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder="Enter your email"
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Current Class</label>
                  <div className="mt-1 relative">
                     <MdOutlineClass className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                     <select
                        name="whichClass"
                        required
                        value={formData.whichClass}
                        onChange={handleChange}
                        className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none"
                     >
                        <option value="" disabled className='text-grey-400 w-10'>
                           Select your current class
                        </option>
                        {classArray.map((index,Class) => (
                           <option className=' w-10 rounded-full overflow-y-scroll' key={index + 1} value={Class+1}>
                              Class {Class+1}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>

               <div>
               <label className="block text-sm font-medium text-gray-700">Password</label>
               <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                     name="password"
                     type="password"
                     required
                     value={formData.password}
                     onChange={handleChange}
                     className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                     placeholder="Enter your password"
                  />
               </div>
               </div>

               <div>
               <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
               <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                     name="confirmPassword"
                     type="password"
                     required
                     value={formData.confirmPassword}
                     onChange={handleChange}
                     className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                     placeholder="Confirm your password"
                  />
               </div>
               </div>

               <div>
               <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
               >
                  {
                     loading ?  <Loader  className="animate-spin"/> : "Send OTP"
                  }
               </button>
               </div>
               <div onClick={()=>navigate("/")} className="flex justify-end font-thin text-thin">
                  - Back to Home
               </div>
            </form>
         </div>
         </div>
      </div>
   );
};

export default SignupPage;
