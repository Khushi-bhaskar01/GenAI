import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Plus, X, Target, FileText, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Skill {
  id: string;
  name: string;
  progress: number;
}

interface RadarData {
  subject: string;
  value: number;
  fullMark: 100;
}

interface Improvement {
  id: string;
  skill: string;
  suggestion: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

const SkillMonitoringPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', progress: 75 },
    { id: '2', name: 'TypeScript', progress: 60 },
    { id: '3', name: 'Python', progress: 45 },
  ]);
  
  const [newSkill, setNewSkill] = useState('');
  const [animatedProgress, setAnimatedProgress] = useState<{ [key: string]: number }>({});

  const radarData: RadarData[] = [
    { subject: 'Frontend', value: 70, fullMark: 100 },
    { subject: 'Backend', value: 45, fullMark: 100 },
    { subject: 'Database', value: 55, fullMark: 100 },
    { subject: 'DevOps', value: 30, fullMark: 100 },
    { subject: 'Testing', value: 50, fullMark: 100 },
    { subject: 'Design', value: 40, fullMark: 100 },
  ];

  const improvements: Improvement[] = [
    { id: '1', skill: 'React', suggestion: 'Learn React Hooks and Context API', priority: 'High' },
    { id: '2', skill: 'Python', suggestion: 'Practice data structures and algorithms', priority: 'High' },
    { id: '3', skill: 'DevOps', suggestion: 'Get familiar with Docker and Kubernetes', priority: 'Medium' },
    { id: '4', skill: 'Testing', suggestion: 'Learn unit testing with Jest', priority: 'Medium' },
  ];

  const milestones: Milestone[] = [
    { id: '1', title: 'Started Learning', date: 'Jan 2024', completed: true },
    { id: '2', title: 'First Assessment Completed', date: 'Feb 2024', completed: true },
    { id: '3', title: 'Intermediate Level Reached', date: 'Mar 2024', completed: true },
    { id: '4', title: 'Advanced Project Built', date: 'Apr 2024', completed: false },
    { id: '5', title: 'Industry Certification', date: 'May 2024', completed: false },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const animated: { [key: string]: number } = {};
      skills.forEach(skill => {
        animated[skill.id] = skill.progress;
      });
      setAnimatedProgress(animated);
    }, 300);

    return () => clearTimeout(timer);
  }, [skills]);

  const addSkill = () => {
    if (newSkill.trim()) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.trim(),
        progress: Math.floor(Math.random() * 60) + 20,
      };
      setSkills([...skills, skill]);
      setNewSkill('');
    }
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
    const newAnimated = { ...animatedProgress };
    delete newAnimated[id];
    setAnimatedProgress(newAnimated);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-red-400 text-red-400';
      case 'Medium': return 'border-yellow-400 text-yellow-400';
      case 'Low': return 'border-green-400 text-green-400';
      default: return 'border-gray-400 text-gray-400';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 pt-25 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Upper Half */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Skill Input */}
          <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Add Your Skills
            </h2>
            
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a skill (e.g., JavaScript, Python)"
                className="flex-1 bg-black/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={addSkill}
                className="px-6 py-3 bg-transparent border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500/10 transition-all duration-300 font-semibold"
              >
                Add
              </button>
            </div>

            {/* Skills List */}
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-3 border border-gray-700/50 animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <span className="text-white font-medium">{skill.name}</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Quick Actions */}
          <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Quick Actions
            </h2>
            
            <div className="space-y-4">
              <button onClick={()=>{navigate("/assessment")}} className="w-full py-4 px-6 bg-transparent border-2 border-blue-500 text-white rounded-xl hover:bg-blue-500/10 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3">
                <FileText className="w-6 h-6" />
                Take Assessment
              </button>
              
              <button onClick={()=>{navigate("/resume")}} className="w-full py-4 px-6 bg-black/30 border border-gray-600 text-white rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3">
                <TrendingUp className="w-6 h-6" />
                Resume Analyzer
              </button>
            </div>
          </div>
        </div>

        {/* Lower Half */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Analysis Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Overview */}
            <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
              <h3 className="text-xl font-bold text-white mb-6">Skill Overview & Analysis</h3>
              
              <div className="space-y-4 mb-8">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-gray-400 text-sm">{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${animatedProgress[skill.id] || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Radar Chart */}
              <div className="h-80">
                <h4 className="text-lg font-semibold text-white mb-4">Skill Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff', fontSize: 12 }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#3b82f6' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* What to Improve Section */}
            <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
              <h3 className="text-xl font-bold text-white mb-6">What to Improve</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {improvements.map((item) => (
                  <div key={item.id} className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{item.skill}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{item.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Tracking Section */}
          <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-6">Progress Tracking</h3>
            
            <div className="relative">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-start gap-4 relative">
                  <div className="flex flex-col items-center relative z-10">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      milestone.completed 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-600 bg-transparent'
                    }`} />
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className={`font-medium ${milestone.completed ? 'text-white' : 'text-gray-400'}`}>
                      {milestone.title}
                    </h4>
                    <p className="text-gray-500 text-sm">{milestone.date}</p>
                  </div>
                  {/* Connecting line */}
                  {index < milestones.length - 1 && (
                    <div 
                      className={`absolute left-2 top-4 w-0.5 h-full ${
                        milestones[index + 1].completed ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                      style={{ transform: 'translateX(-50%)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SkillMonitoringPage;
