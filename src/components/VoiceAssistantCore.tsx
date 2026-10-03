import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Wrench, 
  Sparkles, 
  Sliders, 
  Send, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Radio, 
  ShieldCheck, 
  Plus, 
  Trash2,
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';
import { 
  SystemMemoryNode, 
  SystemSkillsNode, 
  SystemSoulNode, 
  SystemSettingsNode,
  PixelAgent,
  AgentName
} from '../types';
import { playTacticalBeep, playSuccessChime, speakAgentTTS } from '../utils/audio';

interface VoiceAssistantCoreProps {
  memory: SystemMemoryNode;
  onUpdateMemory: (mem: SystemMemoryNode) => void;
  skills: SystemSkillsNode;
  onUpdateSkills: (sk: SystemSkillsNode) => void;
  soul: SystemSoulNode;
  onUpdateSoul: (sl: SystemSoulNode) => void;
  settings: SystemSettingsNode;
  onUpdateSettings: (st: SystemSettingsNode) => void;
  onExecuteCommand: (cmd: string) => void;
  isDispatching: boolean;
  agents: PixelAgent[];
}

interface ConversationMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  circuitTriggered?: 'MEMORY' | 'SKILLS' | 'SOUL' | 'SETTINGS';
}

export const VoiceAssistantCore: React.FC<VoiceAssistantCoreProps> = ({
  memory,
  onUpdateMemory,
  skills,
  onUpdateSkills,
  soul,
  onUpdateSoul,
  settings,
  onUpdateSettings,
  onExecuteCommand,
  isDispatching,
  agents,
}) => {
  const [activeCircuit, setActiveCircuit] = useState<'VOICE_CORE' | 'MEMORY' | 'SKILLS' | 'SOUL' | 'SETTINGS'>('VOICE_CORE');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [newMemKey, setNewMemKey] = useState('');
  const [newMemVal, setNewMemVal] = useState('');
  
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hermes Core online. All four circuits—Memory, Skills, Personality (Soul), and Settings—are synchronized and operational. What is your objective?',
      timestamp: '08:30:00',
      circuitTriggered: 'SOUL',
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          handleSend(transcript.trim());
          setTranscript('');
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleMic = () => {
    playTacticalBeep(isListening ? 450 : 750);
    if (!isListening) {
      setIsListening(true);
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (e) {
        // Speech recognition fallback
        setTimeout(() => {
          setTranscript('Scrape live gold bullion rates and update 3D world monitor');
        }, 1500);
      }
    } else {
      setIsListening(false);
      recognitionRef.current?.stop();
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    playTacticalBeep(650);
    const userMsg: ConversationMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Trigger Hermes Router
    onExecuteCommand(query);

    // Generate Assistant Conversational Response
    setTimeout(() => {
      let reply = `Executing directive across sub-agent mesh. Delegating sub-tasks to Alice, Bob, Carol, and Dave.`;
      if (query.toLowerCase().includes('gold') || query.toLowerCase().includes('rate')) {
        reply = `Bob has dispatched the high-frequency Karachi bullion scraper. Spot rates and USD/PKR deltas ingested.`;
      } else if (query.toLowerCase().includes('radar') || query.toLowerCase().includes('satellite') || query.toLowerCase().includes('threat')) {
        reply = `Carol is sweeping GEO-PK-09 SAR radar feeds across designated maritime and cyber sectors.`;
      } else if (query.toLowerCase().includes('research') || query.toLowerCase().includes('file') || query.toLowerCase().includes('brief')) {
        reply = `Alice is compiling the structured intelligence briefing in the Stonic Data virtual filesystem.`;
      } else if (query.toLowerCase().includes('cpu') || query.toLowerCase().includes('system') || query.toLowerCase().includes('process')) {
        reply = `Dave has audited system processes and background telemetry. Core latency 0.42ms.`;
      }

      const botMsg: ConversationMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        circuitTriggered: 'SKILLS',
      };
      setMessages(prev => [...prev, botMsg]);
      if (settings.ttsVoiceEnabled) {
        speakAgentTTS(reply);
      }
    }, 600);
  };

  const handleAddMemory = () => {
    if (!newMemKey.trim() || !newMemVal.trim()) return;
    playSuccessChime();
    const updated = {
      ...memory,
      longTermKnowledge: [
        ...memory.longTermKnowledge,
        { key: newMemKey.trim(), val: newMemVal.trim(), timestamp: new Date().toISOString() }
      ],
      activeTokensCount: memory.activeTokensCount + 64,
    };
    onUpdateMemory(updated);
    setNewMemKey('');
    setNewMemVal('');
  };

  const handleRemoveMemory = (index: number) => {
    playTacticalBeep(500);
    const updated = {
      ...memory,
      longTermKnowledge: memory.longTermKnowledge.filter((_, i) => i !== index),
      activeTokensCount: Math.max(128, memory.activeTokensCount - 64),
    };
    onUpdateMemory(updated);
  };

  const handleToggleSkill = (skillId: string) => {
    playTacticalBeep(650);
    const updated = {
      ...skills,
      skillsList: skills.skillsList.map(s => s.id === skillId ? { ...s, enabled: !s.enabled } : s)
    };
    onUpdateSkills(updated);
  };

  const handleArchetypeSelect = (archetype: string) => {
    playSuccessChime();
    let directive = soul.coreDirective;
    let temp = soul.temperament;
    let creat = soul.creativityLevel;

    if (archetype === 'Tactical Commander') {
      directive = 'Execute mission-critical tasks with military precision, brevity, and zero latency.';
      temp = 'Decisive, structured, low-chatter';
      creat = 0.2;
    } else if (archetype === 'Cyberpunk Copilot') {
      directive = 'Hack through system bottlenecks, optimize desktop automation, and provide witty telemetry insights.';
      temp = 'Edgy, hyper-competent, rapid-fire';
      creat = 0.8;
    } else if (archetype === 'Academic Analyst') {
      directive = 'Produce rigorous analytical summaries, cross-examine market rates, and ensure deep validation.';
      temp = 'Analytical, thorough, epistemically careful';
      creat = 0.4;
    } else {
      directive = 'Provide friendly, collaborative, and seamless desktop voice assistance.';
      temp = 'Empathetic, clear, supportive';
      creat = 0.6;
    }

    onUpdateSoul({
      ...soul,
      identity: archetype,
      temperament: temp,
      coreDirective: directive,
      creativityLevel: creat,
    });
  };

  return (
    <div id="stonic-voice-assistant-core" className="w-full space-y-4 font-mono-code">
      {/* Top Circuit Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl tactical-card border border-cyan-900/60 bg-gradient-to-r from-slate-950 via-[#0a1426] to-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Mic className={`w-5 h-5 ${isListening ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-slate-100">
                Hermes Voice Assistant Core
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold">
                4-CIRCUIT ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Voice-driven neural core engineered from Memory, Skills, Personality (Soul), and Settings circuits.
            </p>
          </div>
        </div>

        {/* 4 Circuits Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              playTacticalBeep(600);
              setActiveCircuit('VOICE_CORE');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeCircuit === 'VOICE_CORE'
                ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Voice Core
          </button>
          <button
            type="button"
            onClick={() => {
              playTacticalBeep(600);
              setActiveCircuit('MEMORY');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeCircuit === 'MEMORY'
                ? 'bg-indigo-950 border border-indigo-500/60 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            1. Memory
          </button>
          <button
            type="button"
            onClick={() => {
              playTacticalBeep(600);
              setActiveCircuit('SKILLS');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeCircuit === 'SKILLS'
                ? 'bg-amber-950 border border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            2. Skills
          </button>
          <button
            type="button"
            onClick={() => {
              playTacticalBeep(600);
              setActiveCircuit('SOUL');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeCircuit === 'SOUL'
                ? 'bg-rose-950 border border-rose-500/60 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            3. Personality (Soul)
          </button>
          <button
            type="button"
            onClick={() => {
              playTacticalBeep(600);
              setActiveCircuit('SETTINGS');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeCircuit === 'SETTINGS'
                ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            4. Settings
          </button>
        </div>
      </div>

      {/* Circuit 1: VOICE CORE & CONVERSATION ORB */}
      {activeCircuit === 'VOICE_CORE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Glowing Plasma Orb & Voice Interaction (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-xl tactical-card border border-cyan-950/80 bg-slate-950/90 flex flex-col items-center justify-center text-center space-y-5">
            {/* Plasma Voice Orb */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
                isListening
                  ? 'bg-rose-500/40 animate-ping'
                  : isDispatching
                  ? 'bg-cyan-500/40 animate-pulse'
                  : 'bg-cyan-500/20'
              }`} />
              
              <div 
                onClick={toggleMic}
                className={`relative w-36 h-36 rounded-full border-2 flex items-center justify-center cursor-pointer shadow-2xl transition-all duration-300 group ${
                  isListening
                    ? 'border-rose-500 bg-rose-950/60 shadow-[0_0_40px_rgba(244,63,94,0.5)] scale-105'
                    : 'border-cyan-500/60 bg-gradient-to-tr from-cyan-950/90 via-[#0a1a36] to-slate-950 hover:border-cyan-400 hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Mic className={`w-10 h-10 ${isListening ? 'text-rose-400 animate-bounce' : 'text-cyan-400 group-hover:scale-110'} transition-transform`} />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    {isListening ? 'Listening...' : 'Tap to Talk'}
                  </span>
                </div>
              </div>
            </div>

            {/* Audio Waveform Bars Simulation */}
            <div className="flex items-center gap-1.5 h-8">
              {[40, 70, 90, 60, 100, 75, 45, 85, 95, 65, 50, 80].map((val, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-200 ${
                    isListening
                      ? 'bg-rose-400 animate-pulse'
                      : isDispatching
                      ? 'bg-cyan-400 animate-pulse'
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height: isListening ? `${Math.max(20, Math.random() * 100)}%` : `${val * 0.3}%`
                  }}
                />
              ))}
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-200">
                {isListening ? 'Neural Voice Ingestion Active' : 'Speech & Voice Engine Standby'}
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                {transcript || 'Click the orb or choose a quick prompt to delegate across the mesh.'}
              </div>
            </div>

            {/* Voice Command Quick Triggers */}
            <div className="w-full space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="text-[10px] text-slate-500 text-left font-bold uppercase">
                Quick Voice Directives:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Scrape Karachi Bullion Rates',
                  'SAR Radar Sector Sweep',
                  'Write Intelligence Brief',
                  'Audit System Processes',
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500 text-[10px] text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Conversational Stream & Chat Terminal (7 cols) */}
          <div className="lg:col-span-7 p-4 rounded-xl tactical-card border border-cyan-950/80 bg-slate-950/90 flex flex-col justify-between h-[450px]">
            {/* Message Stream */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                      <span>{isUser ? 'Commander' : 'Hermes Neural Core'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      {msg.circuitTriggered && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-[9px] text-cyan-300">
                          {msg.circuitTriggered} CIRCUIT
                        </span>
                      )}
                    </div>

                    <div className={`p-3 rounded-xl max-w-[85%] text-xs font-sans leading-relaxed ${
                      isUser
                        ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-100'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Speak or type a command for Hermes and sub-agents..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-code"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isDispatching}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Circuit 2: MEMORY CIRCUIT */}
      {activeCircuit === 'MEMORY' && (
        <div className="p-5 rounded-xl tactical-card border border-indigo-900/60 bg-slate-950/90 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-950/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                Circuit 1: Memory Architecture & Knowledge Graph
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Episodic and long-term key-value knowledge memory nodes indexed by Vega for fast semantic retrieval.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-indigo-400 font-bold">
                Tokens: {memory.activeTokensCount} / {memory.maxContextTokens}
              </span>
              <div className="w-32 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${(memory.activeTokensCount / memory.maxContextTokens) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Add New Memory Node */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-950 flex flex-col sm:flex-row items-center gap-2 text-xs">
            <input
              type="text"
              value={newMemKey}
              onChange={(e) => setNewMemKey(e.target.value)}
              placeholder="Memory Key (e.g. user_risk_tolerance, gold_base_currency)"
              className="w-full sm:w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono-code"
            />
            <input
              type="text"
              value={newMemVal}
              onChange={(e) => setNewMemVal(e.target.value)}
              placeholder="Memory Value / Fact"
              className="w-full sm:flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono-code"
            />
            <button
              type="button"
              onClick={handleAddMemory}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Node
            </button>
          </div>

          {/* Existing Memory Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {memory.longTermKnowledge.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-indigo-300">{item.key}</div>
                  <div className="text-xs text-slate-300 mt-1 font-sans">{item.val}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{item.timestamp}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMemory(idx)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Circuit 3: SKILLS CIRCUIT */}
      {activeCircuit === 'SKILLS' && (
        <div className="p-5 rounded-xl tactical-card border border-amber-900/60 bg-slate-950/90 space-y-4">
          <div className="border-b border-amber-950/80 pb-3">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              Circuit 2: Registered Skills & Tool Calling Capabilities
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Toggle and configure capabilities mapped directly to autonomous agents in Agent Town.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.skillsList.map((skill) => (
              <div
                key={skill.id}
                className={`p-3.5 rounded-xl border transition ${
                  skill.enabled
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{skill.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-[10px] text-amber-300">
                        Assigned: {skill.agentAssigned}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-sans">
                      {skill.description}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleSkill(skill.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      skill.enabled
                        ? 'bg-amber-500 text-black font-extrabold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {skill.enabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Circuit 4: PERSONALITY (SOUL) CIRCUIT */}
      {activeCircuit === 'SOUL' && (
        <div className="p-5 rounded-xl tactical-card border border-rose-900/60 bg-slate-950/90 space-y-4">
          <div className="border-b border-rose-950/80 pb-3">
            <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              Circuit 3: Personality (Soul) & Prompt Archetype Engine
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Calibrate tone, empathy, creative initiative, and system safety constraints.
            </p>
          </div>

          {/* Archetype Quick Presets */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">
              Personality Archetype Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'Tactical Commander', icon: '⚔️', desc: 'Crisp military precision & brevity' },
                { name: 'Cyberpunk Copilot', icon: '⚡', desc: 'Witty, hyper-competent, rapid' },
                { name: 'Academic Analyst', icon: '📜', desc: 'Thorough, deep analytical rigor' },
                { name: 'Friendly Assistant', icon: '🤝', desc: 'Supportive, conversational, warm' },
              ].map((arch) => (
                <button
                  key={arch.name}
                  type="button"
                  onClick={() => handleArchetypeSelect(arch.name)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    soul.identity === arch.name
                      ? 'bg-rose-950/50 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg mb-1">{arch.icon}</div>
                  <div className="text-xs font-bold text-slate-200">{arch.name}</div>
                  <div className="text-[10px] text-slate-500 font-sans">{arch.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Directives & Sliders */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Core Directive Prompt
              </label>
              <textarea
                value={soul.coreDirective}
                onChange={(e) => onUpdateSoul({ ...soul, coreDirective: e.target.value })}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono-code"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Creativity & Initiative Quotient</span>
                  <span className="text-rose-300 font-bold">{Math.round(soul.creativityLevel * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soul.creativityLevel}
                  onChange={(e) => onUpdateSoul({ ...soul, creativityLevel: parseFloat(e.target.value) })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Safety & Grounding Level</span>
                  <span className="text-emerald-400 font-bold">STRICT_CONSTRAINTS</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AST Linting & Hallucination Filter Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Circuit 5: SETTINGS CIRCUIT */}
      {activeCircuit === 'SETTINGS' && (
        <div className="p-5 rounded-xl tactical-card border border-emerald-900/60 bg-slate-950/90 space-y-4">
          <div className="border-b border-emerald-950/80 pb-3">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Circuit 4: Engine Settings & System Diagnostics
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Tune temperature, latency profiles, audio sound packs, and autonomous self-healing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Auto Loop */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Autonomous Self-Healing</div>
                <div className="text-[10px] text-slate-400 font-sans">Auto-restart failed sub-agents and scrapers</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoHealing}
                onChange={(e) => onUpdateSettings({ ...settings, autoHealing: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* TTS Voice Enabled */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Voice TTS Synthesis</div>
                <div className="text-[10px] text-slate-400 font-sans">Natural audio speech playback for responses</div>
              </div>
              <input
                type="checkbox"
                checked={settings.ttsVoiceEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, ttsVoiceEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Temperature */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-300 font-bold">
                <span>Model Temperature</span>
                <span className="text-emerald-300">{settings.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.temperature}
                onChange={(e) => onUpdateSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Sound Pack */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="text-slate-300 font-bold">Audio Feedback Pack</div>
              <select
                value={settings.soundPack}
                onChange={(e: any) => onUpdateSettings({ ...settings, soundPack: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="tactical-beeps">Tactical Cyber Beeps (Default)</option>
                <option value="ambient-synth">Ambient Harmonic Synth</option>
                <option value="silent">Silent / Muted</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
