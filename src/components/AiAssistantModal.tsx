import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Trash2,
  Minimize2,
  Maximize2,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { ChatMessage } from '../types/weather';
import { getInitialGreeting, processWeatherQuery } from '../services/aiWeatherAssistant';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { weatherData } = useWeather();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset chat on open/city change
  useEffect(() => {
    if (messages.length === 0 && weatherData) {
      setMessages([getInitialGreeting(weatherData)]);
    }
  }, [weatherData, messages.length]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const response = processWeatherQuery(query, weatherData);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (weatherData) {
      setMessages([getInitialGreeting(weatherData)]);
    } else {
      setMessages([]);
    }
  };

  const quickPrompts = [
    'Will it rain today?',
    'Should I carry an umbrella?',
    'What should I wear today?',
    'Is tomorrow good for outdoor activities?',
    'Which day this week will be the coolest?',
    'Compare today with tomorrow',
    'What is the air quality like?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-2 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full rounded-3xl glass-panel-glow border border-white/60 dark:border-cyan-500/30 shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-3xl animate-slide-up transition-all ${
          isExpanded
            ? 'max-w-4xl h-[90vh]'
            : 'max-w-xl h-[560px] sm:h-[620px]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25">
              <Bot size={22} className="animate-pulse-slow" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  AeroAI Assistant
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                  Live Context
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Grounded in {weatherData?.location.name || 'Current City'} atmospheric data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClear}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Clear chat history"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
              title={isExpanded ? 'Minimize' : 'Expand window'}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
              title="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-800 dark:text-cyan-400 shrink-0 self-start mt-1">
                    <Sparkles size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all ${
                    isBot
                      ? 'bg-white/70 dark:bg-slate-900/80 border border-white/50 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 shadow-md whitespace-pre-wrap'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-medium'
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdownText(msg.text) }} />

                  {/* Suggestion action pills inside bot response */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-900 dark:text-cyan-300 border border-cyan-500/20 transition-all text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-1.5 ${
                      isBot ? 'text-slate-700 dark:text-slate-300' : 'text-cyan-100'
                    } text-right`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-800 dark:text-cyan-400 shrink-0">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompt Chips */}
        <div className="px-4 py-2 border-t border-slate-200/30 dark:border-slate-800/40 bg-white/30 dark:bg-slate-950/40">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 shrink-0">
              <HelpCircle size={12} /> Prompts:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-white/60 dark:bg-slate-800/60 hover:bg-cyan-500/20 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/60 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200/40 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/70 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask AeroAI about ${weatherData?.location.name || 'weather'} (e.g. "Will it rain today?")...`}
            className="flex-1 px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isTyping}
            className={`p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 transition-all ${
              !inputQuery.trim() || isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
            title="Send Message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Markdown formatting helper for bolding and bullet lists
function formatMarkdownText(text: string): string {
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
  return formatted;
}
