

// import React, { useState } from "react";
// import { ShootingStarsAndStarsBackgroundDemo } from "../component/starbackground";
// import Navbar from "../component/NavbarLogin";
// import { useNavigate } from "react-router-dom";
// import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
// import { app } from "../firebase/firebase";

// const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [resetEmail, setResetEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [resetEmailSent, setResetEmailSent] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     if (!email || !password) {
//       alert("Enter the credentials");
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const auth = getAuth(app);
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/"); // redirect after login
//     } catch (error: any) {
//       if (error.code === "auth/user-not-found") {
//         alert("User not found. Please sign up first.");
//       } else if (error.code === "auth/wrong-password") {
//         alert("Incorrect password. Try again.");
//       } else if (error.code === "auth/invalid-email") {
//         alert("Please enter a valid email address.");
//       } else if (error.code === "auth/invalid-credential") {
//         alert("Invalid email or password. Please check your credentials.");
//       } else {
//         alert(error.message);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!resetEmail) {
//       alert("Please enter your email address");
//       return;
//     }

//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(resetEmail)) {
//       alert("Please enter a valid email address");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const auth = getAuth(app);
//       await sendPasswordResetEmail(auth, resetEmail);
//       setResetEmailSent(true);
//       alert("Password reset email sent! Check your inbox and follow the instructions to reset your password.");
//     } catch (error: any) {
//       if (error.code === "auth/user-not-found") {
//         alert("No account found with this email address. Please check your email or sign up for a new account.");
//       } else if (error.code === "auth/invalid-email") {
//         alert("Please enter a valid email address.");
//       } else if (error.code === "auth/too-many-requests") {
//         alert("Too many password reset attempts. Please wait a moment before trying again.");
//       } else {
//         alert("Error sending password reset email: " + error.message);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleSubmit();
//     }
//   };

//   const handleForgotPasswordKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleForgotPassword();
//     }
//   };

//   const closeForgotPassword = () => {
//     setShowForgotPassword(false);
//     setResetEmail("");
//     setResetEmailSent(false);
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen flex items-center justify-center px-4 py-8 z-20 inset-0 fixed">
//         <ShootingStarsAndStarsBackgroundDemo />
        
//         {/* Main Login Form */}
//         {!showForgotPassword && (
//           <div className="w-full max-w-md bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-lg p-8">
//             {/* Logo */}
//             <div className="text-center mb-8">
//               <div className="text-3xl font-bold select-none mb-2">
//                 <span className="text-gray-100">NEXT</span>
//                 <span className="text-blue-400">skill</span>
//               </div>
//               <p className="text-gray-300 text-sm">
//                 Welcome back! Please sign in to your account
//               </p>
//             </div>

//             {/* Login Fields */}
//             <div className="space-y-6">
//               {/* Email Input */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-300 mb-2"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Enter your email"
//                   className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300"
//                   disabled={isLoading}
//                 />
//               </div>

//               {/* Password Input */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-300 mb-2"
//                 >
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     placeholder="Enter your password"
//                     className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300 pr-12"
//                     disabled={isLoading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 text-sm"
//                     disabled={isLoading}
//                   >
//                     {showPassword ? "Hide" : "Show"}
//                   </button>
//                 </div>
//               </div>

//               {/* Forgot Password */}
//               <div className="text-right">
//                 <button
//                   type="button"
//                   onClick={() => setShowForgotPassword(true)}
//                   className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300"
//                   disabled={isLoading}
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               {/* Login Button */}
//               <button
//                 onClick={handleSubmit}
//                 disabled={isLoading}
//                 className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//               >
//                 {isLoading ? "Signing In..." : "Log In"}
//               </button>
//             </div>

//             {/* Divider */}
//             <div className="my-6 flex items-center">
//               <div className="flex-1 border-t border-white/20"></div>
//               <span className="px-4 text-sm text-gray-400">or</span>
//               <div className="flex-1 border-t border-white/20"></div>
//             </div>

//             {/* Sign Up Link */}
//             <div className="text-center">
//               <p className="text-gray-400 text-sm">
//                 Don't have an account?{" "}
//                 <button
//                   onClick={() => navigate("/signup")}
//                   className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
//                   disabled={isLoading}
//                 >
//                   Sign up
//                 </button>
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Forgot Password Modal */}
//         {showForgotPassword && (
//           <div className="w-full max-w-md bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-lg p-8">
//             {/* Header */}
//             <div className="text-center mb-8">
//               <div className="text-2xl font-bold text-gray-100 mb-2">
//                 Reset Password
//               </div>
//               <p className="text-gray-300 text-sm">
//                 {resetEmailSent 
//                   ? "Check your email for reset instructions"
//                   : "Enter your email address and we'll send you a link to reset your password"
//                 }
//               </p>
//             </div>

