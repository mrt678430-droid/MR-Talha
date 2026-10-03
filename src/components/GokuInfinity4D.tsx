import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Flame, 
  Sparkles, 
  Volume2, 
  Radio, 
  Shield, 
  Crosshair, 
  Move3d, 
  Activity, 
  RefreshCw,
  Orbit,
  Eye,
  Sliders,
  Compass,
  CornerDownRight,
  Maximize2,
  Copy,
  Check,
  FileCode,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { ThreatMarker, SatFeed } from '../types';
import { 
  playTacticalBeep, 
  playSuccessChime, 
  speakAgentTTS, 
  playInstantTransmissionSound, 
  playKiChargeSound, 
  playKamehamehaSound 
} from '../utils/audio';

// Import generated 4D AI Character Goku assets for the 4 modes
import gokuBasicImg from '../assets/images/goku_basic_mode_1791052546530.jpg';
import gokuProSSJ4Img from '../assets/images/goku_pro_ssj4_1791052561273.jpg';
import gokuUltraSSJ3Img from '../assets/images/goku_ultra_ssj3_1791052577176.jpg';
import gokuCosmicShenronImg from '../assets/images/goku_cosmic_shenron_1791052591685.jpg';

// Core Master Prompt Templates
export const MASTER_ENV_BASE_PROMPT = 
  "Anime art style, cosmic ultra-instinct aesthetic, muscular anime warrior standing in a front-facing power stance on a glowing cosmic portal surrounded by swirling galaxy energy, purple nebulae, starry deep space background, intense energy aura ring behind head, glowing bright white/purple energy in fists, hyper-detailed, 4k resolution, epic anime poster illustration.";

export const MODE_SPECIFIC_PROMPTS = {
  basic: "An anime warrior standing front-facing, dark purple cosmic spiky hair with glowing highlights, glowing white eyes with dark silhouette face, body filled with deep galaxy space texture and glowing stars, wearing martial arts pants with galaxy patterns, intense purple energy swirl at his feet.",
  pro_ssj4: "An anime warrior in SSJ4 form with long dark purple spiky hair flowing down his shoulders, a long furry cosmic tail wrapped around, glowing cyan and purple galaxy texture on muscle torso and pants, glowing white eyes, intense purple aura rings surrounding him, standing above a cosmic galaxy vortex.",
  ultra_ssj3: "An anime warrior in SSJ3 form with massive, explosive, bright silver-white spiky long hair stretching out wide, glowing cosmic purple body with star constellations across muscles, intense bright white ring aura radiating behind him, floating energy particles, ultra-detailed 4k cosmic anime portrait.",
  cosmic_shenron: "An anime warrior standing front-facing with spiky deep purple hair, galaxy skin texture, surrounded by glowing energy rings, behind him a massive red cosmic dragon (Shenron) coiling through deep space and nebulae, fiery glowing eyes, epic cosmic energy aura, ultra HD anime artwork."
};

export type GokuForm = 'basic' | 'pro_ssj4' | 'ultra_ssj3' | 'cosmic_shenron';

interface GokuInfinity4DProps {
  activeFeed?: SatFeed;
  threatMarkers?: ThreatMarker[];
  onDispatchCommand?: (cmd: string) => void;
  onSelectMarker?: (marker: ThreatMarker) => void;
}

