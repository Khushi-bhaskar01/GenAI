// import React, { useState } from "react";
// import {
//   User,
//   LayoutDashboard,
//   Monitor,
//   BookOpen,
//   Map,
//   FileText,
//   File,
//   Settings,
//   LogOut,
//   Edit,
//   X,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/authContext";
// import { getAuth, signOut, deleteUser } from "firebase/auth";
// import { app } from "../firebase/firebase";

// interface ProfilePanelProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onEditProfile?: () => void;
//   onDashboard?: () => void;
//   onSkillMonitor?: () => void;
//   onCourseLibrary?: () => void;
//   onRoadmap?: () => void;
//   onAssessments?: () => void;
//   onResume?: () => void;
//   onSettings?: () => void;
//   onLogout?: () => void;
// }

// // ✅ Avatar component with fallback
// const ProfileAvatar: React.FC<{ name: string; photoURL?: string }> = ({
//   name,
//   photoURL,
// }) => {
//   const [imageError, setImageError] = useState(false);

//   return (
//     <div className="w-16 h-16 rounded-full bg-black/40 border border-white/20 flex items-center justify-center overflow-hidden">
//       {photoURL && !imageError ? (
//         <img
//           src={photoURL}
//           alt={name}
//           className="w-full h-full object-cover"
//           onError={() => setImageError(true)}
//         />
//       ) : (
//         <User size={32} className="text-gray-400" />
//       )}
//     </div>
//   );
// };

// const Dashboard: React.FC<ProfilePanelProps> = ({
//   isOpen,
//   onClose,
//   onEditProfile,
//   onDashboard,
//   onSkillMonitor,
//   onCourseLibrary,
//   onRoadmap,
//   onAssessments,
//   onResume,
//   onSettings,
//   onLogout,
// }) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const displayProfile = {
//     name: user?.displayName || "User",
//     email: user?.email || "user@example.com",
//     profileImageUrl: user?.photoURL || undefined,
//   };

//   const menuItems = [
//     {
//       icon: LayoutDashboard,
//       label: "Dashboard",
//       onClick: () => {
//         navigate("/");
//         onClose();
//         onDashboard?.();
//       },
//     },
//     {
//       icon: Monitor,
//       label: "Skill Monitor",
//       onClick: () => {
//         navigate("/skill");
//         onClose();
//         onSkillMonitor?.();
//       },
//     },
//     // {
//     //   icon: BookOpen,
//     //   label: "Course Library",
//     //   onClick: () => {
//     //     navigate("/");
//     //     onClose();
//     //     onCourseLibrary?.();
//     //   },
//     // },
//     {
//       icon: Map,
//       label: "Roadmap",
//       onClick: () => {
//         navigate("/roadmap/0");
//         onClose();
//         onRoadmap?.();
//       },
//     },
//     {
//       icon: FileText,
//       label: "Assessments",
//       onClick: () => {
//         navigate("/assessment");
//         onClose();
//         onAssessments?.();
//       },
//     },
//     {
//       icon: File,
//       label: "Resume",
//       onClick: () => {
//         navigate("/resume");
//         onClose();
//         onResume?.();
//       },
//     },
//     // {
//     //   icon: Settings,
//     //   label: "Settings",
//     //   onClick: () => {
//     //     navigate("/settings");
//     //     onClose();
//     //     onSettings?.();
//     //   },
//     // },
//   ];

//   const handleLogout = async () => {
//     try {
//       const auth = getAuth(app);
//       await signOut(auth);
//       console.log("User signed out successfully");

//       onLogout?.();
//       navigate("/");
//       onClose();
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     try {
//       const auth = getAuth(app);
//       if (auth.currentUser) {
//         await deleteUser(auth.currentUser);
//         console.log("User deleted successfully");
//         navigate("/");
//         onClose();
//       }
//     } catch (error) {
//       console.error("Error deleting account:", error);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex justify-start">
//           {/* Backdrop */}
//           <motion.div
//             className="absolute inset-0 bg-black/50 backdrop-blur-md"
//             onClick={onClose}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.8 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           />

//           {/* Panel */}
//           <motion.div
//             className="relative w-64 sm:w-72 h-full bg-black/60 backdrop-blur-md border-r border-white/10 shadow-lg flex flex-col"
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ type: "tween", duration: 0.3 }}
//           >
//             {/* Close Button */}
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
//             >
//               <X size={20} />
//             </button>

