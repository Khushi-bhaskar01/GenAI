// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Clock,
// // //   BookOpen,
// // //   Play,
// // //   CheckCircle,
// // //   Circle,
// // //   AlertCircle,
// // //   ExternalLink,
// // //   Target,
// // // } from "lucide-react";
// // // import { useAuth } from "../context/authContext";
// // // import { db } from "../firebase/firebase";
// // // import { doc, getDoc } from "firebase/firestore";
// // // import { useNavigate, useParams, useLocation } from "react-router-dom";

// // // interface Task {
// // //   taskName: string;
// // //   status: "completed" | "current" | "upcoming";
// // //   timeAllocation: string;
// // //   resources: string[];
// // // }

// // // interface RoadmapData {
// // //   title: string;
// // //   tasks: Task[];
// // // }

// // // // Mock Firebase data (used only as fallback)
// // // const mockRoadmapData: RoadmapData = {
// // //   title: "Frontend Development",
// // //   tasks: [
// // //     {
// // //       taskName: "Learn HTML",
// // //       status: "completed",
// // //       timeAllocation: "2 weeks",
// // //       resources: ["W3Schools - HTML Tutorial", "MDN - HTML Basics", "freeCodeCamp - HTML Guide"],
// // //     },
// // //     {
// // //       taskName: "Learn CSS",
// // //       status: "current",
// // //       timeAllocation: "3 weeks",
// // //       resources: ["CSS Tricks", "MDN - CSS", "YouTube - Traversy Media CSS"],
// // //     },
// // //     {
// // //       taskName: "Learn JavaScript Fundamentals",
// // //       status: "upcoming",
// // //       timeAllocation: "4 weeks",
// // //       resources: ["MDN - JavaScript Guide", "JavaScript.info", "Eloquent JavaScript Book", "freeCodeCamp - JavaScript"],
// // //     },
// // //     {
// // //       taskName: "Learn React.js",
// // //       status: "upcoming",
// // //       timeAllocation: "5 weeks",
// // //       resources: ["Official React Documentation", "React Tutorial for Beginners", "The Complete React Course", "React Projects for Practice"],
// // //     },
// // //     {
// // //       taskName: "Build Portfolio Projects",
// // //       status: "upcoming",
// // //       timeAllocation: "6 weeks",
// // //       resources: ["Portfolio Project Ideas", "GitHub Pages Deployment", "Netlify Hosting Guide", "Portfolio Design Inspiration"],
// // //     },
// // //   ],
// // // };

// // // const RoadmapPage: React.FC = () => {
// // //   const { user, loading: authLoading } = useAuth();
// // //   const { roadmapIndex } = useParams<{ roadmapIndex: string }>();
// // //   const location = useLocation();
// // //   const navigate = useNavigate();
  
// // //   const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [visibleTasks, setVisibleTasks] = useState<number>(0);
// // //   const [expandedResources, setExpandedResources] = useState<number[]>([]);

// // //   // Fetch roadmap dynamically from Firestore or URL params
// // //   useEffect(() => {
// // //     const fetchRoadmap = async () => {
// // //       if (!user) return;

// // //       try {
// // //         // Check if roadmap data is passed via state (from navigation)
// // //         if (location.state?.roadmapData) {
// // //           setRoadmapData(location.state.roadmapData);
// // //           setLoading(false);
// // //           return;
// // //         }

// // //         // If no state data, fetch from Firestore using roadmapIndex
// // //         if (roadmapIndex !== undefined) {
// // //           const docRef = doc(db, "user", user.uid);
// // //           const docSnap = await getDoc(docRef);

// // //           if (docSnap.exists()) {
// // //             const userData = docSnap.data();
// // //             const roadmaps = userData.roadmap || [];
// // //             const selectedRoadmap = roadmaps[parseInt(roadmapIndex)];
            
// // //             if (selectedRoadmap) {
// // //               setRoadmapData(selectedRoadmap);
// // //             } else {
// // //               console.warn(`Roadmap at index ${roadmapIndex} not found`);
// // //               setRoadmapData(mockRoadmapData);
// // //             }
// // //           } else {
// // //             setRoadmapData(mockRoadmapData);
// // //           }
// // //         } else {
// // //           // Fallback to mock data if no index provided
// // //           setRoadmapData(mockRoadmapData);
// // //         }
// // //       } catch (err) {
// // //         console.error("Error fetching roadmap:", err);
// // //         setRoadmapData(mockRoadmapData);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     if (!authLoading) fetchRoadmap();
// // //   }, [user, authLoading, roadmapIndex, location.state]);

// // //   // Animate task appearance
// // //   useEffect(() => {
// // //     if (!roadmapData) return;

// // //     const timer = setInterval(() => {
// // //       setVisibleTasks((prev) => {
// // //         if (prev < roadmapData.tasks.length) return prev + 1;
// // //         clearInterval(timer);
// // //         return prev;
// // //       });
// // //     }, 200);

// // //     return () => clearInterval(timer);
// // //   }, [roadmapData]);

// // //   // Status helpers
// // //   // const getStatusIcon = (status: string) => {
// // //   //   switch (status) {
// // //   //     case "completed":
// // //   //       return <CheckCircle className="w-5 h-5 text-white" />;
// // //   //     case "current":
// // //   //       return <AlertCircle className="w-5 h-5 text-blue-300" />;
// // //   //     case "upcoming":
// // //   //       return <Circle className="w-5 h-5 text-gray-300" />;
// // //   //     default:
// // //   //       return <Circle className="w-5 h-5 text-gray-300" />;
// // //   //   }
// // //   // };

// // //   const getStatusText = (status: string) => {
// // //     switch (status) {
// // //       case "completed":
// // //         return "Completed";
// // //       case "current":
// // //         return "In Progress";
// // //       case "upcoming":
// // //         return "Upcoming";
// // //       default:
// // //         return "Upcoming";
// // //     }
// // //   };

// // //   const getStatusBadgeColor = (status: string) => {
// // //     switch (status) {
// // //       case "completed":
// // //         return "bg-white/15 text-white border-white/25 backdrop-blur-sm";
// // //       case "current":
// // //         return "bg-blue-500/15 text-blue-300 border-blue-400/30 backdrop-blur-sm";
// // //       case "upcoming":
// // //         return "bg-white/8 text-gray-300 border-white/15 backdrop-blur-sm";
// // //       default:
// // //         return "bg-white/8 text-gray-300 border-white/15 backdrop-blur-sm";
// // //     }
// // //   };

// // //   const toggleResourceExpansion = (taskIndex: number) => {
// // //     setExpandedResources((prev) =>
// // //       prev.includes(taskIndex)
// // //         ? prev.filter((index) => index !== taskIndex)
// // //         : [...prev, taskIndex]
// // //     );
// // //   };

// // //   // Loading / fallback UI
// // //   if (authLoading || loading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
// // //         <div className="absolute top-32 left-32 w-64 h-64 bg-white/3 rounded-full blur-3xl"></div>
// // //         <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
// // //         <div className="text-center backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8">
// // //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
// // //           <p className="text-white text-lg">Loading your roadmap...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!roadmapData) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
// // //         <div className="absolute top-32 left-32 w-64 h-64 bg-white/3 rounded-full blur-3xl"></div>
// // //         <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
// // //         <div className="text-center backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8">
// // //           <p className="text-white text-lg mb-4">No roadmap found.</p>
// // //           <button 
// // //             onClick={() => navigate('/skill')}
// // //             className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-white rounded-lg hover:bg-blue-500/30 transition-all duration-300"
// // //           >
// // //             Back to Career Paths
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   const nextTask =
// // //     roadmapData.tasks.find((task) => task.status === "current") ||
// // //     roadmapData.tasks.find((task) => task.status === "upcoming");

// // //   const completedTasks = roadmapData.tasks.filter(
// // //     (task) => task.status === "completed"
// // //   ).length;
// // //   const totalTasks = roadmapData.tasks.length;
// // //   const progressPercentage =
// // //     totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

