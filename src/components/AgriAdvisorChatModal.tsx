import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RotateCw, 
  User, 
  Trash2, 
  HelpCircle,
  Sprout,
  Compass
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';

interface AgriAdvisorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AgriAdvisorChatModal: React.FC<AgriAdvisorChatModalProps> = ({ isOpen, onClose }) => {
  const { blocks, telemetry, weather } = useFarm();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Halo Petani Hebat Nusantara! Saya **Agronomis AI AgriSmart**. Saya siap membantu Anda menganalisis kondisi lahan, dosis pemupukan berimbang 5T, penanganan hama/penyakit, dan strategi agroklimat. Apa yang bisa saya bantu hari ini?',
      timestamp: 'Baru saja'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    'Rekomendasi pemupukan susulan padi umur 30 HST',
    'Cara kendalikan antraknosa / patek cabai saat musim hujan',
    'Solusi menaikkan pH tanah masam di bawah 5.5',
    'Tips panen dan pengeringan gabah agar rendemen > 68%',
    'Pencegahan serangan ulat grayak FAW pada jagung muda'
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    // Build context summary from current farm
    const farmSummary = `Peternakan/Lahan Pertanian Terpadu Nusantara:
- Total ${blocks.length} blok lahan (${blocks.map(b => `${b.name}: ${b.cropType} ${b.cropVariety} umur ${b.ageDays} HST, kelembaban ${b.soilMoisturePct}%, pH ${b.soilPh}`).join('; ')}).
- Kondisi IoT saat ini: Suhu udara ${telemetry.airTempC}°C, Kelembaban udara ${telemetry.humidityPct}%, Lengas tanah ${telemetry.soilMoistureAvg}%, ET0 ${telemetry.evapotranspirationMm} mm/hari.
- Cuaca hari ini: ${weather[0]?.condition || 'Cerah Berawan'}, peluang hujan ${weather[0]?.rainProbPct || 20}%.`;

    try {
      const res = await fetch('/api/ai/agri-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          farmContext: farmSummary
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: json.data,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(json.error || 'Respon AI tidak valid');
      }
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Mohon maaf, terjadi gangguan koneksi dengan server AI. Silakan coba kembali sesaat lagi.',
        timestamp: 'Error'
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white">Konsultan Agronomis AI Nusantara</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-stone-400">Didukung Gemini 3.7 Flash • Sadar Konteks Lahan & IoT</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setMessages([{
                id: 'welcome',
                sender: 'assistant',
                text: 'Sesi percakapan telah dibersihkan. Ada hal lain yang ingin Anda konsultasikan?',
                timestamp: 'Baru saja'
              }])}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 transition-colors"
              title="Bersihkan Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prompt Chips Bar */}
        <div className="px-4 py-2 bg-stone-950/60 border-b border-stone-800/80 overflow-x-auto flex items-center space-x-2 shrink-0 scrollbar-none">
          <span className="text-[10px] text-stone-500 shrink-0 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-amber-400" /> Contoh Topik:
          </span>
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-emerald-500/40 text-[11px] shrink-0 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message History Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                    isBot
                      ? 'bg-stone-950 border border-stone-800 text-stone-200 shadow-md'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className={`text-[9px] mt-1.5 text-right ${isBot ? 'text-stone-500' : 'text-emerald-200'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-stone-400 text-xs p-2">
              <RotateCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Agronomis AI sedang menganalisis data agroklimat & solusi terbaik...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Message Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-stone-950 border-t border-stone-800 flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Tanyakan masalah tanaman, dosis pupuk, cuaca, atau hama..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500 placeholder:text-stone-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
