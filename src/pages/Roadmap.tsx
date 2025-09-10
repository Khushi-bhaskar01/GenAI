import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Play, CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface RoadmapStep {
  title: string;
  description: string;
  timeAllocation: string;
  status: 'completed' | 'current' | 'upcoming';
  tasks: string[];
  color: string;
}

interface Resource {
  id: string;
  name: string;
  platform: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Course' | 'Tutorial' | 'Book' | 'Practice';
}

const RoadmapPage: React.FC = () => {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);

  const roadmapData: RoadmapStep[] = [
    {
      title: "Foundation",
      description: "Master the fundamentals and core concepts",
      timeAllocation: "2-4 weeks",
      status: "completed",
      tasks: ["Learn basic syntax", "Understand data structures", "Practice problem solving"],
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Skill Development",
      description: "Build practical skills through hands-on projects",
      timeAllocation: "6-8 weeks",
      status: "current",
      tasks: ["Complete 3 projects", "Join online communities", "Get peer feedback"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Advanced Topics",
      description: "Dive deep into specialized areas of expertise",
      timeAllocation: "4-6 weeks",
      status: "upcoming",
      tasks: ["Study advanced concepts", "Build complex applications", "Contribute to open source"],
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "Portfolio Creation",
      description: "Showcase your work and create a professional presence",
      timeAllocation: "2-3 weeks",
      status: "upcoming",
      tasks: ["Build portfolio website", "Document your projects", "Create compelling case studies"],
      color: "from-sky-500 to-blue-500"
    },
    {
      title: "Job Preparation",
      description: "Prepare for interviews and job applications",
      timeAllocation: "3-4 weeks",
      status: "upcoming",
      tasks: ["Practice technical interviews", "Update resume", "Apply to positions"],
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "Career Launch",
      description: "Land your dream job and continue growing",
      timeAllocation: "Ongoing",
      status: "upcoming",
      tasks: ["Start new position", "Set performance goals", "Plan continuous learning"],
      color: "from-cyan-500 to-blue-400"
    }
  ];

  const resources: Resource[] = [
    {
      id: '1',
      name: 'Complete Web Development Course',
      platform: 'Udemy',
      difficulty: 'Beginner',
      type: 'Course'
    },
    {
      id: '2',
      name: 'Advanced JavaScript Patterns',
      platform: 'Frontend Masters',
      difficulty: 'Advanced',
      type: 'Course'
    },
    {
      id: '3',
      name: 'React Documentation',
      platform: 'Official Docs',
      difficulty: 'Intermediate',
      type: 'Tutorial'
    },
    {
      id: '4',
      name: 'Clean Code Handbook',
      platform: 'Book Store',
      difficulty: 'Intermediate',
      type: 'Book'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSteps(prev => {
        if (prev < roadmapData.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'current':
        return <AlertCircle className="w-5 h-5 text-white" />;
      case 'upcoming':
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'current':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Upcoming';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-gray-300 bg-gray-800 border-gray-600';
      case 'Intermediate':
        return 'text-gray-300 bg-gray-800 border-gray-600';
      case 'Advanced':
        return 'text-gray-300 bg-gray-800 border-gray-600';
      default:
        return 'text-gray-300 bg-gray-800 border-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Course':
        return <Play className="w-4 h-4" />;
      case 'Tutorial':
        return <BookOpen className="w-4 h-4" />;
      case 'Book':
        return <BookOpen className="w-4 h-4" />;
      case 'Practice':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const nextStep = roadmapData.find(step => step.status === 'current') ||
                  roadmapData.find(step => step.status === 'upcoming');

  return (
    <div className="min-h-screen p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold text-white mb-4">
              Your Learning Roadmap
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-blue-400 rounded-full"></div>
          </div>
          <p className="text-gray-300 text-lg italic mt-6">
            A personalized journey to close your skill gap.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Roadmap Timeline */}
          <div className="lg:col-span-3">
            <div className="relative">
              <div className="absolute left-8 top-8 w-0.5 bg-gray-700" style={{ height: `${(roadmapData.length - 1) * 200}px` }}></div>

              <div className="space-y-8">
                {roadmapData.map((step, index) => (
                  <div
                    key={index}
                    className={`relative transition-all duration-500 ease-out transform ${
                      index < visibleSteps
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Step Number Circle */}
                    <div className="absolute left-0 flex items-center justify-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                        step.status === 'completed' ? 'bg-white border-white' :
                        step.status === 'current' ? 'bg-blue-400 border-blue-400' : 'bg-gray-800 border-gray-600'
                      }`}>
                        <span className={`font-bold text-lg ${
                          step.status === 'completed' ? 'text-black' : 'text-white'
                        }`}>{index + 1}</span>
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className="ml-24 bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50 hover:border-gray-700 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(step.status)}
                          <span className="text-sm text-gray-300">{getStatusText(step.status)}</span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{step.description}</p>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-gray-600 bg-gray-800/50">
                          <Clock className="w-3 h-3 text-gray-300" />
                          <span className="text-gray-300">{step.timeAllocation}</span>
                        </span>
                      </div>

                      {/* Tasks */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-300">Tasks:</h4>
                        <ul className="space-y-1">
                          {step.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="text-sm text-gray-400 flex items-center gap-2">
                              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resource Recommendations Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50 mb-8">
                <h3 className="text-xl font-bold text-white mb-6">Recommended Resources</h3>

                <div className="space-y-4">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-black/30 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white text-sm group-hover:text-gray-300 transition-colors">
                          {resource.name}
                        </h4>
                        {getTypeIcon(resource.type)}
                      </div>

                      <p className="text-gray-400 text-xs mb-3">{resource.platform}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full border bg-blue-400 ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                      </div>

                      <button className="w-full px-3 py-2 text-xs bg-blue-500 text-gray-300 rounded-md hover:bg-blue-800 transition-colors">
                        Save to Roadmap
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Step Highlight */}
        {nextStep && (
          <div className="mt-12">
            <div className="bg-black/60 rounded-2xl p-8 backdrop-blur-sm border-2 border-blue-400 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Ready for Your Next Challenge?</h3>
                  <p className="text-gray-300">Continue your learning journey with the next step</p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 mb-6">
                  <h4 className="text-xl font-semibold text-white mb-2">{nextStep.title}</h4>
                  <p className="text-gray-300 mb-4">{nextStep.description}</p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-gray-600 bg-gray-800/50">
                      <Clock className="w-4 h-4 text-gray-300" />
                      <span className="text-gray-300">{nextStep.timeAllocation}</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-gray-300">Tasks to complete:</h5>
                    <ul className="space-y-1">
                      {nextStep.tasks.map((task, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <button className="px-8 py-4 bg-blue-400 hover:bg-blue-500 text-black rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105">
                    Start This Step
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;

