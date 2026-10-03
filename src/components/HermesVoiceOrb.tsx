import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  Zap, 
  Activity, 
  Maximize2, 
  Minimize2, 
  X, 
  Bot, 
  Play, 
  Pause, 
  AudioLines as WaveformIcon,
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { playTacticalBeep, playDispatchChirp, speakAgentTTS } from '../utils/audio';

export type OrbTheme = 'sapphire' | 'cyan' | 'violet' | 'solar' | 'emerald';
export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface HermesVoiceOrbProps {
  onDispatchVoiceCommand: (command: string) => Promise<void>;
  isProcessing: boolean;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  lastIntent?: string;
  activeAgentResponse?: string;
}

const ORB_THEMES: Record<OrbTheme, {
  name: string;
  coreGradient: string;
  plasmaGlow: string;
  equatorLaser: string;
  ambientRing: string;
  badgeBg: string;
  accentText: string;
}> = {
  sapphire: {
    name: 'Sapphire Horizon (Default)',
    coreGradient: 'from-blue-900 via-indigo-700 to-blue-500',
    plasmaGlow: 'rgba(59, 130, 246, 0.45)',
    equatorLaser: '#60a5fa',
    ambientRing: 'border-blue-500/40 shadow-[0_0_35px_rgba(59,130,246,0.35)]',
    badgeBg: 'bg-blue-950/80 border-blue-600/60 text-blue-300',
    accentText: 'text-blue-400',
  },
  cyan: {
    name: 'Cybernetic Cyan',
    coreGradient: 'from-cyan-900 via-teal-700 to-cyan-400',
    plasmaGlow: 'rgba(6, 182, 212, 0.5)',
    equatorLaser: '#22d3ee',
    ambientRing: 'border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.4)]',
    badgeBg: 'bg-cyan-950/80 border-cyan-600/60 text-cyan-300',
    accentText: 'text-cyan-400',
  },
  violet: {
    name: 'Quantum Nebula',
    coreGradient: 'from-purple-950 via-indigo-900 to-violet-500',
    plasmaGlow: 'rgba(168, 85, 247, 0.45)',
    equatorLaser: '#c084fc',
    ambientRing: 'border-purple-500/40 shadow-[0_0_35px_rgba(168,85,247,0.35)]',
    badgeBg: 'bg-purple-950/80 border-purple-600/60 text-purple-300',
    accentText: 'text-purple-400',
  },
  solar: {
    name: 'Solar Bullion Gold',
    coreGradient: 'from-amber-950 via-yellow-800 to-amber-400',
    plasmaGlow: 'rgba(245, 158, 11, 0.45)',
    equatorLaser: '#fbbf24',
    ambientRing: 'border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.35)]',
    badgeBg: 'bg-amber-950/80 border-amber-600/60 text-amber-300',
    accentText: 'text-amber-400',
  },
  emerald: {
    name: 'Matrix Biosphere',
    coreGradient: 'from-emerald-950 via-teal-900 to-emerald-400',
    plasmaGlow: 'rgba(16, 185, 129, 0.45)',
    equatorLaser: '#34d399',
    ambientRing: 'border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.35)]',
    badgeBg: 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300',
    accentText: 'text-emerald-400',
  },
};

const SUGGESTED_VOICE_COMMANDS = [
  'Scrape live gold bullion rates and PKR metrics',
  'Activate Sat-Link GEO-PK-09 orbital telemetry',
  'Reassign Oliver to Research and Sam to Scraper',
  'Write Stonic intelligence briefing to storage',
  'Perform market volatility calculation for 24K gold',
  'Scan active threats in regional surveillance grid'
];

