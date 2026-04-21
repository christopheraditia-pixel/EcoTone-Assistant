/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Leaf, 
  Music, 
  Trash2, 
  Info, 
  Menu, 
  X, 
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { cn } from './lib/utils';
import { getEcoToneResponse } from './lib/gemini';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const MATERIALS = [
  "Kayu Bekas (Recycled Wood)",
  "Electric Guitar Bridge",
  "Senar Gitar Elektrik",
  "Nut Kayu",
  "6 Tuning Machines",
  "Pickup Humbucker",
  "1 Potensio Volume",
  "Lubang Jack Gitar"
];

const EcoToneLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 400 400" className={className}>
    <defs>
      <path id="circlePathTop" d="M 100, 200 a 100,100 0 1,1 200,0" fill="transparent" />
      <path id="circlePathBottom" d="M 100, 200 a 100,100 0 1,0 200,0" fill="transparent" />
    </defs>
    {/* Background Circle */}
    <circle cx="200" cy="200" r="160" fill="white" fillOpacity="0.05" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
    
    {/* Text */}
    <text className="font-serif text-[28px] uppercase tracking-[4px]" fill="currentColor" opacity="0.6">
      <textPath href="#circlePathTop" startOffset="50%" textAnchor="middle">LAP STEEL</textPath>
    </text>
    <text className="font-serif text-[28px] uppercase tracking-[4px]" fill="currentColor" opacity="0.6">
      <textPath href="#circlePathBottom" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">GUITARS</textPath>
    </text>
    
    {/* Center Brand */}
    <text x="50%" y="54%" textAnchor="middle" className="font-serif font-black italic text-[72px]">
      <tspan fill="#22c55e">Eco</tspan>
      <tspan fill="currentColor">Tone</tspan>
    </text>
  </svg>
);

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Selamat datang di proyek EcoTone. Saya asisten virtual Anda yang memahami setiap detail instrumen Lap Steel Guitar ini. Tanyakan apa saja tentang konversi kayu bekas menjadi alat musik.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await getEcoToneResponse(input, history);
      
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden text-stone-200 font-sans">
      {/* Navigation Header */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-4 md:py-6 border-b border-stone-800/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <EcoToneLogo className="w-10 h-10 md:w-14 md:h-14" />
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-serif italic tracking-wide font-bold leading-tight">EcoTone</span>
            <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-stone-500">Lap Steel Guitars</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-medium opacity-60">
          <span>Material Logic</span>
          <span>Acoustic Engineering</span>
          <span>Sustainability</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 text-stone-400 hover:text-white"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <main className="flex flex-1 p-4 md:p-8 gap-8 overflow-hidden">
        {/* Chat / Terminal Section */}
        <section className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="glass-panel rounded-2xl p-4 md:p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
              <h2 className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-green-500/80">Assistant Terminal</h2>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2"
            >
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex w-full",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "p-4 rounded-xl max-w-[85%] md:max-w-[80%] text-sm leading-relaxed",
                        msg.role === 'user' 
                          ? "bg-green-900/20 border border-green-700/30 text-green-100 italic" 
                          : "bg-stone-800/30 border-l-2 border-green-600 text-stone-300 shadow-sm"
                      )}
                    >
                      <div className="markdown-body">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-stone-800/30 p-3 rounded-xl border-l-2 border-green-600/50">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <span className="w-1.5 h-1.5 bg-green-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 bg-green-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-800">
              <form 
                onSubmit={handleSend}
                className="flex gap-3 bg-black/40 p-2 rounded-lg border border-stone-700 focus-within:border-green-700/50 transition-colors"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pertanyaan tentang lap steel guitar ini..."
                  className="flex-1 bg-transparent px-3 py-1 outline-none text-sm text-stone-300 placeholder:text-stone-600 italic"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-3 text-green-500 hover:text-green-400 disabled:opacity-30"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Sidebar Info Section */}
        <section 
          className={cn(
            "fixed inset-y-0 right-0 z-40 w-80 p-8 flex flex-col gap-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:p-0",
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Main Materials at the top */}
          <div className="p-6 bg-stone-900/60 border border-stone-800 rounded-2xl backdrop-blur-md shadow-xl relative overflow-hidden">
            <h3 className="text-[10px] uppercase tracking-widest mb-6 font-bold text-green-500/80 border-b border-stone-800 pb-2 relative z-10">Bahan Utama</h3>
            <ul className="space-y-4 relative z-10">
              {[
                { label: "Body", value: "Kayu Bekas" },
                { label: "Bridge", value: "Electric Bridge" },
                { label: "Pickup", value: "Humbucker" },
                { label: "Electronics", value: "1x Vol, 1x Jack" },
                { label: "Nut", value: "Kayu Custom" },
                { label: "Hardware", value: "6x Tuning Machine" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center justify-between group">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">{item.label}</span>
                  <span className="text-[11px] font-mono text-green-400 uppercase font-bold tracking-tight">{item.value}</span>
                </li>
              ))}
            </ul>
            {/* Subtle background brand mark */}
            <div className="absolute -right-12 -bottom-12 opacity-5 text-green-400 rotate-12 pointer-events-none">
              <EcoToneLogo className="w-48 h-48" />
            </div>
          </div>
        </section>
      </main>


      {/* Technical Footer */}
      <footer className="px-6 md:px-10 py-4 bg-black/60 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-4 border-t border-stone-800">
        <div className="text-[10px] uppercase tracking-widest text-stone-600 font-mono">
          EcoTone Technical Protocol v1.0.4
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[10px] uppercase tracking-widest text-stone-400">Wood Waste Validated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[10px] uppercase tracking-widest text-stone-400">Tone Output Optimized</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