//             {/* Panel Content */}
//             <div className="p-6 h-full flex flex-col">
//               {/* User Profile Section */}
//               <div className="mb-8">
//                 <div className="flex items-center space-x-4 mb-4">
//                   <ProfileAvatar
//                     name={displayProfile.name}
//                     photoURL={displayProfile.profileImageUrl}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-gray-100 font-medium text-lg truncate">
//                       {displayProfile.name}
//                     </h3>
//                     <p className="text-gray-400 text-sm truncate">
//                       {displayProfile.email}
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => {
//                     onClose();
//                     navigate("/edit-profile");
//                   }}
//                   className="w-full flex items-center justify-center space-x-2 py-2.5 bg-black/40 border border-white/20 rounded-lg text-gray-300 hover:bg-black/60 hover:text-white hover:border-white/30 transition-all duration-300"
//                 >
//                   <Edit size={16} />
//                   <span>Edit Profile</span>
//                 </button>
//               </div>

//               {/* Navigation Menu */}
//               <nav className="flex-1">
//                 <div className="space-y-0">
//                   {menuItems.map((item, index) => (
//                     <button
//                       key={index}
//                       onClick={item.onClick}
//                       className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-left group"
//                     >
//                       <item.icon
//                         size={20}
//                         className="text-gray-400 group-hover:text-white transition-colors duration-300"
//                       />
//                       <span className="font-medium">{item.label}</span>
//                     </button>
//                   ))}
//                 </div>
//               </nav>

//               {/* Logout + Delete Account */}
//               <div className="mt-auto pt-2 border-t border-white/10 space-y-2">
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 text-left group"
//                 >
//                   <LogOut
//                     size={20}
//                     className="text-red-400 group-hover:text-red-300 transition-colors duration-300"
//                   />
//                   <span className="font-medium">Logout</span>
//                 </button>

//                 <button
//                   onClick={handleDeleteAccount}
//                   className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-gray-300 hover:bg-white/10 rounded-lg transition-all duration-300 text-left group"
//                 >
//                   <X
//                     size={20}
//                     className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
//                   />
//                   <span className="font-medium">Delete Account</span>
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Dashboard;

import React, { useState } from "react";
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
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { app, db } from "../firebase/firebase";

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

// ✅ Avatar component with fallback
const ProfileAvatar: React.FC<{ name: string; photoURL?: string }> = ({
  name,
  photoURL,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-16 h-16 rounded-full bg-black/40 border border-white/20 flex items-center justify-center overflow-hidden">
      {photoURL && !imageError ? (
        <img
          src={photoURL}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <User size={32} className="text-gray-400" />
      )}
    </div>
  );
};

// Confirmation Modal Component
const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-black/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />

              <h3 className="text-xl font-bold text-white mb-2">
                Delete Account
              </h3>

              <p className="text-gray-300 mb-6">
                This action is permanent and cannot be undone. All your data
                including:
              </p>

              <ul className="text-left text-sm text-gray-400 mb-6 space-y-1">
                <li>• Skills and assessments</li>
                <li>• Roadmaps and progress</li>
                <li>• Resume analysis</li>
                <li>• All account information</li>
              </ul>

              <p className="text-red-400 text-sm mb-6 font-medium">
                will be permanently deleted.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
      icon: Map,
      label: "Roadmap",
      onClick: () => {
        navigate("/roadmap/0");
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
  ];

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      console.log("User signed out successfully");

      onLogout?.();
      navigate("/");
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      setDeleteError("No user found");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const auth = getAuth(app);

      // Step 1: Delete user data from Firestore
      console.log("Deleting user data from Firestore...");
      const userDocRef = doc(db, "user", user.uid);
      await deleteDoc(userDocRef);
      console.log("User data deleted from Firestore successfully");

      // Step 2: Delete user from Firebase Authentication
      console.log("Deleting user from Firebase Auth...");
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        console.log("User deleted from Firebase Auth successfully");
      }

      // Step 3: Navigate away and close modal
      setShowDeleteModal(false);
      navigate("/");
      onClose();
    } catch (error: any) {
      console.error("Error deleting account:", error);

      // Handle specific error cases
      if (error.code === "auth/requires-recent-login") {
        setDeleteError(
          "For security reasons, please log out and log back in before deleting your account."
        );
      } else if (error.code === "permission-denied") {
        setDeleteError("You don't have permission to delete this account.");
      } else {
        setDeleteError(
          "Failed to delete account. Please try again or contact support."
        );
      }

      setIsDeleting(false);
    }
  };

  return (
    <>
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
                    <ProfileAvatar
                      name={displayProfile.name}
                      photoURL={displayProfile.profileImageUrl}
                    />
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
                      onClose();
                      navigate("/edit-profile");
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-black/40 border border-white/20 rounded-lg text-gray-300 hover:bg-black/60 hover:text-white hover:border-white/30 transition-all duration-300"
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Error Display */}
                {deleteError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 text-sm">{deleteError}</p>
                  </div>
                )}

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

                {/* Logout + Delete Account */}
                <div className="mt-auto pt-2 border-t border-white/10 space-y-2">
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

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isDeleting}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 text-left group disabled:opacity-50"
                  >
                    <X
                      size={20}
                      className="text-gray-400 group-hover:text-red-400 transition-colors duration-300"
                    />
                    <span className="font-medium">Delete Account</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default Dashboard;
