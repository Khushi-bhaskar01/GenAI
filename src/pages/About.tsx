import React, { useState } from "react";
import {
  Target,
  BookOpen,
  TrendingUp,
  Users,
  ArrowRight,
  Play,
  FileText,
  HelpCircle,
  Map,
  BarChart3,
  Brain,
  FileSearch,
} from "lucide-react";
import { ShootingStarsAndStarsBackgroundDemo } from "../component/starbackground";
import { useNavigate } from "react-router-dom";

const NEXTskillLanding: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const navigate = useNavigate();

  const valueProps = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Skill Mapping",
      description:
        "Define your primary and secondary skills, and let AI generate personalized roadmaps instantly.",
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Multiple Roadmaps",
      description:
        "Explore, compare, and even remove roadmaps based on your career direction.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Progress Tracking",
      description:
        "Monitor your journey step by step with live progress analytics on each roadmap.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Skill Assessments",
      description:
        "Every skill comes with 5 smart questions to validate your knowledge and growth.",
    },
    {
      icon: <FileSearch className="w-8 h-8" />,
      title: "Resume Analyzer",
      description:
        "Upload your resume to get ATS score, readability score, and keyword insights.",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Sign In & Get Started",
      description: "Log in to NEXTskill and begin your journey instantly.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: 2,
      title: "Add Skills",
      description:
        "Enter your primary and secondary skills to personalize your learning path.",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      step: 3,
      title: "Generate Roadmaps",
      description:
        "AI creates multiple career roadmaps for you to explore and refine.",
      icon: <Map className="w-6 h-6" />,
    },
    {
      step: 4,
      title: "Track Your Progress",
      description:
        "Follow your roadmap and see your skill development with real-time tracking dashboards.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      step: 5,
      title: "Take Skill Assessments",
      description:
        "Complete 5-question adaptive assessments for each skill to validate your learning and growth.",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      step: 6,
      title: "Optimize Your Resume",
      description:
        "Upload your resume for ATS analysis, readability score, and personalized keyword recommendations.",
      icon: <FileSearch className="w-6 h-6" />,
    },
  ];

  const documentation = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Play className="w-5 h-5" />,
      content:
        "Sign up, add your skills, and get your first personalized roadmap in minutes. This will guide your journey from day one.",
    },
    {
      id: "assessments",
      title: "Skill Assessments",
      icon: <FileText className="w-5 h-5" />,
      content:
        "Each skill assessment has 5 adaptive questions to evaluate your current level. Retake assessments anytime to measure progress.",
    },
    {
      id: "roadmaps",
      title: "Roadmaps & Progress",
      icon: <Map className="w-5 h-5" />,
      content:
        "AI generates multiple roadmaps based on your inputs. You can explore, customize, and remove paths as needed. Progress is tracked in real-time.",
    },
    {
      id: "resume-analyzer",
      title: "Resume Analyzer",
      icon: <FileText className="w-5 h-5" />,
      content:
        "Upload your resume to receive a formatting score, ATS compatibility score, readability score, and keyword analysis with missing recommendations.",
    },
    {
      id: "faqs",
      title: "Frequently Asked Questions",
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-400">
          <li>
            <strong>Is NEXTskill free to use?</strong> – Yes, you can start with
            free assessments and roadmaps.
          </li>
          <li>
            <strong>Who is NEXTskill for?</strong> – Students, job seekers, and
            professionals aiming to grow or switch careers.
          </li>
          <li>
            <strong>What makes NEXTskill different?</strong> – Personalized
            AI-powered roadmaps, ATS-friendly resume analysis, and continuous
            progress tracking.
          </li>
          <li>
            <strong>How many questions are in each assessment?</strong> – 5
            adaptive questions per skill.
          </li>
          <li>
            <strong>Can I retake assessments?</strong> – Yes, retake anytime to
            refine your roadmap and monitor growth.
          </li>
          <li>
            <strong>How are roadmaps generated?</strong> – Based on your skills,
            goals, and assessment results.
          </li>
          <li>
            <strong>Can I modify my roadmap?</strong> – Absolutely, you can add
            or remove paths to fit your needs.
          </li>
          <li>
            <strong>How is progress tracked?</strong> – Directly on the roadmap
            page with completion percentages and milestones.
          </li>
          <li>
            <strong>What does the resume analyzer check?</strong> – Formatting,
            ATS compatibility, readability, and keyword coverage.
          </li>
          <li>
            <strong>Will NEXTskill recommend resume improvements?</strong> –
            Yes, suggestions for formatting, keywords, and readability are
            provided.
          </li>
        </ul>
      ),
    },
  ];
  return (
    <div className="min-h-screen bg-black text-white">
      <ShootingStarsAndStarsBackgroundDemo />
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            What is <span className="text-blue-400">NEXTskill</span>?
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
            Your AI-powered career accelerator.
          </p>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              NEXTskill helps you identify your strengths, generate tailored
              career roadmaps, validate your skills through assessments, and
              optimize your resume for maximum impact. From first login to job
              readiness, everything you need is in one place.
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/home")}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/roadmap")}
              className="px-8 py-4 bg-transparent border-2 border-gray-600 text-white hover:border-gray-400 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              Explore Roadmaps
            </button>
          </div>
        </div>
      </section>

      {/* Why NEXTskill Section */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why NEXTskill?
            </h2>
            <p className="text-xl text-gray-400">
              One platform for skills, roadmaps, and career growth
            </p>
          </div>

          {/* Why NEXTskill Section */}
          <section className="py-20 px-6 bg-gray-900/50">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {[
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Sign In & Get Started",
                    description:
                      "Quickly log in or create an account to begin your personalized skill development journey.",
                  },
                  ...valueProps,
                ].map((prop, index) => (
                  <div
                    key={index}
                    className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 group"
                  >
                    <div className="text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                      {prop.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{prop.title}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">Your journey step by step</p>
          </div>

          <div className="space-y-16">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="flex flex-col md:flex-row md:items-start gap-8"
              >
                {/* Step Number Circle */}
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {step.step}
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-blue-400">{step.icon}</div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Documentation & Guidance
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to use NEXTskill effectively
            </p>
          </div>

          <div className="space-y-4">
            {documentation.map((doc) => (
              <div
                key={doc.id}
                className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === doc.id ? null : doc.id)
                  }
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-blue-400">{doc.icon}</div>
                    <h3 className="text-xl font-semibold">{doc.title}</h3>
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 transition-transform ${
                      expandedFaq === doc.id ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedFaq === doc.id && (
                  <div className="px-6 pb-6">
                    <div className="pl-9 border-l-2 border-gray-700 ml-2">
                      <p className="text-gray-400 leading-relaxed">
                        {doc.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NEXTskillLanding;
