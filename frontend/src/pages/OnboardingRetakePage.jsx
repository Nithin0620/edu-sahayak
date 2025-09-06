import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Heart, Loader, ArrowLeft } from 'lucide-react';
import useAuthStore from '../ZustandStore/Auth';

const OnboardingRetakePage = () => {
   const navigate = useNavigate();
   const { retakeOnboarding, loading, user } = useAuthStore();
   
   const [eqAnswers, setEqAnswers] = useState({
      q1: 0, q2: 0, q3: 0, q4: 0, q5: 0
   });
   
   const [ilsAnswers, setIlsAnswers] = useState({
      q1: '', q2: '', q3: '', q4: ''
   });

   // ...existing questions arrays from OnboardingPage...
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
      const eqScore = Object.values(eqAnswers).reduce((sum, val) => sum + val, 0);
      
      let eqLevel;
      if (eqScore >= 5 && eqScore <= 12) {
         eqLevel = "Low";
      } else if (eqScore >= 13 && eqScore <= 19) {
         eqLevel = "Moderate";
      } else if (eqScore >= 20 && eqScore <= 25) {
         eqLevel = "High";
      } else {
         eqLevel = "Invalid";
      }

      const learningStyle = {
         processing: ilsAnswers.q1 === 'a' ? 'Active' : 'Reflective',
         perception: ilsAnswers.q2 === 'a' ? 'Sensing' : 'Intuitive', 
         input: ilsAnswers.q3 === 'a' ? 'Visual' : 'Verbal',
         understanding: ilsAnswers.q4 === 'a' ? 'Sequential' : 'Global'
      };

      return { 
         eq_score: eqScore, 
         eq_level: eqLevel, 
         learning_style: learningStyle 
      };
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      const allEqAnswered = Object.values(eqAnswers).every(val => val > 0);
      const allIlsAnswered = Object.values(ilsAnswers).every(val => val !== '');
      
      if (!allEqAnswered || !allIlsAnswered) {
         alert("Please answer all questions before proceeding.");
         return;
      }

      const onboardingResults = calculateScores();
      const success = await retakeOnboarding(onboardingResults);
      
      if (success) {
         navigate("/dashboard");
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
                  Retake Onboarding Assessment
               </h2>
               <p className="mt-2 text-center text-sm text-purple-100">
                  Update your learning profile based on your progress
               </p>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
               {/* Same form structure as OnboardingPage */}
               <form onSubmit={handleSubmit} className="space-y-8">
                  {/* EQ Questions */}
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
                                       checked={eqAnswers[`q${index + 1}`] === value}
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

                  {/* ILS Questions */}
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
                                    checked={ilsAnswers[`q${index + 1}`] === 'a'}
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
                                    checked={ilsAnswers[`q${index + 1}`] === 'b'}
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
                        onClick={() => navigate("/dashboard")}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                     >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                     </button>
                     <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50 flex items-center"
                     >
                        {loading ? (
                           <>
                              <Loader className="animate-spin mr-2 h-4 w-4" />
                              Updating...
                           </>
                        ) : (
                           "Update Profile"
                        )}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default OnboardingRetakePage;
