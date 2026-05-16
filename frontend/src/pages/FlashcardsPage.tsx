import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, ArrowRight, RotateCcw, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface Flashcard {
  front: string;
  back: string;
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    generateFlashcards();
  }, []);

  const generateFlashcards = async () => {
    try {
      setLoading(true);
      const text = sessionStorage.getItem('studyBuddyDocument') || "Provide general flashcards about computer science if no text is given.";
      const token = localStorage.getItem('studyBuddyToken');
      
      const formData = new FormData();
      formData.append('type', 'flashcards');
      formData.append('text', text);

      const res = await axios.post('http://localhost:5000/api/ai/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setFlashcards(res.data.flashcards);
    } catch (error) {
      console.error(error);
      alert('Failed to generate flashcards. Check API key limits.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(c => c + 1), 150);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(c => c - 1), 150);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center flex-col gap-4 text-white">
        <Loader2 className="animate-spin text-[#8b5cf6]" size={48} />
        <p className="text-xl font-medium animate-pulse">Forging your AI Flashcards...</p>
      </div>
    );
  }

  if (flashcards.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#050816] text-white p-10 relative overflow-hidden flex flex-col items-center justify-center perspective-[2000px]">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute top-10 left-10 z-20">
        <Link to="/dashboard" className="text-white/50 hover:text-white flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>

      <div className="absolute top-10 right-10 z-20 text-[#8b5cf6] font-bold text-xl glass px-6 py-2 rounded-full">
        {currentIndex + 1} / {flashcards.length}
      </div>

      <div className="w-full max-w-2xl h-[400px] relative mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative perspective-[2000px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              className="w-full h-full relative preserve-3d"
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden glass rounded-[3rem] p-12 flex items-center justify-center border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/5 to-[#8b5cf6]/5 rounded-[3rem]"></div>
                <h2 className="text-3xl font-bold text-center leading-relaxed relative z-10">
                  {flashcards[currentIndex].front}
                </h2>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 flex items-center gap-2 text-sm">
                  <RotateCcw size={16} /> Click to flip
                </div>
              </div>

              {/* Back */}
              <div 
                className="absolute inset-0 backface-hidden glass rounded-[3rem] p-12 flex flex-col items-center justify-center border-2 border-[#8b5cf6]/50 shadow-[0_0_50px_rgba(139,92,246,0.15)] bg-[#8b5cf6]/5"
                style={{ transform: "rotateY(180deg)" }}
              >
                <p className="text-2xl text-center leading-relaxed text-white/90">
                  {flashcards[currentIndex].back}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-6 mt-16 z-20">
        <button 
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="px-8 py-4 rounded-full glass hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Previous
        </button>
        <button 
          onClick={nextCard}
          disabled={currentIndex === flashcards.length - 1}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] font-bold disabled:opacity-30 transition-transform hover:scale-105 flex items-center gap-2"
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
