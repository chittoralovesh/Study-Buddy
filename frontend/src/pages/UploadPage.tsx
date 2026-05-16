import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Loader2, ArrowLeft, BrainCircuit } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'file' | 'text'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file && !textInput) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('type', 'summary');
    if (mode === 'file' && file) {
      formData.append('file', file);
    } else {
      formData.append('text', textInput);
    }

    try {
      const token = localStorage.getItem('studyBuddyToken');
      const res = await axios.post('http://localhost:5000/api/ai/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Save summary to local storage temporarily to pass to the Summary Page
      // Save summary and the original extracted text for future quizzes/flashcards
      localStorage.setItem('studyBuddySummary', JSON.stringify(res.data));
      if (res.data.sourceText) {
        sessionStorage.setItem('studyBuddyDocument', res.data.sourceText);
      }
      
      navigate('/summary');
    } catch (error) {
      console.error('Error processing document', error);
      alert('Error processing document. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-10 relative overflow-hidden flex flex-col items-center">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-4xl flex items-center mb-10 z-10 relative">
        <Link to="/dashboard" className="text-white/50 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl glass p-10 rounded-[2rem] border border-[#0ea5e9]/20 relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Feed the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6]">AI Brain</span></h1>
          <p className="text-white/60">Upload your PDF syllabus or paste your notes to generate a smart summary instantly.</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl mb-8 w-fit mx-auto border border-white/10">
          <button 
            onClick={() => setMode('file')}
            className={`px-6 py-2 rounded-lg transition-all ${mode === 'file' ? 'bg-[#0ea5e9] text-white font-medium shadow-lg' : 'text-white/50 hover:text-white'}`}
          >
            PDF Document
          </button>
          <button 
            onClick={() => setMode('text')}
            className={`px-6 py-2 rounded-lg transition-all ${mode === 'text' ? 'bg-[#8b5cf6] text-white font-medium shadow-lg' : 'text-white/50 hover:text-white'}`}
          >
            Paste Text
          </button>
        </div>

        {mode === 'file' ? (
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-[#0ea5e9] bg-[#0ea5e9]/10 scale-[1.02]' 
                : file 
                  ? 'border-[#8b5cf6] bg-[#8b5cf6]/10' 
                  : 'border-white/20 hover:border-[#0ea5e9]/50 hover:bg-white/5'
            }`}
          >
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            {file ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center text-[#8b5cf6]">
                <FileText size={64} className="mb-4" />
                <p className="text-xl font-bold">{file.name}</p>
                <p className="text-sm opacity-70 mt-2">Ready to process ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center text-white/50">
                <UploadCloud size={64} className="mb-4 text-[#0ea5e9]" />
                <p className="text-xl font-medium mb-2 text-white">Drag & Drop your PDF here</p>
                <p className="text-sm">or click to browse from your computer</p>
              </div>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <textarea 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your syllabus or lecture notes here..."
              className="w-full h-64 bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-[#8b5cf6] transition-colors resize-none"
            />
          </motion.div>
        )}

        <div className="mt-10 flex justify-center">
          <button 
            disabled={loading || (mode === 'file' && !file) || (mode === 'text' && !textInput)}
            onClick={handleProcess}
            className="group relative px-12 py-4 bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] rounded-full text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden hover:scale-105 transition-transform"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <div className="relative flex items-center gap-3">
              {loading ? <Loader2 size={24} className="animate-spin" /> : <BrainCircuit size={24} />}
              {loading ? 'Analyzing Content...' : 'Generate Smart Summary'}
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
