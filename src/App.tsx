// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./component/Login";
// import Testing from "./pages/TesingPage";

// const App: React.FC = () => {
//   return (
//     <div className="h-screen w-screen overflow-y-scroll scrollbar-hide">
//       <Router>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<HomePage />} />
//           <Route path="/testing" element={<Testing />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./component/Login";
// import Testing from "./pages/TesingPage";
import SkillMonitoringPage from "./component/SkillMoniter";
import RoadmapPage from "./component/Roadmap";
import AssessmentPage from "./component/Assessment";
import ResumeAnalyzer from "./component/Resume";
import Layout from "./component/Layout";
import Home from "./component/Homecopy2";
import Navbar from "./component/Navbar";
import SignupPage from "./component/Signup";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/skill" element={<SkillMonitoringPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/resume" element={<ResumeAnalyzer />} />
          {/* <Route path="/testing" element={<Testing />} /> */}
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