export const HermesVoiceOrb: React.FC<HermesVoiceOrbProps> = ({
  onDispatchVoiceCommand,
  isProcessing,
  ttsEnabled,
  onToggleTts,
  lastIntent,
  activeAgentResponse,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [voiceVolume, setVoiceVolume] = useState<number>(0.2);
  const [theme, setTheme] = useState<OrbTheme>('sapphire');
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [voiceHistory, setVoiceHistory] = useState<Array<{ sender: 'user' | 'hermes'; text: string; time: string }>>([
    {
      sender: 'hermes',
      text: 'Hermes Neural Voice Core initialized. Tap the glowing orb or hold microphone to issue natural language commands.',
      time: 'ONLINE'
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Synchronize state with incoming processing/TTS state
  useEffect(() => {
    if (isProcessing) {
      setOrbState('thinking');
    } else if (isListening) {
      setOrbState('listening');
    } else {
      setOrbState('idle');
    }
  }, [isProcessing, isListening]);

  // Handle Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      recognizer.onstart = () => {
        setIsListening(true);
        setOrbState('listening');
        playTacticalBeep(880, 'sine', 0.1, 0.1);
      };

      recognizer.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        setVoiceVolume(Math.min(1.0, 0.3 + Math.random() * 0.7));
      };

      recognizer.onerror = (event: any) => {
        console.warn('Speech recognition error/cancelled:', event.error);
        setIsListening(false);
        setOrbState('idle');
      };

      recognizer.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          handleExecuteVoiceCommand(transcript.trim());
        } else {
          setOrbState('idle');
        }
      };

      recognitionRef.current = recognizer;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopMicAudioAnalysis();
    };
  }, [transcript]);

  // Start real-time audio volume analyzer if microphone available
  const startMicAudioAnalysis = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkAudio = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalized = Math.min(1.0, Math.max(0.15, avg / 80));
            setVoiceVolume(normalized);
          }
          animationFrameRef.current = requestAnimationFrame(checkAudio);
        };
        checkAudio();
      }
    } catch (e) {
      // Fallback simulated volume pulsation
      simulateAudioPulse();
    }
  };

  const stopMicAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setVoiceVolume(0.2);
  };

  const simulateAudioPulse = () => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      if (!isListening && !isProcessing) {
        clearInterval(interval);
        setVoiceVolume(0.2);
        return;
      }
      setVoiceVolume(0.25 + Math.sin(tick * 0.4) * 0.2 + Math.random() * 0.35);
    }, 100);
  };

  // Toggle Voice Capture
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopMicAudioAnalysis();
      setIsListening(false);
      setOrbState('idle');
      playTacticalBeep(440, 'sine', 0.08, 0.08);
    } else {
      setTranscript('');
      playDispatchChirp();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          startMicAudioAnalysis();
        } catch (e) {
          // Fallback if already running
          setIsListening(true);
          setOrbState('listening');
        }
      } else {
        // Fallback for browsers without Web Speech API
        setIsListening(true);
        setOrbState('listening');
        simulateAudioPulse();
        const demoPhrase = SUGGESTED_VOICE_COMMANDS[Math.floor(Math.random() * SUGGESTED_VOICE_COMMANDS.length)];
        setTranscript(`[Voice detected]: "${demoPhrase}"`);
        setTimeout(() => {
          setIsListening(false);
          handleExecuteVoiceCommand(demoPhrase);
        }, 2200);
      }
    }
  };

  const handleExecuteVoiceCommand = async (cmd: string) => {
    if (!cmd.trim() || isProcessing) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setVoiceHistory(prev => [
      ...prev,
      { sender: 'user', text: cmd, time: now }
    ]);

    setOrbState('thinking');
    playDispatchChirp();
    await onDispatchVoiceCommand(cmd);
    setTranscript('');
    stopMicAudioAnalysis();
    setOrbState('idle');
  };

  // Handle Hermes agent TTS response notification
  useEffect(() => {
    if (activeAgentResponse && ttsEnabled) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setVoiceHistory(prev => [
        ...prev,
        { sender: 'hermes', text: activeAgentResponse, time: now }
      ]);
      setOrbState('speaking');
      setVoiceVolume(0.85);
      setTimeout(() => {
        setOrbState('idle');
        setVoiceVolume(0.2);
      }, 3500);
    }
  }, [activeAgentResponse, ttsEnabled]);

  const currentTheme = ORB_THEMES[theme];

  return (
    <>
      {/* 1. Compact Neural Orb Button in Command Bar */}
      <div className="flex items-center gap-2">
        <button
          id="btn-voice-orb-interactive"
          onClick={toggleListening}
          onDoubleClick={() => setIsExpanded(true)}
          className={`relative group flex items-center justify-center rounded-full p-1 transition-all ${
            isListening
              ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0d131f] shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-105'
              : isProcessing
              ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#0d131f] shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse'
              : 'hover:scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          }`}
          title={isListening ? 'Listening to voice... (Tap to finish)' : 'Hermes Voice Core (Click to speak, Double-click to expand HUD)'}
        >
          {/* Outer Bioluminescent Halo */}
          <div 
            className="absolute inset-0 rounded-full blur-md transition-opacity"
            style={{
              backgroundColor: isListening ? '#22d3ee' : isProcessing ? '#c084fc' : currentTheme.plasmaGlow,
              opacity: isListening ? 0.8 : 0.45,
            }}
          />

          {/* Spherical Glowing Core */}
          <div className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-[#050813] border border-blue-400/40 shadow-inner">
            {/* Plasma Gradient Background */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${currentTheme.coreGradient} opacity-80 animate-spin`} 
              style={{ animationDuration: isProcessing ? '3s' : isListening ? '5s' : '14s' }}
            />
            
            {/* Ambient Radial Cloud */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.45),transparent_60%)] pointer-events-none" />

            {/* Glowing Horizontal Horizon Line (Laser Equator from user image) */}
            <div 
              className="absolute left-0 right-0 h-[2px] z-10 transition-all duration-75"
              style={{
                top: '50%',
                transform: `translateY(-50%) scaleY(${isListening || isProcessing ? 1 + voiceVolume * 3 : 1})`,
                backgroundColor: currentTheme.equatorLaser,
                boxShadow: `0 0 10px ${currentTheme.equatorLaser}, 0 0 4px #ffffff`,
              }}
            />

            {/* Inner Horizon Pulse Wave */}
            {(isListening || isProcessing) && (
              <div 
                className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent top-1/2 -translate-y-1/2 animate-pulse"
              />
            )}

            {/* Central Icon / Status */}
            <div className="relative z-20 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
              {isListening ? (
                <Mic className="w-4 h-4 animate-bounce text-white" />
              ) : isProcessing ? (
                <Sparkles className="w-4 h-4 animate-spin text-purple-200" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
              )}
            </div>
          </div>
        </button>

        {/* Expand HUD Button */}
        <button
          onClick={() => {
            playTacticalBeep(720);
            setIsExpanded(true);
          }}
          className="hidden sm:flex items-center gap-1 px-2 py-1 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/40 hover:border-blue-500/60 rounded-md text-[11px] font-mono-code text-blue-300 transition shadow-sm"
          title="Open Fullscreen Neural Voice Core HUD"
        >
          <WaveformIcon className="w-3 h-3 text-blue-400" />
          <span>VOICE CORE</span>
        </button>
      </div>

      {/* 2. Fullscreen / Modal Neural Voice Core HUD (Matching the uploaded image) */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#070b14] border border-blue-900/80 rounded-2xl shadow-[0_0_50px_rgba(30,58,138,0.4)] overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Ambient Background Grid & Stars */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

            {/* Header Strip */}
            <div className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-blue-950/80 bg-[#090f1d]/90">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping" />
                <div>
                  <h3 className="text-sm font-mono-code font-bold text-white tracking-wider flex items-center gap-2">
                    HERMES NEURAL VOICE CORE
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/50">
                      LIVE ORB HUD
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono-code text-slate-400">
                    Bioluminescent AI Voice Synthesizer &bull; Sub-Agent Voice Terminal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Theme Selector */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-slate-800 text-[10px] font-mono-code">
                  {(Object.keys(ORB_THEMES) as OrbTheme[]).map((tKey) => (
                    <button
                      key={tKey}
                      onClick={() => {
                        playTacticalBeep(650);
                        setTheme(tKey);
                      }}
                      className={`px-2 py-0.5 rounded uppercase transition ${
                        theme === tKey
                          ? 'bg-blue-900/80 text-white font-bold border border-blue-400/50'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tKey}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Close HUD"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Interactive Stage */}
            <div className="relative z-10 flex-1 overflow-y-auto p-5 flex flex-col md:flex-row items-center gap-6">
              
              {/* Left Column: The Grand Glowing AI Voice Orb (Matching Image) */}
              <div className="flex flex-col items-center justify-center w-full md:w-1/2 py-4">
                
                {/* Giant Orb Container with Multi-layer Atmosphere */}
                <div className="relative flex items-center justify-center">
                  
                  {/* Outer Diffuse Aura */}
                  <div 
                    className="absolute w-64 h-64 rounded-full blur-3xl transition-all duration-300 pointer-events-none"
                    style={{
                      backgroundColor: isListening ? '#22d3ee' : isProcessing ? '#c084fc' : currentTheme.plasmaGlow,
                      opacity: 0.35 + voiceVolume * 0.45,
                      transform: `scale(${1 + voiceVolume * 0.15})`,
                    }}
                  />

                  {/* Orbital Resonance Ring */}
                  <div 
                    className={`absolute w-56 h-56 rounded-full border border-dashed border-blue-400/30 animate-spin pointer-events-none transition-transform duration-500`}
                    style={{ animationDuration: '30s' }}
                  />

                  {/* Secondary Pulsing Shell */}
                  <div 
                    className={`absolute w-52 h-52 rounded-full border border-blue-500/20 pointer-events-none ${
                      isListening || isProcessing ? 'animate-ping' : ''
                    }`}
                    style={{ animationDuration: '3s' }}
                  />

                  {/* Main Glowing 3D Glass Sphere (Exact Recreation of Uploaded Asset) */}
                  <button
                    onClick={toggleListening}
                    className="relative w-44 h-44 rounded-full overflow-hidden bg-[#04060e] border border-blue-400/50 shadow-[inset_0_0_30px_rgba(0,0,0,0.9),0_0_40px_rgba(59,130,246,0.5)] cursor-pointer group transition-transform active:scale-95 focus:outline-none"
                    title="Click orb to speak or pause voice capture"
                  >
                    {/* Deep Nebula Cosmic Texture Layer 1 */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-tr ${currentTheme.coreGradient} opacity-75 animate-spin`}
                      style={{ 
                        animationDuration: isProcessing ? '4s' : isListening ? '6s' : '18s',
                        filter: 'blur(4px)',
                      }}
                    />

                    {/* Nebula Plasma Wave Layer 2 (Counter-rotating) */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-transparent to-blue-400 opacity-60 animate-spin"
                      style={{ 
                        animationDuration: isProcessing ? '6s' : '24s', 
                        animationDirection: 'reverse',
                        filter: 'blur(6px)',
                      }}
                    />

                    {/* Dark Fluid Organic Plasma Cloud Centers */}
                    <div 
                      className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(15,23,42,0.9),rgba(2,6,23,0.3)_60%,transparent)] opacity-90"
                    />

                    {/* Specular Light Dome Reflection (Top-Left Highlight) */}
                    <div className="absolute top-2 left-5 w-24 h-16 rounded-full bg-gradient-to-b from-white/40 via-white/10 to-transparent transform -rotate-25 blur-[2px] pointer-events-none" />

                    {/* Sharp Glowing Horizontal Horizon Equator Line (Laser Beam from User Image) */}
                    <div 
                      className="absolute left-0 right-0 h-[2.5px] z-20 pointer-events-none transition-all duration-75"
                      style={{
                        top: '50%',
                        transform: `translateY(-50%) scaleY(${isListening || isProcessing ? 1 + voiceVolume * 4 : 1})`,
                        backgroundColor: isListening ? '#67e8f9' : currentTheme.equatorLaser,
                        boxShadow: `0 0 16px 3px ${currentTheme.equatorLaser}, 0 0 6px 2px #ffffff`,
                      }}
                    />

                    {/* Dynamic Horizon Soundwave Displacement */}
                    {(isListening || isProcessing) && (
                      <div 
                        className="absolute inset-x-0 h-8 top-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent z-15 pointer-events-none animate-pulse"
                      />
                    )}

                    {/* Core Ambient Center Sparkle */}
                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                      {isListening ? (
                        <Mic className="w-8 h-8 text-white drop-shadow-[0_0_12px_#22d3ee] animate-bounce" />
                      ) : isProcessing ? (
                        <Sparkles className="w-8 h-8 text-purple-200 drop-shadow-[0_0_12px_#c084fc] animate-spin" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_12px_#fff] group-hover:scale-150 transition-transform" />
                      )}
                    </div>

                    {/* Bottom Sphere Ambient Rim Shadow */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_-14px_24px_rgba(0,0,0,0.8)] pointer-events-none" />
                  </button>
                </div>

                {/* Orb Status Badge */}
                <div className="mt-4 flex flex-col items-center gap-1">
                  <div className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider border ${
                    isListening
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 animate-pulse'
                      : isProcessing
                      ? 'bg-purple-950/80 border-purple-400 text-purple-300'
                      : 'bg-blue-950/80 border-blue-700/60 text-blue-300'
                  }`}>
                    {isListening ? '🎙️ LISTENING TO VOICE...' : isProcessing ? '⚡ REASONING & DELEGATING...' : '✨ READY & LISTENING (TAP ORB)'}
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400">
                    Audio Resonance: {Math.round(voiceVolume * 100)}% &bull; Latency: ~0.12s
                  </span>
                </div>

                {/* Audio Waveform Resonance Bars */}
                <div className="flex items-center gap-1 mt-3 h-6">
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const heightFactor = isListening || isProcessing
                      ? Math.max(15, Math.min(100, Math.sin(idx * 0.5 + Date.now() * 0.005) * 50 + voiceVolume * 60))
                      : 15;
                    return (
                      <div
                        key={idx}
                        className="w-1 bg-gradient-to-t from-blue-600 via-cyan-400 to-white rounded-full transition-all duration-75"
                        style={{ height: `${heightFactor}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Live Voice Conversation Transcript & Suggested Missions */}
              <div className="w-full md:w-1/2 flex flex-col h-full bg-[#050810] border border-blue-950/90 rounded-xl p-4 shadow-inner">
                
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-blue-950">
                  <span className="text-xs font-mono-code font-bold text-slate-200 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-blue-400" />
                    LIVE VOICE TRANSCRIPT LOG
                  </span>

                  <button
                    onClick={() => {
                      playTacticalBeep(600);
                      onToggleTts();
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-code border transition ${
                      ttsEnabled
                        ? 'bg-blue-950 border-blue-500/50 text-blue-300'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    {ttsEnabled ? <Volume2 className="w-3 h-3 text-blue-400" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
                    <span>TTS {ttsEnabled ? 'ENABLED' : 'MUTED'}</span>
                  </button>
                </div>

                {/* Live Transcript Stream Box */}
                <div className="flex-1 min-h-[160px] max-h-[220px] overflow-y-auto space-y-2 pr-1 text-xs font-mono-code mb-3">
                  {voiceHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border ${
                        item.sender === 'user'
                          ? 'bg-cyan-950/40 border-cyan-700/50 text-cyan-100 ml-4'
                          : 'bg-blue-950/40 border-blue-800/50 text-slate-200 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold flex items-center gap-1">
                          {item.sender === 'user' ? '👤 OPERATOR (VOICE)' : '✨ HERMES NEURAL ROUTER'}
                        </span>
                        <span>{item.time}</span>
                      </div>
                      <p className="leading-relaxed">{item.text}</p>
                    </div>
                  ))}

                  {/* Active Interim Voice Bubble */}
                  {transcript && (
                    <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-400 text-cyan-200 ml-4 animate-pulse">
                      <div className="text-[10px] text-cyan-400 font-bold mb-0.5">TRANSCRIPTION IN PROGRESS...</div>
                      <p className="italic">"{transcript}"</p>
                    </div>
                  )}
                </div>

                {/* Quick Voice Command Triggers */}
                <div>
                  <div className="text-[10px] font-mono-code text-slate-400 mb-1.5 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    TAP TO SPEAK OR TRIGGER MISSION:
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {SUGGESTED_VOICE_COMMANDS.slice(0, 3).map((cmd, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          playDispatchChirp();
                          handleExecuteVoiceCommand(cmd);
                        }}
                        disabled={isProcessing}
                        className="text-left px-2.5 py-1.5 rounded bg-[#0a1120] hover:bg-blue-950/60 border border-blue-900/60 hover:border-blue-500/80 text-[11px] font-mono-code text-blue-200 transition flex items-center justify-between group disabled:opacity-50"
                      >
                        <span className="truncate">"{cmd}"</span>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Footer Controls */}
            <div className="relative z-10 flex items-center justify-between px-5 py-3 border-t border-blue-950/80 bg-[#080d19] text-xs font-mono-code text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>VOICE CORE: READY &bull; CONTINUOUS RECOGNITION ONLINE</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'STOP RECORDING' : 'TAP TO SPEAK'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
