import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Loader2, ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      const text = sessionStorage.getItem('studyBuddyDocument') || "Provide a general quiz about computer science if no text is given.";
      const token = localStorage.getItem('studyBuddyToken');
      
      const formData = new FormData();
      formData.append('type', 'quiz');
      formData.append('text', text);

      const res = await axios.post('http://localhost:5000/api/ai/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setQuestions(res.data.questions);
    } catch (error) {
      console.error(error);
      alert('Failed to generate quiz. Check API key limits.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);

    if (idx === questions[currentQ].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center flex-col gap-4 text-white">
        <Loader2 className="animate-spin text-[#0ea5e9]" size={48} />
        <p className="text-xl font-medium animate-pulse">Generating your adaptive quiz...</p>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-[#050816] text-white p-10 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#0ea5e9]/20 to-[#8b5cf6]/20 rounded-full blur-[150px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="glass p-12 rounded-[3rem] text-center max-w-2xl w-full z-10"
        >
          <Trophy size={80} className="mx-auto mb-6 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
          <h1 className="text-5xl font-black mb-4">Quiz Completed!</h1>
          <p className="text-2xl text-white/70 mb-8">You scored <span className="text-[#0ea5e9] font-bold">{score}</span> out of {questions.length}</p>
          
          <div className="flex justify-center gap-6">
            <Link to="/dashboard" className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-lg font-medium">
              Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="min-h-screen bg-[#050816] text-white p-10 relative overflow-hidden flex flex-col items-center">
      <div className="w-full max-w-3xl flex justify-between items-center mb-10 z-10">
        <Link to="/dashboard" className="text-white/50 hover:text-white flex items-center gap-2">
          <ArrowLeft size={20} /> Exit Quiz
        </Link>
        <div className="glass px-4 py-2 rounded-full font-bold text-[#8b5cf6]">
          Question {currentQ + 1} of {questions.length}
        </div>
        <div className="font-bold text-[#0ea5e9]">
          Score: {score}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQ}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="w-full max-w-3xl glass p-10 rounded-[2rem] relative z-10"
        >
          <h2 className="text-3xl font-bold mb-10 leading-relaxed">{q.question}</h2>

          <div className="space-y-4">
            {q.options.map((opt, idx) => {
              let btnClass = "border-white/10 hover:border-[#0ea5e9]/50 hover:bg-white/5";
              let icon = null;

              if (showResult) {
                if (idx === q.correctAnswer) {
                  btnClass = "border-green-500 bg-green-500/10 text-green-400";
                  icon = <CheckCircle size={24} className="text-green-500" />;
                } else if (idx === selected) {
                  btnClass = "border-red-500 bg-red-500/10 text-red-400";
                  icon = <XCircle size={24} className="text-red-500" />;
                } else {
                  btnClass = "border-white/5 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex justify-between items-center ${btnClass}`}
                >
                  <span className="text-lg">{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {showResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-8 p-6 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 rounded-2xl"
            >
              <h3 className="font-bold text-[#0ea5e9] flex items-center gap-2 mb-2">
                <BrainCircuit size={20} /> Explanation
              </h3>
              <p className="text-white/80 leading-relaxed">{q.explanation}</p>
              
              <button 
                onClick={nextQuestion}
                className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
              >
                {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
