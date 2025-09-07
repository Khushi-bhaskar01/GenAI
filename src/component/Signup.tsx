import React, { useState } from "react";
import Navbar from "./Navbar";
import { ShootingStarsAndStarsBackgroundDemo } from "./starbackground";

interface SignupPageProps {
  onSignupSubmit?: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => void;
  onSignInClick?: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({
  onSignupSubmit,
  onSignInClick,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (name && email && password && confirmPassword) {
      if (password === confirmPassword) {
        onSignupSubmit?.(name, email, password, confirmPassword);
      } else {
        alert("Passwords do not match!");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
    <Navbar />
    <ShootingStarsAndStarsBackgroundDemo/>
      <div className="min-h-screen flex items-center justify-center px-4 py-8 z-20 inset-0 fixed">
        {/* Signup Container */}
        <div className="w-full max-w-md bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-lg p-4">
          {/* NEXTskill Logo */}
          <div className="text-center mb-6">
            <div className="text-2xl font-bold select-none mb-2">
              <span className="text-gray-100">NEXT</span>
              <span className="text-blue-400">skill</span>
            </div>
            <p className="text-gray-300 text-sm">
              Join NEXTskill and start your learning journey
            </p>
          </div>

          {/* Signup Fields */}
          <div className="space-y-2">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300 pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-2 my-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition-all duration-300 hover:scale-105"
            >
              Sign Up
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400 text-xs">
              Already have an account?{" "}
              <button
                onClick={onSignInClick}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
