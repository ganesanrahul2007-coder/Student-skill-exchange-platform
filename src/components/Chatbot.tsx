import React, { useState, useRef, useEffect } from 'react';
import { ragService } from '../services/ragService';
import { ChatMessage } from '../types/rag';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  BrainCircuit,
  Target,
} from 'lucide-react';

export const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => ragService.getInitialMessages(user));
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRAGInspector, setShowRAGInspector] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const targetSkill = user?.skills_wanted?.[0] || 'Python';
  const targetGoal = user?.active_learning_goal || user?.learning_goals?.[0] || 'Skill Mastery';

  const suggestedQuestions = user
    ? [
        `Analyze my skill gap in ${targetSkill}`,
        `What should I learn next for ${targetGoal}?`,
        `Suggest a practice project for my level`,
        `Find a partner who can teach me ${targetSkill}`,
        'How does mutual skill matching work?',
      ]
    : [
        'How does skill exchange work?',
        'How can I find a Python mentor?',
        'How does skill gap analysis work?',
        'How do I send a skill exchange request?',
        'What skills are available?',
      ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    try {
      const ragResponse = await ragService.askQuestion(textToSend, user);

      const aiMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: ragResponse.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        retrievedContexts: ragResponse.retrievedContexts,
        confidenceScore: ragResponse.confidence,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I ran into an issue retrieving knowledge chunks. Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages(ragService.getInitialMessages(user));
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group"
          aria-label="Open SkillMate AI Chatbot"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-700" />
          </div>
          <span className="text-sm font-bold tracking-tight">Ask SkillMate AI</span>
          <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            RAG
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight">SkillMate AI</h3>
                  <span className="text-[10px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded">
                    RAG Knowledge Base
                  </span>
                </div>
                <p className="text-[11px] text-indigo-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Active Assistant • Grounded Retrieval
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClear}
                title="Clear conversation"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* RAG Vector Pipeline Architecture Ribbon */}
          <div className="bg-slate-900 text-slate-300 px-3 py-1.5 text-[10px] flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-indigo-400" />
              <span>Pipeline: Query → Vector Search → Context → Answer</span>
            </div>
            <button
              type="button"
              onClick={() => setShowRAGInspector(!showRAGInspector)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
            >
              <span>{showRAGInspector ? 'Hide chunks' : 'Show RAG info'}</span>
              {showRAGInspector ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* RAG Knowledge Base Inspector Dropdown */}
          {showRAGInspector && (
            <div className="bg-slate-50 border-b border-slate-200 p-3 max-h-36 overflow-y-auto text-[11px] space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Indexed Vector Chunks in Knowledge Base:</span>
              </div>
              <ul className="space-y-1 text-slate-600">
                <li>• Platform bartering philosophy & guidelines</li>
                <li>• Smart matching algorithm formulas (+50 mutual bonus)</li>
                <li>• Requests lifecycle & active exchanges management</li>
                <li>• Peer reviews & academic integrity honor code</li>
              </ul>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Retrieved Contexts / Sources Citation */}
                  {msg.retrievedContexts && msg.retrievedContexts.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        <BookOpen className="w-3 h-3 text-indigo-500" />
                        <span>Retrieved Sources ({msg.retrievedContexts.length})</span>
                      </div>
                      <div className="space-y-1">
                        {msg.retrievedContexts.map((rc, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 border border-slate-200/70 p-1.5 rounded text-[10px] text-slate-600 flex items-center justify-between"
                          >
                            <span className="truncate max-w-[190px] font-medium text-slate-700">
                              {rc.chunk.title}
                            </span>
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded font-mono">
                              {Math.round(rc.similarityScore * 100)}% sim
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="text-[11px] text-slate-400 ml-1.5">Retrieving context & reasoning...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-full transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about skill exchange, matching..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