// // //   return (
// // //     <div className="min-h-screen  relative overflow-hidden">
// // //       {/* Background glass elements */}
// // //       <div className="absolute top-20 left-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
// // //       <div className="absolute top-40 right-40 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-3xl"></div>
// // //       <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl"></div>
      
// // //       <div className="relative z-10 p-6 pt-20">
// // //         <div className="max-w-6xl mx-auto">
// // //           {/* Page Header */}
// // //           <div className="text-center mb-16">
// // //             <div className="relative inline-block">
// // //               <h1 className="text-5xl font-bold text-white mb-4">
// // //                 {roadmapData.title} Roadmap
// // //               </h1>
// // //               <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3xl h-1 bg-gradient-to-r from-transparent via-blue-800 to-transparent rounded-full"></div>
// // //             </div>
// // //             <p className="text-gray-200 text-lg mt-6">
// // //               A personalized journey to master {roadmapData.title.toLowerCase()} skills.
// // //             </p>

// // //             {/* Progress Overview - Glass Design */}
// // //             <div className="mt-8 backdrop-blur-xl bg-white/[0.04] border border-white/15 rounded-2xl p-6 max-w-md mx-auto relative overflow-hidden">
// // //               <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl"></div>
// // //               <div className="relative z-10">
// // //                 <div className="flex items-center justify-between mb-4">
// // //                   <span className="text-gray-200">Overall Progress</span>
// // //                   <span className="text-blue-300 font-bold">
// // //                     {completedTasks}/{totalTasks}
// // //                   </span>
// // //                 </div>
// // //                 <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-3 border border-white/20">
// // //                   <div
// // //                     className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
// // //                     style={{ width: `${progressPercentage}%` }}
// // //                   />
// // //                 </div>
// // //                 <p className="text-sm text-gray-300 mt-2">
// // //                   {Math.round(progressPercentage)}% Complete
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
// // //             {/* Roadmap Timeline */}
// // //             <div className="lg:col-span-3">
// // //               <div className="relative">
// // //                 {/* Glass timeline line */}
// // //                 <div
// // //                   className="absolute left-3 top-8 w-0.5 bg-gradient-to-b from-blue-400/30 via-white/10 to-white/5 backdrop-blur-sm"
// // //                   style={{ height: `${(roadmapData.tasks.length - 1) * 250}px` }}
// // //                 ></div>

// // //                 <div className="space-y-8">
// // //                   {roadmapData.tasks.map((task, index) => (
// // //                     <div
// // //                       key={index}
// // //                       className={`relative transition-all duration-500 ease-out transform ${
// // //                         index < visibleTasks
// // //                           ? "opacity-100 translate-x-0"
// // //                           : "opacity-0 translate-x-8"
// // //                       }`}
// // //                       style={{ transitionDelay: `${index * 100}ms` }}
// // //                     >
// // //                       {/* Task Number Circle - Glass Design */}
// // //                       <div className="absolute left-0 flex items-center justify-center">
// // //                         <div
// // //                           className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-xl relative overflow-hidden ${
// // //                             task.status === "completed"
// // //                               ? "bg-white/20 border-white/40 shadow-lg"
// // //                               : task.status === "current"
// // //                               ? "bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-400/20"
// // //                               : "bg-white/[0.05] border-white/20"
// // //                           }`}
// // //                         >
// // //                           {/* {task.status === "completed" && (
// // //                             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
// // //                           )}
// // //                           {task.status === "current" && (
// // //                             <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 to-transparent rounded-full"></div>
// // //                           )} */}
// // //                           {/* <span
// // //                             className={`font-bold text-lg transition-colors relative z-10 ${
// // //                               task.status === "completed"
// // //                                 ? "text-white"
// // //                                 : task.status === "current"
// // //                                 ? "text-blue-200"
// // //                                 : "text-white"
// // //                             }`}
// // //                           >
// // //                             {index + 1}
// // //                           </span> */}
// // //                         </div>
// // //                       </div>

// // //                       {/* Task Card - Glass Design */}
// // //                       <div className="ml-24 backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 hover:border-blue-300/30 hover:bg-white/[0.06] transition-all duration-300 relative overflow-hidden group">
// // //                         {/* Glass surface reflection */}
// // //                         <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
                        
// // //                         <div className="relative z-10">
// // //                           <div className="flex items-start justify-between mb-4">
// // //                             <h3 className="text-xl font-bold text-white">
// // //                               {task.taskName}
// // //                             </h3>
// // //                             <div className="flex items-center gap-2">
// // //                               {/* {getStatusIcon(task.status)} */}
// // //                               <span
// // //                                 className={`text-xs px-3 py-1 rounded-full border ${getStatusBadgeColor(
// // //                                   task.status
// // //                                 )}`}
// // //                               >
// // //                                 {getStatusText(task.status)}
// // //                               </span>
// // //                             </div>
// // //                           </div>

// // //                           <div className="flex items-center gap-3 mb-6">
// // //                             <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-white/20 bg-white/[0.05] backdrop-blur-sm">
// // //                               <Clock className="w-3 h-3 text-gray-200" />
// // //                               <span className="text-gray-200">
// // //                                 {task.timeAllocation}
// // //                               </span>
// // //                             </span>
                           
// // //                           </div>

// // //                           {/* Resources Section */}
// // //                           <div className="space-y-3">
// // //                             <div className="flex items-center justify-between">
// // //                               <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
// // //                                 <BookOpen className="w-4 h-4" />
// // //                                 Learning Resources ({task.resources?.length || 0})
// // //                               </h4>
// // //                               {(task.resources?.length || 0) > 2 && (
// // //                                 <button
// // //                                   onClick={() => toggleResourceExpansion(index)}
// // //                                   className="text-blue-300 hover:text-blue-200 text-sm transition-colors backdrop-blur-sm bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20"
// // //                                 >
// // //                                   {expandedResources.includes(index)
// // //                                     ? "Show Less"
// // //                                     : "Show All"}
// // //                                 </button>
// // //                               )}
// // //                             </div>

// // //                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
// // //                               {(expandedResources.includes(index)
// // //                                 ? task.resources || []
// // //                                 : (task.resources || []).slice(0, 2)
// // //                               ).map((resource, resourceIndex) => (
// // //                                 <div
// // //                                   key={resourceIndex}
// // //                                   className="flex items-center gap-2 text-sm text-gray-200 backdrop-blur-sm bg-white/[0.06] rounded-lg p-3 hover:bg-white/[0.1] transition-colors cursor-pointer group/resource border border-white/15"
// // //                                 >
// // //                                   <ExternalLink className="w-3 h-3 text-blue-300 group-hover/resource:text-blue-200" />
// // //                                   <span className="flex-1">
// // //                                     {resource}
// // //                                   </span>
// // //                                 </div>
// // //                               ))}
// // //                             </div>

// // //                             {!expandedResources.includes(index) &&
// // //                               (task.resources?.length ?? 0) > 2 && (
// // //                                 <p className="text-xs text-gray-400 text-center">
// // //                                   +{(task.resources?.length || 0) - 2} more resources
// // //                                   available
// // //                                 </p>
// // //                               )}
// // //                           </div>
// // //                         </div>

