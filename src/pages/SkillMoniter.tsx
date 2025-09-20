// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Plus,
//   X,
//   Target,
//   FileText,
//   TrendingUp,
//   Save,
//   RefreshCw,
// } from "lucide-react";
// import { ArrowRight } from "lucide-react";
// import { useAuth } from "../context/authContext";
// import { db } from "../firebase/firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// interface Skill {
//   id: string;
//   name: string;
//   progress: number;
// }

// interface Roadmap {
//   title: string;
//   tasks: Array<{
//     resources: any[];
//     status: string;
//     taskName: string;
//     timeAllocation: string;
//   }>;
// }

// const SkillMonitoringPage: React.FC = () => {
//   const { user, loading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   // Primary & Secondary skill states
//   const [primarySkills, setPrimarySkills] = useState<Skill[]>([]);
//   const [secondarySkills, setSecondarySkills] = useState<Skill[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [saving, setSaving] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   const [newPrimarySkill, setNewPrimarySkill] = useState("");
//   const [newSecondarySkill, setNewSecondarySkill] = useState("");
//   const [animatedProgress, setAnimatedProgress] = useState<{
//     [key: string]: number;
//   }>({});

//   const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]); // roadmap list

//   // 🔹 Load skills from Firestore
//   const loadSkillsFromFirebase = async () => {
//     if (!user) return;
//     try {
//       setLoading(true);
//       setError("");

//       const userDocRef = doc(db, "user", user.uid);
//       const userSnap = await getDoc(userDocRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();

//         if (userData.skills) {
//           const primarySkillsData = userData.skills.primary
//             ? userData.skills.primary.map(
//                 (skillName: string, index: number) => ({
//                   id: `primary_${index}_${Date.now()}`,
//                   name: skillName,
//                   progress: Math.floor(Math.random() * 60) + 40,
//                 })
//               )
//             : [];

//           const secondarySkillsData = userData.skills.secondary
//             ? userData.skills.secondary.map(
//                 (skillName: string, index: number) => ({
//                   id: `secondary_${index}_${Date.now()}`,
//                   name: skillName,
//                   progress: Math.floor(Math.random() * 50) + 25,
//                 })
//               )
//             : [];

//           setPrimarySkills(primarySkillsData);
//           setSecondarySkills(secondarySkillsData);
//         }

//         // Only set roadmaps if they exist and are not empty
//         if (userData.roadmap && Array.isArray(userData.roadmap) && userData.roadmap.length > 0) {
//           setRoadmaps(userData.roadmap);
//         } else {
//           setRoadmaps([]); // Explicitly set empty array
//         }
//       }
//     } catch (err) {
//       console.error("Error loading user data:", err);
//       setError("Failed to load user data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeRoadmap = async (index: number) => {
//     if (!user) return;

//     try {
//       const userDocRef = doc(db, "user", user.uid);
//       const updatedRoadmaps = roadmaps.filter((_, i) => i !== index);

//       await updateDoc(userDocRef, {
//         roadmap: updatedRoadmaps,
//       });

//       setRoadmaps(updatedRoadmaps); // update local state
//       console.log("Roadmap removed successfully");
//     } catch (err) {
//       console.error("Error removing roadmap:", err);
//       setError("Failed to remove roadmap");
//     }
//   };

//   // 🔹 Save skills to Firestore (accept updated state)
//   const saveSkillsToFirebase = async (
//     updatedPrimary: Skill[] = primarySkills,
//     updatedSecondary: Skill[] = secondarySkills
//   ) => {
//     if (!user) return;

//     try {
//       setSaving(true);
//       setError("");

//       const userDocRef = doc(db, "user", user.uid);

//       const skillsData = {
//         primary: updatedPrimary.map((skill) => skill.name),
//         secondary: updatedSecondary.map((skill) => skill.name),
//       };

//       await updateDoc(userDocRef, {
//         skills: skillsData,
//       });

//       console.log("Skills saved to Firebase successfully");
//     } catch (err) {
//       console.error("Error saving skills to Firebase:", err);
//       setError("Failed to save skills to database");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // 🔹 Load skills on mount
//   useEffect(() => {
//     loadSkillsFromFirebase();
//   }, [user]);

//   // 🔹 Animate progress bars
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const animated: { [key: string]: number } = {};
//       [...primarySkills, ...secondarySkills].forEach((skill) => {
//         animated[skill.id] = skill.progress;
//       });
//       setAnimatedProgress(animated);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [primarySkills, secondarySkills]);

//   // 🔹 Add / Remove Skills
//   const addPrimarySkill = async () => {
//     if (newPrimarySkill.trim()) {
//       const skill: Skill = {
//         id: `primary_${Date.now()}`,
//         name: newPrimarySkill.trim(),
//         progress: Math.floor(Math.random() * 60) + 20,
//       };
//       const updatedSkills = [...primarySkills, skill];
//       setPrimarySkills(updatedSkills);
//       setNewPrimarySkill("");
//       await saveSkillsToFirebase(updatedSkills, secondarySkills);
//     }
//   };

//   const addSecondarySkill = async () => {
//     if (newSecondarySkill.trim()) {
//       const skill: Skill = {
//         id: `secondary_${Date.now()}`,
//         name: newSecondarySkill.trim(),
//         progress: Math.floor(Math.random() * 60) + 20,
//       };
//       const updatedSkills = [...secondarySkills, skill];
//       setSecondarySkills(updatedSkills);
//       setNewSecondarySkill("");
//       await saveSkillsToFirebase(primarySkills, updatedSkills);
//     }
//   };

//   const removePrimarySkill = async (id: string) => {
//     const updatedSkills = primarySkills.filter((skill) => skill.id !== id);
//     setPrimarySkills(updatedSkills);
//     await saveSkillsToFirebase(updatedSkills, secondarySkills);
//   };

//   const removeSecondarySkill = async (id: string) => {
//     const updatedSkills = secondarySkills.filter((skill) => skill.id !== id);
//     setSecondarySkills(updatedSkills);
//     await saveSkillsToFirebase(primarySkills, updatedSkills);
//   };

//   const handleKeyPress = (
//     e: React.KeyboardEvent,
//     type: "primary" | "secondary"
//   ) => {
//     if (e.key === "Enter") {
//       if (type === "primary") {
//         addPrimarySkill();
//       } else {
//         addSecondarySkill();
//       }
//     }
//   };

//   // Check if user has any skills
//   const hasSkills = primarySkills.length > 0 || secondarySkills.length > 0;

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-white text-center">
//           <p className="text-xl mb-4">
//             Please log in to access skill monitoring
//           </p>
//         </div>
//       </div>
//     );
//   }
//  const handleGenerateRoadmap = async () => {
//   if (!user) {
//     alert("Please log in first!");
//     return;
//   }

