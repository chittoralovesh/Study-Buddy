import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hello! I'm StudyBuddy, your personal AI tutor. I've analyzed your study material. What would you like to ask me?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const documentText = sessionStorage.getItem('studyBuddyDocument');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const text = documentText || "Provide general tutoring if no text is given.";
      const token = localStorage.getItem('studyBuddyToken');
      
      const formData = new FormData();
      formData.append('type', 'chat');
      formData.append('text', text);
      formData.append('question', userMessage);

      const res = await axios.post('http://localhost:5000/api/ai/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      let aiText = res.data.answer || res.data.response || res.data.message;
      
      // If the backend returned a random hallucinated JSON object (like product details)
      // instead of the conversational answer, gracefully catch it.
      if (!aiText && typeof res.data === 'object') {
        const stringValues = Object.values(res.data).filter(v => typeof v === 'string');
        if (stringValues.length > 0 && stringValues[0] !== documentText) {
           aiText = stringValues[0]; // Try to salvage a string from the hallucination
        } else {
           aiText = "Oops! My neural circuits got crossed and I lost my train of thought. Could you ask me that again?";
        }
      } else if (!aiText) {
        aiText = "I'm having trouble forming a response right now. Please try again.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiText as string }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to the neural network right now. Check your API limits or try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-[#050816] text-white flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#0ea5e9]/10 to-transparent rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#8b5cf6]/10 to-transparent rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <header className="glass p-6 flex justify-between items-center relative z-20 border-b border-white/5">
        <Link to="/dashboard" className="text-white/50 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center p-[2px]">
            <div className="bg-[#050816] w-full h-full rounded-full flex items-center justify-center">
              <Bot size={20} className="text-[#0ea5e9]" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg">StudyBuddy AI</h1>
            <p className="text-xs text-[#0ea5e9] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse"></span>
              Online & Ready
            </p>
          </div>
        </div>
        <div className="glass px-4 py-2 rounded-full text-xs text-white/50 flex items-center gap-2">
          <BookOpen size={14} /> Context Loaded
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 relative z-10 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-4 max-w-4xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-white/10' : 'bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6]'}`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={`p-5 rounded-2xl whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'bg-[#0ea5e9]/20 border border-[#0ea5e9]/30 rounded-tr-none' : 'glass rounded-tl-none'}`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-4 max-w-4xl mr-auto"
          >
            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="glass p-5 rounded-2xl rounded-tl-none flex items-center gap-3">
              <Loader2 size={18} className="animate-spin text-[#0ea5e9]" />
              <span className="text-white/60">Processing your query...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-10 relative z-20">
        <div className="max-w-4xl mx-auto relative">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your syllabus..."
            className="w-full bg-white/5 border border-white/10 rounded-3xl pl-6 pr-16 py-5 text-white placeholder-white/30 focus:outline-none focus:border-[#0ea5e9]/50 transition-colors resize-none glass"
            rows={1}
            style={{ minHeight: '64px', maxHeight: '200px' }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send size={20} className="ml-1" />
          </button>
        </div>
        <p className="text-center text-xs text-white/30 mt-4">StudyBuddy AI can make mistakes. Always verify important facts.</p>
      </div>
    </div>
  );
}
