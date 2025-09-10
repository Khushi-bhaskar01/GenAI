// // ResumeAnalyzer.tsx
// import React, { useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   Tooltip,
//   Cell,
// } from "recharts";

// type ParsedResume = {
//   fileName: string;
//   text: string;
//   skills: Record<string, number>; // skill -> confidence 0-100
//   keywordsFound: string[];
//   keywordsMissing: string[];
//   atsScore: number; // 0-100
//   formattingIssues: string[];
//   suggestions: { id: string; category: string; severity: "Critical" | "Recommended" | "Optional"; text: string }[];
// };

// const MOCK_KEYWORDS = ["React", "TypeScript", "Node.js", "SQL", "System Design", "Algorithms"];

// const mockParseFile = async (file: File): Promise<ParsedResume> => {
//   // Mock parsing — replace this with real AI parsing call
//   await new Promise((r) => setTimeout(r, 700));
//   const fileName = file.name;
//   // simple random-ish mock results based on filename length
//   const seed = Math.min(90, Math.max(20, fileName.length * 7));
//   const skills = {
//     React: Math.min(100, seed + 10),
//     TypeScript: Math.max(20, seed - 10),
//     "Node.js": Math.max(10, seed - 30),
//     SQL: Math.max(5, seed - 50),
//     "System Design": Math.max(5, seed - 60),
//   };

//   const keywordsFound = MOCK_KEYWORDS.filter((k, i) => i % 2 === 0);
//   const keywordsMissing = MOCK_KEYWORDS.filter((k) => !keywordsFound.includes(k));

//   const atsScore = Math.round((Object.values(skills).reduce((a, b) => a + b, 0) / (Object.keys(skills).length * 100)) * 100);

//   const formattingIssues = seed % 3 === 0 ? ["Small inconsistent bullet styles", "Missing section headers"] : [];

//   const suggestions = [
//     {
//       id: "s1",
//       category: "Technical Skills",
//       severity: "Recommended" as const,
//       text: "Add explicit mentions of TypeScript & System Design in bullet points under projects.",
//     },
//     {
//       id: "s2",
//       category: "Formatting",
//       severity: "Optional" as const,
//       text: "Use consistent bullet symbols and increase line spacing for readability.",
//     },
//     {
//       id: "s3",
//       category: "Experience",
//       severity: "Critical" as const,
//       text: "Quantify impact for each project (e.g., \"Reduced latency by 30%\") if possible.",
//     },
//   ];

//   return {
//     fileName,
//     text: `Mocked extracted text for ${fileName}...`,
//     skills,
//     keywordsFound,
//     keywordsMissing,
//     atsScore: Math.min(100, Math.max(10, atsScore)),
//     formattingIssues,
//     suggestions,
//   };
// };

// const container = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.28 } } };

// const ResumeAnalyzer: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [parsing, setParsing] = useState(false);
//   const [parsed, setParsed] = useState<ParsedResume | null>(null);
//   const [dragOver, setDragOver] = useState(false);

//   const handleFile = async (f: File) => {
//     setFile(f);
//     setParsing(true);
//     const result = await mockParseFile(f);
//     setParsed(result);
//     setParsing(false);
//   };

//   const onDrop: React.DragEventHandler = (e) => {
//     e.preventDefault();
//     setDragOver(false);
//     const f = e.dataTransfer.files?.[0];
//     if (f) handleFile(f);
//   };

//   const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
//     const f = e.target.files?.[0];
//     if (f) handleFile(f);
//     e.currentTarget.value = "";
//   };

//   const downloadReport = () => {
//     if (!parsed) return;
//     const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${parsed.fileName.replace(/\.[^/.]+$/, "")}_resume_report.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const radarData = useMemo(() => {
//     if (!parsed) return [];
//     return Object.entries(parsed.skills).map(([skill, value]) => ({ skill, value }));
//   }, [parsed]);

//   const barData = useMemo(() => {
//     if (!parsed) return [];
//     return MOCK_KEYWORDS.map((k) => ({
//       keyword: k,
//       found: parsed.keywordsFound.includes(k) ? 1 : 0,
//     }));
//   }, [parsed]);

//   return (
//     <div className="max-w-6xl mx-auto mt-15 p-6 text-white">
//       <motion.div variants={container} initial="hidden" animate="show">
//         <h1 className="text-3xl font-bold">Resume Analyzer</h1>
//         <p className="text-gray-300 mt-2">Upload your resume (PDF/DOCX/TXT) and get instant AI-driven insights.</p>
//       </motion.div>

