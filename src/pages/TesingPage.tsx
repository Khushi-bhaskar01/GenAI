import { useState } from "react";
import React from "react";
import { ShootingStarsAndStarsBackgroundDemo } from "../component/starbackground";
import Navbar2 from "../component/Navbar2";
import Navbar from "../component/Navbar";
import ProfilePanel2 from "../component/Dahsboard";
import Home from "../component/Home";
import Footer from "../component/Footer";
import LoginPage from "../component/Login";
import SignupPage from "../component/Signup";
import SkillMonitoringPage from "../component/SkillMoniter";
import RoadmapPage from "../component/Roadmap";
import AssessmentPage from "../component/Assessment";
import ResumeAnalyzer from "../component/Resume";

const Testing: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(true);

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      {/* Shooting Stars Background */}
      <ShootingStarsAndStarsBackgroundDemo />
      {/* <LoginPage /> */}
      {/* <SignupPage /> */}
      {/* <Home /> */}

      {/* <Navbar /> */}
      <Navbar2 onProfileClick={() => setIsProfileOpen(true)} />
      <ProfilePanel2
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <ShootingStarsAndStarsBackgroundDemo />
      <SkillMonitoringPage />
      {/* <RoadmapPage /> */}
      {/* <AssessmentPage /> */}
      {/* <ResumeAnalyzer /> */}

      <Footer />
    </div>
  );
};

export default Testing;

// // src/pages/TestingPage.tsx
// import React from "react";
// import Navbar2 from "../component/Navbar2";
// import Footer from "../component/Footer";
// import SkillMonitoring from "../component/SkillMoniter";

// const TestingPage: React.FC = () => {
//   // Sample data for testing
//   const skills = [
//     { name: "React", level: 70 },
//     { name: "Node.js", level: 50 },
//     { name: "CSS", level: 80 },
//   ];

//   const assessments = [
//     { skill: "React", status: "completed", score: 75 },
//     { skill: "Node.js", status: "pending" },
//     { skill: "CSS", status: "completed", score: 90 },
//   ];

//   const gapAnalysis = [
//     { name: "React", level: 30 },
//     { name: "Node.js", level: 50 },
//   ];

//   const roadmap = [
//     { title: "Learn Advanced React", description: "Work on hooks and context" },
//     { title: "Node.js Project", description: "Build REST APIs" },
//   ];

//   return (
//     <div className="min-h-screen w-full relative bg-transparent text-white flex flex-col">
//       {/* Navbar */}
//         <ShootingStarsAndStarsBackgroundDemo />
//       <Navbar2 />

//       {/* Main Content */}
//       <main className="flex-1 p-6 pt-24 overflow-auto">
//         <SkillMonitoring
//           skills={skills}
//           assessments={assessments}
//           gapAnalysis={gapAnalysis}
//           roadmap={roadmap}
//         />
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default TestingPage;