//             {!resetEmailSent ? (
//               <>
//                 {/* Email Input for Reset */}
//                 <div className="space-y-6">
//                   <div>
//                     <label
//                       htmlFor="resetEmail"
//                       className="block text-sm font-medium text-gray-300 mb-2"
//                     >
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       id="resetEmail"
//                       value={resetEmail}
//                       onChange={(e) => setResetEmail(e.target.value)}
//                       onKeyPress={handleForgotPasswordKeyPress}
//                       placeholder="Enter your email"
//                       className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300"
//                       disabled={isLoading}
//                     />
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={closeForgotPassword}
//                       className="flex-1 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-all duration-300"
//                       disabled={isLoading}
//                     >
//                       Back to Login
//                     </button>
//                     <button
//                       onClick={handleForgotPassword}
//                       disabled={isLoading}
//                       className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isLoading ? "Sending..." : "Send Reset Email"}
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <>
//                 {/* Success Message */}
//                 <div className="text-center space-y-6">
//                   <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
//                     <svg
//                       className="w-8 h-8 text-green-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-lg font-semibold text-white mb-2">Email Sent!</h3>
//                     <p className="text-gray-300 text-sm mb-4">
//                       We've sent a password reset link to <span className="text-blue-400">{resetEmail}</span>
//                     </p>
//                     <p className="text-gray-400 text-xs">
//                       Check your email and follow the instructions to reset your password. 
//                       If you don't see the email, check your spam folder.
//                     </p>
//                   </div>

//                   <button
//                     onClick={closeForgotPassword}
//                     className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition-all duration-300"
//                   >
//                     Back to Login
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default LoginPage;





import React, { useState } from "react";
import { ShootingStarsAndStarsBackgroundDemo } from "../component/starbackground";
import Navbar from "../component/NavbarLogin";
import { useNavigate } from "react-router-dom";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { app, db } from "../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  // Create user document in Firestore if it doesn't exist (for Google sign-in)
  const createUserDocumentIfNeeded = async (user: any) => {
    const userDocRef = doc(db, "user", user.uid);
    const userSnap = await getDoc(userDocRef);
    
    if (!userSnap.exists()) {
      // Create new user document with the same structure as signup
      const displayName = user.displayName || user.email?.split('@')[0] || 'User';
      
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
      console.log("New user document created for Google sign-in user");
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Enter the credentials");
      return;
    }
    
    setIsLoading(true);
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // redirect after login
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        alert("User not found. Please sign up first.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Try again.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else if (error.code === "auth/invalid-credential") {
        alert("Invalid email or password. Please check your credentials.");
      } else {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      
      // Configure Google provider
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("Google sign-in successful:", user.uid);

      // Create user document if it doesn't exist (handles first-time Google users)
      await createUserDocumentIfNeeded(user);

      console.log("Google user authenticated, redirecting...");
      navigate("/");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      if (error.code === "auth/popup-closed-by-user") {
        // User closed the popup, don't show error
        return;
      } else if (error.code === "auth/cancelled-popup-request") {
        // Multiple popup requests, ignore
        return;
      } else if (error.code === "auth/popup-blocked") {
        alert("Popup was blocked by browser. Please allow popups for this site and try again.");
      } else if (error.code === "auth/account-exists-with-different-credential") {
        alert("An account already exists with the same email address but different sign-in credentials. Please try using email/password or contact support.");
      } else {
        alert("Google sign-in failed: " + (error.message || "Unknown error"));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      alert("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, resetEmail);
      setResetEmailSent(true);
      alert("Password reset email sent! Check your inbox and follow the instructions to reset your password.");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email address. Please check your email or sign up for a new account.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else if (error.code === "auth/too-many-requests") {
        alert("Too many password reset attempts. Please wait a moment before trying again.");
      } else {
        alert("Error sending password reset email: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleForgotPasswordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleForgotPassword();
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setResetEmailSent(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-8 z-20 inset-0 fixed">
        <ShootingStarsAndStarsBackgroundDemo />
        
        {/* Main Login Form */}
        {!showForgotPassword && (
          <div className="w-full max-w-md bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-lg p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold select-none mb-2">
                <span className="text-gray-100">NEXT</span>
                <span className="text-blue-400">skill</span>
              </div>
              <p className="text-gray-300 text-sm">
                Welcome back! Please sign in to your account
              </p>
            </div>

            {/* Google Sign In Button */}
            <div className="mb-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading || isLoading}
                className="w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-gray-200"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>
                  {googleLoading ? "Signing in..." : "Continue with Google"}
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="mb-6 flex items-center">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-sm text-gray-400">or sign in with email</span>
              <div className="flex-1 border-t border-white/20"></div>
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
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300"
                  disabled={isLoading || googleLoading}
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
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300 pr-12"
                    disabled={isLoading || googleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                    disabled={isLoading || googleLoading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300"
                  disabled={isLoading || googleLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || googleLoading}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Signing In..." : "Log In"}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                  disabled={isLoading || googleLoading}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="w-full max-w-md bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-2xl font-bold text-gray-100 mb-2">
                Reset Password
              </div>
              <p className="text-gray-300 text-sm">
                {resetEmailSent 
                  ? "Check your email for reset instructions"
                  : "Enter your email address and we'll send you a link to reset your password"
                }
              </p>
            </div>

            {!resetEmailSent ? (
              <>
                {/* Email Input for Reset */}
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="resetEmail"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="resetEmail"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      onKeyPress={handleForgotPasswordKeyPress}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:bg-black/60 focus:border-blue-400 focus:outline-none transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={closeForgotPassword}
                      className="flex-1 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-all duration-300"
                      disabled={isLoading}
                    >
                      Back to Login
                    </button>
                    <button
                      onClick={handleForgotPassword}
                      disabled={isLoading}
                      className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Sending..." : "Send Reset Email"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Email Sent!</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      We've sent a password reset link to <span className="text-blue-400">{resetEmail}</span>
                    </p>
                    <p className="text-gray-400 text-xs">
                      Check your email and follow the instructions to reset your password. 
                      If you don't see the email, check your spam folder.
                    </p>
                  </div>

                  <button
                    onClick={closeForgotPassword}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none transition-all duration-300"
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default LoginPage;