import React, { useState, useEffect } from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase"; // Adjust path to your firebase config
import { onAuthStateChanged } from "firebase/auth";
import { type User } from "firebase/auth";

interface NavbarProps {
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  profileImageUrl?: string;
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  userName: propUserName = "User",
  profileImageUrl: propProfileImageUrl,
  onProfileClick,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get user data with fallbacks
  const getUserData = () => {
    if (user) {
      return {
        displayName: user.displayName || propUserName || "User",
        photoURL: user.photoURL || propProfileImageUrl || null,
        email: user.email,
      };
    }
    return {
      displayName: propUserName || "User",
      photoURL: propProfileImageUrl || null,
      email: null,
    };
  };

  const userData = getUserData();

  // Handle profile image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Reset image error when URL changes
  useEffect(() => {
    setImageError(false);
  }, [userData.photoURL]);

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-4 py-2 bg-black/20 border-b border-white/10 shadow-lg fixed top-0 left-0 z-50 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side - Toggle Buttons with Sliding Background */}
        <div className="flex items-center gap-4">
          {/* Profile Logo */}
          <button
            onClick={onProfileClick}
            className="flex items-center justify-center w-12 h-12 border-2 border-white/70 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 cursor-pointer relative"
            title={`${userData.displayName}${
              userData.email ? ` (${userData.email})` : ""
            }`}
          >
            {userData.photoURL && !imageError ? (
              <img
                src={userData.photoURL}
                alt={userData.displayName}
                className="w-full h-full rounded-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-white font-medium text-sm">
                {userData.displayName && userData.displayName !== "User" ? (
                  userData.displayName.charAt(0).toUpperCase()
                ) : (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
            )}

            {/* Online indicator dot for authenticated users */}
            {user && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 border-2 border-black rounded-full"></div>
            )}
          </button>

          {/* Home Button */}
          <div
            onClick={() => {
              navigate("/");
            }}
            className="flex items-center gap-4 sm:gap-6 ml-auto"
          >
            <HoverBorderGradient className="p-2 px-6 cursor-pointer">
              Home
            </HoverBorderGradient>
          </div>
        </div>

        {/* Right Side - What is NEXTskill Button + Logo */}
        <div className="flex items-center gap-4 sm:gap-6 ml-auto">
          {/* What is NEXTskill Button */}
          <HoverBorderGradient
            className="cursor-pointer"
            onClick={() => {
              navigate("/about");
            }}
          >
            What is NEXTskill ?
          </HoverBorderGradient>

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