//   try {
//     setLoading(true);
    
//     console.log("Sending user_id:", user.uid); // Debug log
    
//     const response = await axios.post("http://127.0.0.1:8000/process-user", {
//       user_id: user.uid, // ✅ FIXED - using "user_id" with underscore
//     }, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log("Roadmap response:", response.data);
    
//     // Refresh the roadmaps after successful generation
//     await loadSkillsFromFirebase();
    
//     alert("Roadmap generated successfully!");
    
//   } catch (error) {
//     if (typeof error === "object" && error !== null && "response" in error) {
//       // @ts-expect-error: error is likely an AxiosError
//       console.error("Full error details:", error.response?.data);
//       // @ts-expect-error: error is likely an AxiosError
//       alert("Failed to generate roadmap: " + (error.response?.data?.detail || error.message));
//     } else {
//       console.error("Unknown error:", error);
//       alert("Failed to generate roadmap: " + (error as any)?.message || String(error));
//     }
//     console.error("Request data was:", { user_id: user.uid });
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen p-6 pt-6 font-sans">
//       <div className="max-w-7xl mx-auto">
//         {/* Error Display */}
//         {error && (
//           <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-lg p-4">
//             <p className="text-red-400 text-center">{error}</p>
//           </div>
//         )}
//         <div className="flex justify-center items-center w-full m-auto p-10">
//           <div className="relative inline-block my-12">
//             <h1 className="text-5xl font-bold text-white mb-4 ">
//               Moniter Your Skills With NEXTskill
//             </h1>
//             <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3xl h-1 bg-gradient-to-r from-transparent via-blue-800 to-transparent rounded-full"></div>
//           </div>
//         </div>
//         {/* Upper Half */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//           {/* Left Side - Skill Input */}
//           <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50 space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
//                 <Plus className="w-6 h-6" />
//                 Manage Your Skills
//               </h2>
//               <div className="flex gap-2">
//                 <button
//                   onClick={loadSkillsFromFirebase}
//                   disabled={loading}
//                   className="p-2 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
//                   title="Refresh skills from database"
//                 >
//                   <RefreshCw
//                     className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
//                   />
//                 </button>
//                 <button
//                   onClick={() =>
//                     saveSkillsToFirebase(primarySkills, secondarySkills)
//                   }
//                   disabled={saving}
//                   className="p-2 text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50"
//                   title="Save skills to database"
//                 >
//                   <Save
//                     className={`w-5 h-5 ${saving ? "animate-pulse" : ""}`}
//                   />
//                 </button>
//               </div>
//             </div>

