import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Compass,
  CloudSun,
  Wind,
  Mountain,
  FileCheck2,
  Home,
  Sparkles,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import {
  buildLocalRAGResponse,
  DynamicPlaceTelemetry,
} from '../utils/ragEngine';
import { UserRole } from '../data/uttarakhandData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  telemetry?: DynamicPlaceTelemetry;
  intentType?: string;
}

interface AIYatriDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  initialQuery?: string | null;
  onClearInitialQuery?: () => void;
}

const QUICK_SUGGESTION_CHIPS = [
  'What are the eco-guidelines for Munsiyari?',
  'Current weather in Chopta circuit?',
  'Local customs for homestay etiquette',
  'Weather in Nainital',
  'Weather in Pithoragarh',
  'Weather in Abbott Mount',
  'Weather in Kausani',
  'Homestay availability in Sarmoli',
];

export const AIYatriDrawer: React.FC<AIYatriDrawerProps> = ({
  isOpen,
  onClose,
  userRole,
  initialQuery,
  onClearInitialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initialRag = buildLocalRAGResponse('Weather in Munsiyari');
    return [
      {
        id: 'welcome-msg',
        sender: 'assistant',
        text: 'Namaste! I am your **AI Yatri RAG Concierge** for all 13 districts of Garhwal and Kumaon. Ask me for live micro-climate weather in *any* Uttarakhand village or town (e.g., Munsiyari, Chopta, Nainital, Pithoragarh, Lohaghat, Chaukori, Harshil), biosphere trekking permits, eco-guidelines, or verified Koti Banal homestays.',
        timestamp: 'Just now',
        telemetry: initialRag.telemetry,
        intentType: 'weather',
      },
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSendQuery(initialQuery);
      onClearInitialQuery?.();
    }
  }, [isOpen, initialQuery]);

  const handleSendQuery = async (rawText?: string) => {
    const queryToSend = (rawText ?? inputQuery).trim();
    if (!queryToSend || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!rawText) setInputQuery('');
    setIsTyping(true);

    // Compute local RAG immediately so we always have sub-second fallback and live telemetry card
    const localRag = buildLocalRAGResponse(queryToSend);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch('/api/yatri-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSend,
          history: messages.slice(-4).map(m => ({ sender: m.sender, text: m.text })),
          userRole,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || localRag.formattedResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          telemetry: data.telemetry || localRag.telemetry,
          intentType: data.intentType || localRag.intentType,
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
        return;
      }
    } catch (_err) {
      // Fallback to local RAG engine if offline or timed out
    }

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: localRag.formattedResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        telemetry: localRag.telemetry,
        intentType: localRag.intentType,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 280);
  };

  const handleResetChat = () => {
    const initialRag = buildLocalRAGResponse('Weather in Munsiyari');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. Ask me about weather in any Uttarakhand village, high-altitude trekking permits, eco-guidelines, or local homestay availability.',
        timestamp: 'Just now',
        telemetry: initialRag.telemetry,
        intentType: 'weather',
      },
    ]);
  };

  // Simple clean markdown-like renderer for bold text and bullet lists
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} className="h-1" />;

          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={i} className="font-serif-display font-semibold text-base text-slate-900 pt-1">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          const formatInlineBold = (str: string) => {
            const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
            return parts.map((part, idx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={idx} className="font-semibold text-slate-900">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith('*') && part.endsWith('*')) {
                return (
                  <em key={idx} className="italic text-slate-700">
                    {part.slice(1, -1)}
                  </em>
                );
              }
              return part;
            });
          };

          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <div key={i} className="flex items-start gap-2 pl-1">
                <span className="text-emerald-800 font-bold mt-0.5">·</span>
                <span className="text-slate-700">{formatInlineBold(trimmed.slice(2))}</span>
              </div>
            );
          }

          if (/^\d+\.\s/.test(trimmed)) {
            const numMatch = trimmed.match(/^(\d+\.)\s+(.*)$/);
            if (numMatch) {
              return (
                <div key={i} className="flex items-start gap-2 pl-1">
                  <span className="font-mono-tabular text-xs font-semibold text-emerald-900 mt-0.5">
                    {numMatch[1]}
                  </span>
                  <span className="text-slate-700">{formatInlineBold(numMatch[2])}</span>
                </div>
              );
            }
          }

          return (
            <p key={i} className="text-slate-700">
              {formatInlineBold(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-yatri-drawer-title"
    >
      {/* Backdrop click to close on desktop */}
      <div className="hidden md:block flex-1" onClick={onClose} aria-hidden="true" />

      {/* Responsive Drawer: 100% full-screen on mobile, 480px slide-over panel on desktop */}
      <aside className="w-full md:w-[480px] lg:w-[520px] h-full bg-[#FAF9F5] border-l border-stone-200 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-[#143328] text-stone-100 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800/70 border border-emerald-700 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 id="ai-yatri-drawer-title" className="font-serif-display text-base font-semibold text-white tracking-tight">
                AI Yatri RAG Concierge
              </h2>
              <p className="text-xs text-emerald-200/90">
                13-District Dynamic Weather · Permits · Homestay RAG
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleResetChat}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
              aria-label="Reset conversation history"
              title="Reset chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
              aria-label="Close AI Yatri Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Quick Suggestion Chips Bar */}
        <div className="px-4 py-2.5 bg-stone-100/90 border-b border-stone-200">
          <div className="text-[11px] font-medium text-slate-500 mb-1.5 flex items-center justify-between">
            <span>Quick RAG Queries (Click or type any village in Uttarakhand)</span>
            <span className="font-mono-tabular text-emerald-800">All 13 Districts Active</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_SUGGESTION_CHIPS.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSendQuery(chip)}
                disabled={isTyping}
                className="px-3 py-1.5 min-h-[36px] text-xs font-medium bg-white hover:bg-emerald-900 hover:text-white text-slate-700 border border-stone-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Chat History */}
        <div
          className="flex-1 overflow-y-auto px-4 py-5 space-y-5"
          data-testid="yatri-chat-history"
        >
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[88%] rounded-xl px-4 py-3.5 ${
                  msg.sender === 'user'
                    ? 'bg-[#143328] text-white'
                    : 'bg-white border border-stone-200/90 text-slate-800 shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                ) : (
                  <>
                    {/* Contextual Telemetry Card when location data is retrieved */}
                    {msg.telemetry && (
                      <div className="mb-3 pb-3 border-b border-stone-200">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-900">
                            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                            {msg.telemetry.placeName} · {msg.telemetry.district}
                          </span>
                          <span className="font-mono-tabular">
                            {msg.telemetry.elevationMeters.toLocaleString()}m ASL · {msg.telemetry.region}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-200/80">
                          <div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <CloudSun className="w-3 h-3 text-amber-600" /> Temp
                            </div>
                            <div className="font-mono-tabular text-sm font-bold text-slate-900">
                              {msg.telemetry.temperatureC}°C
                              <span className="text-[11px] font-normal text-slate-500 ml-1">
                                ({msg.telemetry.feelsLikeC}°C)
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Wind className="w-3 h-3 text-sky-700" /> Wind / RH
                            </div>
                            <div className="font-mono-tabular text-sm font-semibold text-slate-900">
                              {msg.telemetry.windSpeedKmh} km/h
                              <span className="text-[11px] font-normal text-slate-500 ml-1">
                                · {msg.telemetry.humidityPercent}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Mountain className="w-3 h-3 text-emerald-700" /> Air Quality
                            </div>
                            <div className="font-mono-tabular text-sm font-semibold text-emerald-800">
                              AQI {msg.telemetry.aqi}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {renderFormattedText(msg.text)}

                    {/* Quick follow-up actions for this place */}
                    {msg.telemetry && (
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() =>
                            handleSendQuery(`Trekking permits for ${msg.telemetry!.placeName}`)
                          }
                          className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-medium underline underline-offset-2 cursor-pointer"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" /> Check {msg.telemetry.placeName} Permits
                        </button>
                        <span className="text-stone-300">·</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleSendQuery(`Homestays in ${msg.telemetry!.placeName}`)
                          }
                          className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-medium underline underline-offset-2 cursor-pointer"
                        >
                          <Home className="w-3.5 h-3.5" /> View {msg.telemetry.placeName} Stays
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 px-1">
                {msg.sender === 'user' ? 'You' : 'AI Yatri RAG'} · {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2" aria-live="polite">
              <div className="bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
                <span>Retrieving live Uttarakhand satellite & forest checkpost telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="p-3.5 bg-white border-t border-stone-200"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="ai-yatri-input" className="sr-only">
              Ask AI Yatri about any village, weather, permit, or homestay in Uttarakhand
            </label>
            <input
              id="ai-yatri-input"
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask e.g. 'weather in Lohaghat', 'permits in Darma Valley'..."
              className="flex-1 min-h-[44px] px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="min-w-[44px] min-h-[44px] px-4 py-2 bg-[#143328] hover:bg-emerald-900 disabled:opacity-40 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
              aria-label="Send query to AI Yatri Assistant"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};
