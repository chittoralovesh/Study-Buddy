import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, BrainCircuit, Calendar, LineChart, MessageSquare, LogOut, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<{username: string, email: string} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('studyBuddyUser');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studyBuddyToken');
    localStorage.removeItem('studyBuddyUser');
    navigate('/');
  };

  if (!user) return null;

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 glass border-r border-white/5 h-screen fixed left-0 top-0 flex flex-col pt-8 pb-4"
      >
        <div className="px-8 text-2xl font-bold tracking-tighter mb-12">
          StudyBuddy<span className="text-[#0ea5e9]">.</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { name: 'Dashboard', icon: <LineChart size={20} />, active: true, path: '/dashboard' },
            { name: 'Study Materials', icon: <BookOpen size={20} />, path: '/upload' },
            { name: 'AI Quizzes', icon: <BrainCircuit size={20} />, path: '/quiz' },
            { name: 'Flashcards', icon: <BookOpen size={20} />, path: '/flashcards' },
            { name: 'Study Planner', icon: <Calendar size={20} />, path: '/planner' },
            { name: 'AI Assistant', icon: <MessageSquare size={20} />, path: '/chat' },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-10 relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[120px] pointer-events-none"></div>

        <header className="flex justify-between items-end mb-12 relative z-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user.username} 👋</h1>
            <p className="text-white/60">Ready to conquer your exams today?</p>
          </div>
          <div className="glass px-6 py-2 rounded-full border border-[#0ea5e9]/30 text-[#0ea5e9] font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
            ⚡ 12 Day Streak!
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Graph Section */}
          <motion.div variants={item} className="glass p-8 rounded-[2rem] lg:col-span-2 border border-white/5 hover:border-[#0ea5e9]/30 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0ea5e9]/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h3 className="text-2xl font-black mb-1">Neural Progress</h3>
                <p className="text-sm text-[#0ea5e9]">XP Gained over 7 Days</p>
              </div>
              <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border border-[#0ea5e9]/30 text-sm font-bold text-[#0ea5e9]">
                +450 XP Today
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-3 px-2 relative z-10">
              {[
                { day: 'Mon', val: 40 },
                { day: 'Tue', val: 70 },
                { day: 'Wed', val: 45 },
                { day: 'Thu', val: 90 },
                { day: 'Fri', val: 65 },
                { day: 'Sat', val: 85 },
                { day: 'Sun', val: 100 }
              ].map((data, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-full h-full bg-white/5 rounded-xl relative overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${data.val}%` }}
                      transition={{ duration: 1.5, delay: i * 0.1, type: "spring" }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-[#0ea5e9]/20 to-[#0ea5e9] rounded-xl group-hover:from-[#8b5cf6]/20 group-hover:to-[#8b5cf6] transition-colors"
                    >
                      <div className="absolute top-0 w-full h-1 bg-white shadow-[0_0_10px_#fff]"></div>
                    </motion.div>
                  </div>
                  <span className="text-xs text-white/40 group-hover:text-white font-medium transition-colors">{data.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Upload Action */}
          <motion.div 
            variants={item} 
            onClick={() => navigate('/upload')}
            className="glass p-8 rounded-[2rem] bg-gradient-to-br from-[#8b5cf6]/10 to-transparent border border-white/5 hover:border-[#8b5cf6]/50 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#8b5cf6]/20 rounded-full blur-[50px] group-hover:bg-[#8b5cf6]/40 transition-colors pointer-events-none"></div>
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform">
                <BrainCircuit size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Initialize Core</h3>
              <p className="text-white/60 text-sm leading-relaxed">Upload new study materials and let the neural network construct your curriculum.</p>
            </div>
            
            <div className="mt-8 flex items-center justify-between text-[#8b5cf6] font-medium group-hover:translate-x-2 transition-transform">
              <span>Quick Upload</span>
              <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center">
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Analytics Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 relative z-10">
          {/* Weak Topics Analysis */}
          <motion.div variants={item} className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-8">
                <Zap className="text-[#f59e0b]" size={24} />
                <h3 className="text-xl font-bold">Optimization Targets</h3>
             </div>
             <div className="space-y-6">
                {[
                  { topic: 'Algorithm Complexity', mastery: 35, color: 'bg-red-500' },
                  { topic: 'Dynamic Programming', mastery: 55, color: 'bg-orange-500' },
                  { topic: 'Memory Allocation', mastery: 70, color: 'bg-yellow-500' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/80">{item.topic}</span>
                      <span className="font-mono text-white/50">{item.mastery}% Mastery</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.mastery}%` }}
                        transition={{ duration: 1, delay: 0.5 + (idx * 0.2) }}
                        className={`h-full ${item.color} shadow-[0_0_10px_currentColor]`}
                      />
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>

          {/* Recent Synapses (Activity) */}
          <motion.div variants={item} className="glass p-8 rounded-[2rem] border border-white/5">
             <h3 className="text-xl font-bold mb-8">Recent Synapses</h3>
             <div className="space-y-6">
                {[
                  { title: 'Completed Flashcards: Computer Networks', time: '2 hours ago', score: '+50 XP' },
                  { title: 'Generated Study Plan: Final Exams', time: '5 hours ago', score: '+100 XP' },
                  { title: 'Passed Quiz: Machine Learning Basics', time: 'Yesterday', score: '90%' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#0ea5e9]/50 transition-colors shrink-0">
                      <CheckCircle size={20} className="text-[#0ea5e9]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white/90">{activity.title}</h4>
                      <p className="text-xs text-white/40">{activity.time}</p>
                    </div>
                    <div className="text-sm font-bold text-[#8b5cf6]">{activity.score}</div>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
