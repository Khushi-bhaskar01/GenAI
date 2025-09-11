import React, { useState } from "react";
import {
  Target,
  BookOpen,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  FileText,
  HelpCircle,
  Map,
  BarChart3,
  Brain,
  Zap,
  Clock,
  Award,
} from "lucide-react";
import { ShootingStarsAndStarsBackgroundDemo } from "../component/starbackground";
import Navbar from "../component/NavbarLogin";
import NavbarLogin from "../component/Navbar";

const NEXTskillLanding: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const valueProps = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Skill Gap Identification",
      description:
        "AI-powered analysis identifies exactly what skills you need to advance in your career.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Personalized Assessments",
      description:
        "Tailored evaluations that adapt to your current skill level and career goals.",
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Learning Roadmaps",
      description:
        "Step-by-step paths designed specifically for your skill gaps and learning pace.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Resource Library",
      description:
        "Curated collection of courses, tutorials, and materials from top platforms.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Progress Tracking",
      description:
        "Real-time monitoring of your skill development with detailed analytics.",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Create Profile",
      description: "Share your current skills and career aspirations",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: 2,
      title: "Take Assessments",
      description: "Complete AI-powered skill evaluations",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      step: 3,
      title: "Get Analysis",
      description: "Receive detailed skill gap insights",
      icon: <Target className="w-6 h-6" />,
    },
    {
      step: 4,
      title: "Follow Roadmap",
      description: "Learn with your personalized path",
      icon: <Map className="w-6 h-6" />,
    },
    {
      step: 5,
      title: "Track Progress",
      description: "Monitor growth and stay aligned with market demands",
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  const documentation = [
    {
      id: "getting-started",
      title: "How to Get Started",
      icon: <Play className="w-5 h-5" />,
      content:
        "Create your profile, complete the initial skill assessment, and receive your first personalized roadmap within minutes.",
    },
    {
      id: "assessments",
      title: "Understanding Assessments",
      icon: <FileText className="w-5 h-5" />,
      content:
        "Our AI-driven assessments evaluate both technical and soft skills using adaptive questioning that adjusts to your responses.",
    },
    {
      id: "roadmaps",
      title: "Roadmaps & Learning Paths",
      icon: <Map className="w-5 h-5" />,
      content:
        "Personalized learning journeys that adapt based on your progress, time availability, and career objectives.",
    },
    {
      id: "faqs",
      title: "Frequently Asked Questions",
      icon: <HelpCircle className="w-5 h-5" />,
      content:
        "Find answers to common questions about assessments, roadmaps, pricing, and platform features.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
        <ShootingStarsAndStarsBackgroundDemo/>
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            What is <span className="text-blue-400">NEXTskill</span>?
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
            NEXTskill bridges the gap between your current skills and market
            demand.
          </p>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              NEXTskill is an AI-powered platform that evaluates your current
              skillset, identifies critical gaps in the market, and provides
              tailored learning roadmaps complete with assessments, curated
              resources, and continuous progress monitoring to ensure you stay
              competitive in today's rapidly evolving job market.
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105">
              Start Your Assessment
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-gray-600 text-white hover:border-gray-400 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105">
              Explore Platform
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
              Everything you need to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
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

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Your journey to skill mastery in 5 simple steps
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 transform md:-translate-x-1/2"></div>

            {/* Steps */}
            <div className="space-y-12">
              {howItWorks.map((step, index) => (
                <div
                  key={step.step}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-col md:gap-16`}
                >
                  {/* Step Number Circle */}
                  <div className="absolute left-0 md:left-1/2 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold transform md:-translate-x-1/2 z-10">
                    {step.step}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`flex-1 ml-24 md:ml-0 ${
                      index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                    }`}
                  >
                    <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-blue-400">{step.icon}</div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              Everything you need to know to get started
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

      {/* Features Highlight */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Platform Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered</h3>
              <p className="text-gray-400">
                Advanced algorithms analyze market trends and personalize your
                learning path
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Time-Efficient</h3>
              <p className="text-gray-400">
                Focus only on skills that matter most for your career
                advancement
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Industry-Aligned</h3>
              <p className="text-gray-400">
                Stay current with skills that employers are actively seeking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your NEXTskill Journey Starts Today
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers
            with personalized skill development
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              Take Your First Assessment
            </button>

            <button className="px-10 py-4 bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              <Map className="w-5 h-5" />
              Explore Roadmaps
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            No credit card required • Free assessment included
          </div>
        </div>
      </section>
    </div>
  );
};

export default NEXTskillLanding;
