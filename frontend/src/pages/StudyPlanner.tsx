import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Loader2, BookOpen, Target, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface DayPlan {
  day: number;
  focus: string;
  tasks: string[];
}

export default function StudyPlanner() {
  const [purpose, setPurpose] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('7');
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const documentText = sessionStorage.getItem('studyBuddyDocument');

  const handleGenerate = async () => {
    if (!purpose.trim() || !subject.trim()) return;
    setLoading(true);
    setShowForm(false);

    try {
      const token = localStorage.getItem('studyBuddyToken');
      const text = documentText || 'General study material';

      const formData = new FormData();
      formData.append('type', 'plan');
      formData.append('text', text);
      formData.append('purpose', purpose);
      formData.append('subject', subject);
      formData.append('duration', duration);

      const res = await axios.post('http://localhost:5000/api/ai/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setPlan(res.data.days || []);
    } catch (error) {
      console.error(error);
      setPlan([]);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#8b5cf6]/10 to-transparent rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#0ea5e9]/10 to-transparent rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <header className="glass p-6 flex justify-between items-center relative z-20 border-b border-white/5">
        <Link to="/dashboard" className="text-white/50 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Calendar className="text-[#8b5cf6]" size={24} />
          <h1 className="text-xl font-bold">Study Planner</h1>
        </div>
        <div className="w-20"></div>
      </header>

      <div className="max-w-5xl mx-auto p-10">
        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 rounded-[2rem] border border-white/5 mb-10"
          >
            <h2 className="text-3xl font-bold mb-2">Create Your Study Plan</h2>
            <p className="text-white/50 mb-8">Tell us about your study goals and we'll generate a personalized plan.</p>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-white/80 mb-3 font-medium">
                  <Target size={18} className="text-[#8b5cf6]" /> What's your purpose?
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., Prepare for final exams, Learn a new topic..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-white/80 mb-3 font-medium">
                  <BookOpen size={18} className="text-[#0ea5e9]" /> Which subject?
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics, Computer Science, Physics..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#0ea5e9]/50 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-white/80 mb-3 font-medium">
                  <Clock size={18} className="text-[#14b8a6]" /> How many days?
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#14b8a6]/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="3" className="bg-[#050816]">3 Days - Quick Review</option>
                  <option value="5" className="bg-[#050816]">5 Days - Short Sprint</option>
                  <option value="7" className="bg-[#050816]">7 Days - Standard Plan</option>
                  <option value="14" className="bg-[#050816]">14 Days - Deep Dive</option>
                  <option value="30" className="bg-[#050816]">30 Days - Full Preparation</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!purpose.trim() || !subject.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] text-white font-bold rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 text-lg"
              >
                Generate My Study Plan ✨
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <Loader2 size={48} className="animate-spin text-[#8b5cf6]" />
            <p className="text-white/60 text-lg">Generating your personalized study plan...</p>
          </motion.div>
        )}

        {/* Plan Results */}
        {plan && plan.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div variants={item} className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">Your {duration}-Day Plan</h2>
                <p className="text-white/50">{subject} • {purpose}</p>
              </div>
              <button
                onClick={() => { setPlan(null); setShowForm(true); }}
                className="glass px-6 py-3 rounded-full text-sm text-white/60 hover:text-white transition-colors"
              >
                Create New Plan
              </button>
            </motion.div>

            {plan.map((day, i) => (
              <motion.div
                key={i}
                variants={item}
                className="glass p-8 rounded-[2rem] border border-white/5 hover:border-[#8b5cf6]/30 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center font-bold text-lg">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{day.focus}</h3>
                    <p className="text-white/40 text-sm">Day {day.day} of {duration}</p>
                  </div>
                </div>
                <ul className="space-y-3 ml-16">
                  {day.tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-3 text-white/70">
                      <span className="w-2 h-2 rounded-full bg-[#0ea5e9] mt-2 shrink-0"></span>
                      {task}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        )}

        {plan && plan.length === 0 && !loading && (
          <div className="text-center py-20 text-white/50">
            <p className="text-lg">Failed to generate a study plan. Please try again.</p>
            <button
              onClick={() => { setPlan(null); setShowForm(true); }}
              className="mt-4 glass px-6 py-3 rounded-full text-[#0ea5e9] hover:text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
