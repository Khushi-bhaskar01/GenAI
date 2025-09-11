
import React, { useState, useEffect } from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { useNavigate, useLocation } from "react-router-dom";

interface NavbarProps {
  onLoginClick?: () => void;
  onSignInClick?: () => void;
  onWhatIsNextskillClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onLoginClick,
  onSignInClick,
  onWhatIsNextskillClick,
}) => {
  const [activeButton, setActiveButton] = useState<"login" | "signin">("login");
  const [showVideo, setShowVideo] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync activeButton state with current route on mount
  useEffect(() => {
    if (location.pathname === "/signup") {
      setActiveButton("signin");
    } else if (location.pathname === "/login") {
      setActiveButton("login");
    }
  }, [location.pathname]);

  const handleLoginClick = () => {
    setActiveButton("login");
    onLoginClick?.();
    navigate("/login");
  };

  const handleSignInClick = () => {
    setActiveButton("signin");
    onSignInClick?.();
    navigate("/signup");
  };

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-4 py-2 bg-black/20 border-b border-white/10 shadow-lg fixed top-0 left-0 z-50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side - Toggle Buttons with Sliding Background */}
        <div className="relative flex bg-black/40 rounded-lg backdrop-blur-sm border border-white/20">
          {/* Sliding Background */}
          <div
            className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-md transition-all duration-300 ease-in-out ${
              activeButton === "login" ? "left-1" : "left-[48%]"
            }`}
          />

          {/* Login Button */}
          <button
            onClick={handleLoginClick}
            className={`relative z-10 px-6 py-2.5 rounded-md font-medium transition-all duration-300 ${
              activeButton === "login"
                ? "text-gray-900"
                : "text-white hover:text-gray-200"
            }`}
          >
            Login
          </button>

          {/* Sign In Button */}
          <button
            onClick={handleSignInClick}
            className={`relative z-10 px-6 py-2.5 rounded-md font-medium transition-all duration-300 ${
              activeButton === "signin"
                ? "text-gray-900"
                : "text-white hover:text-gray-200"
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Right Side - What is NEXTskill Button + Logo */}
        <div onClick={()=>{navigate('/about')}} className="flex items-center gap-4 sm:gap-6 ml-auto">
          {/* What is NEXTskill Button */}
          <HoverBorderGradient>What is NEXTskill ?</HoverBorderGradient>

          {/* NEXTskill Logo */}
          <div className="flex items-center">
            <img
              src="/Nextskilllogo.png"
              alt="NEXTskill Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
