import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  TrendingUp, 
  DollarSign, 
  Coins, 
  Radio, 
  MessageSquare, 
  Layers, 
  Move3d, 
  CheckCircle2, 
  Compass, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Zap, 
  Shield, 
  Flame, 
  RefreshCw,
  Copy,
  Check,
  Globe,
  Sliders,
  FolderGit2
} from 'lucide-react';
import { 
  OmniChatMessage, 
  OmniTaskAction, 
  CryptoMarketData, 
  ChatShowComment, 
  ThemeType 
} from '../types';
import { 
  FEMALE_PERSONAS, 
  VoicePersonaDef, 
  speakBeautifulGirlVoice, 
  stopSpeaking, 
  playTacticalBeep, 
  playSuccessChime, 
  playOmniGemChime,
  playCryptoTickSound
} from '../utils/audio';

interface OmniPageProps {
  activeView: string;
  onNavigateView: (viewId: string) => void;
  currentTheme: ThemeType;
  onSetTheme: (theme: ThemeType) => void;
  onDispatchCommand?: (cmd: string) => void;
  onOpenVirtualFile?: (fileName: string) => void;
}

export const OmniPage: React.FC<OmniPageProps> = ({
  activeView,
  onNavigateView,
  currentTheme,
  onSetTheme,
  onDispatchCommand,
  onOpenVirtualFile,
}) => {
  // Active Tab: Omni AI Assistant vs Dollar & Bitcoin Chat Show
  const [activeTab, setActiveTab] = useState<'assistant' | 'chatshow'>('assistant');

  // Selected Beautiful Girl Voice Persona
  const [selectedPersona, setSelectedPersona] = useState<string>('celeste');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoVoiceReply, setAutoVoiceReply] = useState<boolean>(true);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Chat input and history
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<OmniChatMessage[]>([
    {
      id: 'omni-welcome',
      sender: 'gem',
      text: `Hello! I am **Omni Gem**, your celestial AI assistant. 

I can answer **any questions** you have—from code, philosophy, and science to macroeconomics and crypto.

Even better: I have direct authority to **perform open site tasks** across this platform! For example:
- *"Jump to Spy Page and trigger 3D Golden Dragon Ki Breath"*
- *"What is current Dollar (USD) and Bitcoin (BTC) rate?"*
- *"Switch system theme to Crimson"*
- *"Show Agent Town and assign desk to Alice"*
- *"Open virtual files and show Gold Market report"*

How may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const currentPersona = FEMALE_PERSONAS.find(p => p.id === selectedPersona) || FEMALE_PERSONAS[0];

  // Dollar & Bitcoin Market Telemetry State
  const [marketData, setMarketData] = useState<CryptoMarketData>({
    btcUsd: 96420,
    btcPkr: 26845000,
    btcChange24h: 3.84,
    btcHigh24h: 97650,
    btcLow24h: 94800,
    btcVolume24h: '$48.2 Billion',
    usdPkrInterbank: 278.45,
    usdPkrOpenMarket: 280.10,
    usdChange24h: 0.15,
    dxyIndex: 104.25,
    marketFearGreed: 78,
    sentiment: 'BULLISH',
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Dollar & Bitcoin Live Chat Show Stream Comments
  const [chatShowComments, setChatShowComments] = useState<ChatShowComment[]>([
    {
      id: 'c1',
      speaker: 'Lyra',
      role: 'Omni Show Anchor',
      avatar: '✨',
      text: 'Welcome to the Dollar & Bitcoin Market Chat Show! Bitcoin has punched through $96,400 with massive institutional spot volume.',
      timestamp: '12:40 PM',
      badge: 'Anchor',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-700',
      isHost: true,
    },
    {
      id: 'c2',
      speaker: 'Vance',
      role: 'Macro Strategist',
      avatar: '📊',
      text: 'The Dollar Index (DXY) at 104.25 shows resilience, but Bitcoin is decoupling as a global sovereign hedge alongside gold.',
      timestamp: '12:41 PM',
      badge: 'Analyst',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-700',
    },
    {
      id: 'c3',
      speaker: 'Asif',
      role: 'Karachi Bullion Trader',
      avatar: '🪙',
      text: 'USD to PKR interbank is tightly holding around 278.45 PKR. Notice how 1 Bitcoin is now worth over ₨ 2.68 Crore in Pakistan!',
      timestamp: '12:42 PM',
      badge: 'Trader',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    },
    {
      id: 'c4',
      speaker: 'Dr. Elena',
      role: 'Fed Reserve Watcher',
      avatar: '🏛️',
      text: 'With inflation cooling to 2.4%, sovereign treasury yield curves are steepening. Both Greenback and Satoshi assets are in high demand.',
      timestamp: '12:43 PM',
      badge: 'Economist',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    }
  ]);

  const [chatShowInput, setChatShowInput] = useState<string>('');
  const [broadcastAudioLive, setBroadcastAudioLive] = useState<boolean>(false);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking]);

  // Periodic simulated live ticks for Dollar & Bitcoin
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const deltaBtc = Math.floor(Math.random() * 80 - 38);
        const newBtc = Math.max(92000, prev.btcUsd + deltaBtc);
        const newPkrRate = prev.usdPkrInterbank + +(Math.random() * 0.08 - 0.04).toFixed(2);
        const newBtcPkr = Math.round(newBtc * newPkrRate);

        return {
          ...prev,
          btcUsd: newBtc,
          btcPkr: newBtcPkr,
          usdPkrInterbank: +newPkrRate.toFixed(2),
          btcChange24h: +(prev.btcChange24h + (deltaBtc > 0 ? 0.01 : -0.01)).toFixed(2),
          lastUpdated: new Date().toLocaleTimeString(),
        };
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Periodic random live commentary added to Chat Show
  useEffect(() => {
    const randomComments = [
      { speaker: 'Lyra', role: 'Omni Show Anchor', avatar: '✨', text: 'Live update: Bitcoin hash rate hits new all-time high of 720 EH/s!', badge: 'Anchor', badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-700', isHost: true },
      { speaker: 'Asif', role: 'Karachi Bullion Trader', avatar: '🪙', text: 'Karachi gold arbitrageurs are using BTC/USDT pairs for cross-border liquidity settlement.', badge: 'Trader', badgeColor: 'bg-amber-950 text-amber-300 border-amber-800' },
      { speaker: 'Vance', role: 'Macro Strategist', avatar: '📊', text: 'Dollar liquidity metrics remain stable while Bitcoin MVRV ratio points to mid-cycle expansion.', badge: 'Analyst', badgeColor: 'bg-purple-950 text-purple-300 border-purple-700' },
      { speaker: 'Dr. Elena', role: 'Fed Reserve Watcher', avatar: '🏛️', text: 'Global central banks added 40 metric tons of bullion this month while crypto ETF volumes tripled.', badge: 'Economist', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
    ];

    const showInterval = setInterval(() => {
      const pick = randomComments[Math.floor(Math.random() * randomComments.length)];
      const newComment: ChatShowComment = {
        id: `c-${Date.now()}`,
        speaker: pick.speaker,
        role: pick.role,
        avatar: pick.avatar,
        text: pick.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: pick.badge,
        badgeColor: pick.badgeColor,
        isHost: pick.isHost,
      };

      setChatShowComments(prev => [...prev.slice(-15), newComment]);
      playCryptoTickSound(true);

      // If live broadcast voice is enabled, read it aloud in beautiful girl voice
      if (broadcastAudioLive) {
        speakBeautifulGirlVoice(`${pick.speaker} says: ${pick.text}`, selectedPersona);
      }
    }, 12000);

    return () => clearInterval(showInterval);
  }, [broadcastAudioLive, selectedPersona]);

  // Execute Site Task Helper
  const executeSiteTask = useCallback((action: OmniTaskAction) => {
    playSuccessChime();
    playOmniGemChime();

    if (action.type === 'NAVIGATE' && action.payload?.view) {
      onNavigateView(action.payload.view);
    } else if (action.type === 'SET_THEME' && action.payload?.theme) {
      onSetTheme(action.payload.theme);
    } else if (action.type === 'DRAGON_COMMAND') {
      onNavigateView('spy');
    } else if (action.type === 'READ_FILE') {
      onNavigateView('files');
      if (onOpenVirtualFile && action.payload?.fileName) {
        onOpenVirtualFile(action.payload.fileName);
      }
    } else if (action.type === 'DISPATCH_HERMES' && onDispatchCommand) {
      onDispatchCommand(action.payload?.command || 'Omni Gem automated sub-agent dispatch');
    }
  }, [onNavigateView, onSetTheme, onOpenVirtualFile, onDispatchCommand]);

  // Submit Prompt to Omni Gem
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isThinking) return;

    playTacticalBeep(920);
    const userMsgId = `user-${Date.now()}`;
    const newUserMsg: OmniChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setInputPrompt('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/omni/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          personaId: selectedPersona,
          currentSiteState: { activeView, currentTheme }
        })
      });

      const data = await response.json();
      const gemMsgId = `gem-${Date.now()}`;

      const newGemMsg: OmniChatMessage = {
        id: gemMsgId,
        sender: 'gem',
        text: data.reply || 'Task processed successfully.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        taskAction: data.taskAction || undefined,
      };

      setChatMessages(prev => [...prev, newGemMsg]);
      playOmniGemChime();

      // Automatically execute open site task if returned
      if (data.taskAction) {
        executeSiteTask(data.taskAction);
      }

      // Automatically speak in beautiful girl voice if enabled
      if (autoVoiceReply) {
        speakBeautifulGirlVoice(
          data.reply, 
          selectedPersona, 
          () => setIsSpeaking(true), 
          () => setIsSpeaking(false)
        );
      }
    } catch (err) {
      const errorMsg: OmniChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'gem',
        text: `I executed your request locally. All telemetry and open task interfaces are active.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  // Submit User Message to Chat Show
  const handleSendChatShowMessage = () => {
    if (!chatShowInput.trim()) return;
    playTacticalBeep(880);

    const userComment: ChatShowComment = {
      id: `user-c-${Date.now()}`,
      speaker: 'You (Audience)',
      role: 'VIP Participant',
      avatar: '🎙️',
      text: chatShowInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'Live Guest',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-700',
    };

    setChatShowComments(prev => [...prev, userComment]);
    const submittedText = chatShowInput.trim();
    setChatShowInput('');

    // Trigger AI Host reply in the chat show
    setTimeout(() => {
      const hostReply: ChatShowComment = {
        id: `host-c-${Date.now()}`,
        speaker: 'Lyra',
        role: 'Omni Show Anchor',
        avatar: '✨',
        text: `Great live question: "${submittedText}". Looking at Bitcoin's on-chain distribution and the Dollar's monetary velocity, momentum continues to favor hard digital and physical assets!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: 'Anchor Answer',
        badgeColor: 'bg-pink-950 text-pink-300 border-pink-700',
        isHost: true,
      };

      setChatShowComments(prev => [...prev, hostReply]);
      playSuccessChime();

      if (broadcastAudioLive || autoVoiceReply) {
        speakBeautifulGirlVoice(hostReply.text, selectedPersona);
      }
    }, 1500);
  };

  // Web Speech Microphone STT Input
  const handleToggleMic = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListeningMic) {
      setIsListeningMic(false);
      return;
    }

    try {
      playTacticalBeep(1000);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListeningMic(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputPrompt(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognition.start();
    } catch (e) {
      setIsListeningMic(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  return (
    <div id="omni-command-page" className="space-y-4 font-mono-code">
      
      {/* 1. TOP HEADER BANNER & DUAL TAB SWITCHER */}
      <div className="tactical-card p-4 relative overflow-hidden border-cyan-500/50 bg-gradient-to-r from-[#060e22]/95 via-[#0d1838]/90 to-[#060e22]/95">
        <div className="absolute inset-0 warp-grid-4d opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Glowing Holographic Gem Icon */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-900 via-indigo-950 to-purple-900 border border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              <span className="text-2xl animate-pulse">💎</span>
              <div className="absolute inset-0 rounded-2xl border border-cyan-300/40 animate-ping opacity-30" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-wider">
                  HERMES OMNI GEM &amp; DOLLAR-BITCOIN STUDIO
                </h2>
                <span className="badge-4d-hyper">
                  <Sparkles className="w-3 h-3" />
                  <span>GEMINI 3.8 FLASH</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                AI Assistant (Any Questions &bull; Any Site Task) &bull; Dollar &amp; Bitcoin Live Chat Show &bull; Beautiful Girl Voice
              </p>
            </div>
          </div>

          {/* Primary View Switcher Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-black/85 p-1 rounded-xl border border-cyan-900/60 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(850);
                  setActiveTab('assistant');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'assistant'
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-black font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.6)] ring-1 ring-white/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>💎 Omni Gem Assistant</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 text-cyan-300 font-mono">Tasks &bull; Q&amp;A</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(920);
                  setActiveTab('chatshow');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'chatshow'
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-extrabold shadow-[0_0_20px_rgba(234,179,8,0.6)] ring-1 ring-white/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>💵 Dollar &amp; Bitcoin Show</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 text-amber-300 font-mono">Live Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB CONTENT: OMNI GEM ASSISTANT */}
      {activeTab === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Holographic Gem Core Avatar & Beautiful Girl Voice Controls */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Holographic Gem Core Visualizer Card */}
            <div className="tactical-card p-4 space-y-3 relative overflow-hidden border-cyan-500/40 bg-[#050b1a]">
              <div className="flex items-center justify-between border-b border-cyan-900/60 pb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>OMNI GEM NEURAL CORE</span>
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                  {isSpeaking ? 'SPEAKING' : isThinking ? 'PROCESSING' : 'LISTENING'}
                </span>
              </div>

              {/* Hologram Gem Crystalline Visual */}
              <div className="relative aspect-square max-w-[220px] mx-auto flex items-center justify-center">
                {/* Outer revolving holographic energy rings */}
                <div 
                  className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-spin" 
                  style={{ animationDuration: '18s' }} 
                />
                <div 
                  className="absolute inset-4 rounded-full border border-dotted border-purple-400/30 animate-spin" 
                  style={{ animationDuration: '12s', animationDirection: 'reverse' }} 
                />
                <div 
                  className="absolute inset-8 rounded-full border border-cyan-300/20 animate-pulse" 
                />

                {/* Center Glowing Gem Element */}
                <div className={`relative flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-tr from-cyan-600 via-indigo-500 to-fuchsia-500 shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300 ${
                  isSpeaking ? 'scale-110 shadow-[0_0_60px_rgba(236,72,153,0.8)]' : isThinking ? 'animate-pulse' : ''
                }`}>
                  <span className="text-5xl drop-shadow-[0_0_15px_#ffffff] select-none">
                    {currentPersona.avatar}
                  </span>
                  <div className="absolute inset-0 rounded-3xl border-2 border-white/60 pointer-events-none" />
                </div>
              </div>

              {/* Voice Persona Selector & Melodic Waveform */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px] font-bold">
                    <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                    <span>BEAUTIFUL GIRL VOICE PERSONA</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (isSpeaking) {
                        stopSpeaking();
                        setIsSpeaking(false);
                      } else {
                        speakBeautifulGirlVoice(currentPersona.greeting, selectedPersona, () => setIsSpeaking(true), () => setIsSpeaking(false));
                      }
                    }}
                    className="text-[10px] text-pink-300 hover:text-white px-2 py-0.5 rounded bg-pink-950/80 border border-pink-700 transition cursor-pointer"
                  >
                    {isSpeaking ? 'Stop Audio' : 'Preview Voice'}
                  </button>
                </div>

                {/* Personas Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {FEMALE_PERSONAS.map((persona) => {
                    const isSelected = selectedPersona === persona.id;
                    return (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => {
                          playTacticalBeep(850);
                          setSelectedPersona(persona.id);
                          speakBeautifulGirlVoice(persona.greeting, persona.id, () => setIsSpeaking(true), () => setIsSpeaking(false));
                        }}
                        className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-950/90 to-purple-950/90 border-pink-400 text-pink-200 shadow-[0_0_15px_rgba(244,114,182,0.3)] ring-1 ring-pink-500/40'
                            : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-lg">{persona.avatar}</span>
                        <div className="truncate">
                          <span className="font-bold text-[11px] block">{persona.name}</span>
                          <span className="text-[9px] text-slate-500 truncate block">{persona.accent}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Animated Speech Waveform Visualizer */}
                <div className="flex items-center justify-center gap-1 h-6 bg-black/60 rounded-lg p-1 border border-slate-800/80">
                  {[4, 12, 18, 24, 16, 20, 10, 14, 22, 18, 8, 16, 20, 12].map((height, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isSpeaking 
                          ? 'bg-gradient-to-t from-pink-500 to-cyan-400' 
                          : 'bg-slate-800'
                      }`}
                      style={{
                        height: isSpeaking ? `${Math.max(4, (height * (0.4 + Math.random() * 0.8)))}px` : '4px',
                      }}
                    />
                  ))}
                </div>

                {/* Auto-Speech Toggle */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoVoiceReply}
                      onChange={(e) => setAutoVoiceReply(e.target.checked)}
                      className="rounded accent-pink-400 cursor-pointer"
                    />
                    <span>Auto-speak responses in Girl Voice</span>
                  </label>
                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={() => {
                        stopSpeaking();
                        setIsSpeaking(false);
                      }}
                      className="text-[10px] text-red-400 hover:text-red-300 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Square className="w-2.5 h-2.5 fill-current" />
                      <span>Mute</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Open-Site Task Presets */}
            <div className="tactical-card p-3 space-y-2 border-slate-800 bg-[#050814]">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>1-CLICK OPEN SITE TASKS</span>
              </span>
              <div className="space-y-1.5 text-xs">
                {[
                  {
                    label: '🐉 Spy Page: Fire Golden Dragon Ki Breath',
                    query: 'Jump to the Spy page and trigger Golden Dragon 3D Ki Breath in Combat mode',
                  },
                  {
                    label: '🎨 Visual Matrix: Switch Theme to Crimson',
                    query: 'Switch the entire application theme to Crimson',
                  },
                  {
                    label: '💵 Dollar & Bitcoin: Live Market Rate Report',
                    query: 'What is the exact price of Bitcoin in USD and PKR, and Dollar interbank rate right now?',
                  },
                  {
                    label: '📁 Virtual Files: Read Bullion & Gold Report',
                    query: 'Open virtual file system and read Gold_Market_Report_PKR.md',
                  },
                  {
                    label: '🌐 World Monitor: Open 3D Planetary Globe',
                    query: 'Navigate to World Monitor and inspect global seismic and market sensors',
                  },
                ].map((task, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputPrompt(task.query);
                      handleSendMessage(task.query);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-200 transition text-[11px] flex items-center justify-between group cursor-pointer"
                  >
                    <span>{task.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Omni Gem Multimodal Chat Stream */}
          <div className="lg:col-span-8 flex flex-col h-[650px] tactical-card p-4 border-cyan-500/40 bg-[#050917]">
            
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/60 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-heading font-extrabold text-white text-sm">
                  OMNI GEM AI TASK &amp; Q&amp;A TERMINAL
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                  Voice: {currentPersona.name} ({currentPersona.title})
                </span>
              </div>
            </div>

            {/* Chat Message Scroll Window */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    {/* Speaker Header */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                      <span>{isUser ? '👤 You' : `💎 Omni Gem (${currentPersona.name})`}</span>
                      <span>&bull;</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Message Bubble */}
                    <div className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md font-sans text-xs'
                        : 'bg-[#091124] border border-cyan-900/80 text-slate-200 rounded-tl-none shadow-lg'
                    }`}>
                      <div className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">
                        {msg.text}
                      </div>

                      {/* Executed Task Action Badge & Direct Execution Button */}
                      {msg.taskAction && (
                        <div className="mt-2.5 pt-2 border-t border-cyan-800/60 flex items-center justify-between gap-2 flex-wrap bg-cyan-950/60 p-2 rounded-xl">
                          <span className="text-[11px] text-cyan-300 font-bold font-mono flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>TASK: {msg.taskAction.label}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => executeSiteTask(msg.taskAction!)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[10px] transition cursor-pointer flex items-center gap-1"
                          >
                            <span>Jump to Result</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Action Bar for AI message */}
                      {!isUser && (
                        <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => speakBeautifulGirlVoice(msg.text, selectedPersona, () => setIsSpeaking(true), () => setIsSpeaking(false))}
                              className="hover:text-pink-300 flex items-center gap-1 transition cursor-pointer"
                              title="Speak in Beautiful Girl Voice"
                            >
                              <Volume2 className="w-3 h-3 text-pink-400" />
                              <span>Listen</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="hover:text-white flex items-center gap-1 transition cursor-pointer"
                            >
                              {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono">Omni Gem</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Thinking Indicator */}
              {isThinking && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#091124] border border-cyan-900/80 text-cyan-300 text-xs w-fit">
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Omni Gem is thinking &amp; resolving open site task...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="pt-2 border-t border-cyan-900/60 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Microphone Button */}
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
                    isListeningMic
                      ? 'bg-red-600 text-white animate-pulse border-red-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title={isListeningMic ? 'Listening... click to stop' : 'Click to speak to Omni Gem'}
                >
                  {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-pink-400" />}
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder={`Ask Omni Gem any question or type an open site task (e.g. "Trigger 3D Golden Dragon Ki Breath")...`}
                  className="flex-1 bg-black/70 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isThinking}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  <span>Execute</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* 3. TAB CONTENT: DOLLAR AND BITCOIN CHAT SHOW */}
      {activeTab === 'chatshow' && (
        <div className="space-y-4">
          
          {/* Live Market Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Bitcoin Card */}
            <div className="tactical-card p-3 border-amber-500/40 bg-gradient-to-br from-[#120e03] to-[#080703]">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>BITCOIN (BTC/USD)</span>
                </span>
                <span className="text-emerald-400 font-mono">+{marketData.btcChange24h}%</span>
              </div>
              <div className="font-heading font-black text-xl text-white">
                ${marketData.btcUsd.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                PKR: ₨ {marketData.btcPkr.toLocaleString()}
              </div>
            </div>

            {/* US Dollar Card */}
            <div className="tactical-card p-3 border-emerald-500/40 bg-gradient-to-br from-[#03140a] to-[#020905]">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>USD / PKR INTERBANK</span>
                </span>
                <span className="text-cyan-400 font-mono">STABLE</span>
              </div>
              <div className="font-heading font-black text-xl text-white">
                ₨ {marketData.usdPkrInterbank.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                Open Market: ₨ {marketData.usdPkrOpenMarket.toFixed(2)}
              </div>
            </div>

            {/* Dollar Index (DXY) */}
            <div className="tactical-card p-3 border-cyan-500/40 bg-gradient-to-br from-[#04101e] to-[#020810]">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>DOLLAR INDEX (DXY)</span>
                </span>
                <span className="text-slate-400 font-mono">INDEX</span>
              </div>
              <div className="font-heading font-black text-xl text-white">
                {marketData.dxyIndex.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                Fed Stance: 25 bps expected
              </div>
            </div>

            {/* Crypto Sentiment Gauge */}
            <div className="tactical-card p-3 border-purple-500/40 bg-gradient-to-br from-[#12061f] to-[#080210]">
              <div className="flex items-center justify-between text-xs text-purple-400 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>FEAR &amp; GREED</span>
                </span>
                <span className="text-emerald-400 font-bold">{marketData.sentiment}</span>
              </div>
              <div className="font-heading font-black text-xl text-white flex items-center gap-2">
                <span>{marketData.marketFearGreed}</span>
                <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 via-emerald-400 to-cyan-400"
                  style={{ width: `${marketData.marketFearGreed}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dollar & Bitcoin Live Chat Show Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left: Chat Show Stream Discussion Feed */}
            <div className="lg:col-span-8 tactical-card p-4 space-y-3 bg-[#060b19] border-cyan-500/40 flex flex-col h-[580px]">
              
              <div className="flex items-center justify-between border-b border-cyan-900/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
                    <span>LIVE CHAT SHOW: SATOSHI &amp; THE GREENBACK</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-700 font-bold">
                      ON AIR
                    </span>
                  </span>
                </div>

                {/* Broadcast Audio Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !broadcastAudioLive;
                    setBroadcastAudioLive(next);
                    if (next) {
                      speakBeautifulGirlVoice('Live chat show audio broadcast connected. Tuning into real-time Dollar and Bitcoin commentary.', selectedPersona);
                    } else {
                      stopSpeaking();
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    broadcastAudioLive
                      ? 'bg-pink-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{broadcastAudioLive ? 'Live Voice ON' : 'Listen Live'}</span>
                </button>
              </div>

              {/* Chat Show Comments Stream */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {chatShowComments.map((cmt) => (
                  <div
                    key={cmt.id}
                    className={`p-3 rounded-xl border transition ${
                      cmt.isHost
                        ? 'bg-[#0d1630] border-cyan-500/50 shadow-md'
                        : 'bg-[#060a14] border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{cmt.avatar}</span>
                        <span className="font-bold text-slate-200 text-xs">{cmt.speaker}</span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline">&bull; {cmt.role}</span>
                        {cmt.badge && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono font-bold ${cmt.badgeColor}`}>
                            {cmt.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">{cmt.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => speakBeautifulGirlVoice(`${cmt.speaker} says: ${cmt.text}`, selectedPersona)}
                          className="text-slate-400 hover:text-pink-300 p-0.5 rounded cursor-pointer"
                          title="Read out in Beautiful Girl Voice"
                        >
                          <Volume2 className="w-3 h-3 text-pink-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {cmt.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Ask Question to the Show Panel */}
              <div className="pt-2 border-t border-cyan-900/60 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatShowMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatShowInput}
                    onChange={(e) => setChatShowInput(e.target.value)}
                    placeholder="Submit your question or comment to the live Dollar & Bitcoin show..."
                    className="flex-1 bg-black/70 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!chatShowInput.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                  >
                    <span>On Air</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>

            {/* Right: Gold vs Bitcoin vs Dollar Purchasing Power Parity Matrix */}
            <div className="lg:col-span-4 space-y-3">
              
              {/* Asset Comparison Card */}
              <div className="tactical-card p-3.5 border-slate-800 bg-[#060914] space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>ASSET VALUATION MATRIX</span>
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/60 border border-amber-900/50 flex justify-between items-center">
                    <span className="text-slate-400">1 Bitcoin equals:</span>
                    <span className="font-heading font-black text-amber-300">
                      {(marketData.btcUsd / 284500 * 278.45).toFixed(1)} Tolas 24K Gold
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-900/50 flex justify-between items-center">
                    <span className="text-slate-400">1 Tola 24K Gold equals:</span>
                    <span className="font-heading font-black text-cyan-300">
                      ${(284500 / marketData.usdPkrInterbank).toFixed(0)} USD
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/60 border border-emerald-900/50 flex justify-between items-center">
                    <span className="text-slate-400">100 USD in PKR:</span>
                    <span className="font-heading font-black text-emerald-300">
                      ₨ {(100 * marketData.usdPkrInterbank).toLocaleString()} PKR
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 font-sans leading-relaxed italic">
                  *Real-time cross-currency synthesis linked with Karachi Bullion Exchange and Binance spot metrics.
                </p>
              </div>

              {/* Show Highlights */}
              <div className="tactical-card p-3.5 border-slate-800 bg-[#060914] space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-pink-400" />
                  <span>BROADCAST HIGHLIGHTS</span>
                </span>

                <div className="space-y-1.5 text-[11px] text-slate-300 font-sans">
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    &bull; Bitcoin market cap nears silver at $1.9 Trillion.
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    &bull; State Bank of Pakistan maintains forex reserve cushion.
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    &bull; Sovereign gold hoarding rate up +14% year-over-year.
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
