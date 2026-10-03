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
  Maximize2
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

// Import generated Goku Infinity character asset
import gokuInfinityImg from '../assets/images/goku_infinity_spy_1791051337186.jpg';

export type GokuForm = 'base' | 'ssj_god' | 'ultra_instinct' | 'infinity';

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
  const [form, setForm] = useState<GokuForm>('infinity');
  const [kiChargeLevel, setKiChargeLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isFiringKamehameha, setIsFiringKamehameha] = useState<boolean>(false);
  const [isTeleporting, setIsTeleporting] = useState<boolean>(false);
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

  // Form properties & Battle Power
  const formDetails: Record<GokuForm, {
    name: string;
    powerDisplay: string;
    multiplier: string;
    auraGradient: string;
    glowColor: string;
    borderColor: string;
    badgeBg: string;
    kiFrequencyThz: string;
    description: string;
  }> = {
    base: {
      name: 'Saiyan Tactical Scout',
      powerDisplay: '1,250,000',
      multiplier: 'Base Scout',
      auraGradient: 'from-cyan-500/20 via-blue-600/10 to-transparent',
      glowColor: '#06b6d4',
      borderColor: 'border-cyan-500/50',
      badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
      kiFrequencyThz: '142.4',
      description: 'Standard reconnaissance protocol scanning low-orbit spectrum.',
    },
    ssj_god: {
      name: 'Super Saiyan God 4D',
      powerDisplay: '850,000,000,000',
      multiplier: 'God Ki x850B',
      auraGradient: 'from-rose-500/30 via-amber-500/15 to-transparent',
      glowColor: '#f43f5e',
      borderColor: 'border-rose-500/60',
      badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-800',
      kiFrequencyThz: '560.8',
      description: 'Divine radiant fiery aura piercing through orbital electronic jamming.',
    },
    ultra_instinct: {
      name: 'Ultra Instinct Omen',
      powerDisplay: '9,999,999,999,999',
      multiplier: 'Autonomous Reflex',
      auraGradient: 'from-slate-200/35 via-indigo-500/20 to-transparent',
      glowColor: '#e0e7ff',
      borderColor: 'border-indigo-400/60',
      badgeBg: 'bg-indigo-950/80 text-indigo-200 border-indigo-700',
      kiFrequencyThz: '890.2',
      description: 'Mind separated from body. Instantly evades cyber incursions and radar sweeps.',
    },
    infinity: {
      name: 'GOKU INFINITY (Omniverse 4D)',
      powerDisplay: '∞ (INFINITY)',
      multiplier: 'Transcendence D₄',
      auraGradient: 'from-cyan-400/40 via-purple-600/30 to-amber-500/20',
      glowColor: '#38bdf8',
      borderColor: 'border-cyan-400',
      badgeBg: 'bg-gradient-to-r from-cyan-950 via-purple-950 to-cyan-950 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
      kiFrequencyThz: '9,999.9',
      description: 'Supreme 4D entity warped across Minkowski spacetime. Omnipresent satellite surveillance.',
    },
  };

  const currentForm = formDetails[form];

  // Actions
  const handleChargeKi = () => {
    setIsCharging(true);
    playKiChargeSound();
    setKiChargeLevel(100);
    const speech = "HAAA! Gathering divine 4D energy across all orbital relays! Ki at 100% capacity!";
    setLastSpeech(speech);
    speakAgentTTS(speech, 1.05, 1.15);
    setTimeout(() => setIsCharging(false), 800);
  };

  const handleInstantTransmission = () => {
    setIsTeleporting(true);
    playInstantTransmissionSound();
    
    // Pick next threat marker to lock on
    if (threatMarkers.length > 0) {
      const randomMarker = threatMarkers[Math.floor(Math.random() * threatMarkers.length)];
      if (onSelectMarker) onSelectMarker(randomMarker);
      const speech = `Instant Transmission locked on ${randomMarker.title}! Sector scanned: Zero blindspots.`;
      setLastSpeech(speech);
      speakAgentTTS(speech, 1.05, 1.2);
    } else {
      const speech = "Instant Transmission activated! Relocating 4D coordinate sensors across orbit.";
      setLastSpeech(speech);
      speakAgentTTS(speech, 1.05, 1.2);
    }

    setTimeout(() => setIsTeleporting(false), 300);
  };

  const handleFireKamehameha = () => {
    if (isFiringKamehameha) return;
    setIsFiringKamehameha(true);
    playKamehamehaSound();
    
    const speech = "KA... ME... HA... ME... 4D INFINITY WAVE! Jamming frequencies blasted into cold space!";
    setLastSpeech(speech);
    speakAgentTTS(speech, 1.1, 1.1);

    if (onDispatchCommand) {
      onDispatchCommand("Execute 4D Goku Infinity Kamehameha orbital purge across threat coordinates.");
    }

    setTimeout(() => {
      setIsFiringKamehameha(false);
      playSuccessChime();
    }, 1800);
  };

  const handleGokuSpeechBriefing = () => {
    const quotes = [
      `Satellite ${activeFeed?.name || 'GEO-PK-09'} looks crystal clear! My Ki senses ${threatMarkers.length} active hotspots on Earth.`,
      "No matter what dimension enemies try to hide in, Ultra Instinct sees right through their radar stealth!",
      "Hey! The Karachi gold exchange and maritime routes are under my 4D surveillance shield. Safe and sound!",
      "My 4D battle power is breaking past the scouter's limits! Keep training and stay alert!",
      "If any orbital frequency tries to hack the Hermes Core, I'll send it flying with a Spirit Blast!"
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
            4D INFINITY KAMEHAMEHA
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-cyan-900/60">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
            <div className="absolute inset-0 rounded-xl border border-cyan-300/40 animate-ping opacity-30" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-base text-white tracking-wide">
                4D AI CHARACTER: GOKU INFINITY
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${currentForm.badgeBg}`}>
                {currentForm.multiplier}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Hyper-Dimensional Autonomous Saiyan Recon Commander &bull; Ultra Instinct Spacetime Matrix
            </p>
          </div>
        </div>

        {/* Transformation Form Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['base', 'ssj_god', 'ultra_instinct', 'infinity'] as GokuForm[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                playTacticalBeep(700 + (f === 'infinity' ? 300 : 100));
                setForm(f);
                if (f === 'infinity') {
                  playSuccessChime();
                  setLastSpeech("Transcendence achieved! GOKU INFINITY 4D Omniverse form active!");
                  speakAgentTTS("Transcendence achieved! Goku Infinity form active!", 1.05, 1.15);
                }
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition cursor-pointer ${
                form === f
                  ? 'bg-cyan-500 text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'base' ? 'Base' : f === 'ssj_god' ? 'SSJ God' : f === 'ultra_instinct' ? 'Ultra Instinct' : '∞ Infinity'}
            </button>
          ))}
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
            className={`relative w-full aspect-square max-w-[280px] rounded-2xl p-2 flex items-center justify-center select-none cursor-pointer overflow-hidden border-2 ${currentForm.borderColor} shadow-2xl transition-all duration-150`}
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${isHovered ? 1.03 : 1}) ${isTeleporting ? 'scale(0.1) opacity(0.2)' : ''}`,
              boxShadow: `0 0 35px ${currentForm.glowColor}40, inset 0 0 25px ${currentForm.glowColor}25`,
            }}
          >
            {/* Background 4D Spacetime Ki Warping Grid */}
            <div className="absolute inset-0 warp-grid-4d opacity-30 pointer-events-none" />

            {/* Concentric Rotating 4D Ki Rings */}
            <div 
              className="absolute w-[250px] h-[250px] rounded-full border border-dashed border-cyan-400/40 pointer-events-none animate-spin" 
              style={{ animationDuration: '18s', transform: `rotateX(60deg) rotateZ(${kiTick}deg)` }} 
            />
            <div 
              className="absolute w-[210px] h-[210px] rounded-full border border-dotted border-purple-400/50 pointer-events-none animate-spin" 
              style={{ animationDuration: '10s', animationDirection: 'reverse', transform: `rotateY(50deg) rotateZ(-${kiTick * 1.5}deg)` }} 
            />

            {/* Pure 4D Ki Tesseract Core (Behind Goku) */}
            <div 
              className="absolute pointer-events-none opacity-40 flex items-center justify-center"
              style={{
                transform: `rotateX(${kiTick * 0.8}deg) rotateY(${kiTick * 1.2}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="w-20 h-20 border border-cyan-300 shadow-[0_0_15px_#06b6d4]" />
              <div className="absolute w-12 h-12 border border-purple-300 shadow-[0_0_15px_#a855f7]" style={{ transform: 'rotateZ(45deg)' }} />
            </div>

            {/* GOKU ULTRA INSTINCT INFINITY HIGH-RES ARTWORK */}
            <div className="relative z-10 w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src={gokuInfinityImg}
                alt="Goku Ultra Instinct Infinity 4D AI Character"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isCharging ? 'scale-105 brightness-125 filter drop-shadow-[0_0_20px_#38bdf8]' : ''
                }`}
              />

              {/* Dynamic Aura Gradient Layer */}
              <div className={`absolute inset-0 bg-gradient-to-t ${currentForm.auraGradient} pointer-events-none mix-blend-screen`} />

              {/* Ultra Instinct Silver Spark Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#ffffff] animate-ping" style={{ top: '25%', left: '30%', position: 'absolute' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8] animate-ping" style={{ top: '40%', right: '25%', position: 'absolute', animationDelay: '0.4s' }} />
                <div className="w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_15px_#c084fc] animate-ping" style={{ bottom: '30%', left: '45%', position: 'absolute', animationDelay: '0.8s' }} />
              </div>

              {/* HUD Target Lock Reticle on Avatar */}
              <div className="absolute top-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/70 border border-cyan-500/70 text-cyan-300 flex items-center gap-1 backdrop-blur-sm">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>GOD KI: {kiChargeLevel}%</span>
              </div>

              <div className="absolute bottom-2 left-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/70 border border-purple-500/70 text-purple-200 backdrop-blur-sm">
                DIM: D₄ HYPER-PLANE
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
              <span>Ki Resonance: {currentForm.kiFrequencyThz} THz</span>
              <span className="text-emerald-400 font-bold">DIMENSIONAL HARMONY 100%</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Voice Briefing, Abilities & Spy Directives */}
        <div className="md:col-span-7 space-y-3 flex flex-col justify-between">
          
          {/* Goku AI Speech Dialogue Box */}
          <div className="bg-[#050914] p-3.5 rounded-xl border border-cyan-500/40 relative space-y-2 shadow-lg">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-bold text-cyan-300">GOKU INFINITY TRANSMISSION</span>
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

            {/* Ability 3: Ultra Instinct Ki Surge */}
            <button
              type="button"
              onClick={handleChargeKi}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer text-[11px]"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Surge God Ki (100%)</span>
            </button>

            {/* Ability 4: 4D Ki Spy Barrier */}
            <button
              type="button"
              onClick={() => {
                playSuccessChime();
                const speech = "4D Tesseract Ki Shield deployed over satellite transceiver! All hostile signals blocked!";
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
                    const speech = `Teleporting Goku Infinity Ki to ${marker.title}! Lat ${marker.lat.toFixed(1)}, Lng ${marker.lng.toFixed(1)}.`;
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

    </div>
  );
};
