import React, { useState } from "react";
import Navbar from "../component/NavbarLogin";
import { ShootingStarsAndStarsBackgroundDemo } from "../component/starbackground";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { type User } from 'firebase/auth'
import { app, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

const SignupPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

  // Create user document in Firestore
  const createUserDocument = async (user: User, displayName: string) => {
    const userDocRef = doc(db, "user", user.uid);

    // Check if user document already exists
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      // Create new user document
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          name: displayName,
          email: user.email,
          skills: { primary: [], secondary: [] },
          assessment: [
            {
              skill: "",
              category: "",
              status: "",
              score: "",
              totalQuestions: "",
              attemptedQuestions: "",
              correctAnswers: "",
              questions: [
                {
                  questionId: "",
                  questionText: "",
                  options: [""],
                  correctOption: "",
                  userAnswer: "",
                },
              ],
              attemptedAt: "",
              completedAt: "",
            },
          ],
          resume: {
            Analysis: {
              atsScore: "",
              keywordsMissing: [""],
              keywordsFound: [""],
              readabilityScore: "",
              formattingScore: "",
            },
            suggestions: [
              {
                id: "1",
                category: "",
                title: "",
                description: "",
                severity: "",
              },
            ],
          },
          roadmap: [
            {
              tasks: [
                {
                  resources: [{ title: "", link: "" }],
                  status: "",
                  taskName: "",
                  timeAllocation: "",
                },
              ],
              title: "",
            },
          ],
        },
        { merge: true }
      );
      console.log("New user document created in Firestore");
    } else {
      console.log("User document already exists");
    }
  };

  // Handle regular email/password signup
  const handleSubmit = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters long!");
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth(app);
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCred.user.uid;

      console.log("Signed up uid:", uid);

      // Update displayName in Firebase Auth
      try {
        await updateProfile(userCred.user, { displayName: name });
      } catch (err) {
        console.warn("updateProfile failed (non-fatal):", err);
      }

      // Create user document in Firestore
      await createUserDocument(userCred.user, name);

      console.log("Firestore user doc written with id:", uid);
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Try logging in.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else {
        alert(error.message || "Signup failed, check console for details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      // Configure Google provider for better UX
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google signup successful:", user.uid);

      // Extract name from Google profile
      const displayName =
        user.displayName || user.email?.split("@")[0] || "User";

      // Create user document in Firestore
      await createUserDocument(user, displayName);

      console.log("Google user document created with id:", user.uid);
      navigate("/");
    } catch (error: any) {
      console.error("Google signup error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        // User closed the popup, don't show error
        return;
      } else if (error.code === "auth/cancelled-popup-request") {
        // Multiple popup requests, ignore
        return;
      } else if (error.code === "auth/popup-blocked") {
        alert(
          "Popup was blocked by browser. Please allow popups for this site and try again."
        );
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        alert(
          "An account already exists with the same email address but different sign-in credentials. Please try logging in with email/password or a different method."
        );
      } else {
        alert("Google sign-in failed: " + (error.message || "Unknown error"));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <Navbar />
      <ShootingStarsAndStarsBackgroundDemo />
      <div className="flex items-center justify-center px-8 py-2 mt-14 z-20 inset-0 fixed">
        <div className="w-full max-w-md bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-lg px-8 py-3">
          {/* Logo */}
          <div className="text-center mb-3">
            <div className="text-2xl font-bold select-none mb-2">
              <span className="text-gray-100">NEXT</span>
              <span className="text-blue-400">skill</span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <div className="mb-4">
            <button
              onClick={handleGoogleSignup}
              disabled={googleLoading || isLoading}
              className="w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-200"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>
                {googleLoading ? "Signing up..." : "Continue with Google"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="mb-2 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-gray-400">
              or sign up with email
            </span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-[0.8rem] font-medium text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your full name"
                disabled={isLoading || googleLoading}
                className="text-sm w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[0.8rem] font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                disabled={isLoading || googleLoading}
                className="text-sm w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[0.8rem] font-medium text-gray-300 mb-1"
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
                  placeholder="Enter your password"
                  disabled={isLoading || googleLoading}
                  className="text-sm w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || googleLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[0.8rem] font-medium text-gray-300 mb-1"
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
                  placeholder="Confirm your password"
                  disabled={isLoading || googleLoading}
                  className="text-sm w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading || googleLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || googleLoading}
              className="w-full py-2 my-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-2">
            <p className="text-gray-400 text-xs">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                disabled={isLoading || googleLoading}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
