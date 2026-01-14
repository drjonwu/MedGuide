
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, Loader2, Info } from 'lucide-react';
import { ChatMessage, RAGChunk, PatientProfile } from '../types';
import { ClinicalRAG } from '../services/ragService';

interface ChatInterfaceProps {
  patient: PatientProfile;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ patient }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'model',
      content: `Hello. I have analyzed ${patient.name}'s records. You can ask me specific questions like "When was the last HbA1c?" or "Why was Warfarin started?"`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize RAG Engine
  // We use a ref to persist the engine instance across renders without triggering re-renders
  const ragEngineRef = useRef<ClinicalRAG | null>(null);

  useEffect(() => {
    // Re-initialize if patient changes
    ragEngineRef.current = new ClinicalRAG(patient.notes);
  }, [patient.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      if (!ragEngineRef.current) {
        ragEngineRef.current = new ClinicalRAG(patient.notes);
      }

      // Add temporary thinking message
      const thinkingId = 'thinking_' + Date.now();
      setMessages(prev => [...prev, {
        id: thinkingId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
        isThinking: true
      }]);

      const { answer, context } = await ragEngineRef.current.answerQuery(userMsg.content);

      // Replace thinking message with real answer
      setMessages(prev => prev.map(msg => 
        msg.id === thinkingId 
          ? { ...msg, content: answer, context, isThinking: false }
          : msg
      ));

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev.filter(m => !m.isThinking), {
        id: Date.now().toString(),
        role: 'model',
        content: "I apologize, but I encountered an error analyzing the records. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white shadow-sm border-x border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
             <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Clinical Copilot</h2>
            <p className="text-xs text-slate-500">RAG-Powered • Context Aware</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">
          <Info className="w-3 h-3" />
          <span>Answers grounded in record</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                ${msg.role === 'user' ? 'bg-slate-200' : 'bg-indigo-100'}
              `}>
                {msg.role === 'user' ? (
                  <User className="w-5 h-5 text-slate-500" />
                ) : (
                  <Bot className="w-5 h-5 text-indigo-600" />
                )}
              </div>

              {/* Bubble */}
              <div className="flex flex-col gap-2 min-w-0">
                <div className={`
                  p-4 rounded-2xl shadow-sm leading-relaxed text-sm whitespace-pre-wrap
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }
                `}>
                  {msg.isThinking ? (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Reading records and checking context...</span>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {/* Context / Sources */}
                {msg.role === 'model' && msg.context && msg.context.length > 0 && (
                  <div className="mt-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Retrieved Context
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {msg.context.map((chunk, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-500 w-64 flex-shrink-0 shadow-sm">
                           <div className="font-semibold text-slate-700 mb-1 text-[10px]">Source Segment {idx + 1}</div>
                           <div className="line-clamp-3 italic opacity-80">"{chunk.text}"</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the patient's history..."
            disabled={isProcessing}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className={`
              p-3 rounded-xl flex items-center justify-center transition-all
              ${!input.trim() || isProcessing
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-200'
              }
            `}
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          AI generated responses can be inaccurate. Always verify with source notes.
        </p>
      </div>
    </div>
  );
};