//             {loading ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                 <p className="text-gray-400">Loading your skills...</p>
//               </div>
//             ) : (
//               <>
//                 {/* Primary Skills */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-2">
//                     Primary Skills ({primarySkills.length})
//                   </h3>
//                   <div className="flex gap-3 mb-4">
//                     <input
//                       type="text"
//                       value={newPrimarySkill}
//                       onChange={(e) => setNewPrimarySkill(e.target.value)}
//                       onKeyPress={(e) => handleKeyPress(e, "primary")}
//                       placeholder="Add a primary skill"
//                       className="flex-1 bg-black/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
//                     />
//                     <button
//                       onClick={addPrimarySkill}
//                       disabled={!newPrimarySkill.trim() || saving}
//                       className="px-6 py-3 border-2 border-blue-500 bg-white text-blue-950 rounded-lg hover:text-white hover:bg-blue-600 transition-all duration-300 font-semibold "
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     {primarySkills.map((skill, index) => (
//                       <div
//                         key={skill.id}
//                         className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-3 border border-gray-700/50 animate-fade-in"
//                         style={{ animationDelay: `${index * 0.1}s` }}
//                       >
//                         <span className="text-white font-medium">
//                           {skill.name}
//                         </span>
//                         <button
//                           onClick={() => removePrimarySkill(skill.id)}
//                           disabled={saving}
//                           className="text-gray-400 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Secondary Skills */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-2">
//                     Secondary Skills ({secondarySkills.length})
//                   </h3>
//                   <div className="flex gap-3 mb-4">
//                     <input
//                       type="text"
//                       value={newSecondarySkill}
//                       onChange={(e) => setNewSecondarySkill(e.target.value)}
//                       onKeyPress={(e) => handleKeyPress(e, "secondary")}
//                       placeholder="Add a secondary skill"
//                       className="flex-1 bg-black/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
//                     />
//                     <button
//                       onClick={addSecondarySkill}
//                       disabled={!newSecondarySkill.trim() || saving}
//                       className="px-6 py-3 border-2 border-blue-500 bg-white text-blue-950 rounded-lg hover:text-white hover:bg-blue-600 transition-all duration-300 font-semibold "
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     {secondarySkills.map((skill, index) => (
//                       <div
//                         key={skill.id}
//                         className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-3 border border-gray-700/50 animate-fade-in"
//                         style={{ animationDelay: `${index * 0.1}s` }}
//                       >
//                         <span className="text-white font-medium">
//                           {skill.name}
//                         </span>
//                         <button
//                           onClick={() => removeSecondarySkill(skill.id)}
//                           disabled={saving}
//                           className="text-gray-400 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Right Side - Quick Actions */}
//           <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
//             <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center gap-2">
//               <Target className="w-6 h-6" />
//               Quick Actions
//             </h2>

//             <div className="space-y-4">
//               <button
//                 onClick={() => {
//                   window.location.href = "/assessment";
//                 }}
//                 className="hover:bg-white hover:text-black bg-blue-600/40 text-white w-full py-4 px-6 border-2 rounded-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3"
//               >
//                 <FileText className="w-6 h-6" />
//                 Take Assessment
//               </button>

//               <button
//                 onClick={() => {
//                   window.location.href = "/resume";
//                 }}
//                 className="w-full py-4 px-6 bg-black/30 border border-gray-600 text-white rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3"
//               >
//                 <TrendingUp className="w-6 h-6" />
//                 Resume Analyzer
//               </button>
//               <button
//                 onClick={handleGenerateRoadmap}
//                 disabled={loading}
//                 className={`w-full py-4 px-6 bg-black/30 border text-white rounded-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3
//                   ${loading ? "border-gray-500 cursor-not-allowed" : "border-gray-600 hover:border-green-500 hover:bg-green-500/5"}
//                 `}
//               >
//                 <TrendingUp className="w-6 h-6" />
//                 {loading ? "Generating..." : "Generate Roadmap"}
//               </button>

//             </div>
//           </div>
//         </div>

//         {/* Lower Half - Roadmap Cards */}
//         <div className="bg-black rounded-2xl relative overflow-hidden">
//           {/* Subtle background blur elements for glass effect */}
//           <div className="absolute top-32 left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl"></div>

//           <div className="relative z-10">
//             <div className="pt-8">
//               <h2 className="text-white text-6xl text-center font-bold">
//                 Recommended Career Paths
//               </h2>
//             </div>

//             <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 p-20">
//               {loading ? (
//                 <div className="col-span-full text-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                   <p className="text-gray-400">Loading roadmaps...</p>
//                 </div>
//               ) : !hasSkills ? (
//                 // Show message when user has no skills
//                 <div className="col-span-full text-center py-16">
//                   <div className="backdrop-blur-lg bg-white/[0.03] border border-white/10 rounded-2xl p-12">
//                     <div className="mb-6">
//                       <Target className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-white mb-4">
//                       Add Skills to Generate Roadmap
//                     </h3>
//                     <p className="text-gray-300 text-lg mb-6 max-w-md mx-auto">
//                       Start by adding your primary and secondary skills above. This will help us create personalized career roadmaps tailored to your expertise.
//                     </p>
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                       <div className="flex items-center gap-2 text-gray-400 text-sm">
//                         <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//                         Add primary skills for your main expertise
//                       </div>
//                       <div className="flex items-center gap-2 text-gray-400 text-sm">
//                         <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//                         Include secondary skills for broader opportunities
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : roadmaps.length > 0 ? (
//                 // Show roadmap cards when they exist
//                 roadmaps.map((roadmap, index) => (
//                   <div key={index} className="group relative">
//                     {/* Glass card */}
//                     <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden hover:bg-white/[0.06]">
//                       {/* Glass surface reflection */}
//                       <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rounded-2xl"></div>

//                       {/* Top glass highlight */}
//                       <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl"></div>

//                       {/* Content */}
//                       <div className="relative z-10">
//                         {/* Career Title */}
//                         <div className="flex items-start gap-3 mb-6">
//                           <div className="p-2 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-500/20">
//                             <Target className="w-5 h-5 text-blue-400" />
//                           </div>
//                           <h3 className="text-xl font-bold text-white leading-tight">
//                             {roadmap.title || "Untitled Roadmap"}
//                           </h3>
//                         </div>

//                         {/* Glass separator */}
//                         <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

//                         {/* Button */}
//                         <button
//                           onClick={() =>
//                             navigate(`/roadmap/${index}`, {
//                               state: { roadmapData: roadmap },
//                             })
//                           }
//                           className="w-full flex items-center justify-center gap-3 px-4 py-3 backdrop-blur-sm bg-white/[0.05] border border-gray-300 rounded-xl text-sm font-medium text-gray-200 hover:bg-blue-500/10 hover:border-blue-500/90 hover:text-white transition-all duration-300 shadow-lg"
//                         >
//                           <span>Explore Path</span>
//                           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//                         </button>
//                         <button
//                           onClick={() => removeRoadmap(index)}
//                           className="w-full flex items-center justify-center gap-3 px-4 py-3 mt-3 backdrop-blur-sm bg-white/[0.05] border-1 border-gray-300 rounded-xl text-sm font-medium text-red-400 hover:bg-white hover:border-red-500/50 hover:text-black transition-all duration-300 shadow-lg"
//                         >
//                           <X className="w-4 h-4" />
//                           <span>Remove Path</span>
//                         </button>
//                       </div>

//                       {/* Bottom glass edge */}
//                       <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

//                       {/* Glass shimmer on hover */}
//                       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
//                         <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 group-hover:left-full transition-all duration-1000 ease-out"></div>
//                       </div>

//                       {/* Subtle inner glow on hover */}
//                       <div
//                         className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-inner"
//                         style={{
//                           boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1)",
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 // Show message when user has skills but no roadmaps
//                 <div className="col-span-full text-center py-16">
//                   <div className="backdrop-blur-lg bg-white/[0.03] border border-white/10 rounded-2xl p-12">
//                     <div className="mb-6">
//                       <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-white mb-4">
//                       Ready to Create Your Career Path?
//                     </h3>
//                     <p className="text-gray-300 text-lg mb-6 max-w-md mx-auto">
//                       You've added your skills! Now take an assessment to generate personalized career roadmaps based on your expertise.
//                     </p>
//                     <button
//                       onClick={() => navigate('/assessment')}
//                       className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-white rounded-xl hover:bg-blue-500/30 hover:scale-[1.02] transition-all duration-300 font-semibold"
//                     >
//                       Take Assessment
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.5s ease-out forwards;
//         }
//         .blur-3xl {
//           filter: blur(80px);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SkillMonitoringPage;


//next


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Plus,
//   X,
//   Target,
//   FileText,
//   TrendingUp,
//   Save,
//   RefreshCw,
// } from "lucide-react";
// import { ArrowRight } from "lucide-react";
// import { useAuth } from "../context/authContext";
// import { db } from "../firebase/firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// interface Skill {
//   id: string;
//   name: string;
//   progress: number;
// }

// interface Roadmap {
//   title: string;
//   tasks: Array<{
//     resources: any[];
//     status: string;
//     taskName: string;
//     timeAllocation: string;
//   }>;
// }

// const SkillMonitoringPage: React.FC = () => {
//   const { user, loading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   // Primary & Secondary skill states
//   const [primarySkills, setPrimarySkills] = useState<Skill[]>([]);
//   const [secondarySkills, setSecondarySkills] = useState<Skill[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [saving, setSaving] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   const [newPrimarySkill, setNewPrimarySkill] = useState("");
//   const [newSecondarySkill, setNewSecondarySkill] = useState("");
//   const [animatedProgress, setAnimatedProgress] = useState<{
//     [key: string]: number;
//   }>({});

//   const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]); // roadmap list

//   // 🔹 Load skills from Firestore
//   const loadSkillsFromFirebase = async () => {
//     if (!user) return;
//     try {
//       setLoading(true);
//       setError("");

//       const userDocRef = doc(db, "user", user.uid);
//       const userSnap = await getDoc(userDocRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();

//         if (userData.skills) {
//           const primarySkillsData = userData.skills.primary
//             ? userData.skills.primary.map(
//                 (skillName: string, index: number) => ({
//                   id: `primary_${index}_${Date.now()}`,
//                   name: skillName,
//                   progress: Math.floor(Math.random() * 60) + 40,
//                 })
//               )
//             : [];

//           const secondarySkillsData = userData.skills.secondary
//             ? userData.skills.secondary.map(
//                 (skillName: string, index: number) => ({
//                   id: `secondary_${index}_${Date.now()}`,
//                   name: skillName,
//                   progress: Math.floor(Math.random() * 50) + 25,
//                 })
//               )
//             : [];

//           setPrimarySkills(primarySkillsData);
//           setSecondarySkills(secondarySkillsData);
//         }

//         // Only set roadmaps if they exist and are not empty
//         if (userData.roadmap && Array.isArray(userData.roadmap) && userData.roadmap.length > 0) {
//           setRoadmaps(userData.roadmap);
//         } else {
//           setRoadmaps([]); // Explicitly set empty array
//         }
//       }
//     } catch (err) {
//       console.error("Error loading user data:", err);
//       setError("Failed to load user data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeRoadmap = async (index: number) => {
//     if (!user) return;

//     try {
//       const userDocRef = doc(db, "user", user.uid);
//       const updatedRoadmaps = roadmaps.filter((_, i) => i !== index);

//       await updateDoc(userDocRef, {
//         roadmap: updatedRoadmaps,
//       });

//       setRoadmaps(updatedRoadmaps); // update local state
//       console.log("Roadmap removed successfully");
//     } catch (err) {
//       console.error("Error removing roadmap:", err);
//       setError("Failed to remove roadmap");
//     }
//   };

//   // 🔹 Save skills to Firestore (accept updated state)
//   const saveSkillsToFirebase = async (
//     updatedPrimary: Skill[] = primarySkills,
//     updatedSecondary: Skill[] = secondarySkills
//   ) => {
//     if (!user) return;

//     try {
//       setSaving(true);
//       setError("");

//       const userDocRef = doc(db, "user", user.uid);

//       const skillsData = {
//         primary: updatedPrimary.map((skill) => skill.name),
//         secondary: updatedSecondary.map((skill) => skill.name),
//       };

//       await updateDoc(userDocRef, {
//         skills: skillsData,
//       });

//       console.log("Skills saved to Firebase successfully");
//     } catch (err) {
//       console.error("Error saving skills to Firebase:", err);
//       setError("Failed to save skills to database");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // 🔹 Load skills on mount
//   useEffect(() => {
//     loadSkillsFromFirebase();
//   }, [user]);

//   // 🔹 Animate progress bars
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const animated: { [key: string]: number } = {};
//       [...primarySkills, ...secondarySkills].forEach((skill) => {
//         animated[skill.id] = skill.progress;
//       });
//       setAnimatedProgress(animated);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [primarySkills, secondarySkills]);

//   // 🔹 Add / Remove Skills
//   const addPrimarySkill = async () => {
//     if (newPrimarySkill.trim()) {
//       const skill: Skill = {
//         id: `primary_${Date.now()}`,
//         name: newPrimarySkill.trim(),
//         progress: Math.floor(Math.random() * 60) + 20,
//       };
//       const updatedSkills = [...primarySkills, skill];
//       setPrimarySkills(updatedSkills);
//       setNewPrimarySkill("");
//       await saveSkillsToFirebase(updatedSkills, secondarySkills);
//     }
//   };

//   const addSecondarySkill = async () => {
//     if (newSecondarySkill.trim()) {
//       const skill: Skill = {
//         id: `secondary_${Date.now()}`,
//         name: newSecondarySkill.trim(),
//         progress: Math.floor(Math.random() * 60) + 20,
//       };
//       const updatedSkills = [...secondarySkills, skill];
//       setSecondarySkills(updatedSkills);
//       setNewSecondarySkill("");
//       await saveSkillsToFirebase(primarySkills, updatedSkills);
//     }
//   };

//   const removePrimarySkill = async (id: string) => {
//     const updatedSkills = primarySkills.filter((skill) => skill.id !== id);
//     setPrimarySkills(updatedSkills);
//     await saveSkillsToFirebase(updatedSkills, secondarySkills);
//   };

//   const removeSecondarySkill = async (id: string) => {
//     const updatedSkills = secondarySkills.filter((skill) => skill.id !== id);
//     setSecondarySkills(updatedSkills);
//     await saveSkillsToFirebase(primarySkills, updatedSkills);
//   };

//   const handleKeyPress = (
//     e: React.KeyboardEvent,
//     type: "primary" | "secondary"
//   ) => {
//     if (e.key === "Enter") {
//       if (type === "primary") {
//         addPrimarySkill();
//       } else {
//         addSecondarySkill();
//       }
//     }
//   };

//   // Check if user has any skills
//   const hasSkills = primarySkills.length > 0 || secondarySkills.length > 0;

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-white text-center">
//           <p className="text-xl mb-4">
//             Please log in to access skill monitoring
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const handleGenerateRoadmap = async () => {
//     if (!user) {
//       alert("Please log in first!");
//       return;
//     }

//     try {
//       setLoading(true);
      
//       console.log("Sending user_id:", user.uid); // Debug log
      
//       const response = await axios.post("http://127.0.0.1:8000/process-user", {
//         user_id: user.uid, // ✅ FIXED - using "user_id" with underscore
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log("Roadmap response:", response.data);
      
//       // Refresh the roadmaps after successful generation
//       await loadSkillsFromFirebase();
      
//       alert("Roadmap generated successfully!");
      
//     } catch (error) {
//       if (typeof error === "object" && error !== null && "response" in error) {
//         // @ts-expect-error: error is likely an AxiosError
//         console.error("Full error details:", error.response?.data);
//         // @ts-expect-error: error is likely an AxiosError
//         alert("Failed to generate roadmap: " + (error.response?.data?.detail || error.message));
//       } else {
//         console.error("Unknown error:", error);
//         alert("Failed to generate roadmap: " + (error as any)?.message || String(error));
//       }
//       console.error("Request data was:", { user_id: user.uid });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 NEW: Handle Take Assessment API call
//   const handleTakeAssessment = async () => {
//     if (!user) {
//       alert("Please log in first!");
//       return;
//     }

//     try {
//       setLoading(true);
      
//       console.log("Sending user_id for assessment:", user.uid); // Debug log
      
//       const response = await axios.post("http://127.0.0.1:8000/process-assessments", {
//         user_id: user.uid,
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log("Assessment response:", response.data);
      
//       alert("Assessment processed successfully!");
      
//     } catch (error) {
//       if (typeof error === "object" && error !== null && "response" in error) {
//         // @ts-expect-error: error is likely an AxiosError
//         console.error("Full assessment error details:", error.response?.data);
//         // @ts-expect-error: error is likely an AxiosError
//         alert("Failed to process assessment: " + (error.response?.data?.detail || error.message));
//       } else {
//         console.error("Unknown assessment error:", error);
//         alert("Failed to process assessment: " + (error as any)?.message || String(error));
//       }
//       console.error("Assessment request data was:", { user_id: user.uid });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 pt-6 font-sans">
//       <div className="max-w-7xl mx-auto">
//         {/* Error Display */}
//         {error && (
//           <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-lg p-4">
//             <p className="text-red-400 text-center">{error}</p>
//           </div>
//         )}
//         <div className="flex justify-center items-center w-full m-auto p-10">
//           <div className="relative inline-block my-12">
//             <h1 className="text-5xl font-bold text-white mb-4 ">
//               Moniter Your Skills With NEXTskill
//             </h1>
//             <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3xl h-1 bg-gradient-to-r from-transparent via-blue-800 to-transparent rounded-full"></div>
//           </div>
//         </div>
//         {/* Upper Half */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//           {/* Left Side - Skill Input */}
//           <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50 space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
//                 <Plus className="w-6 h-6" />
//                 Manage Your Skills
//               </h2>
//               <div className="flex gap-2">
//                 <button
//                   onClick={loadSkillsFromFirebase}
//                   disabled={loading}
//                   className="p-2 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
//                   title="Refresh skills from database"
//                 >
//                   <RefreshCw
//                     className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
//                   />
//                 </button>
//                 <button
//                   onClick={() =>
//                     saveSkillsToFirebase(primarySkills, secondarySkills)
//                   }
//                   disabled={saving}
//                   className="p-2 text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50"
//                   title="Save skills to database"
//                 >
//                   <Save
//                     className={`w-5 h-5 ${saving ? "animate-pulse" : ""}`}
//                   />
//                 </button>
//               </div>
//             </div>

//             {loading ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                 <p className="text-gray-400">Loading your skills...</p>
//               </div>
//             ) : (
//               <>
//                 {/* Primary Skills */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-2">
//                     Primary Skills ({primarySkills.length})
//                   </h3>
//                   <div className="flex gap-3 mb-4">
//                     <input
//                       type="text"
//                       value={newPrimarySkill}
//                       onChange={(e) => setNewPrimarySkill(e.target.value)}
//                       onKeyPress={(e) => handleKeyPress(e, "primary")}
//                       placeholder="Add a primary skill"
//                       className="flex-1 bg-black/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
//                     />
//                     <button
//                       onClick={addPrimarySkill}
//                       disabled={!newPrimarySkill.trim() || saving}
//                       className="px-6 py-3 border-2 border-blue-500 bg-white text-blue-950 rounded-lg hover:text-white hover:bg-blue-600 transition-all duration-300 font-semibold "
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     {primarySkills.map((skill, index) => (
//                       <div
//                         key={skill.id}
//                         className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-3 border border-gray-700/50 animate-fade-in"
//                         style={{ animationDelay: `${index * 0.1}s` }}
//                       >
//                         <span className="text-white font-medium">
//                           {skill.name}
//                         </span>
//                         <button
//                           onClick={() => removePrimarySkill(skill.id)}
//                           disabled={saving}
//                           className="text-gray-400 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Secondary Skills */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-white mb-2">
//                     Secondary Skills ({secondarySkills.length})
//                   </h3>
//                   <div className="flex gap-3 mb-4">
//                     <input
//                       type="text"
//                       value={newSecondarySkill}
//                       onChange={(e) => setNewSecondarySkill(e.target.value)}
//                       onKeyPress={(e) => handleKeyPress(e, "secondary")}
//                       placeholder="Add a secondary skill"
//                       className="flex-1 bg-black/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
//                     />
//                     <button
//                       onClick={addSecondarySkill}
//                       disabled={!newSecondarySkill.trim() || saving}
//                       className="px-6 py-3 border-2 border-blue-500 bg-white text-blue-950 rounded-lg hover:text-white hover:bg-blue-600 transition-all duration-300 font-semibold "
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     {secondarySkills.map((skill, index) => (
//                       <div
//                         key={skill.id}
//                         className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-3 border border-gray-700/50 animate-fade-in"
//                         style={{ animationDelay: `${index * 0.1}s` }}
//                       >
//                         <span className="text-white font-medium">
//                           {skill.name}
//                         </span>
//                         <button
//                           onClick={() => removeSecondarySkill(skill.id)}
//                           disabled={saving}
//                           className="text-gray-400 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Right Side - Quick Actions */}
//           <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
//             <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center gap-2">
//               <Target className="w-6 h-6" />
//               Quick Actions
//             </h2>

//             <div className="space-y-4">
//               <button
//                 onClick={handleTakeAssessment}
//                 disabled={loading}
//                 className={`w-full py-4 px-6 border-2 rounded-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3 ${
//                   loading 
//                     ? "bg-blue-600/20 text-gray-400 border-gray-600 cursor-not-allowed" 
//                     : "hover:bg-white hover:text-black bg-blue-600/40 text-white border-blue-500"
//                 }`}
//               >
//                 <FileText className="w-6 h-6" />
//                 {loading ? "Processing..." : "Take Assessment"}
//               </button>

//               <button
//                 onClick={() => {
//                   window.location.href = "/resume";
//                 }}
//                 className="w-full py-4 px-6 bg-black/30 border border-gray-600 text-white rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3"
//               >
//                 <TrendingUp className="w-6 h-6" />
//                 Resume Analyzer
//               </button>
//               <button
//                 onClick={handleGenerateRoadmap}
//                 disabled={loading}
//                 className={`w-full py-4 px-6 bg-black/30 border text-white rounded-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3
//                   ${loading ? "border-gray-500 cursor-not-allowed" : "border-gray-600 hover:border-green-500 hover:bg-green-500/5"}
//                 `}
//               >
//                 <TrendingUp className="w-6 h-6" />
//                 {loading ? "Generating..." : "Generate Roadmap"}
//               </button>

//             </div>
//           </div>
//         </div>

//         {/* Lower Half - Roadmap Cards */}
//         <div className="bg-black rounded-2xl relative overflow-hidden">
//           {/* Subtle background blur elements for glass effect */}
//           <div className="absolute top-32 left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl"></div>

//           <div className="relative z-10">
//             <div className="pt-8">
//               <h2 className="text-white text-6xl text-center font-bold">
//                 Recommended Career Paths
//               </h2>
//             </div>

//             <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 p-20">
//               {loading ? (
//                 <div className="col-span-full text-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                   <p className="text-gray-400">Loading roadmaps...</p>
//                 </div>
//               ) : !hasSkills ? (
//                 // Show message when user has no skills
//                 <div className="col-span-full text-center py-16">
//                   <div className="backdrop-blur-lg bg-white/[0.03] border border-white/10 rounded-2xl p-12">
//                     <div className="mb-6">
//                       <Target className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-white mb-4">
//                       Add Skills to Generate Roadmap
//                     </h3>
//                     <p className="text-gray-300 text-lg mb-6 max-w-md mx-auto">
//                       Start by adding your primary and secondary skills above. This will help us create personalized career roadmaps tailored to your expertise.
//                     </p>
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                       <div className="flex items-center gap-2 text-gray-400 text-sm">
//                         <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//                         Add primary skills for your main expertise
//                       </div>
//                       <div className="flex items-center gap-2 text-gray-400 text-sm">
//                         <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//                         Include secondary skills for broader opportunities
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : roadmaps.length > 0 ? (
//                 // Show roadmap cards when they exist
//                 roadmaps.map((roadmap, index) => (
//                   <div key={index} className="group relative">
//                     {/* Glass card */}
//                     <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden hover:bg-white/[0.06]">
//                       {/* Glass surface reflection */}
//                       <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rounded-2xl"></div>

//                       {/* Top glass highlight */}
//                       <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl"></div>

//                       {/* Content */}
//                       <div className="relative z-10">
//                         {/* Career Title */}
//                         <div className="flex items-start gap-3 mb-6">
//                           <div className="p-2 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-500/20">
//                             <Target className="w-5 h-5 text-blue-400" />
//                           </div>
//                           <h3 className="text-xl font-bold text-white leading-tight">
//                             {roadmap.title || "Untitled Roadmap"}
//                           </h3>
//                         </div>

//                         {/* Glass separator */}
//                         <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

//                         {/* Button */}
//                         <button
//                           onClick={() =>
//                             navigate(`/roadmap/${index}`, {
//                               state: { roadmapData: roadmap },
//                             })
//                           }
//                           className="w-full flex items-center justify-center gap-3 px-4 py-3 backdrop-blur-sm bg-white/[0.05] border border-gray-300 rounded-xl text-sm font-medium text-gray-200 hover:bg-blue-500/10 hover:border-blue-500/90 hover:text-white transition-all duration-300 shadow-lg"
//                         >
//                           <span>Explore Path</span>
//                           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//                         </button>
//                         <button
//                           onClick={() => removeRoadmap(index)}
//                           className="w-full flex items-center justify-center gap-3 px-4 py-3 mt-3 backdrop-blur-sm bg-white/[0.05] border-1 border-gray-300 rounded-xl text-sm font-medium text-red-400 hover:bg-white hover:border-red-500/50 hover:text-black transition-all duration-300 shadow-lg"
//                         >
//                           <X className="w-4 h-4" />
//                           <span>Remove Path</span>
//                         </button>
//                       </div>

//                       {/* Bottom glass edge */}
//                       <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

//                       {/* Glass shimmer on hover */}
//                       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
//                         <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 group-hover:left-full transition-all duration-1000 ease-out"></div>
//                       </div>

//                       {/* Subtle inner glow on hover */}
//                       <div
//                         className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-inner"
//                         style={{
//                           boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1)",
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 // Show message when user has skills but no roadmaps
//                 <div className="col-span-full text-center py-16">
//                   <div className="backdrop-blur-lg bg-white/[0.03] border border-white/10 rounded-2xl p-12">
//                     <div className="mb-6">
//                       <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-white mb-4">
//                       Ready to Create Your Career Path?
//                     </h3>
//                     <p className="text-gray-300 text-lg mb-6 max-w-md mx-auto">
//                       You've added your skills! Now take an assessment to generate personalized career roadmaps based on your expertise.
//                     </p>
//                     <button
//                       onClick={handleTakeAssessment}
//                       disabled={loading}
//                       className={`px-8 py-4 backdrop-blur-sm border rounded-xl font-semibold transition-all duration-300 ${
//                         loading 
//                           ? "bg-blue-500/10 border-blue-500/20 text-gray-400 cursor-not-allowed"
//                           : "bg-blue-500/20 border-blue-500/30 text-white hover:bg-blue-500/30 hover:scale-[1.02]"
//                       }`}
//                     >
//                       {loading ? "Processing Assessment..." : "Take Assessment"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.5s ease-out forwards;
//         }
//         .blur-3xl {
//           filter: blur(80px);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SkillMonitoringPage;



// next 

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  X,
  Target,
  FileText,
  TrendingUp,
  Save,
  RefreshCw,
} from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/authContext";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface Skill {
  id: string;
  name: string;
  progress: number;
}

interface Roadmap {
  title: string;
  tasks: Array<{
    resources: any[];
    status: string;
    taskName: string;
    timeAllocation: string;
  }>;
}

const SkillMonitoringPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Primary & Secondary skill states
  const [primarySkills, setPrimarySkills] = useState<Skill[]>([]);
  const [secondarySkills, setSecondarySkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [newPrimarySkill, setNewPrimarySkill] = useState("");
  const [newSecondarySkill, setNewSecondarySkill] = useState("");
  const [animatedProgress, setAnimatedProgress] = useState<{
    [key: string]: number;
  }>({});

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]); // roadmap list

  // 🔹 Load skills from Firestore
  const loadSkillsFromFirebase = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");

      const userDocRef = doc(db, "user", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.skills) {
          const primarySkillsData = userData.skills.primary
            ? userData.skills.primary.map(
                (skillName: string, index: number) => ({
                  id: `primary_${index}_${Date.now()}`,
                  name: skillName,
                  progress: Math.floor(Math.random() * 60) + 40,
                })
              )
            : [];

          const secondarySkillsData = userData.skills.secondary
            ? userData.skills.secondary.map(
                (skillName: string, index: number) => ({
                  id: `secondary_${index}_${Date.now()}`,
                  name: skillName,
                  progress: Math.floor(Math.random() * 50) + 25,
                })
              )
            : [];

          setPrimarySkills(primarySkillsData);
          setSecondarySkills(secondarySkillsData);
        }

        // Only set roadmaps if they exist and are not empty
        if (userData.roadmap && Array.isArray(userData.roadmap) && userData.roadmap.length > 0) {
          setRoadmaps(userData.roadmap);
        } else {
          setRoadmaps([]); // Explicitly set empty array
        }
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const removeRoadmap = async (index: number) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "user", user.uid);
      const updatedRoadmaps = roadmaps.filter((_, i) => i !== index);

      await updateDoc(userDocRef, {
        roadmap: updatedRoadmaps,
      });

      setRoadmaps(updatedRoadmaps); // update local state
      console.log("Roadmap removed successfully");
    } catch (err) {
      console.error("Error removing roadmap:", err);
      setError("Failed to remove roadmap");
    }
  };

  // 🔹 Save skills to Firestore (accept updated state)
  const saveSkillsToFirebase = async (
    updatedPrimary: Skill[] = primarySkills,
    updatedSecondary: Skill[] = secondarySkills
  ) => {
    if (!user) return;

    try {
      setSaving(true);
      setError("");

      const userDocRef = doc(db, "user", user.uid);

      const skillsData = {
        primary: updatedPrimary.map((skill) => skill.name),
        secondary: updatedSecondary.map((skill) => skill.name),
      };

      await updateDoc(userDocRef, {
        skills: skillsData,
      });

      console.log("Skills saved to Firebase successfully");
    } catch (err) {
      console.error("Error saving skills to Firebase:", err);
      setError("Failed to save skills to database");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Load skills on mount
  useEffect(() => {
    loadSkillsFromFirebase();
  }, [user]);

  // 🔹 Animate progress bars
  useEffect(() => {
    const timer = setTimeout(() => {
      const animated: { [key: string]: number } = {};
      [...primarySkills, ...secondarySkills].forEach((skill) => {
        animated[skill.id] = skill.progress;
      });
      setAnimatedProgress(animated);
    }, 300);

    return () => clearTimeout(timer);
  }, [primarySkills, secondarySkills]);

  // 🔹 Add / Remove Skills
  const addPrimarySkill = async () => {
    if (newPrimarySkill.trim()) {
      const skill: Skill = {
        id: `primary_${Date.now()}`,
        name: newPrimarySkill.trim(),
        progress: Math.floor(Math.random() * 60) + 20,
      };
      const updatedSkills = [...primarySkills, skill];
      setPrimarySkills(updatedSkills);
      setNewPrimarySkill("");
      await saveSkillsToFirebase(updatedSkills, secondarySkills);
    }
  };

  const addSecondarySkill = async () => {
    if (newSecondarySkill.trim()) {
      const skill: Skill = {
        id: `secondary_${Date.now()}`,
        name: newSecondarySkill.trim(),
        progress: Math.floor(Math.random() * 60) + 20,
      };
      const updatedSkills = [...secondarySkills, skill];
      setSecondarySkills(updatedSkills);
      setNewSecondarySkill("");
      await saveSkillsToFirebase(primarySkills, updatedSkills);
    }
  };

  const removePrimarySkill = async (id: string) => {
    const updatedSkills = primarySkills.filter((skill) => skill.id !== id);
    setPrimarySkills(updatedSkills);
    await saveSkillsToFirebase(updatedSkills, secondarySkills);
  };

  const removeSecondarySkill = async (id: string) => {
    const updatedSkills = secondarySkills.filter((skill) => skill.id !== id);
    setSecondarySkills(updatedSkills);
    await saveSkillsToFirebase(primarySkills, updatedSkills);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    type: "primary" | "secondary"
  ) => {
    if (e.key === "Enter") {
      if (type === "primary") {
        addPrimarySkill();
      } else {
        addSecondarySkill();
      }
    }
  };

  // Check if user has any skills
  const hasSkills = primarySkills.length > 0 || secondarySkills.length > 0;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">
            Please log in to access skill monitoring
          </p>
        </div>
      </div>
    );
  }

  const handleGenerateRoadmap = async () => {
    if (!user) {
      alert("Please log in first!");
      return;
    }

    try {
      setLoading(true);
      
      console.log("Sending user_id:", user.uid); // Debug log
      
      const response = await axios.post("https://roadmap-ub6s.onrender.com/process-user", {
        user_id: user.uid, // ✅ FIXED - using "user_id" with underscore
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Roadmap response:", response.data);
      
      // Refresh the roadmaps after successful generation
      await loadSkillsFromFirebase();
      
      alert("Roadmap generated successfully!");
      
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        // @ts-expect-error: error is likely an AxiosError
        console.error("Full error details:", error.response?.data);
        // @ts-expect-error: error is likely an AxiosError
        alert("Failed to generate roadmap: " + (error.response?.data?.detail || error.message));
      } else {
        console.error("Unknown error:", error);
        alert("Failed to generate roadmap: " + (error as any)?.message || String(error));
      }
      console.error("Request data was:", { user_id: user.uid });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 NEW: Handle Take Assessment API call
  const handleTakeAssessment = async () => {
    if (!user) {
      alert("Please log in first!");
      return;
    }

    try {
      setLoading(true);
      
      console.log("Sending user_id for assessment:", user.uid); // Debug log
      
      const response = await axios.post("https://assessment-6lvh.onrender.com/process-assessments", {
        user_id: user.uid,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Assessment response:", response.data);
      
      alert("Assessment processed successfully!");
      
      // Redirect to assessment page after successful API call
      navigate("/assessment");
      
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        // @ts-expect-error: error is likely an AxiosError
        console.error("Full assessment error details:", error.response?.data);
        // @ts-expect-error: error is likely an AxiosError
        alert("Failed to process assessment: " + (error.response?.data?.detail || error.message));
      } else {
        console.error("Unknown assessment error:", error);
        alert("Failed to process assessment: " + (error as any)?.message || String(error));
      }
      console.error("Assessment request data was:", { user_id: user.uid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pt-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-lg p-4">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}
        <div className="flex justify-center items-center w-full m-auto p-10">
          <div className="relative inline-block my-12">
            <h1 className="text-5xl font-bold text-white mb-4 ">
              Moniter Your Skills With NEXTskill
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3xl h-1 bg-gradient-to-r from-transparent via-blue-800 to-transparent rounded-full"></div>
          </div>
        </div>
        {/* Upper Half */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Skill Input */}
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Manage Your Skills
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={loadSkillsFromFirebase}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                  title="Refresh skills from database"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  onClick={() =>
                    saveSkillsToFirebase(primarySkills, secondarySkills)
                  }
                  disabled={saving}
                  className="p-2 text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50"
                  title="Save skills to database"
                >
                  <Save
                    className={`w-5 h-5 ${saving ? "animate-pulse" : ""}`}
                  />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your skills...</p>
              </div>
            ) : (
              <>
                {/* Primary Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Primary Skills ({primarySkills.length})
                  </h3>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={newPrimarySkill}
                      onChange={(e) => setNewPrimarySkill(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, "primary")}
                      placeholder="Add a primary skill"
                      className="flex-1 bg-black/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      onClick={addPrimarySkill}
                      disabled={!newPrimarySkill.trim() || saving}
                      className="px-6 py-3 border-2 border-blue-500 bg-white text-blue-950 rounded-lg hover:text-white hover:bg-blue-600 transition-all duration-300 font-semibold "
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {primarySkills.map((skill, index) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-3 border border-gray-700/50 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-white font-medium">
                          {skill.name}
                        </span>
                        <button
                          onClick={() => removePrimarySkill(skill.id)}
                          disabled={saving}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secondary Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Secondary Skills ({secondarySkills.length})
                  </h3>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={newSecondarySkill}
                      onChange={(e) => setNewSecondarySkill(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, "secondary")}
                      placeholder="Add a secondary skill"
                      className="flex-1 bg-black/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      onClick={addSecondarySkill}
                      disabled={!newSecondarySkill.trim() || saving}
                      className="px-6 py-3 border-2 border-blue-500 bg-white text-blue-950 rounded-lg hover:text-white hover:bg-blue-600 transition-all duration-300 font-semibold "
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {secondarySkills.map((skill, index) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-3 border border-gray-700/50 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-white font-medium">
                          {skill.name}
                        </span>
                        <button
                          onClick={() => removeSecondarySkill(skill.id)}
                          disabled={saving}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Side - Quick Actions */}
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Quick Actions
            </h2>

            <div className="space-y-4">
              <button
                onClick={handleTakeAssessment}
                disabled={loading}
                className={`w-full py-4 px-6 border-2 rounded-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3 ${
                  loading 
                    ? "bg-blue-600/20 text-gray-400 border-gray-600 cursor-not-allowed" 
                    : "hover:bg-white hover:text-black bg-blue-600/40 text-white border-blue-500"
                }`}
              >
                <FileText className="w-6 h-6" />
                {loading ? "Processing..." : "Take Assessment"}
              </button>

              <button
                onClick={() => {
                  window.location.href = "/resume";
                }}
                className="w-full py-4 px-6 bg-black/30 border border-gray-600 text-white rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3"
              >
                <TrendingUp className="w-6 h-6" />
                Resume Analyzer
              </button>
              <button
                onClick={handleGenerateRoadmap}
                disabled={loading}
                className={`w-full py-4 px-6 bg-black/30 border text-white rounded-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3
                  ${loading ? "border-gray-500 cursor-not-allowed" : "border-gray-600 hover:border-green-500 hover:bg-green-500/5"}
                `}
              >
                <TrendingUp className="w-6 h-6" />
                {loading ? "Generating..." : "Generate Roadmap"}
              </button>

            </div>
          </div>
        </div>

        {/* Lower Half - Roadmap Cards */}
        <div className="bg-black rounded-2xl relative overflow-hidden">
          {/* Subtle background blur elements for glass effect */}
          <div className="absolute top-32 left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="pt-8">
              <h2 className="text-white text-6xl text-center font-bold">
                Recommended Career Paths
              </h2>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 p-20">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading roadmaps...</p>
                </div>
              ) : !hasSkills ? (
                // Show message when user has no skills
                <div className="col-span-full text-center py-16">
                  <div className="backdrop-blur-lg bg-white/[0.03] border border-white/10 rounded-2xl p-12">
                    <div className="mb-6">
                      <Target className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Add Skills to Generate Roadmap
                    </h3>
                    <p className="text-gray-300 text-lg mb-6 max-w-md mx-auto">
                      Start by adding your primary and secondary skills above. This will help us create personalized career roadmaps tailored to your expertise.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Add primary skills for your main expertise
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Include secondary skills for broader opportunities
                      </div>
                    </div>
                  </div>
                </div>
              ) : roadmaps.length > 0 ? (
                // Show roadmap cards when they exist
                roadmaps.map((roadmap, index) => (
                  <div key={index} className="group relative">
                    {/* Glass card */}
                    <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden hover:bg-white/[0.06]">
                      {/* Glass surface reflection */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rounded-2xl"></div>

                      {/* Top glass highlight */}
                      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Career Title */}
                        <div className="flex items-start gap-3 mb-6">
                          <div className="p-2 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-500/20">
                            <Target className="w-5 h-5 text-blue-400" />
                          </div>
                          <h3 className="text-xl font-bold text-white leading-tight">
                            {roadmap.title || "Untitled Roadmap"}
                          </h3>
                        </div>

                        {/* Glass separator */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

                        {/* Button */}
                        <button
                          onClick={() =>
                            navigate(`/roadmap/${index}`, {
                              state: { roadmapData: roadmap },
                            })
                          }
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 backdrop-blur-sm bg-white/[0.05] border border-gray-300 rounded-xl text-sm font-medium text-gray-200 hover:bg-blue-500/10 hover:border-blue-500/90 hover:text-white transition-all duration-300 shadow-lg"
                        >
                          <span>Explore Path</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                        <button
                          onClick={() => removeRoadmap(index)}
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 mt-3 backdrop-blur-sm bg-white/[0.05] border-1 border-gray-300 rounded-xl text-sm font-medium text-red-400 hover:bg-white hover:border-red-500/50 hover:text-black transition-all duration-300 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove Path</span>
                        </button>
                      </div>

                      {/* Bottom glass edge */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

                      {/* Glass shimmer on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 group-hover:left-full transition-all duration-1000 ease-out"></div>
                      </div>

                      {/* Subtle inner glow on hover */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-inner"
                        style={{
                          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1)",
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                // Show message when user has skills but no roadmaps
                <div className="col-span-full text-center py-16">
                  <div className="backdrop-blur-lg bg-white/[0.03] border border-white/10 rounded-2xl p-12">
                    <div className="mb-6">
                      <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Ready to Create Your Career Path?
                    </h3>
                    <p className="text-gray-300 text-lg mb-6 max-w-md mx-auto">
                      You've added your skills! Now take an assessment to generate personalized career roadmaps based on your expertise.
                    </p>
                    <button
                      onClick={handleTakeAssessment}
                      disabled={loading}
                      className={`px-8 py-4 backdrop-blur-sm border rounded-xl font-semibold transition-all duration-300 ${
                        loading 
                          ? "bg-blue-500/10 border-blue-500/20 text-gray-400 cursor-not-allowed"
                          : "bg-blue-500/20 border-blue-500/30 text-white hover:bg-blue-500/30 hover:scale-[1.02]"
                      }`}
                    >
                      {loading ? "Processing Assessment..." : "Take Assessment"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .blur-3xl {
          filter: blur(80px);
        }
      `}</style>
    </div>
  );
};

export default SkillMonitoringPage;