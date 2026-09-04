import React, { useState, useEffect, useRef } from 'react';
import { MessageSquareCode, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { fetchChatHistory, sendChatMessage } from '../lib/api';

export const ChatbotView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChat();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChat = async () => {
    try {
      const history = await fetchChatHistory();
      setMessages(history);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput('');
    setLoading(true);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await sendChatMessage(query);
      if (res.success) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950">
            <Sparkles className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">EcoTrack AI Assistant</h2>
            <p className="text-[11px] text-emerald-400">Powered by Gemini 3.6 Flash</p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/80 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>

                {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(action)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors text-left"
                      >
                        ⚡ {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 text-slate-400 text-xs flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about your emissions, report insights, or green tips..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