//       {/* Upload */}
//       <motion.div
//         variants={container}
//         className={`mt-6 p-6 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm transition-shadow ${
//           dragOver ? "ring-2 ring-blue-500/40 shadow-[0_8px_30px_rgba(168,85,247,0.06)]" : "shadow-md"
//         }`}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragOver(true);
//         }}
//         onDragLeave={() => setDragOver(false)}
//         onDrop={onDrop}
//       >
//         <div className="flex flex-col md:flex-row items-center gap-6">
//           <div className="flex-1">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-black font-semibold">
//                 <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
//                   <path d="M12 3v10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//                   <path d="M7 8l5-5 5 5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//                   <path d="M21 21H3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               </div>
//               <div>
//                 <div className="text-lg font-semibold">Drag & drop or upload your resume</div>
//                 <div className="text-sm text-gray-300">Supported: .pdf, .docx, .txt</div>
//               </div>
//             </div>
//             <div className="mt-4 flex items-center gap-3">
//               <label className="px-4 py-2 bg-blue-600 text-black rounded-lg cursor-pointer hover:opacity-95">
//                 <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={onSelectFile} />
//                 Choose file
//               </label>
//               {file && (
//                 <div className="text-sm text-gray-300">
//                   Selected: <span className="text-white font-medium">{file.name}</span>
//                 </div>
//               )}
//               {parsed && (
//                 <button onClick={downloadReport} className="ml-4 px-3 py-2 bg-white/5 rounded-md">
//                   Download Report
//                 </button>
//               )}
//             </div>
//             <div className="mt-3 text-sm text-gray-400">
//               This demo uses mocked parsing. Replace `mockParseFile` with your AI parsing / resume-parse API.
//             </div>
//           </div>

//           <div className="w-64">
//             <div className="rounded-lg p-3 bg-black/40 border border-white/6 text-center">
//               {parsing ? (
//                 <div className="text-sm text-gray-300">Analyzing resume…</div>
//               ) : parsed ? (
//                 <>
//                   <div className="text-xs text-gray-300">ATS Score</div>
//                   <div className="text-2xl font-semibold mt-1">{parsed.atsScore}%</div>
//                   <div className="w-full h-2 bg-white/6 rounded-full mt-3 overflow-hidden">
//                     <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${parsed.atsScore}%` }} />
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-sm text-gray-400">No resume uploaded</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Analysis grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
//         {/* Left: Skills radar + keywords bar */}
//         <motion.div variants={container} className="lg:col-span-2 bg-black/30 rounded-2xl p-6 border border-white/8">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold">Skills & Keyword Match</h3>
//             <div className="text-sm text-gray-300">{parsed ? parsed.fileName : "No file"}</div>
//           </div>

//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Radar chart for skills */}
//             <div className="h-64 bg-black/40 rounded-lg p-3">
//               {parsed ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
//                     <PolarGrid stroke="rgba(255,255,255,0.06)" />
//                     <PolarAngleAxis dataKey="skill" stroke="white" />
//                     <PolarRadiusAxis tick={false} axisLine={false} />
//                     <Radar name="Confidence" dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
//                   </RadarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="h-full flex items-center justify-center text-gray-400">Upload a resume to see skill radar</div>
//               )}
//             </div>

