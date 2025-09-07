import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

interface NavbarProps {
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onRoadmapClick?: () => void;
  onAssessmentClick?: () => void;
  profileImageUrl?: string;
  userName?: string;
}

const NavbarLogin: React.FC<NavbarProps> = ({
  onProfileClick,
  onHomeClick,
  onRoadmapClick,
  onAssessmentClick,
  profileImageUrl,
  userName = "User",
}) => {
  return (
    <nav className="w-full px-4 sm:px-6 lg:px-4 py-2 bg-transparent fixed z-40 ">
      <div className="flex items-center justify-between">
        {/* Left Side - Profile Logo */}
        <div className="flex items-center w-sm">
          <button
            onClick={onProfileClick}
            className="flex items-center justify-center w-12 h-12 border-1 border-gray-500 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={userName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-white font-medium text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        </div>

        {/* Center - Navigation Buttons */}
        <HoverBorderGradient>
          <div className="flex items-center gap-6 border-gray-500 rounded-full backdrop-blur-2xl">
            <button
              onClick={onHomeClick}
              className="px-6 py-1.5 text-white font-medium rounded-lg  hover:bg-black/60 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Home
            </button>

            <button
              onClick={onRoadmapClick}
              className="px-6 py-1.5 text-white font-medium rounded-lg   hover:bg-black/60 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Roadmap
            </button>

            <button
              onClick={onAssessmentClick}
              className="px-6 py-1.5 text-white font-medium rounded-lg   hover:bg-black/60 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Assessment
            </button>
          </div>
        </HoverBorderGradient>

        {/* Right Side - NEXTskill Logo */}
        <div className="flex w-sm">
          <div className="text-3xl sm:text-2xl font-bold select-none ml-auto flex items-center">
            <img
              src="/Nextskilllogo.png"
              alt="NEXTskill Logo"
              className="h-12 w-auto object-contain" // bigger height, auto width
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLogin;