// // //                         {/* Glass shimmer effect */}
// // //                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
// // //                           <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/8 to-transparent rotate-12 group-hover:left-full transition-all duration-1000 ease-out"></div>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Sidebar - Glass Design */}
// // //             <div className="lg:col-span-1">
// // //               <div className="sticky top-6 space-y-6">
// // //                 {/* Progress Stats - Glass */}
// // //                 <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 relative overflow-hidden">
// // //                   <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
// // //                   <div className="relative z-10">
// // //                     <h3 className="text-xl font-bold text-white mb-6">
// // //                       Progress Overview
// // //                     </h3>
// // //                     <div className="space-y-4">
// // //                       <div className="flex items-center justify-between">
// // //                         <span className="text-gray-200 text-sm">Completed</span>
// // //                         <span className="text-white font-bold">
// // //                           {completedTasks}
// // //                         </span>
// // //                       </div>
// // //                       <div className="flex items-center justify-between">
// // //                         <span className="text-gray-200 text-sm">In Progress</span>
// // //                         <span className="text-blue-300 font-bold">
// // //                           {
// // //                             roadmapData.tasks.filter((t) => t.status === "current")
// // //                               .length
// // //                           }
// // //                         </span>
// // //                       </div>
// // //                       <div className="flex items-center justify-between">
// // //                         <span className="text-gray-200 text-sm">Remaining</span>
// // //                         <span className="text-gray-300 font-bold">
// // //                           {
// // //                             roadmapData.tasks.filter((t) => t.status === "upcoming")
// // //                               .length
// // //                           }
// // //                         </span>
// // //                       </div>
// // //                       <div className="pt-3 border-t border-white/15">
// // //                         <div className="flex items-center justify-between">
// // //                           <span className="text-gray-100 font-medium">
// // //                             Total Progress
// // //                           </span>
// // //                           <span className="text-blue-300 font-bold">
// // //                             {Math.round(progressPercentage)}%
// // //                           </span>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
                
// // //                 {/* Navigation Button - Glass */}
// // //                 <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 flex justify-center items-center relative overflow-hidden">
// // //                   <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
// // //                   <button 
// // //                     onClick={() => navigate('/skill')}
// // //                     className="relative z-10 w-full backdrop-blur-sm bg-blue-500/20 border border-blue-500/30 rounded-full p-3 text-white font-medium hover:bg-blue-500/30 hover:scale-[1.02] transition-all duration-300"
// // //                   >
// // //                     Career Paths
// // //                   </button>
// // //                 </div>

// // //                 {/* Current Task Spotlight - Glass */}
// // //                 {/* {nextTask && (
// // //                   <div className="backdrop-blur-xl bg-blue-500/[0.06] rounded-2xl p-6 border border-blue-400/20 relative overflow-hidden">
// // //                     <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.08] to-transparent rounded-2xl"></div>
// // //                     <div className="relative z-10">
// // //                       <h3 className="text-lg font-bold text-white mb-4">
// // //                         Focus Area
// // //                       </h3>
// // //                       <div className="space-y-3">
// // //                         <h4 className="text-blue-300 font-semibold">
// // //                           {nextTask.taskName}
// // //                         </h4>
// // //                         <div className="flex items-center gap-2 text-sm text-gray-200">
// // //                           <Clock className="w-4 h-4" />
// // //                           <span>
// // //                             {nextTask.timeAllocation}
// // //                           </span>
// // //                         </div>
// // //                         <p className="text-xs text-gray-300">
// // //                           {nextTask.resources?.length || 0} resources available to help
// // //                           you succeed
// // //                         </p>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 )} */}


// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Next Step Highlight - Glass Design */}
// // //           {nextTask && (
// // //             <div className="mt-12">
// // //               <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-8 border border-blue-400/25 relative overflow-hidden">
// // //                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-white/[0.02] rounded-2xl"></div>

// // //                 <div className="relative z-10">
// // //                   <div className="text-center mb-6">
// // //                     <h3 className="text-2xl font-bold text-white mb-2">
// // //                       Ready to Continue?
// // //                     </h3>
// // //                     <p className="text-gray-200">
// // //                       Take the next step in your learning journey
// // //                     </p>
// // //                   </div>

// // //                   <div className="backdrop-blur-xl bg-white/[0.06] rounded-xl p-6 mb-6 border border-white/15 relative overflow-hidden">
// // //                     <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-xl"></div>
// // //                     <div className="relative z-10">
// // //                       <h4 className="text-xl font-semibold text-white mb-4">
// // //                         {nextTask.taskName}
// // //                       </h4>

// // //                       <div className="flex flex-wrap gap-3 mb-6">
// // //                         <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-sm">
// // //                           <Clock className="w-4 h-4 text-gray-200" />
// // //                           <span className="text-gray-200">
// // //                             {nextTask.timeAllocation}
// // //                           </span>
// // //                         </span>
// // //                         <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-blue-400/25 bg-blue-400/15 text-blue-300 backdrop-blur-sm">
// // //                           <BookOpen className="w-4 h-4" />
// // //                           <span>
// // //                             {nextTask.resources?.length || 0} resources
// // //                           </span>
// // //                         </span>
// // //                       </div>

// // //                       <div className="space-y-2">
// // //                         <h5 className="text-sm font-semibold text-gray-200">
// // //                           Available Resources:
// // //                         </h5>
// // //                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
// // //                           {(nextTask.resources || []).slice(0, 4).map((resource, index) => (
// // //                             <div
// // //                               key={index}
// // //                               className="text-sm text-gray-200 flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm rounded p-2 border border-white/15"
// // //                             >
// // //                               <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
// // //                               <span className="truncate">
// // //                                 {resource}
// // //                               </span>
// // //                             </div>
// // //                           ))}
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                   <div className="text-center">
// // //                     <button className="px-8 py-4 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:from-blue-400/25 hover:to-blue-500/25 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02]">
// // //                       Start Learning
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default RoadmapPage;

// // import React, { useState, useEffect } from "react";
// // import {
// //   Clock,
// //   BookOpen,
// //   Play,
// //   CheckCircle,
// //   Circle,
// //   AlertCircle,
// //   ExternalLink,
// //   Target,
// // } from "lucide-react";
// // import { useAuth } from "../context/authContext";
// // import { db } from "../firebase/firebase";
// // import { doc, getDoc } from "firebase/firestore";
// // import { useNavigate, useParams, useLocation } from "react-router-dom";

// // interface Resource {
// //   title: string;
// //   link: string;
// // }

// // interface Task {
// //   taskName: string;
// //   status: "completed" | "current" | "upcoming";
// //   timeAllocation: string;
// //   resources: Resource[];
// // }

// // interface RoadmapData {
// //   title: string;
// //   tasks: Task[];
// // }

// // // Mock Firebase data (used only as fallback)
// // const mockRoadmapData: RoadmapData = {
// //   title: "Frontend Development",
// //   tasks: [
// //     {
// //       taskName: "Learn HTML",
// //       status: "completed",
// //       timeAllocation: "2 weeks",
// //       resources: [
// //         { title: "W3Schools - HTML Tutorial", link: "https://www.w3schools.com/html/" },
// //         { title: "MDN - HTML Basics", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
// //         { title: "freeCodeCamp - HTML Guide", link: "https://www.freecodecamp.org/learn/responsive-web-design/" }
// //       ],
// //     },
// //     {
// //       taskName: "Learn CSS",
// //       status: "current",
// //       timeAllocation: "3 weeks",
// //       resources: [
// //         { title: "CSS Tricks", link: "https://css-tricks.com/" },
// //         { title: "MDN - CSS", link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
// //         { title: "YouTube - Traversy Media CSS", link: "https://www.youtube.com/@TraversyMedia" }
// //       ],
// //     },
// //     {
// //       taskName: "Learn JavaScript Fundamentals",
// //       status: "upcoming",
// //       timeAllocation: "4 weeks",
// //       resources: [
// //         { title: "MDN - JavaScript Guide", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
// //         { title: "JavaScript.info", link: "https://javascript.info/" },
// //         { title: "Eloquent JavaScript Book", link: "https://eloquentjavascript.net/" },
// //         { title: "freeCodeCamp - JavaScript", link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" }
// //       ],
// //     },
// //     {
// //       taskName: "Learn React.js",
// //       status: "upcoming",
// //       timeAllocation: "5 weeks",
// //       resources: [
// //         { title: "Official React Documentation", link: "https://react.dev/" },
// //         { title: "React Tutorial for Beginners", link: "https://react.dev/learn/tutorial-tic-tac-toe" },
// //         { title: "The Complete React Course", link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/" },
// //         { title: "React Projects for Practice", link: "https://github.com/topics/react-projects" }
// //       ],
// //     },
// //     {
// //       taskName: "Build Portfolio Projects",
// //       status: "upcoming",
// //       timeAllocation: "6 weeks",
// //       resources: [
// //         { title: "Portfolio Project Ideas", link: "https://github.com/topics/portfolio-projects" },
// //         { title: "GitHub Pages Deployment", link: "https://pages.github.com/" },
// //         { title: "Netlify Hosting Guide", link: "https://docs.netlify.com/" },
// //         { title: "Portfolio Design Inspiration", link: "https://dribbble.com/tags/portfolio" }
// //       ],
// //     },
// //   ],
// // };

