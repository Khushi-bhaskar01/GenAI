import React, { useState, useEffect } from "react";
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  Target,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface QuizQuestion {
  questionId: string;
  questionText: string;
  options: string[];
  correctOption: string;
  userAnswer?: string;
}

interface Assessment {
  id: string;
  skill: string;
  category: "primary" | "secondary";
  status: "completed" | "in-progress" | "not-started";
  score: string;
  totalQuestions: string;
  attemptedQuestions: string;
  correctAnswers: string;
  questions: QuizQuestion[];
  attemptedAt: string;
  completedAt: string;
  estimatedTime?: string;
}

interface UserAnswer {
  questionId: string;
  selectedOption: string; // This will store the actual option text
  selectedOptionIndex: number; // Store the index for UI consistency
}

const AssessmentPage: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<
    "selector" | "test" | "results"
  >("selector");
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Load user assessments from Firebase
  useEffect(() => {
    const loadUserAssessments = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const userDocRef = doc(db, "user", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          if (userData.assessment && Array.isArray(userData.assessment)) {
            const userAssessments: Assessment[] = userData.assessment.map(
              (assessment: any, index: number) => ({
                id: `assessment-${index}`,
                skill: assessment.skill || "",
                category: assessment.category || "primary",
                status: assessment.status || "not-started",
                score: assessment.score || "0",
                totalQuestions: assessment.totalQuestions || "0",
                attemptedQuestions: assessment.attemptedQuestions || "0",
                correctAnswers: assessment.correctAnswers || "0",
                questions: assessment.questions || [],
                attemptedAt: assessment.attemptedAt || "",
                completedAt: assessment.completedAt || "",
                estimatedTime: `${
                  assessment.questions?.length || 5
                } Questions • ${Math.ceil(
                  (assessment.questions?.length || 5) * 2
                )} mins`,
              })
            );

            setAssessments(userAssessments);
          } else {
            setAssessments([]);
          }
        } else {
          setAssessments([]);
        }
      } catch (error) {
        console.error("Error loading user assessments:", error);
        setError("Failed to load assessments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUserAssessments();
  }, [user]);

  const currentQuestion = selectedAssessment?.questions[currentQuestionIndex];
  const progress = selectedAssessment
    ? ((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100
    : 0;

  useEffect(() => {
    // Load previous answer if exists
    if (currentQuestion) {
      const existingAnswer = userAnswers.find(
        (a) => a.questionId === currentQuestion.questionId
      );
      if (existingAnswer) {
        setSelectedOption(existingAnswer.selectedOptionIndex);
      } else {
        setSelectedOption(null);
      }
    }
  }, [currentQuestionIndex, userAnswers, currentQuestion]);

  const startAssessment = (assessment: Assessment) => {
    if (assessment.questions.length === 0) {
      setError("This assessment has no questions available.");
      return;
    }

    setSelectedAssessment(assessment);
    setCurrentView("test");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setError(null);
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null && currentQuestion && selectedAssessment) {
      // Save current answer with both option text and index
      const selectedOptionText = currentQuestion.options[selectedOption];
      const newAnswer: UserAnswer = {
        questionId: currentQuestion.questionId,
        selectedOption: selectedOptionText,
        selectedOptionIndex: selectedOption,
      };

      // Remove any existing answer for this question and add the new one
      const updatedAnswers = userAnswers.filter(
        (a) => a.questionId !== currentQuestion.questionId
      );
      updatedAnswers.push(newAnswer);
      setUserAnswers(updatedAnswers);

      console.log("Saving answer:", {
        questionId: currentQuestion.questionId,
        selectedOption: selectedOptionText,
        correctOption: currentQuestion.correctOption,
        isCorrect: selectedOptionText === currentQuestion.correctOption,
      });

      if (currentQuestionIndex < selectedAssessment.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Calculate score and save results
        calculateScore(updatedAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const saveAssessmentResult = async (
    answers: UserAnswer[],
    finalScore: number
  ) => {
    if (!user || !selectedAssessment) return;

    try {
      const userDocRef = doc(db, "user", user.uid);
      const now = new Date().toISOString();

      // Get current user data
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentAssessments = [...(userData.assessment || [])];

        // Find the assessment index by skill and category
        const assessmentIndex = currentAssessments.findIndex(
          (assessment: any) =>
            assessment.skill === selectedAssessment.skill &&
            assessment.category === selectedAssessment.category
        );

        if (assessmentIndex !== -1) {
          // Update the questions with user answers
          const updatedQuestions = selectedAssessment.questions.map(
            (question) => {
              const userAnswer = answers.find(
                (a) => a.questionId === question.questionId
              );
              return {
                ...question,
                userAnswer: userAnswer ? userAnswer.selectedOption : "",
              };
            }
          );

          // Update existing assessment with results
          currentAssessments[assessmentIndex] = {
            ...currentAssessments[assessmentIndex],
            status: "completed",
            score: finalScore.toString(),
            totalQuestions: selectedAssessment.questions.length.toString(),
            attemptedQuestions: answers.length.toString(),
            correctAnswers: finalScore.toString(),
            questions: updatedQuestions,
            attemptedAt: selectedAssessment.attemptedAt || now,
            completedAt: now,
          };

          await updateDoc(userDocRef, {
            assessment: currentAssessments,
          });

          console.log("Assessment result saved successfully");
        } else {
          console.error("Assessment not found for update");
          setError("Failed to update assessment status.");
        }
      }
    } catch (error) {
      console.error("Error saving assessment result:", error);
      setError("Failed to save assessment result.");
    }
  };

  const calculateScore = async (answers: UserAnswer[]) => {
    if (!selectedAssessment) return;

    let correct = 0;

    console.log("Calculating score for answers:", answers);
    console.log("Questions:", selectedAssessment.questions);

    answers.forEach((answer) => {
      const question = selectedAssessment.questions.find(
        (q) => q.questionId === answer.questionId
      );

      if (question) {
        const isCorrect = question.correctOption === answer.selectedOption;
        console.log(`Question ${answer.questionId}:`, {
          userAnswer: answer.selectedOption,
          correctAnswer: question.correctOption,
          isCorrect,
        });

        if (isCorrect) {
          correct++;
        }
      }
    });

    console.log(`Final score: ${correct} out of ${answers.length}`);
    setScore(correct);

    // Save to Firebase
    await saveAssessmentResult(answers, correct);

    setCurrentView("results");
  };

  const resetAssessment = () => {
    setCurrentView("selector");
    setSelectedAssessment(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setScore(0);
    setError(null);
  };

  const getScoreColor = (scorePercentage: number) => {
    if (scorePercentage >= 80) return "text-green-400";
    if (scorePercentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-300 border-green-500/20";
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-300 border-blue-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your assessments...</p>
        </div>
      </div>
    );
  }

  if (assessments.length === 0 || assessments[0].skill === "") {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden pt-20">
        <div className="text-center py-20 px-15">
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/15 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              No Assessments Found
            </h2>
            <p className="text-gray-300 mb-6">
              You haven't added any skills yet. Please go to the{" "}
              <span className="text-blue-400 font-semibold">Skills Page</span>
              and add your skills. Once you add skills, assessments will be
              generated for you.
            </p>
            <button
              onClick={() => navigate("/skill")}
              className="px-6 py-3 backdrop-blur-sm bg-blue-500/20 border border-blue-500/30 text-white rounded-lg hover:bg-blue-500/30 transition-all duration-300"
            >
              Go to Skills Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background glass elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-40 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-3xl"></div>

      <div className="relative z-10 p-6 pt-25">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-14">
            <div className="relative inline-block">
              <h1 className="text-5xl font-bold text-white mb-2">
                Skill Assessment
              </h1>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
            </div>
            <p className="text-gray-300 text-lg mt-6">
              Test your skills with personalized questions
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Assessment Selector */}
          {currentView === "selector" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white text-center mb-8">
                Choose Your Assessment
              </h2>

              {/* Primary Skills Section */}
              {assessments.filter((a) => a.category === "primary").length >
                0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Primary Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments
                      .filter((a) => a.category === "primary")
                      .map((assessment, index) => (
                        <div
                          key={assessment.id}
                          className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer group relative overflow-hidden opacity-0 animate-fade-in"
                          style={{
                            animationDelay: `${index * 150}ms`,
                            animationFillMode: "forwards",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
                          <div className="relative z-10">
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                                  {assessment.skill}
                                </h4>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(
                                    assessment.status
                                  )}`}
                                >
                                  {assessment.status.charAt(0).toUpperCase() +
                                    assessment.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm mb-4">
                                Test your knowledge in {assessment.skill}
                              </p>

                              <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                                <Clock className="w-4 h-4" />
                                <span>{assessment.estimatedTime}</span>
                              </div>

                              <div className="text-gray-400 text-sm mb-2">
                                Questions: {assessment.questions.length}
                              </div>

                              {assessment.status === "completed" && (
                                <div className="text-sm">
                                  <span className="text-gray-400">
                                    Last Score:{" "}
                                  </span>
                                  <span
                                    className={getScoreColor(
                                      (parseInt(assessment.score) /
                                        parseInt(assessment.totalQuestions)) *
                                        100
                                    )}
                                  >
                                    {assessment.score}/
                                    {assessment.totalQuestions} (
                                    {Math.round(
                                      (parseInt(assessment.score) /
                                        parseInt(assessment.totalQuestions)) *
                                        100
                                    )}
                                    %)
                                  </span>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => startAssessment(assessment)}
                              disabled={assessment.questions.length === 0}
                              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                                assessment.questions.length === 0
                                  ? "bg-gray-500/20 border border-gray-500/30 text-gray-500 cursor-not-allowed"
                                  : "backdrop-blur-sm bg-white/[0.05] border border-white/20 text-white hover:bg-blue-600 hover:text-white"
                              }`}
                            >
                              {assessment.questions.length === 0
                                ? "No Questions Available"
                                : assessment.status === "completed"
                                ? "Retake Test"
                                : "Start Test"}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Secondary Skills Section */}
              {assessments.filter((a) => a.category === "secondary").length >
                0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    Secondary Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments
                      .filter((a) => a.category === "secondary")
                      .map((assessment, index) => (
                        <div
                          key={assessment.id}
                          className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer group relative overflow-hidden opacity-0 animate-fade-in"
                          style={{
                            animationDelay: `${
                              (index +
                                assessments.filter(
                                  (a) => a.category === "primary"
                                ).length) *
                              150
                            }ms`,
                            animationFillMode: "forwards",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
                          <div className="relative z-10">
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors">
                                  {assessment.skill}
                                </h4>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(
                                    assessment.status
                                  )}`}
                                >
                                  {assessment.status.charAt(0).toUpperCase() +
                                    assessment.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm mb-4">
                                Evaluate your understanding of{" "}
                                {assessment.skill}
                              </p>

                              <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                                <Clock className="w-4 h-4" />
                                <span>{assessment.estimatedTime}</span>
                              </div>

                              <div className="text-gray-400 text-sm mb-2">
                                Questions: {assessment.questions.length}
                              </div>

                              {assessment.status === "completed" && (
                                <div className="text-sm">
                                  <span className="text-gray-400">
                                    Last Score:{" "}
                                  </span>
                                  <span
                                    className={getScoreColor(
                                      (parseInt(assessment.score) /
                                        parseInt(assessment.totalQuestions)) *
                                        100
                                    )}
                                  >
                                    {assessment.score}/
                                    {assessment.totalQuestions} (
                                    {Math.round(
                                      (parseInt(assessment.score) /
                                        parseInt(assessment.totalQuestions)) *
                                        100
                                    )}
                                    %)
                                  </span>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => startAssessment(assessment)}
                              disabled={assessment.questions.length === 0}
                              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                                assessment.questions.length === 0
                                  ? "bg-gray-500/20 border border-gray-500/30 text-gray-500 cursor-not-allowed"
                                  : "backdrop-blur-sm bg-white/[0.05] border border-white/20 text-white hover:bg-blue-600 hover:text-white"
                              }`}
                            >
                              {assessment.questions.length === 0
                                ? "No Questions Available"
                                : assessment.status === "completed"
                                ? "Retake Test"
                                : "Start Test"}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Test Section */}
          {currentView === "test" && currentQuestion && selectedAssessment && (
            <div className="space-y-8">
              {/* Progress Bar */}
              <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-3 border border-white/20">
                <div
                  className="h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>
                  Question {currentQuestionIndex + 1} of{" "}
                  {selectedAssessment.questions.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>

              {/* Question Card */}
              <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-8 border border-white/15 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>

                <div className="relative z-10">
                  <div className="mb-6">
                    <span className="text-xs px-3 py-1 backdrop-blur-sm bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20">
                      {selectedAssessment.skill} • {selectedAssessment.category}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-8">
                    {currentQuestion.questionText}
                  </h2>

                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                          selectedOption === index
                            ? "border-blue-400/50 bg-blue-500/10"
                            : "border-white/15 bg-white/[0.03] hover:border-white/25"
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
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                            selectedOption === index
                              ? "border-blue-400 bg-blue-400"
                              : "border-gray-500"
                          }`}
                        >
                          {selectedOption === index && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-white font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
                    currentQuestionIndex === 0
                      ? "bg-white/[0.03] border border-white/10 text-gray-500 cursor-not-allowed"
                      : "bg-white/[0.05] border border-white/15 text-white hover:bg-white/[0.08]"
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
                    selectedOption === null
                      ? "bg-white/[0.03] border border-white/10 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 hover:scale-[1.02]"
                  }`}
                >
                  {currentQuestionIndex ===
                  selectedAssessment.questions.length - 1
                    ? "Finish"
                    : "Next"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {currentView === "results" && selectedAssessment && (
            <div className="space-y-8 text-center">
              <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-8 border border-white/15 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>

                <div className="relative z-10">
                  <div className="mb-8">
                    <Target className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Assessment Complete!
                    </h2>
                    <p className="text-gray-300">
                      {selectedAssessment.skill} • {selectedAssessment.category}{" "}
                      skill
                    </p>
                  </div>

                  {/* Score Display */}
                  <div className="mb-8">
                    <div className="text-6xl font-bold text-white mb-2">
                      {score}
                      <span className="text-gray-400">
                        /{selectedAssessment.questions.length}
                      </span>
                    </div>
                    <div
                      className={`text-xl ${getScoreColor(
                        (score / selectedAssessment.questions.length) * 100
                      )}`}
                    >
                      {Math.round(
                        (score / selectedAssessment.questions.length) * 100
                      )}
                      % Correct
                    </div>
                  </div>

                  {/* Progress Circle */}
                  <div className="mb-8">
                    <div className="w-32 h-32 mx-auto relative">
                      <svg
                        className="w-32 h-32 transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
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
                          stroke="#60a5fa"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${
                            2 *
                            Math.PI *
                            40 *
                            (1 - score / selectedAssessment.questions.length)
                          }`}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {Math.round(
                            (score / selectedAssessment.questions.length) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={resetAssessment}
                      className="px-8 py-3 backdrop-blur-sm bg-white/[0.05] border border-white/15 hover:bg-white/[0.08] text-white rounded-xl font-semibold transition-all duration-300"
                    >
                      Take Another Assessment
                    </button>

                    <button
                      onClick={() => navigate("/skill")}
                      className="flex items-center justify-center gap-2 px-8 py-3 backdrop-blur-sm bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-300 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                    >
                      <BookOpen className="w-5 h-5" />
                      View Career Paths
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
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