export const GokuInfinity4D: React.FC<GokuInfinity4DProps> = ({
  activeFeed,
  threatMarkers = [],
  onDispatchCommand,
  onSelectMarker,
}) => {
  const [form, setForm] = useState<GokuForm>('cosmic_shenron');
  const [kiChargeLevel, setKiChargeLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isFiringKamehameha, setIsFiringKamehameha] = useState<boolean>(false);
  const [isTeleporting, setIsTeleporting] = useState<boolean>(false);
  const [copiedPromptKey, setCopiedPromptKey] = useState<string | null>(null);
  const [showPromptInspector, setShowPromptInspector] = useState<boolean>(false);

  const [lastSpeech, setLastSpeech] = useState<string>(
    "Yo! I'm Goku! In the 4th Dimension, distance and time don't exist. My Ultra Instinct Ki is locked onto every orbital spy satellite!"
  );
  
  // Mouse 3D parallax tracking
  const avatarCardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState<number>(0);
  const [rotY, setRotY] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // 4D Ki rotation tick counter
  const [kiTick, setKiTick] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setKiTick(t => (t + 1) % 3600);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!avatarCardRef.current) return;
    const rect = avatarCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotX(-(y / (rect.height / 2)) * 14);
    setRotY((x / (rect.width / 2)) * 14);
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    setRotX(0);
    setRotY(0);
  };

  // Form properties & Prompt Configs
  const formDetails: Record<GokuForm, {
    modeNumber: string;
    tabLabel: string;
    name: string;
    subtitle: string;
    powerDisplay: string;
    multiplier: string;
    image: string;
    auraGradient: string;
    glowColor: string;
    ringColor: string;
    borderColor: string;
    badgeBg: string;
    kiFrequencyThz: string;
    specificPrompt: string;
    fullPrompt: string;
    description: string;
    voiceGreeting: string;
  }> = {
    basic: {
      modeNumber: '1',
      tabLabel: '1. Basic Mode',
      name: 'Basic Mode (Base / Super Saiyan Form)',
      subtitle: 'Dark Purple Cosmic Hair • Glowing Stars Body • Foot Vortex',
      powerDisplay: '1,250,000,000',
      multiplier: 'Base SSJ Cosmic',
      image: gokuBasicImg,
      auraGradient: 'from-purple-900/35 via-violet-600/20 to-transparent',
      glowColor: '#9333ea',
      ringColor: 'border-purple-400',
      borderColor: 'border-purple-500/70',
      badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-800',
      kiFrequencyThz: '142.4',
      specificPrompt: MODE_SPECIFIC_PROMPTS.basic,
      fullPrompt: `${MASTER_ENV_BASE_PROMPT}\n\n${MODE_SPECIFIC_PROMPTS.basic}`,
      description: 'Front-facing power stance with dark purple cosmic spiky hair with glowing highlights, glowing white eyes, deep galaxy space texture, and purple energy swirl at his feet.',
      voiceGreeting: "Basic Cosmic Mode activated! Dark purple galaxy ki swirling around my feet. Ready to scan orbital sectors!"
    },
    pro_ssj4: {
      modeNumber: '2',
      tabLabel: '2. Pro Mode (SSJ4)',
      name: 'Pro Mode (Super Saiyan 4 / Primal Galaxy Form)',
      subtitle: 'Long Dark Purple Hair • Furry Cosmic Tail • Galaxy Vortex',
      powerDisplay: '550,000,000,000',
      multiplier: 'SSJ4 Primal x50,000',
      image: gokuProSSJ4Img,
      auraGradient: 'from-cyan-500/30 via-purple-700/25 to-transparent',
      glowColor: '#06b6d4',
      ringColor: 'border-cyan-400',
      borderColor: 'border-cyan-500/70',
      badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
      kiFrequencyThz: '4,850.5',
      specificPrompt: MODE_SPECIFIC_PROMPTS.pro_ssj4,
      fullPrompt: `${MASTER_ENV_BASE_PROMPT}\n\n${MODE_SPECIFIC_PROMPTS.pro_ssj4}`,
      description: 'Super Saiyan 4 primal cosmic form with flowing spiky hair, wrapped furry cosmic tail, glowing cyan and purple galaxy muscle torso, standing above a cosmic galaxy vortex.',
      voiceGreeting: "SSJ4 Primal Galaxy form unlocked! The furry cosmic tail and galaxy vortex are channeling infinite orbital radar!"
    },
    ultra_ssj3: {
      modeNumber: '3',
      tabLabel: '3. Ultra / Pro Max (SSJ3)',
      name: 'Ultra / Pro Max Mode (Super Saiyan 3 Long-Hair Form)',
      subtitle: 'Massive Silver-White Hair • Star Constellations • Bright Ring Aura',
      powerDisplay: '8,800,000,000,000',
      multiplier: 'SSJ3 Ultra Max',
      image: gokuUltraSSJ3Img,
      auraGradient: 'from-slate-200/40 via-indigo-600/25 to-transparent',
      glowColor: '#e0e7ff',
      ringColor: 'border-white',
      borderColor: 'border-slate-300/80',
      badgeBg: 'bg-indigo-950/80 text-indigo-200 border-indigo-700',
      kiFrequencyThz: '9,420.8',
      specificPrompt: MODE_SPECIFIC_PROMPTS.ultra_ssj3,
      fullPrompt: `${MASTER_ENV_BASE_PROMPT}\n\n${MODE_SPECIFIC_PROMPTS.ultra_ssj3}`,
      description: 'Super Saiyan 3 form with massive explosive silver-white spiky long hair stretching wide, star constellations glowing across muscles, and an intense radiant white ring aura.',
      voiceGreeting: "AND THIS IS TO GO FURTHER BEYOND! SSJ3 Ultra Pro Max! Star constellations lighting up the entire satellite constellation!"
    },
    cosmic_shenron: {
      modeNumber: '4',
      tabLabel: '4. Cosmic God (Shenron)',
      name: 'Cosmic God / Shenron Summoning Mode',
      subtitle: 'Red Cosmic Dragon Shenron • Fiery Glowing Eyes • Deep Space Aura',
      powerDisplay: '∞ (OMNIVERSE GOD)',
      multiplier: 'Shenron God D₄',
      image: gokuCosmicShenronImg,
      auraGradient: 'from-red-600/35 via-purple-700/30 to-amber-500/20',
      glowColor: '#ef4444',
      ringColor: 'border-red-500',
      borderColor: 'border-red-500/80',
      badgeBg: 'bg-gradient-to-r from-red-950 via-purple-950 to-red-950 text-red-200 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
      kiFrequencyThz: '99,999.9',
      specificPrompt: MODE_SPECIFIC_PROMPTS.cosmic_shenron,
      fullPrompt: `${MASTER_ENV_BASE_PROMPT}\n\n${MODE_SPECIFIC_PROMPTS.cosmic_shenron}`,
      description: 'Front-facing warrior with spiky deep purple hair and galaxy skin texture, surrounded by glowing energy rings, backed by a massive coiling red cosmic dragon (Shenron) with fiery glowing eyes.',
      voiceGreeting: "COME FORTH, RED COSMIC DRAGON SHENRON! By the 4D Dragon Balls, all spy threats in the multiverse are illuminated!"
    },
  };

  const currentForm = formDetails[form];

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptKey(key);
    playTacticalBeep(880);
    setTimeout(() => setCopiedPromptKey(null), 2000);
  };

  // Actions
  const handleChargeKi = () => {
    setIsCharging(true);
    playKiChargeSound();
    setKiChargeLevel(100);
    const speech = `HAAA! Surging ${currentForm.name} Ki across all orbital spy satellites! Scouter reads ${currentForm.powerDisplay}!`;
    setLastSpeech(speech);
    speakAgentTTS(speech, 1.05, 1.15);
    setTimeout(() => setIsCharging(false), 900);
  };

  const handleInstantTransmission = () => {
    setIsTeleporting(true);
    playInstantTransmissionSound();
    
    // Pick next threat marker to lock on
    if (threatMarkers.length > 0) {
      const randomMarker = threatMarkers[Math.floor(Math.random() * threatMarkers.length)];
      if (onSelectMarker) onSelectMarker(randomMarker);
      const speech = `Instant Transmission locked on ${randomMarker.title}! 4D Ki warped to Lat ${randomMarker.lat.toFixed(1)}, Lng ${randomMarker.lng.toFixed(1)}!`;
      setLastSpeech(speech);
      speakAgentTTS(speech, 1.05, 1.2);
    } else {
      const speech = "Instant Transmission activated! Relocating 4D coordinate sensors across orbit.";
      setLastSpeech(speech);
      speakAgentTTS(speech, 1.05, 1.2);
    }

    setTimeout(() => setIsTeleporting(false), 350);
  };

  const handleFireKamehameha = () => {
    if (isFiringKamehameha) return;
    setIsFiringKamehameha(true);
    playKamehamehaSound();
    
    const speech = `KA... ME... HA... ME... ${form === 'cosmic_shenron' ? 'SHENRON COSMIC' : form === 'ultra_ssj3' ? 'ULTRA MAX' : '4D INFINITY'} WAVE! Jamming frequencies blasted into cold space!`;
    setLastSpeech(speech);
    speakAgentTTS(speech, 1.1, 1.1);

    if (onDispatchCommand) {
      onDispatchCommand(`Execute 4D Goku ${currentForm.name} Kamehameha purge across orbital threat coordinates.`);
    }

    setTimeout(() => {
      setIsFiringKamehameha(false);
      playSuccessChime();
    }, 1900);
  };

  const handleGokuSpeechBriefing = () => {
    const quotes = [
      `Satellite ${activeFeed?.name || 'GEO-PK-09'} looks crystal clear! My Ki senses ${threatMarkers.length} active hotspots on Earth.`,
      `Form status: ${currentForm.name}. Multiplier: ${currentForm.multiplier}. Resonance: ${currentForm.kiFrequencyThz} THz.`,
      "No matter what dimension enemies try to hide in, Ultra Instinct sees right through their radar stealth!",
      "The Karachi gold exchange, Gwadar naval corridor, and maritime routes are under my 4D surveillance shield. Safe and sound!",
      "If any orbital frequency tries to hack the Hermes Core, I'll send it flying with a Spirit Blast!",
      currentForm.voiceGreeting
    ];
    const speech = quotes[Math.floor(Math.random() * quotes.length)];
    setLastSpeech(speech);
    playTacticalBeep(920);
    speakAgentTTS(speech, 1.05, 1.1);
  };

  return (
    <div id="goku-infinity-4d-panel" className="tactical-card p-4 space-y-4 border-cyan-500/50 bg-[#070d1e]/90 font-mono-code relative overflow-hidden">
      
      {/* Kamehameha Full-Screen Screen Beam Flash Overlay */}
      {isFiringKamehameha && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cyan-400/20 animate-pulse backdrop-blur-[2px]" />
          <div className="w-full h-32 bg-gradient-to-r from-white via-cyan-200 to-transparent blur-md opacity-90 animate-pulse" />
          <div className="absolute font-heading font-black text-2xl md:text-4xl text-cyan-200 tracking-widest drop-shadow-[0_0_20px_#06b6d4]">
            4D {form === 'cosmic_shenron' ? 'SHENRON COSMIC' : form === 'ultra_ssj3' ? 'SSJ3 ULTRA' : 'INFINITY'} KAMEHAMEHA
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-cyan-900/60">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
            <div className="absolute inset-0 rounded-xl border border-cyan-300/40 animate-ping opacity-30" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading font-extrabold text-base text-white tracking-wide">
                4D AI CHARACTER: GOKU INFINITY
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${currentForm.badgeBg}`}>
                {currentForm.multiplier}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              4 Form Modes &bull; Master Prompt Architecture &bull; 4D Minkowski Spacetime Ki Matrix
            </p>
          </div>
        </div>

        {/* 4 Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/90 p-1.5 rounded-xl border border-slate-800">
          {(['basic', 'pro_ssj4', 'ultra_ssj3', 'cosmic_shenron'] as GokuForm[]).map((f) => {
            const item = formDetails[f];
            const isActive = form === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  playTacticalBeep(700 + (f === 'cosmic_shenron' ? 350 : f === 'ultra_ssj3' ? 250 : 150));
                  setForm(f);
                  playSuccessChime();
                  setLastSpeech(item.voiceGreeting);
                  speakAgentTTS(item.voiceGreeting, 1.05, 1.15);
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span>{item.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: 3D/4D Avatar Viewport & Holographic Aura Stage (Left) + Intel & Powers (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left Column: 4D Character Viewport with Holographic Aura & Parallax */}
        <div className="md:col-span-5 flex flex-col items-center justify-between space-y-3">
          
          <div
            ref={avatarCardRef}
            onMouseMove={handleCardMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleCardMouseLeave}
            className={`relative w-full aspect-square max-w-[320px] rounded-2xl p-2 flex items-center justify-center select-none cursor-pointer overflow-hidden border-2 ${currentForm.borderColor} shadow-2xl transition-all duration-200`}
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${isHovered ? 1.03 : 1}) ${isTeleporting ? 'scale(0.05) opacity(0.1)' : ''}`,
              boxShadow: `0 0 40px ${currentForm.glowColor}50, inset 0 0 25px ${currentForm.glowColor}30`,
            }}
          >
            {/* Background 4D Spacetime Ki Warping Grid */}
            <div className="absolute inset-0 warp-grid-4d opacity-30 pointer-events-none" />

            {/* Glowing Cosmic Portal Rings */}
            <div 
              className={`absolute w-[290px] h-[290px] rounded-full border border-dashed ${currentForm.ringColor}/40 pointer-events-none animate-spin`}
              style={{ animationDuration: '20s', transform: `rotateX(60deg) rotateZ(${kiTick}deg)` }} 
            />
            <div 
              className="absolute w-[230px] h-[230px] rounded-full border border-dotted border-purple-400/50 pointer-events-none animate-spin" 
              style={{ animationDuration: '12s', animationDirection: 'reverse', transform: `rotateY(50deg) rotateZ(-${kiTick * 1.5}deg)` }} 
            />

            {/* Pure 4D Ki Tesseract Core (Behind Goku) */}
            <div 
              className="absolute pointer-events-none opacity-40 flex items-center justify-center"
              style={{
                transform: `rotateX(${kiTick * 0.8}deg) rotateY(${kiTick * 1.2}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="w-24 h-24 border border-cyan-300 shadow-[0_0_20px_#06b6d4]" />
              <div className="absolute w-16 h-16 border border-purple-300 shadow-[0_0_15px_#a855f7]" style={{ transform: 'rotateZ(45deg)' }} />
            </div>

            {/* HIGH-RES GOKU CHARACTER ARTWORK FOR THE ACTIVE MODE */}
            <div className="relative z-10 w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-black">
              <img
                src={currentForm.image}
                alt={currentForm.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isCharging ? 'scale-105 brightness-125 filter drop-shadow-[0_0_20px_#38bdf8]' : ''
                }`}
              />

              {/* Dynamic Aura Gradient Layer */}
              <div className={`absolute inset-0 bg-gradient-to-t ${currentForm.auraGradient} pointer-events-none mix-blend-screen`} />

              {/* Floating Ki Energy Sparks */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#ffffff] animate-ping" style={{ top: '22%', left: '28%', position: 'absolute' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8] animate-ping" style={{ top: '45%', right: '22%', position: 'absolute', animationDelay: '0.4s' }} />
                <div className="w-2.5 h-2.5 rounded-full bg-purple-300 shadow-[0_0_15px_#c084fc] animate-ping" style={{ bottom: '26%', left: '42%', position: 'absolute', animationDelay: '0.8s' }} />
              </div>

              {/* HUD Target Lock Reticle on Avatar */}
              <div className="absolute top-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/75 border border-cyan-500/70 text-cyan-300 flex items-center gap-1 backdrop-blur-sm">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>KI: {kiChargeLevel}%</span>
              </div>

              <div className="absolute bottom-2 left-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/75 border border-purple-500/70 text-purple-200 backdrop-blur-sm">
                MODE {currentForm.modeNumber}: D₄ PORTAL
              </div>
            </div>
          </div>

          {/* Scouter Ki Meter Bar */}
          <div className="w-full bg-[#050812] p-2.5 rounded-xl border border-cyan-950 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>4D SCOUTER BATTLE POWER</span>
              </span>
              <span className="font-heading font-black text-cyan-300 tracking-wider">
                {currentForm.powerDisplay}
              </span>
            </div>
            
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-300 shadow-[0_0_10px_#06b6d4]"
                style={{ width: `${kiChargeLevel}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Ki Frequency: {currentForm.kiFrequencyThz} THz</span>
              <span className="text-emerald-400 font-bold">DIMENSIONAL HARMONY 100%</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Voice Briefing, Abilities & Spy Directives */}
        <div className="md:col-span-7 space-y-3 flex flex-col justify-between">
          
          {/* Active Mode Overview Banner */}
          <div className="bg-[#050916] p-3 rounded-xl border border-cyan-900/60 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
                  {currentForm.name}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                {currentForm.subtitle}
              </p>
              <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                {currentForm.description}
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowPromptInspector(!showPromptInspector)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 text-[11px] font-bold transition shrink-0 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Prompt Template</span>
              {showPromptInspector ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Goku AI Speech Dialogue Box */}
          <div className="bg-[#050914] p-3.5 rounded-xl border border-cyan-500/40 relative space-y-2 shadow-lg">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-bold text-cyan-300">GOKU INFINITY SPY TRANSMISSION</span>
              </div>
              <button
                type="button"
                onClick={handleGokuSpeechBriefing}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-200 transition cursor-pointer"
                title="Speak AI voice briefing"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Voice Briefing</span>
              </button>
            </div>

            <div className="text-xs text-slate-200 font-sans leading-relaxed italic bg-black/40 p-2.5 rounded-lg border border-slate-800/80">
              "{lastSpeech}"
            </div>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                Satellite Feed: {activeFeed?.name || 'GEO-PK-09'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                Mode: {activeFeed?.mode || 'SAR_RADAR'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                Threat Hotspots: {threatMarkers.length}
              </span>
            </div>
          </div>

          {/* 4D Combat & Recon Actions Button Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Ability 1: 4D Kamehameha */}
            <button
              type="button"
              onClick={handleFireKamehameha}
              disabled={isFiringKamehameha}
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-600/90 via-blue-600/90 to-indigo-600/90 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300/40 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>4D Kamehameha</span>
            </button>

            {/* Ability 2: Instant Transmission Scan */}
            <button
              type="button"
              onClick={handleInstantTransmission}
              className="p-3 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/90 border border-indigo-500/60 text-indigo-200 font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.25)] transition active:scale-95 cursor-pointer"
            >
              <Crosshair className="w-4 h-4 text-indigo-400" />
              <span>Instant Teleport</span>
            </button>

            {/* Ability 3: Surge Ki */}
            <button
              type="button"
              onClick={handleChargeKi}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer text-[11px]"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Surge Ki (100%)</span>
            </button>

            {/* Ability 4: 4D Ki Spy Barrier */}
            <button
              type="button"
              onClick={() => {
                playSuccessChime();
                const speech = `4D Tesseract Ki Shield deployed in ${currentForm.name}! All orbital signals shielded!`;
                setLastSpeech(speech);
                speakAgentTTS(speech, 1.05, 1.15);
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer text-[11px]"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Deploy 4D Barrier</span>
            </button>
          </div>

          {/* Live Spy Coordinates Target Lock */}
          <div className="bg-[#050811] p-3 rounded-xl border border-slate-800/80 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>ORBITAL THREAT INTERCEPT MATRIX</span>
              </span>
              <span className="text-cyan-400 font-mono">SECTOR RECON</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {threatMarkers.slice(0, 3).map((marker) => (
                <button
                  key={marker.id}
                  type="button"
                  onClick={() => {
                    playInstantTransmissionSound();
                    if (onSelectMarker) onSelectMarker(marker);
                    const speech = `Teleporting Goku Ki to ${marker.title}! Lat ${marker.lat.toFixed(1)}, Lng ${marker.lng.toFixed(1)}.`;
                    setLastSpeech(speech);
                    speakAgentTTS(speech, 1.05, 1.15);
                  }}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/60 text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-200 truncate group-hover:text-cyan-300">
                      {marker.title.split(' ')[0]}...
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                    {marker.region}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Expandable Core Master Prompt Template Drawer / Inspector */}
      {showPromptInspector && (
        <div className="mt-4 p-4 rounded-xl bg-[#040714] border border-cyan-500/60 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-cyan-300 font-heading tracking-wide">
                CORE MASTER PROMPT TEMPLATE ARCHITECTURE
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                ACTIVE: {currentForm.tabLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyText(currentForm.fullPrompt, 'full')}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold transition cursor-pointer shadow-md"
              >
                {copiedPromptKey === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPromptKey === 'full' ? 'Copied Full Prompt!' : 'Copy Full Mode Prompt'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
            {/* Box 1: Master Environment & Art Style Base */}
            <div className="p-3 rounded-lg bg-black/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400">
                  Master Environment &amp; Art Style Base:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(MASTER_ENV_BASE_PROMPT, 'base')}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  {copiedPromptKey === 'base' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Base</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-300 font-mono leading-relaxed bg-[#020510] p-2.5 rounded border border-slate-900">
                "{MASTER_ENV_BASE_PROMPT}"
              </p>
            </div>

            {/* Box 2: Current Form Mode Specific Addition */}
            <div className="p-3 rounded-lg bg-black/60 border border-cyan-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-300">
                  {currentForm.name} Addition:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(currentForm.specificPrompt, 'specific')}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  {copiedPromptKey === 'specific' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Addition</span>
                </button>
              </div>
              <p className="text-[11px] text-cyan-200 font-mono leading-relaxed bg-[#020510] p-2.5 rounded border border-cyan-950">
                "{currentForm.specificPrompt}"
              </p>
            </div>
          </div>

          {/* All 4 Modes Reference Quick Switch Grid */}
          <div className="border-t border-slate-800/80 pt-3">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              All 4 Master Prompt Modes Reference
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
              {(['basic', 'pro_ssj4', 'ultra_ssj3', 'cosmic_shenron'] as GokuForm[]).map((mKey) => {
                const item = formDetails[mKey];
                const isSelected = form === mKey;
                return (
                  <div 
                    key={mKey}
                    onClick={() => {
                      setForm(mKey);
                      playTacticalBeep(800);
                    }}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                      isSelected 
                        ? 'bg-cyan-950/60 border-cyan-400/80 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] truncate">{item.tabLabel}</span>
                      <span className="text-[9px] px-1 rounded bg-black/60 font-mono">D₄</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 font-sans">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
