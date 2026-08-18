import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am your 24/7 VTU automated support assistant. How can I assist you today?',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickQuestions = [
    'How do I fund my wallet?',
    'Why is my electricity token delayed?',
    'What is the rate for Air to Cash?',
    'How do I get my API key?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = query.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    if (!textToSend) setInputText('');

    setTimeout(() => {
      let reply = 'Our automated dispatch engine operates 24/7 with 99.9% uptime. All services are instant!';
      const q = userMsg.toLowerCase();
      if (q.includes('fund') || q.includes('wallet') || q.includes('deposit')) {
        reply = 'To fund your wallet instantly, transfer to any of your dedicated virtual bank accounts (Moniepoint, Wema, Providus) displayed in the Profile or Fund Wallet tab. Deposits credit in 5 seconds without fees!';
      } else if (q.includes('electricity') || q.includes('token') || q.includes('meter')) {
        reply = 'Electricity tokens are vended instantly upon payment. You can copy your 20-digit token directly from the Transaction History receipt or check your SMS.';
      } else if (q.includes('air to cash') || q.includes('rate') || q.includes('convert')) {
        reply = 'Our Airtime-to-Cash rate is currently 82% instant payout directly to your bank account (OPay, PalmPay, GTB, etc.).';
      } else if (q.includes('api') || q.includes('developer') || q.includes('bot')) {
        reply = 'You can access your live REST API key and webhook documentation under the "Developer" service on the home page or inside the Profile tab.';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Orange Chat Button (matches screenshot) */}
      <button
        id="floating-chat-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 sm:right-auto sm:left-[calc(50%+130px)] z-40 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition cursor-pointer"
        title="24/7 VTU Live Help & Bot"
      >
        <MessageSquare className="w-5 h-5 fill-black" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
      </button>

      {/* Chat Dialog Sheet */}
      {isOpen && (
        <div 
          id="floating-chat-modal"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4"
        >
          <div className="w-full max-w-sm bg-[#071920] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px] max-h-[85vh] animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 bg-[#05141a] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">VTU Support Assistant</h3>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Instant Automated
                  </span>
                </div>
              </div>
              <button
                id="close-chat-modal-btn"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-[#0a232b] text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Quick Suggestion Chips */}
              <div className="pt-2 space-y-2">
                <a
                  id="whatsapp-direct-chat-btn"
                  href="https://wa.me/2348123534689?text=Hello%2C%20I%20need%20assistance%20with%20my%20VTU%20service"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-[11px] font-semibold transition"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Chat directly on WhatsApp (+234 812 353 4689)
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-bold">OPEN</span>
                </a>

                <div>
                  <p className="text-[10px] text-slate-500 mb-1.5">Common questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(q)}
                        className="text-[10px] py-1 px-2.5 rounded-full bg-[#0a232b] border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-[#05141a] border-t border-slate-800 flex gap-2">
              <input
                type="text"
                id="chat-input-field"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 bg-[#0a232b] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                id="send-chat-btn"
                onClick={() => handleSend()}
                className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center font-bold transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