// // const RoadmapPage: React.FC = () => {
// //   const { user, loading: authLoading } = useAuth();
// //   const { roadmapIndex } = useParams<{ roadmapIndex: string }>();
// //   const location = useLocation();
// //   const navigate = useNavigate();
  
// //   const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [visibleTasks, setVisibleTasks] = useState<number>(0);
// //   const [expandedResources, setExpandedResources] = useState<number[]>([]);

// //   // Fetch roadmap dynamically from Firestore or URL params
// //   useEffect(() => {
// //     const fetchRoadmap = async () => {
// //       if (!user) return;

// //       try {
// //         // Check if roadmap data is passed via state (from navigation)
// //         if (location.state?.roadmapData) {
// //           setRoadmapData(location.state.roadmapData);
// //           setLoading(false);
// //           return;
// //         }

// //         // If no state data, fetch from Firestore using roadmapIndex
// //         if (roadmapIndex !== undefined) {
// //           const docRef = doc(db, "user", user.uid);
// //           const docSnap = await getDoc(docRef);

// //           if (docSnap.exists()) {
// //             const userData = docSnap.data();
// //             const roadmaps = userData.roadmap || [];
// //             const selectedRoadmap = roadmaps[parseInt(roadmapIndex)];
            
// //             if (selectedRoadmap) {
// //               setRoadmapData(selectedRoadmap);
// //             } else {
// //               console.warn(`Roadmap at index ${roadmapIndex} not found`);
// //               setRoadmapData(mockRoadmapData);
// //             }
// //           } else {
// //             setRoadmapData(mockRoadmapData);
// //           }
// //         } else {
// //           // Fallback to mock data if no index provided
// //           setRoadmapData(mockRoadmapData);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching roadmap:", err);
// //         setRoadmapData(mockRoadmapData);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (!authLoading) fetchRoadmap();
// //   }, [user, authLoading, roadmapIndex, location.state]);

// //   // Animate task appearance
// //   useEffect(() => {
// //     if (!roadmapData) return;

// //     const timer = setInterval(() => {
// //       setVisibleTasks((prev) => {
// //         if (prev < roadmapData.tasks.length) return prev + 1;
// //         clearInterval(timer);
// //         return prev;
// //       });
// //     }, 200);

// //     return () => clearInterval(timer);
// //   }, [roadmapData]);

// //   // Status helpers
// //   // const getStatusIcon = (status: string) => {
// //   //   switch (status) {
// //   //     case "completed":
// //   //       return <CheckCircle className="w-5 h-5 text-white" />;
// //   //     case "current":
// //   //       return <AlertCircle className="w-5 h-5 text-blue-300" />;
// //   //     case "upcoming":
// //   //       return <Circle className="w-5 h-5 text-gray-300" />;
// //   //     default:
// //   //       return <Circle className="w-5 h-5 text-gray-300" />;
// //   //   }
// //   // };

// //   const getStatusText = (status: string) => {
// //     switch (status) {
// //       case "completed":
// //         return "Completed";
// //       case "current":
// //         return "In Progress";
// //       case "upcoming":
// //         return "Upcoming";
// //       default:
// //         return "Upcoming";
// //     }
// //   };

// //   const getStatusBadgeColor = (status: string) => {
// //     switch (status) {
// //       case "completed":
// //         return "bg-white/15 text-white border-white/25 backdrop-blur-sm";
// //       case "current":
// //         return "bg-blue-500/15 text-blue-300 border-blue-400/30 backdrop-blur-sm";
// //       case "upcoming":
// //         return "bg-white/8 text-gray-300 border-white/15 backdrop-blur-sm";
// //       default:
// //         return "bg-white/8 text-gray-300 border-white/15 backdrop-blur-sm";
// //     }
// //   };

// //   const toggleResourceExpansion = (taskIndex: number) => {
// //     setExpandedResources((prev) =>
// //       prev.includes(taskIndex)
// //         ? prev.filter((index) => index !== taskIndex)
// //         : [...prev, taskIndex]
// //     );
// //   };

// //   // Loading / fallback UI
// //   if (authLoading || loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
// //         <div className="absolute top-32 left-32 w-64 h-64 bg-white/3 rounded-full blur-3xl"></div>
// //         <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
// //         <div className="text-center backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8">
// //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
// //           <p className="text-white text-lg">Loading your roadmap...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!roadmapData) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
// //         <div className="absolute top-32 left-32 w-64 h-64 bg-white/3 rounded-full blur-3xl"></div>
// //         <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
// //         <div className="text-center backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8">
// //           <p className="text-white text-lg mb-4">No roadmap found.</p>
// //           <button 
// //             onClick={() => navigate('/skill')}
// //             className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-white rounded-lg hover:bg-blue-500/30 transition-all duration-300"
// //           >
// //             Back to Career Paths
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const nextTask =
// //     roadmapData.tasks.find((task) => task.status === "current") ||
// //     roadmapData.tasks.find((task) => task.status === "upcoming");

// //   const completedTasks = roadmapData.tasks.filter(
// //     (task) => task.status === "completed"
// //   ).length;
// //   const totalTasks = roadmapData.tasks.length;
// //   const progressPercentage =
// //     totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

// //   return (
// //     <div className="min-h-screen  relative overflow-hidden">
// //       {/* Background glass elements */}
// //       <div className="absolute top-20 left-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
// //       <div className="absolute top-40 right-40 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-3xl"></div>
// //       <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl"></div>
      
// //       <div className="relative z-10 p-6 pt-20">
// //         <div className="max-w-6xl mx-auto">
// //           {/* Page Header */}
// //           <div className="text-center mb-16">
// //             <div className="relative inline-block">
// //               <h1 className="text-5xl font-bold text-white mb-4">
// //                 {roadmapData.title} Roadmap
// //               </h1>
// //               <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3xl h-1 bg-gradient-to-r from-transparent via-blue-800 to-transparent rounded-full"></div>
// //             </div>
// //             <p className="text-gray-200 text-lg mt-6">
// //               A personalized journey to master {roadmapData.title.toLowerCase()} skills.
// //             </p>

// //             {/* Progress Overview - Glass Design */}
// //             <div className="mt-8 backdrop-blur-xl bg-white/[0.04] border border-white/15 rounded-2xl p-6 max-w-md mx-auto relative overflow-hidden">
// //               <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl"></div>
// //               <div className="relative z-10">
// //                 <div className="flex items-center justify-between mb-4">
// //                   <span className="text-gray-200">Overall Progress</span>
// //                   <span className="text-blue-300 font-bold">
// //                     {completedTasks}/{totalTasks}
// //                   </span>
// //                 </div>
// //                 <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-3 border border-white/20">
// //                   <div
// //                     className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
// //                     style={{ width: `${progressPercentage}%` }}
// //                   />
// //                 </div>
// //                 <p className="text-sm text-gray-300 mt-2">
// //                   {Math.round(progressPercentage)}% Complete
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
// //             {/* Roadmap Timeline */}
// //             <div className="lg:col-span-3">
// //               <div className="relative">
// //                 {/* Glass timeline line */}
// //                 <div
// //                   className="absolute left-3 top-8 w-0.5 bg-gradient-to-b from-blue-400/30 via-white/10 to-white/5 backdrop-blur-sm"
// //                   style={{ height: `${(roadmapData.tasks.length - 1) * 250}px` }}
// //                 ></div>

