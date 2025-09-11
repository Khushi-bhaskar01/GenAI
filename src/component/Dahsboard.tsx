import React from "react";
import {
  User,
  LayoutDashboard,
  Monitor,
  BookOpen,
  Map,
  FileText,
  File,
  Settings,
  LogOut,
  Edit,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase/firebase";

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile?: () => void;
  onDashboard?: () => void;
  onSkillMonitor?: () => void;
  onCourseLibrary?: () => void;
  onRoadmap?: () => void;
  onAssessments?: () => void;
  onResume?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

const Dashboard: React.FC<ProfilePanelProps> = ({
  isOpen,
  onClose,
  onEditProfile,
  onDashboard,
  onSkillMonitor,
  onCourseLibrary,
  onRoadmap,
  onAssessments,
  onResume,
  onSettings,
  onLogout,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const displayProfile = {
    name: user?.displayName || "User",
    email: user?.email || "user@example.com",
    profileImageUrl: user?.photoURL || undefined,
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      onClick: () => {
        navigate("/");
        onClose();
        onDashboard?.();
      },
    },
    {
      icon: Monitor,
      label: "Skill Monitor",
      onClick: () => {
        navigate("/skill");
        onClose();
        onSkillMonitor?.();
      },
    },
    {
      icon: BookOpen,
      label: "Course Library",
      onClick: () => {
        navigate("/");
        onClose();
        onCourseLibrary?.();
      },
    },
    {
      icon: Map,
      label: "Roadmap",
      onClick: () => {
        navigate("/roadmap");
        onClose();
        onRoadmap?.();
      },
    },
    {
      icon: FileText,
      label: "Assessments",
      onClick: () => {
        navigate("/assessment");
        onClose();
        onAssessments?.();
      },
    },
    {
      icon: File,
      label: "Resume",
      onClick: () => {
        navigate("/resume");
        onClose();
        onResume?.();
      },
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => {
        navigate("/settings");
        onClose();
        onSettings?.();
      },
    },
  ];

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth); // 👈 properly signs out from Firebase
      console.log("User signed out successfully");

      onLogout?.(); // if you want to trigger extra parent logic
      navigate("/"); // go back to home
      onClose(); // close the dashboard panel
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-start">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-64 sm:w-72 h-full bg-black/60 backdrop-blur-md border-r border-white/10 shadow-lg flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              <X size={20} />
            </button>

            {/* Panel Content */}
            <div className="p-6 h-full flex flex-col">
              {/* User Profile Section */}
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-black/40 border border-white/20 flex items-center justify-center overflow-hidden">
                    {displayProfile.profileImageUrl ? (
                      <img
                        src={displayProfile.profileImageUrl}
                        alt={displayProfile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-100 font-medium text-lg truncate">
                      {displayProfile.name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {displayProfile.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onEditProfile?.();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-black/40 border border-white/20 rounded-lg text-gray-300 hover:bg-black/60 hover:text-white hover:border-white/30 transition-all duration-300"
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="flex-1">
                <div className="space-y-0">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-left group"
                    >
                      <item.icon
                        size={20}
                        className="text-gray-400 group-hover:text-white transition-colors duration-300"
                      />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </nav>

              {/* Logout Button */}
              <div className="mt-auto pt-2 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 text-left group"
                >
                  <LogOut
                    size={20}
                    className="text-red-400 group-hover:text-red-300 transition-colors duration-300"
                  />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Dashboard;
