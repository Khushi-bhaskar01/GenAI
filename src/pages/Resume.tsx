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
} from "firebase/firestore";
import type { User } from "firebase/auth";

// Initialize storage
const storage = getStorage();

// Real AI analysis function - calls your Python backend
const analyzeResume = async (userId: string) => {
  try {
    const response = await fetch("https://cv-erpv.onrender.com/analyze-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Backend analysis result:", result);

    return result.analysis;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Analysis error:", error.message);
    } else {
      console.error("Unknown analysis error:", error);
    }
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
          oldStoragePath: docData.resumeFile?.storagePath,
        };

        setResume(resumeData);
        const mockFile = new File([""], resumeData.name, { type: resumeData.type });
        Object.defineProperty(mockFile, "size", { value: resumeData.size });
        setUploadedFile(mockFile);
      } else {
        setResume(null);
        setUploadedFile(null);
      }
    });

    const userDocRef = doc(db, "user", user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if (userData.resume) {
          console.log("Analysis data from Firestore:", userData.resume);
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
          storagePath,
        };

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
              if (error instanceof Error) {
                console.warn("Could not delete old file:", error.message);
              } else {
                console.warn("Unknown error deleting old file:", error);
              }
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

        setIsAnalyzing(true);
        try {
          await analyzeResume(user.uid);
        } catch (error) {
          if (error instanceof Error) {
            console.error("Analysis failed:", error.message);
            setAnalysisError(`Analysis failed: ${error.message}`);
          } else {
            console.error("Unknown analysis error:", error);
            setAnalysisError("Analysis failed: Unknown error");
          }
        } finally {
          setIsAnalyzing(false);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Upload failed:", error.message);
        } else {
          console.error("Unknown upload error:", error);
        }
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

  const triggerAnalysis = async () => {
    if (!user) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      await analyzeResume(user.uid);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Analysis failed:", error.message);
        setAnalysisError(`Analysis failed: ${error.message}`);
      } else {
        console.error("Unknown analysis error:", error);
        setAnalysisError("Analysis failed: Unknown error");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pt-8 bg-gradient-to-br from-slate-900 via-slate-900 to-black-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white flex items-center gap-3">
          <FileText className="w-10 h-10 text-blue-400" />
          Resume Analyzer
        </h1>

        {/* Upload Section */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 mb-8 text-center transition-colors ${
            dragOver ? "border-blue-400 bg-blue-400/10" : "border-slate-700 bg-slate-800/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <p className="text-slate-300">
            Drag and drop your resume here, or click to browse
          </p>
          <p className="text-slate-500 text-sm mt-2">Supports PDF, DOC, DOCX</p>
        </div>

        {/* Status */}
        {isUploading && (
          <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Uploading your resume...
          </div>
        )}

        {uploadStatus === "success" && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Resume uploaded successfully!
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Upload failed. Please try again.
          </div>
        )}

        {/* Resume Preview */}
        {uploadedFile && resume && (
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-white font-medium">{resume.name}</h3>
                  <p className="text-slate-400 text-sm">
                    {(resume.size / 1024 / 1024).toFixed(2)} MB •{" "}
                    {resume.type.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5 text-slate-400" />
                </a>
                <a
                  href={resume.url}
                  download
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 text-slate-400" />
                </a>
                <button
                  onClick={triggerAnalysis}
                  disabled={isAnalyzing}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-5 h-5 text-slate-400 ${
                      isAnalyzing ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {analysisError && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {analysisError}
          </div>
        )}

        {/* Analysis */}
        {isAnalyzing && (
          <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Analyzing your resume...
          </div>
        )}

        {analysisData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scores */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Scores
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-300">
                  <span>ATS Score:</span>
                  <span className="text-white font-medium">
                    {analysisData.Analysis.atsScore}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Content Score:</span>
                  <span className="text-white font-medium">
                    {analysisData.Analysis.contentScore}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Formatting Score:</span>
                  <span className="text-white font-medium">
                    {analysisData.Analysis.formattingScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" />
                Keywords
              </h3>
              <div className="mb-4">
                <p className="text-slate-400 text-sm mb-2">Found:</p>
                <div className="flex flex-wrap gap-2">
                  {analysisData.Analysis.keywordsFound.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-lg bg-green-500/10 text-green-400 border border-green-500/20"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Missing:</p>
                <div className="flex flex-wrap gap-2">
                  {analysisData.Analysis.keywordsMissing.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="md:col-span-2 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Suggestions
              </h3>
              <div className="space-y-3">
                {analysisData.suggestions.map((sug, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-slate-900/50 border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        {sug.severity === "high" && (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        )}
                        {sug.severity === "medium" && (
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        )}
                        {sug.severity === "low" && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                        {sug.title}
                      </h4>
                      <span className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-400">
                        {sug.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{sug.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