// //                 <div className="space-y-8">
// //                   {roadmapData.tasks.map((task, index) => (
// //                     <div
// //                       key={index}
// //                       className={`relative transition-all duration-500 ease-out transform ${
// //                         index < visibleTasks
// //                           ? "opacity-100 translate-x-0"
// //                           : "opacity-0 translate-x-8"
// //                       }`}
// //                       style={{ transitionDelay: `${index * 100}ms` }}
// //                     >
// //                       {/* Task Number Circle - Glass Design */}
// //                       <div className="absolute left-0 flex items-center justify-center">
// //                         <div
// //                           className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-xl relative overflow-hidden ${
// //                             task.status === "completed"
// //                               ? "bg-white/20 border-white/40 shadow-lg"
// //                               : task.status === "current"
// //                               ? "bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-400/20"
// //                               : "bg-white/[0.05] border-white/20"
// //                           }`}
// //                         >
// //                           {/* {task.status === "completed" && (
// //                             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
// //                           )}
// //                           {task.status === "current" && (
// //                             <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 to-transparent rounded-full"></div>
// //                           )} */}
// //                           {/* <span
// //                             className={`font-bold text-lg transition-colors relative z-10 ${
// //                               task.status === "completed"
// //                                 ? "text-white"
// //                                 : task.status === "current"
// //                                 ? "text-blue-200"
// //                                 : "text-white"
// //                             }`}
// //                           >
// //                             {index + 1}
// //                           </span> */}
// //                         </div>
// //                       </div>

// //                       {/* Task Card - Glass Design */}
// //                       <div className="ml-24 backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 hover:border-blue-300/30 hover:bg-white/[0.06] transition-all duration-300 relative overflow-hidden group">
// //                         {/* Glass surface reflection */}
// //                         <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
                        
// //                         <div className="relative z-10">
// //                           <div className="flex items-start justify-between mb-4">
// //                             <h3 className="text-xl font-bold text-white">
// //                               {task.taskName}
// //                             </h3>
// //                             <div className="flex items-center gap-2">
// //                               {/* {getStatusIcon(task.status)} */}
// //                               <span
// //                                 className={`text-xs px-3 py-1 rounded-full border ${getStatusBadgeColor(
// //                                   task.status
// //                                 )}`}
// //                               >
// //                                 {getStatusText(task.status)}
// //                               </span>
// //                             </div>
// //                           </div>

// //                           <div className="flex items-center gap-3 mb-6">
// //                             <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-white/20 bg-white/[0.05] backdrop-blur-sm">
// //                               <Clock className="w-3 h-3 text-gray-200" />
// //                               <span className="text-gray-200">
// //                                 {task.timeAllocation}
// //                               </span>
// //                             </span>
                           
// //                           </div>

// //                           {/* Resources Section */}
// //                           <div className="space-y-3">
// //                             <div className="flex items-center justify-between">
// //                               <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
// //                                 <BookOpen className="w-4 h-4" />
// //                                 Learning Resources ({task.resources?.length || 0})
// //                               </h4>
// //                               {(task.resources?.length || 0) > 2 && (
// //                                 <button
// //                                   onClick={() => toggleResourceExpansion(index)}
// //                                   className="text-blue-300 hover:text-blue-200 text-sm transition-colors backdrop-blur-sm bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20"
// //                                 >
// //                                   {expandedResources.includes(index)
// //                                     ? "Show Less"
// //                                     : "Show All"}
// //                                 </button>
// //                               )}
// //                             </div>

// //                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
// //                               {(expandedResources.includes(index)
// //                                 ? task.resources || []
// //                                 : (task.resources || []).slice(0, 2)
// //                               ).map((resource, resourceIndex) => (
// //                                 <a
// //                                   key={resourceIndex}
// //                                   href={resource.link}
// //                                   target="_blank"
// //                                   rel="noopener noreferrer"
// //                                   className="flex items-center gap-2 text-sm text-gray-200 backdrop-blur-sm bg-white/[0.06] rounded-lg p-3 hover:bg-white/[0.1] transition-colors group/resource border border-white/15"
// //                                 >
// //                                   <ExternalLink className="w-3 h-3 text-blue-300 group-hover/resource:text-blue-200" />
// //                                   <span className="flex-1">
// //                                     {resource.title}
// //                                   </span>
// //                                 </a>
// //                               ))}
// //                             </div>

// //                             {!expandedResources.includes(index) &&
// //                               (task.resources?.length ?? 0) > 2 && (
// //                                 <p className="text-xs text-gray-400 text-center">
// //                                   +{(task.resources?.length || 0) - 2} more resources
// //                                   available
// //                                 </p>
// //                               )}
// //                           </div>
// //                         </div>

// //                         {/* Glass shimmer effect */}
// //                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
// //                           <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/8 to-transparent rotate-12 group-hover:left-full transition-all duration-1000 ease-out"></div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Sidebar - Glass Design */}
// //             <div className="lg:col-span-1">
// //               <div className="sticky top-6 space-y-6">
// //                 {/* Progress Stats - Glass */}
// //                 <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 relative overflow-hidden">
// //                   <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
// //                   <div className="relative z-10">
// //                     <h3 className="text-xl font-bold text-white mb-6">
// //                       Progress Overview
// //                     </h3>
// //                     <div className="space-y-4">
// //                       <div className="flex items-center justify-between">
// //                         <span className="text-gray-200 text-sm">Completed</span>
// //                         <span className="text-white font-bold">
// //                           {completedTasks}
// //                         </span>
// //                       </div>
// //                       <div className="flex items-center justify-between">
// //                         <span className="text-gray-200 text-sm">In Progress</span>
// //                         <span className="text-blue-300 font-bold">
// //                           {
// //                             roadmapData.tasks.filter((t) => t.status === "current")
// //                               .length
// //                           }
// //                         </span>
// //                       </div>
// //                       <div className="flex items-center justify-between">
// //                         <span className="text-gray-200 text-sm">Remaining</span>
// //                         <span className="text-gray-300 font-bold">
// //                           {
// //                             roadmapData.tasks.filter((t) => t.status === "upcoming")
// //                               .length
// //                           }
// //                         </span>
// //                       </div>
// //                       <div className="pt-3 border-t border-white/15">
// //                         <div className="flex items-center justify-between">
// //                           <span className="text-gray-100 font-medium">
// //                             Total Progress
// //                           </span>
// //                           <span className="text-blue-300 font-bold">
// //                             {Math.round(progressPercentage)}%
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 {/* Navigation Button - Glass */}
// //                 <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 flex justify-center items-center relative overflow-hidden">
// //                   <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
// //                   <button 
// //                     onClick={() => navigate('/skill')}
// //                     className="relative z-10 w-full backdrop-blur-sm bg-blue-500/20 border border-blue-500/30 rounded-full p-3 text-white font-medium hover:bg-blue-500/30 hover:scale-[1.02] transition-all duration-300"
// //                   >
// //                     Career Paths
// //                   </button>
// //                 </div>

// //                 {/* Current Task Spotlight - Glass */}
// //                 {/* {nextTask && (
// //                   <div className="backdrop-blur-xl bg-blue-500/[0.06] rounded-2xl p-6 border border-blue-400/20 relative overflow-hidden">
// //                     <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.08] to-transparent rounded-2xl"></div>
// //                     <div className="relative z-10">
// //                       <h3 className="text-lg font-bold text-white mb-4">
// //                         Focus Area
// //                       </h3>
// //                       <div className="space-y-3">
// //                         <h4 className="text-blue-300 font-semibold">
// //                           {nextTask.taskName}
// //                         </h4>
// //                         <div className="flex items-center gap-2 text-sm text-gray-200">
// //                           <Clock className="w-4 h-4" />
// //                           <span>
// //                             {nextTask.timeAllocation}
// //                           </span>
// //                         </div>
// //                         <p className="text-xs text-gray-300">
// //                           {nextTask.resources?.length || 0} resources available to help
// //                           you succeed
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )} */}


