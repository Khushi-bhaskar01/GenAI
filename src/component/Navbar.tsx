import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleHomeClick = () => {
    onHomeClick?.();
    navigate("/");
  };

  const handleRoadmapClick = () => {
    onRoadmapClick?.();
    navigate("/roadmap");
  };

  const handleSkillClick = () => {
    onAssessmentClick?.();
    navigate("/skill");
  };

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-4 bg-transparent fixed top-0 left-0 z-40">
      <div className="flex items-center justify-between py-2">
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
              onClick={handleHomeClick}
              className="px-6 py-1.5 text-white font-medium rounded-lg hover:bg-black/60 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={handleRoadmapClick}
              className="px-6 py-1.5 text-white font-medium rounded-lg hover:bg-black/60 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Roadmap
            </button>
            <button
              onClick={handleSkillClick}
              className="px-6 py-1.5 text-white font-medium rounded-lg hover:bg-black/60 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Skill
            </button>
          </div>
        </HoverBorderGradient>

        {/* Right Side - NEXTskill Logo */}
        <div className="flex w-sm">
          <div className="text-3xl sm:text-2xl font-bold select-none ml-auto flex items-center">
            <img
              src="/Nextskilllogo.png"
              alt="NEXTskill Logo"
              className="h-12 w-auto object-contain"
              onClick={() => {
                navigate("/about");
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLogin;





