
import React, { useState, useEffect } from "react";
import {
  Clock,
  BookOpen,
  Play,
  CheckCircle,
  Circle,
  AlertCircle,
  ExternalLink,
  Target,
  Plus,
  User,
  Pause,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface Resource {
  title: string;
  link: string;
}

interface Task {
  taskName: string;
  status: "completed" | "current" | "upcoming" | "";
  timeAllocation: string;
  resources: Resource[];
}

interface RoadmapData {
  title: string;
  tasks: Task[];
}

const RoadmapPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { roadmapIndex } = useParams<{ roadmapIndex: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState<number>(0);
  const [expandedResources, setExpandedResources] = useState<number[]>([]);
  const [hasSkills, setHasSkills] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Fetch roadmap dynamically from Firestore or URL params
  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!user) return;

      try {
        // Check if roadmap data is passed via state (from navigation)
        if (location.state?.roadmapData) {
          const roadmapFromState = location.state.roadmapData;
          
          // Check if the roadmap has meaningful data
          if (!roadmapFromState.title || !roadmapFromState.tasks || roadmapFromState.tasks.length === 0) {
            setIsEmpty(true);
            setRoadmapData(null);
          } else {
            // Initialize tasks with proper status if not set
            const initializedRoadmap = {
              ...roadmapFromState,
              tasks: roadmapFromState.tasks.map((task: Task, index: number) => ({
                ...task,
                status: task.status || (index === 0 ? "current" : "upcoming")
              }))
            };
            setRoadmapData(initializedRoadmap);
            setIsEmpty(false);
          }
          setLoading(false);
          return;
        }

        // Fetch from Firestore using roadmapIndex
        if (roadmapIndex !== undefined) {
          const docRef = doc(db, "user", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            
            // Check if user has skills first
            const userSkills = userData.skills;
            const hasPrimarySkills = userSkills?.primary && userSkills.primary.length > 0;
            const hasSecondarySkills = userSkills?.secondary && userSkills.secondary.length > 0;
            setHasSkills(hasPrimarySkills || hasSecondarySkills);

            const roadmaps = userData.roadmap || [];
            const selectedRoadmap = roadmaps[parseInt(roadmapIndex)];
            
            if (selectedRoadmap && selectedRoadmap.title && selectedRoadmap.tasks && selectedRoadmap.tasks.length > 0) {
              // Initialize tasks with proper status if not set
              const initializedRoadmap = {
                ...selectedRoadmap,
                tasks: selectedRoadmap.tasks.map((task: Task, index: number) => ({
                  ...task,
                  status: task.status || (index === 0 ? "current" : "upcoming")
                }))
              };
              setRoadmapData(initializedRoadmap);
              setIsEmpty(false);
            } else {
              console.warn(`Roadmap at index ${roadmapIndex} not found or empty`);
              setRoadmapData(null);
              setIsEmpty(true);
            }
          } else {
            // User document doesn't exist
            setRoadmapData(null);
            setIsEmpty(true);
            setHasSkills(false);
          }
        } else {
          // No index provided
          setRoadmapData(null);
          setIsEmpty(true);
        }
      } catch (err) {
        console.error("Error fetching roadmap:", err);
        setRoadmapData(null);
        setIsEmpty(true);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchRoadmap();
  }, [user, authLoading, roadmapIndex, location.state]);

  // Animate task appearance
  useEffect(() => {
    if (!roadmapData || isEmpty) return;

    const timer = setInterval(() => {
      setVisibleTasks((prev) => {
        if (prev < roadmapData.tasks.length) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [roadmapData, isEmpty]);

  // Update task status in Firestore
  const updateTaskStatus = async (taskIndex: number, newStatus: "upcoming" | "current" | "completed") => {
    if (!user || !roadmapData || roadmapIndex === undefined) return;

    setUpdating(true);
    try {
      const docRef = doc(db, "user", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const roadmaps = [...(userData.roadmap || [])];
        const roadmapIdx = parseInt(roadmapIndex);
        
        if (roadmaps[roadmapIdx]) {
          const updatedTasks = [...roadmaps[roadmapIdx].tasks];
          
          // Update the specific task
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            status: newStatus
          };

          // Auto-progression logic: when a task is completed, start the next one
          if (newStatus === "completed" && taskIndex < updatedTasks.length - 1) {
            // Find the next incomplete task and mark it as current
            for (let i = taskIndex + 1; i < updatedTasks.length; i++) {
              if (updatedTasks[i].status === "upcoming" || updatedTasks[i].status === "") {
                updatedTasks[i] = {
                  ...updatedTasks[i],
                  status: "current"
                };
                break;
              }
            }
          }

          // Update roadmap
          roadmaps[roadmapIdx] = {
            ...roadmaps[roadmapIdx],
            tasks: updatedTasks
          };

          await updateDoc(docRef, {
            roadmap: roadmaps
          });

          // Update local state
          setRoadmapData({
            ...roadmapData,
            tasks: updatedTasks
          });

          console.log(`Task ${taskIndex} updated to ${newStatus}`);
        }
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "current":
        return "In Progress";
      case "upcoming":
        return "Upcoming";
      default:
        return "Not Started";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/15 text-green-300 border-green-400/30 backdrop-blur-sm";
      case "current":
        return "bg-blue-500/15 text-blue-300 border-blue-400/30 backdrop-blur-sm";
      case "upcoming":
        return "bg-white/8 text-gray-300 border-white/15 backdrop-blur-sm";
      default:
        return "bg-white/8 text-gray-300 border-white/15 backdrop-blur-sm";
    }
  };

  const toggleResourceExpansion = (taskIndex: number) => {
    setExpandedResources((prev) =>
      prev.includes(taskIndex)
        ? prev.filter((index) => index !== taskIndex)
        : [...prev, taskIndex]
    );
  };

  const renderTaskActions = (task: Task, taskIndex: number) => {
    return (
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/15">
        {(task.status === "upcoming" || task.status === "") && (
          <button
            onClick={() => updateTaskStatus(taskIndex, "current")}
            disabled={updating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50 text-sm"
          >
            <Play className="w-4 h-4" />
            Start Task
          </button>
        )}

        {task.status === "current" && (
          <>
            <button
              onClick={() => updateTaskStatus(taskIndex, "completed")}
              disabled={updating}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Complete
            </button>
            <button
              onClick={() => updateTaskStatus(taskIndex, "upcoming")}
              disabled={updating}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 text-gray-300 rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 text-sm"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          </>
        )}

        {task.status === "completed" && (
          <button
            onClick={() => updateTaskStatus(taskIndex, "current")}
            disabled={updating}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-gray-300 rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Mark Incomplete
          </button>
        )}

        {updating && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            Updating...
          </div>
        )}
      </div>
    );
  };

  // Loading UI
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
        <div className="absolute top-32 left-32 w-64 h-64 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="text-center backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  // Empty state - No roadmap data or skills
  if (isEmpty || !roadmapData) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background glass elements */}
        <div className="absolute top-32 left-32 w-64 h-64 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-6 pt-20">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <h1 className="text-5xl font-bold text-white mb-4">Learning Roadmap</h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
              </div>
              <p className="text-gray-300 text-lg mt-6">
                Your personalized learning journey
              </p>
            </div>

            {/* Empty State Card */}
            <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-12 border border-white/15 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 backdrop-blur-xl bg-white/[0.08] rounded-full flex items-center justify-center border border-white/20">
                    <Target className="w-12 h-12 text-gray-300" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">
                    No Roadmap Available
                  </h2>
                  
                  {!hasSkills ? (
                    <>
                      <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                        To generate a personalized learning roadmap, you need to first add your primary and secondary skills in the Skills Monitoring page.
                      </p>
                      
                      <div className="backdrop-blur-xl bg-white/[0.05] rounded-xl p-6 mb-8 border border-white/15 max-w-md mx-auto">
                        <h3 className="text-xl font-semibold text-white mb-4">Getting Started</h3>
                        <div className="space-y-3 text-left">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                              <span className="text-blue-300 text-sm font-bold">1</span>
                            </div>
                            <span className="text-gray-200 text-sm">Go to Skills Monitoring</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                              <span className="text-blue-300 text-sm font-bold">2</span>
                            </div>
                            <span className="text-gray-200 text-sm">Add your primary skills</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                              <span className="text-blue-300 text-sm font-bold">3</span>
                            </div>
                            <span className="text-gray-200 text-sm">Add secondary skills (optional)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                              <span className="text-blue-300 text-sm font-bold">4</span>
                            </div>
                            <span className="text-gray-200 text-sm">Generate your roadmap</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                        Your roadmap data appears to be empty or incomplete. Please try generating a new roadmap from your skills.
                      </p>
                    </>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/skill')}
                      className="flex items-center justify-center gap-2 px-8 py-4 backdrop-blur-sm bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl font-semibold hover:bg-blue-500/30 hover:scale-[1.02] transition-all duration-300"
                    >
                      <User className="w-5 h-5" />
                      {!hasSkills ? 'Add Skills' : 'Manage Skills'}
                    </button>
                    
                    {hasSkills && (
                      <button
                        onClick={() => navigate('/skill')}
                        className="flex items-center justify-center gap-2 px-8 py-4 backdrop-blur-sm bg-white/[0.05] border border-white/15 text-white rounded-xl font-semibold hover:bg-white/[0.08] transition-all duration-300"
                      >
                        <Plus className="w-5 h-5" />
                        Generate Roadmap
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress using existing status field
  const completedTasks = roadmapData.tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const currentTasks = roadmapData.tasks.filter(
    (task) => task.status === "current"
  ).length;
  const upcomingTasks = roadmapData.tasks.filter(
    (task) => task.status === "upcoming" || task.status === ""
  ).length;
  const totalTasks = roadmapData.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Find next task to work on
  const nextTask =
    roadmapData.tasks.find((task) => task.status === "current") ||
    roadmapData.tasks.find((task) => task.status === "upcoming" || task.status === "");

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background glass elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-40 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl"></div>
      
      <div className="relative z-10 p-6 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <h1 className="text-5xl font-bold text-white mb-4">
                {roadmapData.title} Roadmap
              </h1>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3xl h-1 bg-gradient-to-r from-transparent via-blue-800 to-transparent rounded-full"></div>
            </div>
            <p className="text-gray-200 text-lg mt-6">
              A personalized journey to master {roadmapData.title.toLowerCase()} skills.
            </p>

            {/* Progress Overview - Glass Design */}
            <div className="mt-8 backdrop-blur-xl bg-white/[0.04] border border-white/15 rounded-2xl p-6 max-w-md mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-200">Overall Progress</span>
                  <span className="text-blue-300 font-bold">
                    {completedTasks}/{totalTasks}
                  </span>
                </div>
                <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-3 border border-white/20">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-300 mt-2">
                  {Math.round(progressPercentage)}% Complete
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Roadmap Timeline */}
            <div className="lg:col-span-3">
              <div className="relative">
                {/* Glass timeline line */}
                <div
                  className="absolute left-3 top-8 w-0.5 bg-gradient-to-b from-blue-400/30 via-white/10 to-white/5 backdrop-blur-sm"
                  style={{ height: `${(roadmapData.tasks.length - 1) * 300}px` }}
                ></div>

                <div className="space-y-8">
                  {roadmapData.tasks.map((task, index) => (
                    <div
                      key={index}
                      className={`relative transition-all duration-500 ease-out transform ${
                        index < visibleTasks
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-8"
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      {/* Task Number Circle - Glass Design */}
                      <div className="absolute left-0 flex items-center justify-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-xl relative overflow-hidden ${
                            task.status === "completed"
                              ? "bg-green-500/20 border-green-400/50 shadow-lg shadow-green-400/10"
                              : task.status === "current"
                              ? "bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-400/20"
                              : "bg-white/[0.05] border-white/20"
                          }`}
                        >
                          {task.status === "completed" ? (
                            <CheckCircle className="w-4 h-4 text-green-300" />
                          ) : task.status === "current" ? (
                            <Play className="w-3 h-3 text-blue-300" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Task Card - Glass Design */}
                      <div className="ml-24 backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 hover:border-blue-300/30 hover:bg-white/[0.06] transition-all duration-300 relative overflow-hidden group">
                        {/* Glass surface reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">
                              {task.taskName}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-3 py-1 rounded-full border ${getStatusBadgeColor(
                                  task.status
                                )}`}
                              >
                                {getStatusText(task.status)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-6">
                            <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-white/20 bg-white/[0.05] backdrop-blur-sm">
                              <Clock className="w-3 h-3 text-gray-200" />
                              <span className="text-gray-200">
                                {task.timeAllocation}
                              </span>
                            </span>
                          </div>

                          {/* Resources Section */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Learning Resources ({task.resources?.length || 0})
                              </h4>
                              {(task.resources?.length || 0) > 2 && (
                                <button
                                  onClick={() => toggleResourceExpansion(index)}
                                  className="text-blue-300 hover:text-blue-200 text-sm transition-colors backdrop-blur-sm bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20"
                                >
                                  {expandedResources.includes(index)
                                    ? "Show Less"
                                    : "Show All"}
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(expandedResources.includes(index)
                                ? task.resources || []
                                : (task.resources || []).slice(0, 2)
                              ).map((resource, resourceIndex) => (
                                <a
                                  key={resourceIndex}
                                  href={resource.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-gray-200 backdrop-blur-sm bg-white/[0.06] rounded-lg p-3 hover:bg-white/[0.1] transition-colors group/resource border border-white/15"
                                >
                                  <ExternalLink className="w-3 h-3 text-blue-300 group-hover/resource:text-blue-200" />
                                  <span className="flex-1">
                                    {resource.title}
                                  </span>
                                </a>
                              ))}
                            </div>

                            {!expandedResources.includes(index) &&
                              (task.resources?.length ?? 0) > 2 && (
                                <p className="text-xs text-gray-400 text-center">
                                  +{(task.resources?.length || 0) - 2} more resources
                                  available
                                </p>
                              )}
                          </div>

                          {/* Task Actions */}
                          {renderTaskActions(task, index)}
                        </div>

                        {/* Glass shimmer effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/8 to-transparent rotate-12 group-hover:left-full transition-all duration-1000 ease-out"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Glass Design */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Progress Stats - Glass */}
                <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-6">
                      Progress Overview
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-200 text-sm">Completed</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 font-bold">
                            {completedTasks}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-200 text-sm">In Progress</span>
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300 font-bold">
                            {currentTasks}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-200 text-sm">Remaining</span>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 font-bold">
                            {upcomingTasks}
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-white/15">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-100 font-medium">
                            Total Progress
                          </span>
                          <span className="text-blue-300 font-bold">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Button - Glass */}
                <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 flex justify-center items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
                  <button 
                    onClick={() => navigate('/skill')}
                    className="relative z-10 w-full backdrop-blur-sm bg-blue-500/20 border border-blue-500/30 rounded-full p-3 text-white font-medium hover:bg-blue-500/30 hover:scale-[1.02] transition-all duration-300"
                  >
                    Career Paths
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Next Step Highlight - Glass Design */}
          {nextTask && (
            <div className="mt-12">
              <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-8 border border-blue-400/25 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-white/[0.02] rounded-2xl"></div>

                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {nextTask.status === "current" ? "Continue Learning" : "Ready to Start?"}
                    </h3>
                    <p className="text-gray-200">
                      {nextTask.status === "current" 
                        ? "Keep up the momentum with your current task"
                        : "Take the next step in your learning journey"}
                    </p>
                  </div>

                  <div className="backdrop-blur-xl bg-white/[0.06] rounded-xl p-6 mb-6 border border-white/15 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-white">
                          {nextTask.taskName}
                        </h4>
                        <span
                          className={`text-xs px-3 py-1 rounded-full border ${getStatusBadgeColor(
                            nextTask.status
                          )}`}
                        >
                          {getStatusText(nextTask.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-6">
                        <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-sm">
                          <Clock className="w-4 h-4 text-gray-200" />
                          <span className="text-gray-200">
                            {nextTask.timeAllocation}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-blue-400/25 bg-blue-400/15 text-blue-300 backdrop-blur-sm">
                          <BookOpen className="w-4 h-4" />
                          <span>
                            {nextTask.resources?.length || 0} resources
                          </span>
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-gray-200">
                          Available Resources:
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(nextTask.resources || []).slice(0, 4).map((resource, index) => (
                            <a
                              key={index}
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-200 flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm rounded p-2 border border-white/15 hover:bg-white/[0.1] transition-colors"
                            >
                              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                              <span className="truncate">
                                {resource.title}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    {(nextTask.status === "upcoming" || nextTask.status === "") && (
                      <button 
                        onClick={() => updateTaskStatus(roadmapData.tasks.findIndex(t => t === nextTask), "current")}
                        disabled={updating}
                        className="px-8 py-4 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:from-blue-400/25 hover:to-blue-500/25 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                      >
                        {updating ? "Starting..." : "Start Learning"}
                      </button>
                    )}
                    {nextTask.status === "current" && (
                      <div className="flex gap-4 justify-center">
                        <button 
                          onClick={() => updateTaskStatus(roadmapData.tasks.findIndex(t => t === nextTask), "completed")}
                          disabled={updating}
                          className="px-8 py-4 backdrop-blur-sm bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-400/30 hover:from-green-400/25 hover:to-green-500/25 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                        >
                          {updating ? "Completing..." : "Mark Complete"}
                        </button>
                        <button className="px-8 py-4 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:from-blue-400/25 hover:to-blue-500/25 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02]">
                          Continue Learning
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;