// //               </div>
// //             </div>
// //           </div>

// //           {/* Next Step Highlight - Glass Design */}
// //           {nextTask && (
// //             <div className="mt-12">
// //               <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-8 border border-blue-400/25 relative overflow-hidden">
// //                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-white/[0.02] rounded-2xl"></div>

// //                 <div className="relative z-10">
// //                   <div className="text-center mb-6">
// //                     <h3 className="text-2xl font-bold text-white mb-2">
// //                       Ready to Continue?
// //                     </h3>
// //                     <p className="text-gray-200">
// //                       Take the next step in your learning journey
// //                     </p>
// //                   </div>

// //                   <div className="backdrop-blur-xl bg-white/[0.06] rounded-xl p-6 mb-6 border border-white/15 relative overflow-hidden">
// //                     <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-xl"></div>
// //                     <div className="relative z-10">
// //                       <h4 className="text-xl font-semibold text-white mb-4">
// //                         {nextTask.taskName}
// //                       </h4>

// //                       <div className="flex flex-wrap gap-3 mb-6">
// //                         <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-sm">
// //                           <Clock className="w-4 h-4 text-gray-200" />
// //                           <span className="text-gray-200">
// //                             {nextTask.timeAllocation}
// //                           </span>
// //                         </span>
// //                         <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-blue-400/25 bg-blue-400/15 text-blue-300 backdrop-blur-sm">
// //                           <BookOpen className="w-4 h-4" />
// //                           <span>
// //                             {nextTask.resources?.length || 0} resources
// //                           </span>
// //                         </span>
// //                       </div>

// //                       <div className="space-y-2">
// //                         <h5 className="text-sm font-semibold text-gray-200">
// //                           Available Resources:
// //                         </h5>
// //                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
// //                           {(nextTask.resources || []).slice(0, 4).map((resource, index) => (
// //                             <a
// //                               key={index}
// //                               href={resource.link}
// //                               target="_blank"
// //                               rel="noopener noreferrer"
// //                               className="text-sm text-gray-200 flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm rounded p-2 border border-white/15 hover:bg-white/[0.1] transition-colors"
// //                             >
// //                               <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
// //                               <span className="truncate">
// //                                 {resource.title}
// //                               </span>
// //                             </a>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="text-center">
// //                     <button className="px-8 py-4 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:from-blue-400/25 hover:to-blue-500/25 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02]">
// //                       Start Learning
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default RoadmapPage;



// import React, { useState, useEffect } from "react";
// import {
//   Clock,
//   BookOpen,
//   Play,
//   CheckCircle,
//   Circle,
//   AlertCircle,
//   ExternalLink,
//   Target,
// } from "lucide-react";
// import { useAuth } from "../context/authContext";
// import { db } from "../firebase/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate, useParams, useLocation } from "react-router-dom";

// interface Resource {
//   title: string;
//   link: string;
// }

// interface Task {
//   taskName: string;
//   status: "completed" | "current" | "upcoming";
//   timeAllocation: string;
//   resources: Resource[];
// }

// interface RoadmapData {
//   title: string;
//   tasks: Task[];
// }

// // Mock Firebase data (used only as fallback)
// const mockRoadmapData: RoadmapData = {
//   title: "Frontend Development",
//   tasks: [
//     {
//       taskName: "Learn HTML",
//       status: "completed",
//       timeAllocation: "2 weeks",
//       resources: [
//         { title: "W3Schools - HTML Tutorial", link: "https://www.w3schools.com/html/" },
//         { title: "MDN - HTML Basics", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
//         { title: "freeCodeCamp - HTML Guide", link: "https://www.freecodecamp.org/learn/responsive-web-design/" }
//       ],
//     },
//     {
//       taskName: "Learn CSS",
//       status: "current",
//       timeAllocation: "3 weeks",
//       resources: [
//         { title: "CSS Tricks", link: "https://css-tricks.com/" },
//         { title: "MDN - CSS", link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
//         { title: "YouTube - Traversy Media CSS", link: "https://www.youtube.com/@TraversyMedia" }
//       ],
//     },
//     {
//       taskName: "Learn JavaScript Fundamentals",
//       status: "upcoming",
//       timeAllocation: "4 weeks",
//       resources: [
//         { title: "MDN - JavaScript Guide", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
//         { title: "JavaScript.info", link: "https://javascript.info/" },
//         { title: "Eloquent JavaScript Book", link: "https://eloquentjavascript.net/" },
//         { title: "freeCodeCamp - JavaScript", link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" }
//       ],
//     },
//     {
//       taskName: "Learn React.js",
//       status: "upcoming",
//       timeAllocation: "5 weeks",
//       resources: [
//         { title: "Official React Documentation", link: "https://react.dev/" },
//         { title: "React Tutorial for Beginners", link: "https://react.dev/learn/tutorial-tic-tac-toe" },
//         { title: "The Complete React Course", link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/" },
//         { title: "React Projects for Practice", link: "https://github.com/topics/react-projects" }
//       ],
//     },
//     {
//       taskName: "Build Portfolio Projects",
//       status: "upcoming",
//       timeAllocation: "6 weeks",
//       resources: [
//         { title: "Portfolio Project Ideas", link: "https://github.com/topics/portfolio-projects" },
//         { title: "GitHub Pages Deployment", link: "https://pages.github.com/" },
//         { title: "Netlify Hosting Guide", link: "https://docs.netlify.com/" },
//         { title: "Portfolio Design Inspiration", link: "https://dribbble.com/tags/portfolio" }
//       ],
//     },
//   ],
// };

// const RoadmapPage: React.FC = () => {
//   const { user, loading: authLoading } = useAuth();
//   const { roadmapIndex } = useParams<{ roadmapIndex: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [visibleTasks, setVisibleTasks] = useState<number>(0);
//   const [expandedResources, setExpandedResources] = useState<number[]>([]);

//   // Fetch roadmap dynamically from Firestore or URL params
//   useEffect(() => {
//     const fetchRoadmap = async () => {
//       if (!user) return;

//       try {
//         // Check if roadmap data is passed via state (from navigation)
//         if (location.state?.roadmapData) {
//           setRoadmapData(location.state.roadmapData);
//           setLoading(false);
//           return;
//         }

//         // If no state data, fetch from Firestore using roadmapIndex
//         if (roadmapIndex !== undefined) {
//           const docRef = doc(db, "user", user.uid);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             const userData = docSnap.data();
//             const roadmaps = userData.roadmap || [];
//             const selectedRoadmap = roadmaps[parseInt(roadmapIndex)];
            
//             if (selectedRoadmap) {
//               setRoadmapData(selectedRoadmap);
//             } else {
//               console.warn(`Roadmap at index ${roadmapIndex} not found`);
//               setRoadmapData(mockRoadmapData);
//             }
//           } else {
//             setRoadmapData(mockRoadmapData);
//           }
//         } else {
//           // Fallback to mock data if no index provided
//           setRoadmapData(mockRoadmapData);
//         }
//       } catch (err) {
//         console.error("Error fetching roadmap:", err);
//         setRoadmapData(mockRoadmapData);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!authLoading) fetchRoadmap();
//   }, [user, authLoading, roadmapIndex, location.state]);

//   // Animate task appearance
//   useEffect(() => {
//     if (!roadmapData) return;

//     const timer = setInterval(() => {
//       setVisibleTasks((prev) => {
//         if (prev < roadmapData.tasks.length) return prev + 1;
//         clearInterval(timer);
//         return prev;
//       });
//     }, 200);

//     return () => clearInterval(timer);
//   }, [roadmapData]);