//             {/* Keywords found/missing */}
//             <div className="h-64 bg-black/40 rounded-lg p-3 flex flex-col">
//               <div className="text-sm text-gray-300">Keyword Match</div>
//               <div className="flex-1 mt-3 overflow-auto space-y-3">
//                 {parsed ? (
//                   <>
//                     <div>
//                       <div className="text-xs text-gray-300">Found</div>
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {parsed.keywordsFound.map((k) => (
//                           <span key={k} className="px-2 py-1 bg-green-600/20 text-green-300 rounded-full text-xs">
//                             {k}
//                           </span>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="mt-3">
//                       <div className="text-xs text-gray-300">Missing</div>
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {parsed.keywordsMissing.map((k) => (
//                           <span key={k} className="px-2 py-1 bg-red-600/20 text-red-300 rounded-full text-xs">
//                             {k}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-gray-400">Keywords will show here after analysis.</div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* small formatting issues */}
//           <div className="mt-4">
//             <h4 className="text-sm font-medium text-gray-200">Formatting & Readability</h4>
//             <div className="mt-2 text-sm text-gray-400">
//               {parsed ? (
//                 parsed.formattingIssues.length ? (
//                   <ul className="list-disc list-inside space-y-1">
//                     {parsed.formattingIssues.map((it, i) => (
//                       <li key={i}>{it}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="text-gray-300">No critical formatting issues found.</div>
//                 )
//               ) : (
//                 <div className="text-gray-500">Analysis will populate here.</div>
//               )}
//             </div>
//           </div>
//         </motion.div>

//         {/* Right column: Suggestions + actions */}
//         <motion.aside variants={container} className="bg-black/30 rounded-2xl p-6 border border-white/8">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold">Improvement Suggestions</h3>
//             <div className="text-xs text-gray-400">AI insights</div>
//           </div>

//           <div className="mt-4 space-y-3 max-h-[36rem] overflow-auto pr-2">
//             {parsed ? (
//               parsed.suggestions.map((s) => (
//                 <div key={s.id} className="p-3 rounded-lg bg-black/40 border border-white/6">
//                   <div className="flex items-start justify-between gap-2">
//                     <div>
//                       <div className="text-sm font-medium">{s.category}</div>
//                       <div className="text-gray-300 text-sm mt-1">{s.text}</div>
//                     </div>
//                     <div className="text-xs">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           s.severity === "Critical" ? "bg-red-600 text-white" : s.severity === "Recommended" ? "bg-yellow-500 text-black" : "bg-white/5 text-gray-200"
//                         }`}
//                       >
//                         {s.severity}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-gray-400">Upload a resume to receive personalized suggestions.</div>
//             )}
//           </div>

//           <div className="mt-6 flex flex-col gap-3">
//             <button
//               onClick={() => {
//                 // placeholder: connect to resume editor or roadmap
//                 const el = document.getElementById("roadmap");
//                 if (el) el.scrollIntoView({ behavior: "smooth" });
//               }}
//               className="px-3 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-black font-semibold"
//             >
//               Update Resume / Edit
//             </button>
//             <button
//               onClick={downloadReport}
//               className="px-3 py-2 rounded-md border border-white/10 text-gray-200"
//             >
//               Download JSON Report
//             </button>
//             <button
//               onClick={() => {
//                 // optional: show export to pdf flow (left as placeholder)
//                 alert("Export to PDF not implemented in demo. Use server-side rendering or client PDF lib.");
//               }}
//               className="px-3 py-2 rounded-md bg-white/5 text-gray-200"
//             >
//               Export as PDF
//             </button>
//           </div>
//         </motion.aside>
//       </div>

//       {/* Footer CTA / small notes */}
//       <div className="mt-6 text-sm text-gray-400">
//         Note: This demo uses mocked parsing for speed. Replace <code className="bg-white/5 px-1 rounded">mockParseFile</code> with an AI resume
//         parsing endpoint (e.g., Tika + NLP or an LLM-based parser) to extract real content, keywords, and suggestions.
//       </div>
//     </div>
//   );
// };

// export default ResumeAnalyzer;


import React, { useState, useRef, useCallback } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Upload, FileText, X, Download, Edit, AlertTriangle, CheckCircle, Target, Code, Palette, User, TrendingUp } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content?: string;
}

interface AnalysisData {
  atsScore: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  readabilityScore: number;
  formattingScore: number;
}

interface SkillData {
  skill: string;
  resumeLevel: number;
  marketDemand: number;
}

interface Suggestion {
  id: string;
  category: 'Technical Skills' | 'Formatting' | 'Experience' | 'Keywords';
  title: string;
  description: string;
  severity: 'Critical' | 'Recommended' | 'Optional';
  icon: React.ReactNode;
}

const ResumeAnalyzer: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for analysis
  const mockAnalysis: AnalysisData = {
    atsScore: 72,
    keywordsFound: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'Git'],
    keywordsMissing: ['Python', 'AWS', 'Docker', 'Kubernetes', 'MongoDB'],
    readabilityScore: 85,
    formattingScore: 68
  };

  const skillData: SkillData[] = [
    { skill: 'React', resumeLevel: 80, marketDemand: 90 },
    { skill: 'JavaScript', resumeLevel: 85, marketDemand: 95 },
    { skill: 'TypeScript', resumeLevel: 70, marketDemand: 85 },
    { skill: 'Python', resumeLevel: 20, marketDemand: 90 },
    { skill: 'AWS', resumeLevel: 30, marketDemand: 80 },
    { skill: 'Docker', resumeLevel: 15, marketDemand: 75 }
  ];

  const radarData = [
    { subject: 'Frontend', A: 85, B: 90, fullMark: 100 },
    { subject: 'Backend', A: 45, B: 80, fullMark: 100 },
    { subject: 'Database', A: 60, B: 75, fullMark: 100 },
    { subject: 'DevOps', A: 25, B: 70, fullMark: 100 },
    { subject: 'Mobile', A: 30, B: 65, fullMark: 100 },
    { subject: 'Testing', A: 55, B: 70, fullMark: 100 }
  ];

  const suggestions: Suggestion[] = [
    {
      id: '1',
      category: 'Technical Skills',
      title: 'Add Cloud Computing Skills',
      description: 'Include AWS, Azure, or GCP experience to match current market demands.',
      severity: 'Critical',
      icon: <Code className="w-5 h-5" />
    },
    {
      id: '2',
      category: 'Keywords',
      title: 'Include Industry Keywords',
      description: 'Add keywords like "Agile", "Microservices", and "CI/CD" to improve ATS scanning.',
      severity: 'Recommended',
      icon: <Target className="w-5 h-5" />
    },
    {
      id: '3',
      category: 'Formatting',
      title: 'Improve Section Headers',
      description: 'Use consistent formatting for section headers and bullet points.',
      severity: 'Recommended',
      icon: <Palette className="w-5 h-5" />
    },
    {
      id: '4',
      category: 'Experience',
      title: 'Quantify Achievements',
      description: 'Add metrics and numbers to demonstrate impact of your work.',
      severity: 'Critical',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: '5',
      category: 'Technical Skills',
      title: 'Add Database Experience',
      description: 'Include experience with SQL, MongoDB, or other database technologies.',
      severity: 'Optional',
      icon: <Code className="w-5 h-5" />
    }
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'text/plain')) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const uploadedFile: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type
    };
    
    setUploadedFile(uploadedFile);
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setAnalysisData(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setAnalysisData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'Recommended': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Optional': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical Skills': return <Code className="w-5 h-5 text-blue-400" />;
      case 'Formatting': return <Palette className="w-5 h-5 text-blue-400" />;
      case 'Experience': return <User className="w-5 h-5 text-blue-400" />;
      case 'Keywords': return <Target className="w-5 h-5 text-blue-400" />;
      default: return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen p-6 pt-25">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold text-white mb-4">
              Resume Analyzer
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-blue-400 rounded-full"></div>
          </div>
          <p className="text-gray-300 text-lg italic mt-6">
            Get AI-powered insights to optimize your resume for ATS systems
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <div
            className={`bg-black/40 rounded-2xl p-8 backdrop-blur-sm border-2 border-dashed transition-all duration-300 ${
              isDragOver 
                ? 'border-blue-400 bg-blue-400/5' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!uploadedFile ? (
              <div className="text-center">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-gray-300 mb-6">
                  Drag and drop your resume here, or click to browse
                </p>
                <div className="mb-4">
                  <span className="text-sm text-gray-400">
                    Supported formats: PDF, DOCX, TXT
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-blue-400 hover:bg-blue-500 text-black rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Choose File
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-12 h-12 text-blue-400" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{uploadedFile.name}</h4>
                    <p className="text-gray-400 text-sm">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="text-center mb-12">
            <div className="bg-black/40 rounded-2xl p-8 backdrop-blur-sm border border-gray-800/50">
              <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white text-lg">Analyzing your resume...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          </div>
        )}

        {/* Analysis Overview */}
        {analysisData && !isAnalyzing && (
          <div className="space-y-12">
            {/* Analysis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ATS Score */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <div className="text-center">
                  <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">ATS Score</h3>
                  <div className="text-4xl font-bold text-white mb-4">{analysisData.atsScore}%</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${analysisData.atsScore}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Applicant Tracking System compatibility</p>
                </div>
              </div>

              {/* Readability */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Readability</h3>
                  <div className="text-4xl font-bold text-white mb-4">{analysisData.readabilityScore}%</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${analysisData.readabilityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Content clarity and structure</p>
                </div>
              </div>

              {/* Formatting */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <div className="text-center">
                  <Palette className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Formatting</h3>
                  <div className="text-4xl font-bold text-white mb-4">{analysisData.formattingScore}%</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${analysisData.formattingScore}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Visual consistency and layout</p>
                </div>
              </div>
            </div>

            {/* Keywords Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Keywords Found */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Keywords Found
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisData.keywordsFound.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm border border-green-400/30"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Keywords Missing */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisData.keywordsMissing.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-400/10 text-red-400 rounded-full text-sm border border-red-400/30"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill Match Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <h3 className="text-xl font-semibold text-white mb-6 text-center">Skills Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <Radar name="Your Skills" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} strokeWidth={2} />
                    <Radar name="Market Demand" dataKey="B" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Your Skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                    <span className="text-gray-300">Market Demand</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <h3 className="text-xl font-semibold text-white mb-6 text-center">Skill Gap Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#ffffff', fontSize: 10 }} />
                    <YAxis dataKey="skill" type="category" tick={{ fill: '#ffffff', fontSize: 10 }} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Bar dataKey="resumeLevel" fill="#a855f7" name="Your Level" />
                    <Bar dataKey="marketDemand" fill="#6366f1" name="Market Demand" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
              <h3 className="text-2xl font-semibold text-white mb-8 text-center">Improvement Suggestions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    className="bg-black/30 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getCategoryIcon(suggestion.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white">{suggestion.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(suggestion.severity)}`}>
                            {suggestion.severity}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{suggestion.description}</p>
                        <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded-full">
                          {suggestion.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-300">
                <Download className="w-5 h-5" />
                Download Report
              </button>
              
              <button className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-400 hover:bg-blue-500 text-black rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                <Edit className="w-5 h-5" />
                Update Resume
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeAnalyzer;