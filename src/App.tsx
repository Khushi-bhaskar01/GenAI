import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./component/Signup";
import LoginPage from "./component/Login";
import Layout from "./component/Layout";
import Home from "./component/Home";
import SkillMonitoringPage from "./component/SkillMoniter";
import RoadmapPage from "./component/Roadmap";
import AssessmentPage from "./component/Assessment";
import ResumeAnalyzer from "./component/Resume";
import NEXTskillLanding from "./component/About";

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
        <Route path="/about" element={<NEXTskillLanding />} />
      </Routes>
    </Router>
  );
};
export default App;
