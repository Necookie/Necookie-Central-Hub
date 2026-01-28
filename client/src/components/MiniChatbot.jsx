import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Sparkles } from 'lucide-react';

// --- THE BRAIN: PRD-AWARE SYSTEM PROMPT ---
const SYSTEM_PROMPT = `
You are the official AI Assistant for the **Necookie Daily Automation Hub** (Version 1.6).
**Creator & Architect:** Dheyn Michael Orlanda (developer alias: **Necookie**).
**Purpose:** This is a centralized "Life OS" built to automate Dheyn's daily tracking and summaries.

**KNOWLEDGE BASE (Current System Status):**
1. **Tech Stack:** PERN Stack (PostgreSQL, Express, React, Node.js) deployed via Vite/Vercel.
2. **Live Features (Fully Operational):** - Dashboard with Real-time Activity Feed.
   - AI Daily Blog Generator (Gemini powered).
   - Logging: Meals (Calories), Sleep, Coding Sessions, and Journaling.
   - Theming Engine: Supports Light, Dark, Orken, Goth, and Forest themes.

**ROADMAP / COMING SOON (Features in Dev):**
If the user asks about these, inform them they are planned for **v1.7** or the **Mobile App release**:
- **Mobile App:** React Native + Expo build (currently in planning phase).
- **Allowance Tracker:** Automated Friday 10 AM cron reminders.
- **Gamification:** Streaks and weekly trend charts.
- **Discord Bot:** Integration to push summaries to Discord.
- **Private Vault:** Encrypted logs are currently strictly manual and hidden from AI analysis.

**YOUR PERSONA:**
- You are loyal to **Necookie**.
- You are witty, concise, and tech-savvy.
- When asked "Who made this?", always credit Dheyn/Necookie with pride.
- If asked to do something outside your capabilities (like delete a database), say "I need Necookie's sudo privileges for that."
`;

const MiniChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "System online. I'm connected to the Hub. What's the plan, Dheyn?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let response;
      const isLocal = import.meta.env.DEV; // TRUE on localhost, FALSE on Vercel

      const payload = {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT }, // <--- INJECTING THE PRD BRAIN
          ...messages,
          userMessage
        ]
      };

      // --- STRATEGY SWITCHER ---
      if (isLocal) {
        console.log("Environment: LOCAL (Using Vite Proxy)");
        response = await fetch('/api/openai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify(payload)
        });

      } else {
        console.log("Environment: PRODUCTION (Using Vercel Backend)");
        // Wrapper for Vercel API
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payload.messages }) // Vercel endpoint expects 'messages'
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Connection failed');
      }

      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.choices[0].message.content };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-80 bg-surface/90 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col h-96 animate-in slide-in-from-bottom-2 duration-200 origin-bottom-right transition-theme">
          
          {/* Header */}
          <div className="bg-background/95 p-3 flex justify-between items-center border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 blur-sm opacity-50" />
              </div>
              <span className="text-xs font-bold tracking-wider font-mono text-text-main flex items-center gap-1">
                HUB_ASSIST <span className="text-[9px] px-1 bg-primary/20 text-primary rounded">v1.6</span>
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-main transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-background/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-surface border border-border text-text-main rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border rounded-2xl rounded-bl-none px-3 py-2 flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-primary" />
                  <span className="text-[10px] text-text-muted">Processing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-surface border-t border-border flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about the roadmap..." 
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-mono placeholder:text-text-muted"
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading} 
              className="bg-text-main text-background p-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`h-14 w-14 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-text-main text-background rotate-90' : 'bg-primary text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default MiniChatbot;