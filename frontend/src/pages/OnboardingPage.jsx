import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Heart, Loader } from 'lucide-react';
import useAuthStore from '../ZustandStore/Auth';

const OnboardingPage = () => {
   const navigate = useNavigate();
   const { sendOTP, formData, loading } = useAuthStore();
   
   const [eqAnswers, setEqAnswers] = useState({
      q1: 0, q2: 0, q3: 0, q4: 0, q5: 0
   });
   
   const [ilsAnswers, setIlsAnswers] = useState({
      q1: '', q2: '', q3: '', q4: '', q5: ''
   });

   const eqQuestions = [
      "I can tell when my mood is beginning to change during study sessions.",
      "I am aware of how my emotions affect my focus.", 
      "I can recognize when frustration is holding me back from learning.",
      "I know how to calm myself when I feel overwhelmed by a topic.",
      "I often reflect on how my emotional state influences my academic performance."
   ];

   const ilsQuestions = [
      {
         question: "I understand something better if I:",
         options: { a: "try it out", b: "think it through" },
         type: "Processing"
      },
      {
         question: "I prefer information that is:",
         options: { a: "factual", b: "conceptual" },
         type: "Perception"
      },
      {
         question: "When recalling a story, I remember:",
         options: { a: "pictures", b: "words" },
         type: "Input"
      },
      {
         question: "I learn best by:",
         options: { a: "following step-by-step logic", b: "grasping the big picture" },
         type: "Understanding"
      }
   ];

   const handleEqChange = (questionIndex, value) => {
      setEqAnswers(prev => ({
         ...prev,
         [`q${questionIndex + 1}`]: parseInt(value)
      }));
   };

   const handleIlsChange = (questionIndex, value) => {
      setIlsAnswers(prev => ({
         ...prev,
         [`q${questionIndex + 1}`]: value
      }));
   };

   const calculateScores = () => {
      const eqScore = Object.values(eqAnswers).reduce((sum, val) => sum + val, 0) + 1;
      
      let eqClassification;
      if (eqScore <= 12) eqClassification = "Low EQ - Needs strong emotional regulation support";
      else if (eqScore <= 19) eqClassification = "Moderate EQ - Some awareness, can improve self-regulation";
      else eqClassification = "High EQ - High emotional awareness, can self-adjust effectively";

      return { eqScore, eqClassification, ilsAnswers };
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      const allEqAnswered = Object.values(eqAnswers).every(val => val > 0);
      const allIlsAnswered = Object.values(ilsAnswers).every(val => val !== '');
      
      if (!allEqAnswered || !allIlsAnswered) {
         alert("Please answer all questions before proceeding.");
         return;
      }

      const scores = calculateScores();
      
      // Store the onboarding results
      console.log("Onboarding Results:", scores);
      
      // Send OTP after completing onboarding
      if (formData?.email) {
         const success = await sendOTP(formData.email, navigate);
         if (success) {
            navigate("/verify-email");
         }
      } else {
         alert("Email not found. Please go back to signup.");
         navigate("/signup");
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-4xl w-full space-y-8">
            <div>
               <div className="flex justify-center">
                  <BookOpen className="h-12 w-12 text-white" />
               </div>
               <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                  Onboarding Assessment
               </h2>
               <p className="mt-2 text-center text-sm text-purple-100">
                  Help us understand your learning style and emotional awareness
               </p>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
               <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Part A - Emotional Self-Awareness */}
                  <div>
                     <div className="flex items-center mb-6">
                        <Heart className="h-6 w-6 text-red-500 mr-2" />
                        <h3 className="text-xl font-bold text-gray-800">Part A – Emotional Self-Awareness (EQ)</h3>
                     </div>
                     <p className="text-sm text-gray-600 mb-4">
                        Rate each statement: 1 = Strongly Disagree | 2 = Disagree | 3 = Neutral | 4 = Agree | 5 = Strongly Agree
                     </p>
                     
                     {eqQuestions.map((question, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                           <p className="mb-3 font-medium text-gray-700">{question}</p>
                           <div className="flex space-x-4">
                              {[1, 2, 3, 4, 5].map(value => (
                                 <label key={value} className="flex items-center">
                                    <input
                                       type="radio"
                                       name={`eq_q${index + 1}`}
                                       value={value}
                                       onChange={(e) => handleEqChange(index, e.target.value)}
                                       className="mr-2"
                                    />
                                    <span className="text-sm">{value}</span>
                                 </label>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Part B - Learning Style */}
                  <div>
                     <div className="flex items-center mb-6">
                        <Brain className="h-6 w-6 text-blue-500 mr-2" />
                        <h3 className="text-xl font-bold text-gray-800">Part B – Learning Style (ILS)</h3>
                     </div>
                     <p className="text-sm text-gray-600 mb-4">
                        Choose either (a) or (b) for each question:
                     </p>
                     
                     {ilsQuestions.map((item, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                           <p className="mb-3 font-medium text-gray-700">{item.question}</p>
                           <div className="space-y-2">
                              <label className="flex items-center">
                                 <input
                                    type="radio"
                                    name={`ils_q${index + 1}`}
                                    value="a"
                                    onChange={(e) => handleIlsChange(index, e.target.value)}
                                    className="mr-2"
                                 />
                                 <span>(a) {item.options.a}</span>
                              </label>
                              <label className="flex items-center">
                                 <input
                                    type="radio"
                                    name={`ils_q${index + 1}`}
                                    value="b"
                                    onChange={(e) => handleIlsChange(index, e.target.value)}
                                    className="mr-2"
                                 />
                                 <span>(b) {item.options.b}</span>
                              </label>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="flex justify-between">
                     <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                     >
                        Back to Signup
                     </button>
                     <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50 flex items-center"
                     >
                        {loading ? (
                           <>
                              <Loader className="animate-spin mr-2 h-4 w-4" />
                              Sending OTP...
                           </>
                        ) : (
                           "Complete & Send OTP"
                        )}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default OnboardingPage;