//   // Status helpers
//   // const getStatusIcon = (status: string) => {
//   //   switch (status) {
//   //     case "completed":
//   //       return <CheckCircle className="w-5 h-5 text-white" />;
//   //     case "current":
//   //       return <AlertCircle className="w-5 h-5 text-blue-300" />;
//   //     case "upcoming":
//   //       return <Circle className="w-5 h-5 text-gray-300" />;
//   //     default:
//   //       return <Circle className="w-5 h-5 text-gray-300" />;
//   //   }
//   // };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "Completed";
//       case "current":
//         return "In Progress";
//       case "upcoming":
//         return "Upcoming";
//       default:
//         return "Upcoming";
//     }
//   };

//   const getStatusBadgeColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-white/15 text-white border-white/25 backdrop-blur-sm";
//       case "current":
//         return "bg-blue-500/15 text-blue-300 border-blue-400/30 backdrop-blur-sm";
//       case "upcoming":
//         return "bg-white/8 text-gray-300 border-white/15 backdrop-blur-sm";
//       default:
//         return "bg-white/8 text-gray-300 border-white/15 backdrop-blur-sm";
//     }
//   };

//   const toggleResourceExpansion = (taskIndex: number) => {
//     setExpandedResources((prev) =>
//       prev.includes(taskIndex)
//         ? prev.filter((index) => index !== taskIndex)
//         : [...prev, taskIndex]
//     );
//   };

//   // Loading / fallback UI
//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
//         <div className="absolute top-32 left-32 w-64 h-64 bg-white/3 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
//         <div className="text-center backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading your roadmap...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!roadmapData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
//         <div className="absolute top-32 left-32 w-64 h-64 bg-white/3 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
//         <div className="text-center backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8">
//           <p className="text-white text-lg mb-4">No roadmap found.</p>
//           <button 
//             onClick={() => navigate('/skill')}
//             className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-white rounded-lg hover:bg-blue-500/30 transition-all duration-300"
//           >
//             Back to Career Paths
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const nextTask =
//     roadmapData.tasks.find((task) => task.status === "current") ||
//     roadmapData.tasks.find((task) => task.status === "upcoming");

//   const completedTasks = roadmapData.tasks.filter(
//     (task) => task.status === "completed"
//   ).length;
//   const totalTasks = roadmapData.tasks.length;
//   const progressPercentage =
//     totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

//   return (
//     <div className="min-h-screen  relative overflow-hidden">
//       {/* Background glass elements */}
//       <div className="absolute top-20 left-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
//       <div className="absolute top-40 right-40 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-3xl"></div>
//       <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl"></div>
      
//       <div className="relative z-10 p-6 pt-20">
//         <div className="max-w-6xl mx-auto">
//           {/* Page Header */}
//           <div className="text-center mb-16">
//             <div className="relative inline-block">
//               <h1 className="text-5xl font-bold text-white mb-4">
//                 {roadmapData.title} Roadmap
//               </h1>
//               <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3xl h-1 bg-gradient-to-r from-transparent via-blue-800 to-transparent rounded-full"></div>
//             </div>
//             <p className="text-gray-200 text-lg mt-6">
//               A personalized journey to master {roadmapData.title.toLowerCase()} skills.
//             </p>

//             {/* Progress Overview - Glass Design */}
//             <div className="mt-8 backdrop-blur-xl bg-white/[0.04] border border-white/15 rounded-2xl p-6 max-w-md mx-auto relative overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl"></div>
//               <div className="relative z-10">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-gray-200">Overall Progress</span>
//                   <span className="text-blue-300 font-bold">
//                     {completedTasks}/{totalTasks}
//                   </span>
//                 </div>
//                 <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-3 border border-white/20">
//                   <div
//                     className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
//                     style={{ width: `${progressPercentage}%` }}
//                   />
//                 </div>
//                 <p className="text-sm text-gray-300 mt-2">
//                   {Math.round(progressPercentage)}% Complete
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//             {/* Roadmap Timeline */}
//             <div className="lg:col-span-3">
//               <div className="relative">
//                 {/* Glass timeline line */}
//                 <div
//                   className="absolute left-3 top-8 w-0.5 bg-gradient-to-b from-blue-400/30 via-white/10 to-white/5 backdrop-blur-sm"
//                   style={{ height: `${(roadmapData.tasks.length - 1) * 250}px` }}
//                 ></div>

//                 <div className="space-y-8">
//                   {roadmapData.tasks.map((task, index) => (
//                     <div
//                       key={index}
//                       className={`relative transition-all duration-500 ease-out transform ${
//                         index < visibleTasks
//                           ? "opacity-100 translate-x-0"
//                           : "opacity-0 translate-x-8"
//                       }`}
//                       style={{ transitionDelay: `${index * 100}ms` }}
//                     >
//                       {/* Task Number Circle - Glass Design */}
//                       <div className="absolute left-0 flex items-center justify-center">
//                         <div
//                           className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-xl relative overflow-hidden ${
//                             task.status === "completed"
//                               ? "bg-white/20 border-white/40 shadow-lg"
//                               : task.status === "current"
//                               ? "bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-400/20"
//                               : "bg-white/[0.05] border-white/20"
//                           }`}
//                         >
//                           {/* {task.status === "completed" && (
//                             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
//                           )}
//                           {task.status === "current" && (
//                             <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 to-transparent rounded-full"></div>
//                           )} */}
//                           {/* <span
//                             className={`font-bold text-lg transition-colors relative z-10 ${
//                               task.status === "completed"
//                                 ? "text-white"
//                                 : task.status === "current"
//                                 ? "text-blue-200"
//                                 : "text-white"
//                             }`}
//                           >
//                             {index + 1}
//                           </span> */}
//                         </div>
//                       </div>

//                       {/* Task Card - Glass Design */}
//                       <div className="ml-24 backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 hover:border-blue-300/30 hover:bg-white/[0.06] transition-all duration-300 relative overflow-hidden group">
//                         {/* Glass surface reflection */}
//                         <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
                        
//                         <div className="relative z-10">
//                           <div className="flex items-start justify-between mb-4">
//                             <h3 className="text-xl font-bold text-white">
//                               {task.taskName}
//                             </h3>
//                             <div className="flex items-center gap-2">
//                               {/* {getStatusIcon(task.status)} */}
//                               <span
//                                 className={`text-xs px-3 py-1 rounded-full border ${getStatusBadgeColor(
//                                   task.status
//                                 )}`}
//                               >
//                                 {getStatusText(task.status)}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-3 mb-6">
//                             <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-white/20 bg-white/[0.05] backdrop-blur-sm">
//                               <Clock className="w-3 h-3 text-gray-200" />
//                               <span className="text-gray-200">
//                                 {task.timeAllocation}
//                               </span>
//                             </span>
                           
//                           </div>

