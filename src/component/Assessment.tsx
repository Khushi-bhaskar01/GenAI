import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, ArrowLeft, CheckCircle, XCircle, Target, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  totalQuestions: number;
  category: string;
}

interface UserAnswer {
  questionId: number;
  selectedOption: number;
}

const AssessmentPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'selector' | 'test' | 'results'>('selector');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const quizData: QuizQuestion[] = [
    {
      id: 1,
      question: "What is the primary purpose of a function in programming?",
      options: [
        "To store data permanently",
        "To reuse code and organize logic",
        "To create visual interfaces",
        "To connect to databases"
      ],
      correct: 1,
      category: "Programming Fundamentals"
    },
    {
      id: 2,
      question: "Which of the following best describes responsive web design?",
      options: [
        "Websites that load quickly",
        "Websites that work on multiple devices and screen sizes",
        "Websites with interactive animations", 
        "Websites that use modern frameworks"
      ],
      correct: 1,
      category: "Web Development"
    },
    {
      id: 3,
      question: "What is the main advantage of version control systems like Git?",
      options: [
        "They make code run faster",
        "They automatically fix bugs",
        "They track changes and enable collaboration",
        "They provide hosting for websites"
      ],
      correct: 2,
      category: "Development Tools"
    },
    {
      id: 4,
      question: "In data analysis, what does SQL primarily help you do?",
      options: [
        "Create machine learning models",
        "Query and manipulate databases",
        "Design user interfaces",
        "Write mobile applications"
      ],
      correct: 1,
      category: "Data Management"
    },
    {
      id: 5,
      question: "What is the purpose of API in software development?",
      options: [
        "To style web pages",
        "To enable communication between different software systems",
        "To store user passwords",
        "To create animations"
      ],
      correct: 1,
      category: "Software Architecture"
    }
  ];

  const assessments: Assessment[] = [
    {
      id: 'programming-fundamentals',
      title: 'Programming Fundamentals',
      description: 'Test your knowledge of basic programming concepts',
      estimatedTime: '5 Questions • 10 mins',
      totalQuestions: 5,
      category: 'Programming'
    },
    {
      id: 'web-development',
      title: 'Web Development Basics',
      description: 'Assess your understanding of web technologies',
      estimatedTime: '4 Questions • 8 mins',
      totalQuestions: 4,
      category: 'Web Development'
    },
    {
      id: 'data-structures',
      title: 'Data Structures & Algorithms',
      description: 'Challenge yourself with DSA questions',
      estimatedTime: '6 Questions • 15 mins',
      totalQuestions: 6,
      category: 'Computer Science'
    }
  ];

  const currentQuestion = quizData[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
  const navigate = useNavigate();

  useEffect(() => {
    // Load previous answer if exists
    const existingAnswer = userAnswers.find(a => a.questionId === currentQuestion?.id);
    if (existingAnswer) {
      setSelectedOption(existingAnswer.selectedOption);
    } else {
      setSelectedOption(null);
    }
  }, [currentQuestionIndex, userAnswers, currentQuestion?.id]);

  const startAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setCurrentView('test');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null && currentQuestion) {
      // Save current answer
      const newAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedOption: selectedOption
      };

      const updatedAnswers = userAnswers.filter(a => a.questionId !== currentQuestion.id);
      updatedAnswers.push(newAnswer);
      setUserAnswers(updatedAnswers);

      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Calculate score and show results
        calculateScore(updatedAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = (answers: UserAnswer[]) => {
    let correct = 0;
    answers.forEach(answer => {
      const question = quizData.find(q => q.id === answer.questionId);
      if (question && question.correct === answer.selectedOption) {
        correct++;
      }
    });
    setScore(correct);
    setCurrentView('results');
  };

  const getScoreMessage = () => {
    const percentage = (score / quizData.length) * 100;
    if (percentage >= 80) return "Excellent! You have a strong grasp of the fundamentals.";
    if (percentage >= 60) return "Good job! You're on the right track with room for improvement.";
    if (percentage >= 40) return "Not bad! Focus on strengthening your foundational knowledge.";
    return "Keep learning! Consider reviewing the basics before advanced topics.";
  };

  const resetAssessment = () => {
    setCurrentView('selector');
    setSelectedAssessment(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setScore(0);
  };

  return (
    <div className="min-h-screen p-6 pt-25">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold text-white mb-4">
              Skill Assessment
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-blue-400 rounded-full"></div>
          </div>
          <p className="text-gray-300 text-lg italic mt-6">
            Test your skills with AI-generated questions
          </p>
        </div>

        {/* Assessment Selector */}
        {currentView === 'selector' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Choose Your Assessment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments.map((assessment, index) => (
                <div
                  key={assessment.id}
                  className={`bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50 hover:border-gray-600 transition-all duration-300 cursor-pointer group opacity-0 animate-fade-in`}
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">
                      {assessment.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{assessment.description}</p>
                    
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{assessment.estimatedTime}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => startAssessment(assessment)}
                    className="w-full py-3 bg-blue-400 hover:bg-blue-500 text-black rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Test Section */}
        {currentView === 'test' && currentQuestion && (
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="h-2 bg-blue-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-400">
              <span>Question {currentQuestionIndex + 1} of {quizData.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>

            {/* Question Card */}
            <div className="bg-black/40 rounded-2xl p-8 backdrop-blur-sm border border-gray-800/50">
              <div className="mb-6">
                <span className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-600">
                  {currentQuestion.category}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-8">
                {currentQuestion.question}
              </h2>
              
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedOption === index
                        ? 'border-blue-400 bg-blue-400/10'
                        : 'border-gray-700 bg-black/20 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={selectedOption === index}
                      onChange={() => handleOptionSelect(index)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                      selectedOption === index
                        ? 'border-blue-400 bg-blue-400'
                        : 'border-gray-500'
                    }`}>
                      {selectedOption === index && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-white font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedOption === null
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-400 text-black hover:bg-blue-500 hover:scale-105'
                }`}
              >
                {currentQuestionIndex === quizData.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {currentView === 'results' && (
          <div className="space-y-8 text-center">
            <div className="bg-black/40 rounded-2xl p-8 backdrop-blur-sm border border-gray-800/50">
              <div className="mb-8">
                <Target className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">Assessment Complete!</h2>
              </div>
              
              {/* Score Display */}
              <div className="mb-8">
                <div className="text-6xl font-bold text-white mb-2">
                  {score}<span className="text-gray-400">/{quizData.length}</span>
                </div>
                <div className="text-xl text-gray-300">
                  {Math.round((score / quizData.length) * 100)}% Correct
                </div>
              </div>
              
              {/* Progress Circle */}
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto relative">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#374151"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#a855f7"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / quizData.length)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {Math.round((score / quizData.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Feedback Message */}
              <div className="bg-black/30 rounded-xl p-6 mb-8">
                <p className="text-gray-300 text-lg">
                  {getScoreMessage()}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetAssessment}
                  className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Take Another Assessment
                </button>
                
                <button onClick={()=>{navigate('/roadmap')}} className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-400 hover:bg-blue-500 text-black rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                  <BookOpen className="w-5 h-5" />
                  View Recommended Courses
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AssessmentPage;

