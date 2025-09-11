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
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Task {
  taskName: string;
  status: "completed" | "current" | "upcoming";
  timeAllocation: string;
  resources: string[];
}

interface RoadmapData {
  title: string;
  tasks: Task[];
}

// Mock Firebase data (used only as fallback)
const mockRoadmapData: RoadmapData = {
  title: "Frontend Development",
  tasks: [
    {
      taskName: "Learn HTML",
      status: "completed",
      timeAllocation: "2 weeks",
      resources: ["W3Schools - HTML Tutorial", "MDN - HTML Basics", "freeCodeCamp - HTML Guide"],
    },
    {
      taskName: "Learn CSS",
      status: "current",
      timeAllocation: "3 weeks",
      resources: ["CSS Tricks", "MDN - CSS", "YouTube - Traversy Media CSS"],
    },
    {
      taskName: "Learn JavaScript Fundamentals",
      status: "upcoming",
      timeAllocation: "4 weeks",
      resources: ["MDN - JavaScript Guide", "JavaScript.info", "Eloquent JavaScript Book", "freeCodeCamp - JavaScript"],
    },
    {
      taskName: "Learn React.js",
      status: "upcoming",
      timeAllocation: "5 weeks",
      resources: ["Official React Documentation", "React Tutorial for Beginners", "The Complete React Course", "React Projects for Practice"],
    },
    {
      taskName: "Build Portfolio Projects",
      status: "upcoming",
      timeAllocation: "6 weeks",
      resources: ["Portfolio Project Ideas", "GitHub Pages Deployment", "Netlify Hosting Guide", "Portfolio Design Inspiration"],
    },
  ],
};

const RoadmapPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleTasks, setVisibleTasks] = useState<number>(0);
  const [expandedResources, setExpandedResources] = useState<number[]>([]);

  // Fetch roadmap dynamically from Firestore
  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "user", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setRoadmapData(userData.roadmap || mockRoadmapData);
        } else {
          setRoadmapData(mockRoadmapData);
        }
      } catch (err) {
        console.error("Error fetching roadmap:", err);
        setRoadmapData(mockRoadmapData);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchRoadmap();
  }, [user, authLoading]);

  // Animate task appearance
  useEffect(() => {
    if (!roadmapData) return;

    const timer = setInterval(() => {
      setVisibleTasks((prev) => {
        if (prev < roadmapData.tasks.length) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [roadmapData]);

  // Status helpers
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-white" />;
      case "current":
        return <AlertCircle className="w-5 h-5 text-blue-300" />;
      case "upcoming":
        return <Circle className="w-5 h-5 text-gray-300" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
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
        return "Upcoming";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-white/20 text-white border-white/30";
      case "current":
        return "bg-blue-400/20 text-blue-300 border-blue-400/40";
      case "upcoming":
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
    }
  };

  const toggleResourceExpansion = (taskIndex: number) => {
    setExpandedResources((prev) =>
      prev.includes(taskIndex)
        ? prev.filter((index) => index !== taskIndex)
        : [...prev, taskIndex]
    );
  };

  // Loading / fallback UI
  if (authLoading || loading) {
    return <div className="text-white p-6">Loading your roadmap...</div>;
  }

  if (!roadmapData) {
    return <div className="text-white p-6">No roadmap found for this user.</div>;
  }

  const nextTask =
    roadmapData.tasks.find((task) => task.status === "current") ||
    roadmapData.tasks.find((task) => task.status === "upcoming");

  const completedTasks = roadmapData.tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasks = roadmapData.tasks.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
   <div className="min-h-screen p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        Page Header
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold text-white mb-4">
              {roadmapData.title} 
              Roadmap
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-200 text-lg italic mt-6">
            A personalized journey to master frontend development skills.
          </p>

          {/* Progress Overview */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-200">Overall Progress</span>
              <span className="text-blue-300 font-bold">
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-blue-400/30"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-300 mt-2">
              {Math.round(progressPercentage)}% Complete
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Roadmap Timeline */}
          <div className="lg:col-span-3">
            <div className="relative">
              <div
                className="absolute left-8 top-8 w-0.5 bg-gradient-to-b from-blue-400/50 to-white/20"
                style={{ height: `${(roadmapData.tasks.length - 1) * 250}px` }}
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
                    {/* Task Number Circle */}
                    <div className="absolute left-0 flex items-center justify-center">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          task.status === "completed"
                            ? "bg-white border-white shadow-lg shadow-white/30"
                            : task.status === "current"
                            ? "bg-blue-500 border-blue-400 shadow-lg shadow-blue-400/40"
                            : "bg-white/10 border-white/30"
                        }`}
                      >
                        <span
                          className={`font-bold text-lg transition-colors ${
                            task.status === "completed"
                              ? "text-gray-800"
                              : task.status === "current"
                              ? "text-white"
                              : "text-white"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Task Card */}
                    <div className="ml-24 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-300/50 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">
                          {task.taskName}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
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
                        <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-white/30 bg-white/10">
                          <Clock className="w-3 h-3 text-gray-200" />
                          <span className="text-gray-200">
                            {task.timeAllocation}
                          </span>
                        </span>
                        {task.status === "current" && (
                          <span className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/40">
                            <Play className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>

                      {/* Resources Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Learning Resources ({task.resources?.length})
                          </h4>
                          <button
                            onClick={() => toggleResourceExpansion(index)}
                            className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
                          >
                            {expandedResources.includes(index)
                              ? "Show Less"
                              : "Show All"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(expandedResources.includes(index)
                            ? task.resources || []
                            : (task.resources || []).slice(0, 2)
                          ).map((resource, resourceIndex) => (
                            <div
                              key={resourceIndex}
                              className="flex items-center gap-2 text-sm text-gray-200 bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer group border border-white/20"
                            >
                              <ExternalLink className="w-3 h-3 text-blue-300 group-hover:text-blue-200" />
                              <span className="flex-1">
                                {resource}
                              </span>
                            </div>
                          ))}
                        </div>

                        {!expandedResources.includes(index) &&
                          (task.resources?.length ?? 0) > 2 && (
                            <p className="text-xs text-gray-400 text-center">
                              +{task.resources.length - 2} more resources
                              available
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar with Stats and Current Task */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Progress Stats */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">
                  Progress Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200 text-sm">Completed</span>
                    <span className="text-white font-bold">
                      {/* {completedTasks} */}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200 text-sm">In Progress</span>
                    <span className="text-blue-300 font-bold">
                      {
                        roadmapData.tasks.filter((t) => t.status === "current")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200 text-sm">Remaining</span>
                    <span className="text-gray-300 font-bold">
                      {
                        roadmapData.tasks.filter((t) => t.status === "upcoming")
                          .length
                      }
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/20">
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

              {/* Current Task Spotlight */}
              {nextTask && (
                <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Focus Area
                  </h3>
                  <div className="space-y-3">
                    <h4 className="text-blue-300 font-semibold">
                      {nextTask.taskName}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <Clock className="w-4 h-4" />
                      <span>
                        {nextTask.timeAllocation}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">
                      {nextTask.resources.length} resources available to help
                      you succeed
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Step Highlight */}
        {nextTask && (
          <div className="mt-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-400/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Ready to Continue?
                  </h3>
                  <p className="text-gray-200">
                    Take the next step in your learning journey
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
                  <h4 className="text-xl font-semibold text-white mb-4">
                    {nextTask.taskName}
                  </h4>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-white/30 bg-white/10">
                      <Clock className="w-4 h-4 text-gray-200" />
                      <span className="text-gray-200">
                        {nextTask.timeAllocation}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-blue-400/40 bg-blue-400/20 text-blue-300">
                      <BookOpen className="w-4 h-4" />
                      <span>
                        {nextTask.resources.length} resources
                        </span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-gray-200">
                      Available Resources:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {nextTask.resources.slice(0, 4).map((resource, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-200 flex items-center gap-2 bg-white/10 rounded p-2 border border-white/20"
                        >
                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                          <span className="truncate">
                            {resource}
                            </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30">
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