//                           {/* Resources Section */}
//                           <div className="space-y-3">
//                             <div className="flex items-center justify-between">
//                               <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
//                                 <BookOpen className="w-4 h-4" />
//                                 Learning Resources ({task.resources?.length || 0})
//                               </h4>
//                               {(task.resources?.length || 0) > 2 && (
//                                 <button
//                                   onClick={() => toggleResourceExpansion(index)}
//                                   className="text-blue-300 hover:text-blue-200 text-sm transition-colors backdrop-blur-sm bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20"
//                                 >
//                                   {expandedResources.includes(index)
//                                     ? "Show Less"
//                                     : "Show All"}
//                                 </button>
//                               )}
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                               {(expandedResources.includes(index)
//                                 ? task.resources || []
//                                 : (task.resources || []).slice(0, 2)
//                               ).map((resource, resourceIndex) => (
//                                 <a
//                                   key={resourceIndex}
//                                   href={resource.link}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="flex items-center gap-2 text-sm text-gray-200 backdrop-blur-sm bg-white/[0.06] rounded-lg p-3 hover:bg-white/[0.1] transition-colors group/resource border border-white/15"
//                                 >
//                                   <ExternalLink className="w-3 h-3 text-blue-300 group-hover/resource:text-blue-200" />
//                                   <span className="flex-1">
//                                     {resource.title}
//                                   </span>
//                                 </a>
//                               ))}
//                             </div>

//                             {!expandedResources.includes(index) &&
//                               (task.resources?.length ?? 0) > 2 && (
//                                 <p className="text-xs text-gray-400 text-center">
//                                   +{(task.resources?.length || 0) - 2} more resources
//                                   available
//                                 </p>
//                               )}
//                           </div>
//                         </div>

//                         {/* Glass shimmer effect */}
//                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
//                           <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/8 to-transparent rotate-12 group-hover:left-full transition-all duration-1000 ease-out"></div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Sidebar - Glass Design */}
//             <div className="lg:col-span-1">
//               <div className="sticky top-6 space-y-6">
//                 {/* Progress Stats - Glass */}
//                 <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 relative overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
//                   <div className="relative z-10">
//                     <h3 className="text-xl font-bold text-white mb-6">
//                       Progress Overview
//                     </h3>
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-200 text-sm">Completed</span>
//                         <span className="text-white font-bold">
//                           {completedTasks}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-200 text-sm">In Progress</span>
//                         <span className="text-blue-300 font-bold">
//                           {
//                             roadmapData.tasks.filter((t) => t.status === "current")
//                               .length
//                           }
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-200 text-sm">Remaining</span>
//                         <span className="text-gray-300 font-bold">
//                           {
//                             roadmapData.tasks.filter((t) => t.status === "upcoming")
//                               .length
//                           }
//                         </span>
//                       </div>
//                       <div className="pt-3 border-t border-white/15">
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-100 font-medium">
//                             Total Progress
//                           </span>
//                           <span className="text-blue-300 font-bold">
//                             {Math.round(progressPercentage)}%
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Navigation Button - Glass */}
//                 <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/15 flex justify-center items-center relative overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl"></div>
//                   <button 
//                     onClick={() => navigate('/skill')}
//                     className="relative z-10 w-full backdrop-blur-sm bg-blue-500/20 border border-blue-500/30 rounded-full p-3 text-white font-medium hover:bg-blue-500/30 hover:scale-[1.02] transition-all duration-300"
//                   >
//                     Career Paths
//                   </button>
//                 </div>

//                 {/* Current Task Spotlight - Glass */}
//                 {/* {nextTask && (
//                   <div className="backdrop-blur-xl bg-blue-500/[0.06] rounded-2xl p-6 border border-blue-400/20 relative overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.08] to-transparent rounded-2xl"></div>
//                     <div className="relative z-10">
//                       <h3 className="text-lg font-bold text-white mb-4">
//                         Focus Area
//                       </h3>
//                       <div className="space-y-3">
//                         <h4 className="text-blue-300 font-semibold">
//                           {nextTask.taskName}
//                         </h4>
//                         <div className="flex items-center gap-2 text-sm text-gray-200">
//                           <Clock className="w-4 h-4" />
//                           <span>
//                             {nextTask.timeAllocation}
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-300">
//                           {nextTask.resources?.length || 0} resources available to help
//                           you succeed
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )} */}


//               </div>
//             </div>
//           </div>

//           {/* Next Step Highlight - Glass Design */}
//           {nextTask && (
//             <div className="mt-12">
//               <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-8 border border-blue-400/25 relative overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-white/[0.02] rounded-2xl"></div>

//                 <div className="relative z-10">
//                   <div className="text-center mb-6">
//                     <h3 className="text-2xl font-bold text-white mb-2">
//                       Ready to Continue?
//                     </h3>
//                     <p className="text-gray-200">
//                       Take the next step in your learning journey
//                     </p>
//                   </div>

//                   <div className="backdrop-blur-xl bg-white/[0.06] rounded-xl p-6 mb-6 border border-white/15 relative overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-xl"></div>
//                     <div className="relative z-10">
//                       <h4 className="text-xl font-semibold text-white mb-4">
//                         {nextTask.taskName}
//                       </h4>

//                       <div className="flex flex-wrap gap-3 mb-6">
//                         <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-sm">
//                           <Clock className="w-4 h-4 text-gray-200" />
//                           <span className="text-gray-200">
//                             {nextTask.timeAllocation}
//                           </span>
//                         </span>
//                         <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-blue-400/25 bg-blue-400/15 text-blue-300 backdrop-blur-sm">
//                           <BookOpen className="w-4 h-4" />
//                           <span>
//                             {nextTask.resources?.length || 0} resources
//                           </span>
//                         </span>
//                       </div>

//                       <div className="space-y-2">
//                         <h5 className="text-sm font-semibold text-gray-200">
//                           Available Resources:
//                         </h5>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                           {(nextTask.resources || []).slice(0, 4).map((resource, index) => (
//                             <a
//                               key={index}
//                               href={resource.link}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-sm text-gray-200 flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm rounded p-2 border border-white/15 hover:bg-white/[0.1] transition-colors"
//                             >
//                               <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
//                               <span className="truncate">
//                                 {resource.title}
//                               </span>
//                             </a>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="text-center">
//                     <button className="px-8 py-4 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:from-blue-400/25 hover:to-blue-500/25 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02]">
//                       Start Learning
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoadmapPage;



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
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface Resource {
  title: string;
  link: string;
}

interface Task {
  taskName: string;
  status: "completed" | "current" | "upcoming";
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
            setRoadmapData(roadmapFromState);
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
              setRoadmapData(selectedRoadmap);
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
        return "bg-white/15 text-white border-white/25 backdrop-blur-sm";
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

                {/* Additional Info */}
                <div className="mt-12 pt-8 border-t border-white/15">
                  <h3 className="text-lg font-semibold text-white mb-4">Why do I need to add skills?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="backdrop-blur-xl bg-white/[0.03] rounded-xl p-4 border border-white/10">
                      <Target className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
                      <h4 className="text-white font-medium mb-2">Personalized Learning</h4>
                      <p className="text-gray-300 text-sm">Get a roadmap tailored to your specific skills and career goals</p>
                    </div>
                    <div className="backdrop-blur-xl bg-white/[0.03] rounded-xl p-4 border border-white/10">
                      <BookOpen className="w-8 h-8 text-green-400 mb-3 mx-auto" />
                      <h4 className="text-white font-medium mb-2">Curated Resources</h4>
                      <p className="text-gray-300 text-sm">Access handpicked learning materials and courses for each skill</p>
                    </div>
                    <div className="backdrop-blur-xl bg-white/[0.03] rounded-xl p-4 border border-white/10">
                      <Clock className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                      <h4 className="text-white font-medium mb-2">Time Management</h4>
                      <p className="text-gray-300 text-sm">Get realistic time estimates and structured learning schedules</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we have roadmap data, render the existing roadmap UI
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
                      {/* Task Number Circle - Glass Design */}
                      <div className="absolute left-0 flex items-center justify-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-xl relative overflow-hidden ${
                            task.status === "completed"
                              ? "bg-white/20 border-white/40 shadow-lg"
                              : task.status === "current"
                              ? "bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-400/20"
                              : "bg-white/[0.05] border-white/20"
                          }`}
                        >
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
                          <div className="space-y-3">
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
                        <span className="text-white font-bold">
                          {completedTasks}
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

          {/* Next Step Highlight - Glass Design
          {nextTask && (
            <div className="mt-12">
              <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-8 border border-blue-400/25 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-white/[0.02] rounded-2xl"></div>

                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Ready to Continue?
                    </h3>
                    <p className="text-gray-200">
                      Take the next step in your learning journey
                    </p>
                  </div>

                  <div className="backdrop-blur-xl bg-white/[0.06] rounded-xl p-6 mb-6 border border-white/15 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-xl"></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-semibold text-white mb-4">
                        {nextTask.taskName}
                      </h4>

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
                    <button className="px-8 py-4 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:from-blue-400/25 hover:to-blue-500/25 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02]">
                      Start Learning
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;