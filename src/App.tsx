import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import Layout from "./component/Layout";
import Home from "./pages/Home";
import SkillMonitoringPage from "./pages/SkillMoniter";
import RoadmapPage from "./pages/Roadmap";
import AssessmentPage from "./pages/Assessment";
import ResumeAnalyzer from "./pages/Resume";
import About from "./pages/About";
import ProtectedRoute from "../src/component/ProtectedRoute";
const App: React.FC = () => {
  return (
    <Routes>
      {/* Home should always render Layout, but Layout itself decides which Navbar to show */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>

      <Route path="/about" element={<Layout />}>
        <Route index element={<About />} />
      </Route>

      {/* Protected routes (only logged-in users) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/skill" element={<SkillMonitoringPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
      </Route>

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;
