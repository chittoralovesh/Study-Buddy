import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, BookOpen, Clock, BrainCircuit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SummaryPage() {
  const [summary, setSummary] = useState<{title: string, overview: string, keyPoints: string[]} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('studyBuddySummary');
    if (data) {
      setSummary(JSON.parse(data));
    } else {
      navigate('/upload');
    }
  }, [navigate]);

  if (!summary) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-10 relative overflow-hidden flex flex-col items-center">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8b5cf6]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-5xl flex justify-between items-center mb-12 z-10 relative">
        <Link to="/upload" className="text-white/50 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Upload another file
        </Link>
        <div className="glass px-4 py-2 rounded-full border border-[#0ea5e9]/30 text-[#0ea5e9] flex items-center gap-2 text-sm">
          <Sparkles size={16} /> AI Generated Summary
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-5xl relative z-10"
      >
        {/* Header section */}
        <motion.div variants={item} className="mb-12">
          <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 leading-tight">
            {summary.title}
          </h1>
          <div className="glass p-8 rounded-[2rem] border-l-4 border-l-[#0ea5e9] bg-[#0ea5e9]/5">
            <p className="text-xl text-white/80 leading-relaxed font-light">
              {summary.overview}
            </p>
          </div>
        </motion.div>

        {/* Key Takeaways Grid */}
        <motion.h2 variants={item} className="text-2xl font-bold mb-6 flex items-center gap-3">
          <BrainCircuit className="text-[#8b5cf6]" /> Key Takeaways
        </motion.h2>

        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {summary.keyPoints.map((point, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="glass p-6 rounded-2xl border border-white/5 hover:border-[#8b5cf6]/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#0ea5e9] to-[#8b5cf6] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-4xl font-black text-white/5 absolute -top-4 -right-4 pointer-events-none select-none">
                {index + 1}
              </div>
              <p className="text-lg text-white/80 leading-relaxed relative z-10">{point}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Bar */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
          <button 
            onClick={() => navigate('/flashcards')}
            className="px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-lg font-medium transition-all flex items-center justify-center gap-3"
          >
            <BookOpen size={20} /> Generate Flashcards
          </button>
          <button 
            onClick={() => navigate('/quiz')}
            className="px-10 py-4 bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] rounded-full text-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(14,165,233,0.3)]"
          >
            <Clock size={20} /> Take a Quick Quiz
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
