import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { AiService } from '../services/aiService';
import { StorageService } from '../services/storageService';
import {
  Bot,
  Send,
  Sparkles,
  User,
  HelpCircle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const AiMentorPage: React.FC = () => {
  const profile = StorageService.getProfile();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_1',
      sender: 'assistant',
      text: `👋 Hi **${profile.name}**! I am your personal **AI Mentor**.

I have full awareness of your learning goals (**${profile.currentRoleTarget}**), active roadmaps, DSA problem count, and weak areas.

How can I help you accelerate your learning today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "What should I study today?",
    "I have one hour. Give me a study plan.",
    "Which topics are weak for me?",
    "Should I learn a new AI framework now?",
    "Help me prepare for a Java technical interview."
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsTyping(true);

    const responseText = await AiService.generateMentorResponse(query);

    const assistantMsg: ChatMessage = {
      id: 'msg_' + (Date.now() + 1),
      sender: 'assistant',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-brand-800 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold shadow-md">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Personalized AI Mentor</h1>
            <p className="text-xs text-brand-200">
              Context-Aware Companion • Aligned with {profile.currentRoleTarget} Goal
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-brand-200">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Rule-Based + LLM Ready</span>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Sparkles size={12} />
          <span>Quick Ask:</span>
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-all"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-6 min-h-[420px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm">
                <Bot size={16} />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white font-medium rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <span className={`block text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-brand-200 text-right' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
              <Bot size={16} />
            </div>
            <div className="bg-slate-100 dark:bg-slate-700/60 p-3 rounded-2xl rounded-bl-none text-xs text-slate-500 italic flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-brand-500" />
              <span>AI Mentor is thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <input
          type="text"
          placeholder="Ask AI Mentor anything about your learning, DSA, AI/ML, or placement prep..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
        >
          <span>Send</span>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
