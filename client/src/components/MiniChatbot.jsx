import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';

const MiniChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello Dheyn. Systems online. How can I assist?' }
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

      // --- STRATEGY SWITCHER ---
      if (isLocal) {
        console.log("Environment: LOCAL (Using Vite Proxy)");
        
        // Strategy A: Local Proxy (uses local .env key)
        response = await fetch('/api/openai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are the AI assistant for Necookie's Hub." },
              ...messages,
              userMessage
            ]
          })
        });

      } else {
        console.log("Environment: PRODUCTION (Using Vercel Backend)");

        // Strategy B: Vercel Serverless Function (uses Vercel Env Vars)
        // Ensure you have created client/api/chat.js !
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
             messages: [
              { role: "system", content: "You are the AI assistant for Necookie's Hub." },
              ...messages, 
              userMessage
             ] 
          })
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
        <div className="mb-4 w-80 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-96 animate-in slide-in-from-bottom-2 duration-200 origin-bottom-right">
          <div className="bg-slate-900/95 p-3 flex justify-between items-center text-white border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wider font-mono">NECOOKIE_AI</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={14} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-none'
                }`}>{msg.content}</div>
              </div>
            ))}
            {isLoading && <div className="flex justify-start"><Loader2 size={14} className="animate-spin text-indigo-500 m-2" /></div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white/50 border-t border-slate-200 flex gap-2">
            <input 
              type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Command..." className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-all font-mono"
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-slate-900 text-white p-2 rounded-xl"><Send size={14} /></button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default MiniChatbot;