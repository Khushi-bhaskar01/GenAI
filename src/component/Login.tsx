import React, { useState } from "react";
import { ShootingStarsAndStarsBackgroundDemo } from "./starbackground";
import Navbar from "./NavbarLogin";

interface LoginPageProps {
  onLoginSubmit?: (email: string, password: string) => void;
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSubmit,
  onSignUpClick,
  onForgotPasswordClick,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (email && password) {
      onLoginSubmit?.(email, password);
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
      <div className="min-h-screen flex items-center justify-center px-4 py-8  z-20 inset-0 fixed">
        <ShootingStarsAndStarsBackgroundDemo />
        {/* Login Container */}
        <div className="w-full max-w-md bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-lg p-8">
          {/* NEXTskill Logo */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold select-none mb-2">
              <span className="text-gray-100">NEXT</span>
              <span className="text-blue-400">skill</span>
            </div>
            <p className="text-gray-300 text-sm">
              Welcome back! Please sign in to your account
            </p>
          </div>

          {/* Login Fields */}
          <div className="space-y-6">
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

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition-all duration-300 hover:scale-105"
            >
              Log In
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <button
                onClick={onSignUpClick}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
