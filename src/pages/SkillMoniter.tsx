import React, { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  X,
  Target,
  FileText,
  TrendingUp,
  Save,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface Skill {
  id: string;
  name: string;
  progress: number;
}

interface RadarData {
  subject: string;
  valuePrimary: number;
  valueSecondary: number;
  fullMark: 100;
}

interface Improvement {
  id: string;
  skill: string;
  suggestion: string;
  priority: "High" | "Medium" | "Low";
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

const SkillMonitoringPage: React.FC = () => {
  const { user } = useAuth();

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

  // Static data (unchanged)
  const radarData: RadarData[] = [
    {
      subject: "Frontend",
      valuePrimary: 70,
      valueSecondary: 40,
      fullMark: 100,
    },
    { subject: "Backend", valuePrimary: 45, valueSecondary: 50, fullMark: 100 },
    {
      subject: "Database",
      valuePrimary: 55,
      valueSecondary: 35,
      fullMark: 100,
    },
    { subject: "DevOps", valuePrimary: 30, valueSecondary: 25, fullMark: 100 },
    { subject: "Testing", valuePrimary: 50, valueSecondary: 30, fullMark: 100 },
    { subject: "Design", valuePrimary: 40, valueSecondary: 45, fullMark: 100 },
  ];

  const improvements: Improvement[] = [
    {
      id: "1",
      skill: "React",
      suggestion: "Learn React Hooks and Context API",
      priority: "High",
    },
    {
      id: "2",
      skill: "Python",
      suggestion: "Practice data structures and algorithms",
      priority: "High",
    },
    {
      id: "3",
      skill: "DevOps",
      suggestion: "Get familiar with Docker and Kubernetes",
      priority: "Medium",
    },
    {
      id: "4",
      skill: "Testing",
      suggestion: "Learn unit testing with Jest",
      priority: "Medium",
    },
  ];

  const milestones: Milestone[] = [
    { id: "1", title: "Started Learning", date: "Jan 2024", completed: true },
    {
      id: "2",
      title: "First Assessment Completed",
      date: "Feb 2024",
      completed: true,
    },
    {
      id: "3",
      title: "Intermediate Level Reached",
      date: "Mar 2024",
      completed: true,
    },
    {
      id: "4",
      title: "Advanced Project Built",
      date: "Apr 2024",
      completed: false,
    },
    {
      id: "5",
      title: "Industry Certification",
      date: "May 2024",
      completed: false,
    },
  ];

  // Firebase functions
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
          // Convert Firebase skills to local format with progress
          const primarySkillsData = userData.skills.primary
            ? userData.skills.primary.map(
                (skillName: string, index: number) => ({
                  id: `primary_${index}_${Date.now()}`,
                  name: skillName,
                  progress: Math.floor(Math.random() * 60) + 40, // Random progress between 40-100
                })
              )
            : [];

          const secondarySkillsData = userData.skills.secondary
            ? userData.skills.secondary.map(
                (skillName: string, index: number) => ({
                  id: `secondary_${index}_${Date.now()}`,
                  name: skillName,
                  progress: Math.floor(Math.random() * 50) + 25, // Random progress between 25-75
                })
              )
            : [];

          setPrimarySkills(primarySkillsData);
          setSecondarySkills(secondarySkillsData);
        }
      }
    } catch (err) {
      console.error("Error loading skills from Firebase:", err);
      setError("Failed to load skills from database");
    } finally {
      setLoading(false);
    }
  };

  const saveSkillsToFirebase = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError("");

      const userDocRef = doc(db, "user", user.uid);

      // Convert local skills back to Firebase format
      const skillsData = {
        primary: primarySkills.map((skill) => skill.name),
        secondary: secondarySkills.map((skill) => skill.name),
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

  // Load skills on component mount
  useEffect(() => {
    loadSkillsFromFirebase();
  }, [user]);

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

  // Skill handlers
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

      // Auto-save after adding
      setTimeout(saveSkillsToFirebase, 100);
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

      // Auto-save after adding
      setTimeout(saveSkillsToFirebase, 100);
    }
  };

  const removePrimarySkill = async (id: string) => {
    const updatedSkills = primarySkills.filter((skill) => skill.id !== id);
    setPrimarySkills(updatedSkills);

    // Auto-save after removing
    setTimeout(saveSkillsToFirebase, 100);
  };

  const removeSecondarySkill = async (id: string) => {
    const updatedSkills = secondarySkills.filter((skill) => skill.id !== id);
    setSecondarySkills(updatedSkills);

    // Auto-save after removing
    setTimeout(saveSkillsToFirebase, 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-red-400 text-red-400";
      case "Medium":
        return "border-yellow-400 text-yellow-400";
      case "Low":
        return "border-green-400 text-green-400";
      default:
        return "border-gray-400 text-gray-400";
    }
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

  return (
    <div className="min-h-screen p-6 pt-25 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-lg p-4">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Upper Half */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Skill Input */}
          <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50 space-y-6">
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
                  onClick={saveSkillsToFirebase}
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
                      className="px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500/10 transition-all duration-300 font-semibold disabled:opacity-50"
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
                      className="px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500/10 transition-all duration-300 font-semibold disabled:opacity-50"
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

          {/* Right Side - Quick Actions (unchanged) */}
          <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Quick Actions
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => {
                  window.location.href = "/assessment";
                }}
                className="w-full py-4 px-6 border-2 border-blue-500 text-white rounded-xl hover:bg-blue-500/10 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3"
              >
                <FileText className="w-6 h-6" />
                Take Assessment
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
            </div>
          </div>
        </div>

        {/* Lower Half - All sections remain unchanged */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Analysis Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Overview */}
            <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
              <h3 className="text-xl font-bold text-white mb-6">
                Skill Overview & Analysis
              </h3>

              {/* Primary */}
              <h4 className="text-blue-400 mb-2">Primary Skills</h4>
              <div className="space-y-4 mb-6">
                {primarySkills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        {skill.name}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {skill.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${animatedProgress[skill.id] || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Secondary */}
              <h4 className="text-green-400 mb-2">Secondary Skills</h4>
              <div className="space-y-4 mb-6">
                {secondarySkills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        {skill.name}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {skill.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="h-2 bg-green-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${animatedProgress[skill.id] || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Radar Chart */}
              <div className="h-80">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Skill Distribution
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#ffffff", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "#9CA3AF", fontSize: 10 }}
                    />
                    <Radar
                      name="Primary Skills"
                      dataKey="valuePrimary"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="Secondary Skills"
                      dataKey="valueSecondary"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* What to Improve Section */}
            <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
              <h3 className="text-xl font-bold text-white mb-6">
                What to Improve
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {improvements.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black/30 rounded-lg p-4 border border-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{item.skill}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{item.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Tracking Section */}
          <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-6">
              Progress Tracking
            </h3>
            <div className="relative">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex items-start gap-4 relative"
                >
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        milestone.completed
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-600 bg-transparent"
                      }`}
                    />
                  </div>
                  <div className="flex-1 pb-8">
                    <h4
                      className={`font-medium ${
                        milestone.completed ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {milestone.title}
                    </h4>
                    <p className="text-gray-500 text-sm">{milestone.date}</p>
                  </div>
                  {index < milestones.length - 1 && (
                    <div
                      className={`absolute left-2 top-4 w-0.5 h-full ${
                        milestones[index + 1].completed
                          ? "bg-blue-500"
                          : "bg-gray-600"
                      }`}
                      style={{ transform: "translateX(-50%)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default SkillMonitoringPage;
