import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  FileText,
  X,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Target,
  Palette,
  AlertTriangle,
  Download,
  Edit,
  Lightbulb,
  Eye,
} from "lucide-react";
import { auth, db } from "../firebase/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  updateDoc,
  doc,
  getDocs,
  getDoc
} from "firebase/firestore";
import type { User } from "firebase/auth";

// Initialize storage
const storage = getStorage();

// Real AI analysis function - calls your Python backend
const analyzeResume = async (userId: string) => {
  try {
    const response = await fetch('https://cv-erpv.onrender.com/analyze-cv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId
      }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Backend analysis result:', result);
    
    return result.analysis;
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};

interface ResumeData {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: any;
  updatedAt: any;
  oldStoragePath?: string;
}

interface AnalysisData {
  Analysis: {
    atsScore: string;
    contentScore: string;
    formattingScore: string;
    keywordsFound: string[];
    keywordsMissing: string[];
  };
  suggestions: Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    severity: string;
  }>;
}

const ResumeAnalyzer = () => {
  const [user, setUser] = useState<User | null>(null);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | "">("");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch existing resume and analysis when user changes
  useEffect(() => {
    if (!user) {
      setResume(null);
      setUploadedFile(null);
      setAnalysisData(null);
      return;
    }

    // Listen to resume changes
    const resumeQuery = query(
      collection(db, "resumes"),
      where("uid", "==", user.uid),
      orderBy("uploadedAt", "desc"),
      limit(1)
    );

    const unsubscribeResume = onSnapshot(resumeQuery, (snapshot) => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        const docId = snapshot.docs[0].id;

        const resumeData: ResumeData = {
          id: docId,
          name: docData.resumeFile?.name || "",
          size: docData.resumeFile?.size || 0,
          type: docData.resumeFile?.type || "",
          url: docData.resumeFile?.url || "",
          uploadedAt: docData.uploadedAt,
          updatedAt: docData.updatedAt,
          oldStoragePath: docData.resumeFile?.storagePath
        };

        setResume(resumeData);
        const mockFile = new File([''], resumeData.name, { type: resumeData.type });
        Object.defineProperty(mockFile, 'size', { value: resumeData.size });
        setUploadedFile(mockFile);
      } else {
        setResume(null);
        setUploadedFile(null);
      }
    });

    // Listen to analysis changes from user collection
    const userDocRef = doc(db, "user", user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if (userData.resume) {
          console.log('Analysis data from Firestore:', userData.resume);
          setAnalysisData(userData.resume);
          setAnalysisError(null);
        }
      }
    });

    return () => {
      unsubscribeResume();
      unsubscribeUser();
    };
  }, [user]);

  // File upload handler
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file || !user) return;
      
      setIsUploading(true);
      setUploadStatus("");
      setAnalysisData(null);
      setAnalysisError(null);

      try {
        // Upload file to Firebase Storage
        const timestamp = Date.now();
        const storagePath = `resumes/${user.uid}/${timestamp}_${file.name}`;
        const storageRef = ref(storage, storagePath);

        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          url,
          storagePath
        };

        // Update or create resume document
        const existingResumeQuery = query(
          collection(db, "resumes"),
          where("uid", "==", user.uid)
        );
        
        const existingResumes = await getDocs(existingResumeQuery);
        
        if (!existingResumes.empty) {
          const existingDoc = existingResumes.docs[0];
          const existingData = existingDoc.data();
          
          if (existingData.resumeFile?.storagePath) {
            try {
              const oldFileRef = ref(storage, existingData.resumeFile.storagePath);
              await deleteObject(oldFileRef);
            } catch (error) {
              console.warn('Could not delete old file:', error);
            }
          }

          await updateDoc(doc(db, "resumes", existingDoc.id), {
            resumeFile: fileData,
            updatedAt: new Date(),
          });
        } else {
          const docData = {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            resumeFile: fileData,
            uploadedAt: new Date(),
            updatedAt: new Date(),
          };

          await addDoc(collection(db, "resumes"), docData);
        }

        setUploadedFile(file);
        setUploadStatus("success");

        // Start analysis with backend
        setIsAnalyzing(true);
        try {
          const analysis = await analyzeResume(user.uid);
          console.log('Received analysis:', analysis);
          // Analysis will be updated via Firestore listener
        } catch (analysisError) {
          console.error('Analysis failed:', analysisError);
          setAnalysisError(`Analysis failed: ${analysisError.message}`);
        } finally {
          setIsAnalyzing(false);
        }

      } catch (error) {
        console.error("Upload failed:", error);
        setUploadStatus("error");
        setIsUploading(false);
      } finally {
        if (uploadStatus !== "error") {
          setIsUploading(false);
        }
        setTimeout(() => setUploadStatus(""), 3000);
      }
    },
    [user]
  );

  // Trigger analysis for existing resume
  const triggerAnalysis = async () => {
    if (!user) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      await analyzeResume(user.uid);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisError(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.type === 'application/pdf' || file.type.includes('document') || file.type === 'text/plain')) {
        handleFileUpload(file);
      } else {
        alert("Please upload a PDF, Word document, or TXT file.");
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = async () => {
    if (!user || !resume) return;

    try {
      if (resume.oldStoragePath) {
        const storageRef = ref(storage, resume.oldStoragePath);
        await deleteObject(storageRef);
      }

      await updateDoc(doc(db, "resumes", resume.id), {
        resumeFile: null,
        updatedAt: new Date(),
      });

      setResume(null);
      setUploadedFile(null);
      setAnalysisData(null);
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2);
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'low':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconClass = "w-6 h-6 text-blue-400";
    switch (category.toLowerCase()) {
      case 'keywords':
        return <Target className={iconClass} />;
      case 'formatting':
      case 'format':
        return <Palette className={iconClass} />;
      case 'content':
        return <FileText className={iconClass} />;
      case 'structure':
        return <Eye className={iconClass} />;
      default:
        return <Lightbulb className={iconClass} />;
    }
  };

  return (
    <div className="min-h-screen p-6 pt-8 bg-gradient-to-br from-slate-900 via-slate-900 to-black-900">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold text-white mb-4">
              Resume Analyzer
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-black-400 rounded-full"></div>
          </div>
          <p className="text-gray-300 text-lg italic mt-6">
            Get AI-powered insights to optimize your resume for ATS systems
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <div
            className={`bg-black/40 rounded-2xl p-8 backdrop-blur-sm border-2 border-dashed transition-all duration-300 ${
              dragOver 
                ? 'border-blue-400 bg-blue-400/5' 
                : 'border-gray-600 hover:border-gray-500'
            } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleFileDrop}
          >
            {isUploading ? (
              <div className="text-center">
                <RefreshCw className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Uploading your resume...
                </h3>
                <p className="text-gray-300">
                  Please wait while we process your file
                </p>
              </div>
            ) : !uploadedFile ? (
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
                    Supported formats: PDF, DOCX, TXT • Max 10MB
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.doc"
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
                    <p className="text-gray-400 text-sm">{formatFileSize(uploadedFile.size)} MB</p>
                    {resume && resume.uploadedAt && (
                      <p className="text-gray-500 text-xs">
                        {resume.updatedAt && resume.updatedAt !== resume.uploadedAt 
                          ? `Updated: ${formatDate(resume.updatedAt)}`
                          : `Uploaded: ${formatDate(resume.uploadedAt)}`
                        }
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {resume?.url && (
                    <a
                      href={resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View
                    </a>
                  )}
                  {!isAnalyzing && !analysisData && (
                    <button
                      onClick={triggerAnalysis}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Analyze
                    </button>
                  )}
                  <button
                    onClick={removeFile}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {uploadStatus && (
          <div className={`mb-8 p-4 rounded-lg flex items-center space-x-3 ${
            uploadStatus === "success" 
              ? "bg-green-900/30 border border-green-500/30" 
              : "bg-red-900/30 border border-red-500/30"
          }`}>
            {uploadStatus === "success" ? (
              <>
                <CheckCircle className="text-green-400" size={20} />
                <p className="text-green-300">
                  {resume ? "Resume updated successfully!" : "Resume uploaded successfully!"}
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="text-red-400" size={20} />
                <p className="text-red-300">Upload failed. Please try again.</p>
              </>
            )}
          </div>
        )}

        {/* Analysis Error */}
        {analysisError && (
          <div className="mb-8 p-4 rounded-lg flex items-center space-x-3 bg-red-900/30 border border-red-500/30">
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-300">{analysisError}</p>
            <button
              onClick={triggerAnalysis}
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="text-center mb-12">
            <div className="bg-black/40 rounded-2xl p-8 backdrop-blur-sm border border-gray-800/50">
              <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white text-lg">Analyzing your resume with AI...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisData && !isAnalyzing && (
          <div className="space-y-12">
            {/* Analysis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ATS Score */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <div className="text-center">
                  <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">ATS Score</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    {analysisData.Analysis?.atsScore || '0'}%
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${analysisData.Analysis?.atsScore || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Applicant Tracking System compatibility</p>
                </div>
              </div>

              {/* Content Score */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Content Score</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    {analysisData.Analysis?.contentScore || '0'}%
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${analysisData.Analysis?.contentScore || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Content quality and relevance</p>
                </div>
              </div>

              {/* Formatting Score */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <div className="text-center">
                  <Palette className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Formatting</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    {analysisData.Analysis?.formattingScore || '0'}%
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${analysisData.Analysis?.formattingScore || 0}%` }}
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
                  {(analysisData.Analysis?.keywordsFound || []).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm border border-green-400/30"
                    >
                      {keyword}
                    </span>
                  ))}
                  {(!analysisData.Analysis?.keywordsFound || analysisData.Analysis.keywordsFound.length === 0) && (
                    <span className="text-gray-400 text-sm">No keywords identified yet</span>
                  )}
                </div>
              </div>

              {/* Keywords Missing */}
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(analysisData.Analysis?.keywordsMissing || []).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-400/10 text-red-400 rounded-full text-sm border border-red-400/30"
                    >
                      {keyword}
                    </span>
                  ))}
                  {(!analysisData.Analysis?.keywordsMissing || analysisData.Analysis.keywordsMissing.length === 0) && (
                    <span className="text-gray-400 text-sm">No missing keywords identified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            {analysisData.suggestions && analysisData.suggestions.length > 0 && (
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-800/50">
                <h3 className="text-2xl font-semibold text-white mb-8 text-center">Improvement Suggestions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisData.suggestions.map((suggestion, index) => (
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
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-black-400 hover:bg-black-500 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Edit className="w-5 h-5" />
                Reload to Upload NEW
              </button>
            </div>
          </div>
        )}

        {/* User Status */}
        {!user && (
          <div className="fixed bottom-4 right-4 p-4 bg-red-900/80 border border-red-500/30 rounded-lg shadow-lg backdrop-blur-sm">
            <p className="text-red-300 text-sm">Please log in to save your resume</p>
          </div>
        )}
      </div>

      <style>{`
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