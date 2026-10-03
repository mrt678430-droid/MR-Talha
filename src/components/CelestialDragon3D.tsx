import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Eye, 
  Compass, 
  RotateCw, 
  Volume2, 
  Radio, 
  Shield, 
  Crosshair, 
  Activity, 
  Sliders, 
  Orbit, 
  Move3d, 
  Maximize2,
  Wind
} from 'lucide-react';
import { ThreatMarker, SatFeed } from '../types';
import { 
  playTacticalBeep, 
  playSuccessChime, 
  speakAgentTTS, 
  playDragonRoarSound, 
  playDragonKiBreathSound 
} from '../utils/audio';

// Import the 3 generated dragon assets
import dragonBlueImg from '../assets/images/dragon_blue_3d_1791054265249.jpg';
import dragonGoldenImg from '../assets/images/dragon_golden_3d_1791054280260.jpg';
import dragonPurpleImg from '../assets/images/dragon_purple_3d_1791054298834.jpg';

export type DragonColor = 'blue' | 'golden' | 'purple';
export type DragonMotionMode = 'patrol' | 'combat' | 'warp';

interface CelestialDragon3DProps {
  activeFeed?: SatFeed;
  threatMarkers?: ThreatMarker[];
  onDispatchCommand?: (cmd: string) => void;
  onSelectMarker?: (marker: ThreatMarker) => void;
}

export const CelestialDragon3D: React.FC<CelestialDragon3DProps> = ({
  activeFeed,
  threatMarkers = [],
  onDispatchCommand,
  onSelectMarker,
}) => {
  const [color, setColor] = useState<DragonColor>('golden');
  const [motionMode, setMotionMode] = useState<DragonMotionMode>('combat');
  const [flightSpeed, setFlightSpeed] = useState<number>(1.2);
  const [kiIntensity, setKiIntensity] = useState<number>(95);
  const [isRoaring, setIsRoaring] = useState<boolean>(false);
  const [isBreathingBlast, setIsBreathingBlast] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // 3D Parallax Tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltX, setTiltX] = useState<number>(0);
  const [tiltY, setTiltY] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Live 3D animation tick
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      setTick(t => (t + 1) % 7200);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltX(-(y / (rect.height / 2)) * 16);
    setTiltY((x / (rect.width / 2)) * 16);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltX(0);
    setTiltY(0);
  };

  // Color Definitions
  const colorConfigs = {
    blue: {
      name: 'Azure Celestial Dragon (Cosmic Blue)',
      title: 'Azure Dragon of the East',
      subtitle: 'Electric Cyan Scales • High-Frequency Plasma Ki • Stellar Whispers',
      image: dragonBlueImg,
      glowColor: '#06b6d4',
      badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-700',
      pillActive: 'bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_#06b6d4]',
      borderGlow: 'border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.45)]',
      gradientAura: 'from-cyan-500/40 via-blue-600/30 to-transparent',
      ringBorder: 'border-cyan-400',
      element: 'Cosmic Water & Lightning Qi',
      powerDisplay: '770,000,000,000',
      frequency: '432.8 THz',
      cloudColor: 'text-cyan-300/60',
      blastColor: 'from-cyan-300 via-blue-500 to-indigo-700',
      roarGreeting: 'The Azure Celestial Dragon roars! Plasma radar waves sweep across the South Asia satellite gateway!'
    },
    golden: {
      name: 'Imperial Solar Dragon (24K Gold Shenron)',
      title: 'Divine Emperor of the Sun',
      subtitle: 'Gleaming 24K Bullion Scales • Solar Crown Horns • Imperial Auspicious Ki',
      image: dragonGoldenImg,
      glowColor: '#eab308',
      badgeBg: 'bg-yellow-950 text-yellow-300 border-yellow-700',
      pillActive: 'bg-amber-400 text-black font-extrabold shadow-[0_0_15px_#eab308]',
      borderGlow: 'border-amber-400 shadow-[0_0_35px_rgba(234,179,8,0.45)]',
      gradientAura: 'from-amber-400/40 via-yellow-600/30 to-transparent',
      ringBorder: 'border-amber-400',
      element: 'Solar Divine Ki & Vault Guardian',
      powerDisplay: '8,888,888,888,000',
      frequency: '888.8 THz',
      cloudColor: 'text-amber-300/70',
      blastColor: 'from-yellow-200 via-amber-400 to-amber-700',
      roarGreeting: 'The Imperial Golden Dragon descends! Solar Ki envelops Karachi gold reserves and global satellite orbits!'
    },
    purple: {
      name: 'Void Nebula Dragon (Deep Space Purple)',
      title: 'Transcendental Void Serpent',
      subtitle: 'Dark Matter Obsidian Scales • Ultraviolet Eye Rays • Galaxy Nebula Vortex',
      image: dragonPurpleImg,
      glowColor: '#a855f7',
      badgeBg: 'bg-purple-950 text-purple-300 border-purple-700',
      pillActive: 'bg-purple-500 text-white font-extrabold shadow-[0_0_15px_#a855f7]',
      borderGlow: 'border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.45)]',
      gradientAura: 'from-purple-500/40 via-violet-700/30 to-transparent',
      ringBorder: 'border-purple-400',
      element: 'Dark Matter Spacetime & Void Graviton',
      powerDisplay: '∞ (TRANSCENDENT VOID)',
      frequency: '999.9 THz',
      cloudColor: 'text-purple-300/70',
      blastColor: 'from-fuchsia-300 via-purple-600 to-indigo-900',
      roarGreeting: 'The Void Nebula Dragon awakens! Gravitational spacetime lenses warp around orbital reconnaissance nodes!'
    }
  };

  const currentConfig = colorConfigs[color];

  // Motion Mode Configurations
  const motionModes: Record<DragonMotionMode, {
    label: string;
    description: string;
    speedFactor: number;
    serpentineFlex: number;
    pitchOffset: number;
  }> = {
    patrol: {
      label: '1. Orbital Recon Patrol',
      description: 'Smooth gliding serpentine undulation patrolling low-earth satellite trajectories.',
      speedFactor: 0.8,
      serpentineFlex: 8,
      pitchOffset: 4,
    },
    combat: {
      label: '2. Celestial Combat Coil',
      description: 'Tight coiling power stance with high-amplitude 3D parallax tracking and ready blast ki.',
      speedFactor: 1.4,
      serpentineFlex: 14,
      pitchOffset: 8,
    },
    warp: {
      label: '3. Spacetime Warp Ascension',
      description: 'Rapid 3D helical rotation, hyper-dimensional wormhole vortex hopping across coordinates.',
      speedFactor: 2.2,
      serpentineFlex: 22,
      pitchOffset: 16,
    }
  };

  const currentMotion = motionModes[motionMode];

  // Sound & combat triggers
  const handleTriggerRoar = () => {
    setIsRoaring(true);
    playDragonRoarSound();
    playTacticalBeep(920);
    speakAgentTTS(currentConfig.roarGreeting, 0.85, 1.05);

    setTimeout(() => {
      setIsRoaring(false);
      playSuccessChime();
    }, 1200);
  };

  const handleTriggerKiBreath = () => {
    if (isBreathingBlast) return;
    setIsBreathingBlast(true);
    playDragonKiBreathSound();
    playTacticalBeep(1100);

    const speech = `${currentConfig.title} unleashes divine ${currentConfig.element} Ki Breath! Orbital threat markers neutralized!`;
    speakAgentTTS(speech, 0.9, 1.1);

    if (onDispatchCommand) {
      onDispatchCommand(`Celestial Dragon (${color.toUpperCase()}) executed ${currentConfig.element} Ki Breath purge across satellite coordinates.`);
    }

    setTimeout(() => {
      setIsBreathingBlast(false);
      playSuccessChime();
    }, 2000);
  };

  // Undulation calculations for live 3D serpentine segments
  const wave1 = Math.sin((tick * 0.05 * flightSpeed * currentMotion.speedFactor)) * currentMotion.serpentineFlex;
  const wave2 = Math.cos((tick * 0.04 * flightSpeed * currentMotion.speedFactor + 1.2)) * currentMotion.serpentineFlex * 0.7;
  const autoOrbitAngle = autoRotate ? (tick * 0.4 * flightSpeed * currentMotion.speedFactor) % 360 : 0;

  return (
    <div id="celestial-dragon-3d-panel" className={`tactical-card p-4 space-y-4 font-mono-code relative overflow-hidden transition-all duration-300 border-2 ${currentConfig.borderGlow} bg-[#060a18]/95`}>
      
      {/* Roar Screen Tremor Overlay */}
      {isRoaring && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center animate-pulse">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
          <div className="text-xl sm:text-3xl font-heading font-black tracking-widest text-white drop-shadow-[0_0_25px_#ffffff] uppercase text-center px-4">
            🐉 ROAR OF THE CELESTIAL DRAGON 🐉
          </div>
        </div>
      )}

      {/* Ki Breath Blast Beam Flash */}
      {isBreathingBlast && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-white/20 animate-pulse backdrop-blur-[2px]" />
          <div className={`w-full h-28 bg-gradient-to-r ${currentConfig.blastColor} blur-md opacity-90 animate-pulse shadow-[0_0_50px_#ffffff]`} />
          <div className="absolute font-heading font-black text-xl sm:text-3xl text-white tracking-widest drop-shadow-[0_0_20px_#ffffff] text-center px-2">
            CELESTIAL DRAGON {color.toUpperCase()} KI BREATH PURGE
          </div>
        </div>
      )}

      {/* Top Header: Title, Color Switcher & Motion Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-cyan-900/60">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-slate-950 border border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <span className="text-xl">🐉</span>
            <div className="absolute inset-0 rounded-xl border border-cyan-300/40 animate-ping opacity-30" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading font-extrabold text-base text-white tracking-wide">
                CELESTIAL DRAGON 3D: LIVE MOVE GUARDIAN
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${currentConfig.badgeBg}`}>
                {currentConfig.element}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Eastern Serpentine Dragon &bull; 3 Color Auras (Blue, Golden, Purple) &bull; 3 Live 3D Motion Modes
            </p>
          </div>
        </div>

        {/* 3 Color Selector Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden sm:inline">Color Aura:</span>
          <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-slate-800">
            {(['blue', 'golden', 'purple'] as DragonColor[]).map((cKey) => {
              const cfg = colorConfigs[cKey];
              const isSelected = color === cKey;
              return (
                <button
                  key={cKey}
                  type="button"
                  onClick={() => {
                    playTacticalBeep(cKey === 'golden' ? 950 : cKey === 'purple' ? 880 : 750);
                    setColor(cKey);
                    playSuccessChime();
                    speakAgentTTS(`${cfg.title} activated!`, 0.95, 1.1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? cfg.pillActive
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.glowColor }} />
                  <span className="capitalize">{cKey}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Live Moving Dragon Stage (Left) + Interactive Flight Controls & Spy Defense (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: 3D Interactive Live Moving Dragon Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center justify-between space-y-3">
          
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className={`relative w-full aspect-square max-w-[380px] rounded-2xl p-3 flex items-center justify-center select-none cursor-pointer overflow-hidden border-2 transition-all duration-150 ${currentConfig.borderGlow}`}
            style={{
              perspective: '1200px',
              transformStyle: 'preserve-3d',
              background: 'radial-gradient(circle at center, #0a1428 0%, #030611 100%)',
              boxShadow: `0 0 45px ${currentConfig.glowColor}40, inset 0 0 35px ${currentConfig.glowColor}25`,
            }}
          >
            {/* Background 4D Spacetime Ki Warping Grid */}
            <div className="absolute inset-0 warp-grid-4d opacity-30 pointer-events-none" />

            {/* Orbiting Ki Cosmic Rings */}
            <div 
              className={`absolute w-[330px] h-[330px] rounded-full border border-dashed ${currentConfig.ringBorder}/40 pointer-events-none animate-spin`} 
              style={{ animationDuration: '22s', transform: `rotateX(65deg) rotateZ(${tick * 0.8 * flightSpeed}deg)` }} 
            />
            <div 
              className="absolute w-[260px] h-[260px] rounded-full border border-dotted border-white/30 pointer-events-none animate-spin" 
              style={{ animationDuration: '14s', animationDirection: 'reverse', transform: `rotateY(55deg) rotateZ(-${tick * 1.2 * flightSpeed}deg)` }} 
            />

            {/* LIVE 3D MOVING DRAGON CONTAINER WITH MULTI-DEPTH PARALLAX */}
            <div
              className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/20 transition-transform duration-100 flex items-center justify-center"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${tiltX + (motionMode === 'combat' ? wave1 * 0.5 : 0)}deg) rotateY(${tiltY + (motionMode === 'warp' ? autoOrbitAngle : wave2 * 0.5)}deg) scale3d(${isHovered ? 1.04 : 1}, ${isHovered ? 1.04 : 1}, 1)`,
              }}
            >
              {/* Dragon High-Resolution Volumetric Artwork */}
              <img
                src={currentConfig.image}
                alt={currentConfig.name}
                className={`w-full h-full object-cover transition-all duration-300 filter ${
                  isRoaring ? 'brightness-135 contrast-125 scale-105' : ''
                } ${isBreathingBlast ? 'brightness-150 saturate-150' : ''}`}
                style={{
                  transform: `translate(${wave2 * 0.5}px, ${wave1 * 0.5}px)`,
                }}
              />

              {/* Dynamic Aura Gradient Layer */}
              <div className={`absolute inset-0 bg-gradient-to-t ${currentConfig.gradientAura} pointer-events-none mix-blend-screen`} />

              {/* LIVE FLOATING 3D CELESTIAL CLOUDS (PARALLAX DEPTH PLANES) */}
              <div 
                className={`absolute top-4 left-6 pointer-events-none transition-transform duration-300 ${currentConfig.cloudColor}`}
                style={{ transform: `translate3d(${wave1 * 1.2}px, ${wave2 * 0.8}px, 40px)` }}
              >
                <Wind className="w-8 h-8 opacity-80 drop-shadow-[0_0_10px_currentColor]" />
              </div>
              <div 
                className={`absolute bottom-6 right-6 pointer-events-none transition-transform duration-300 ${currentConfig.cloudColor}`}
                style={{ transform: `translate3d(-${wave1 * 1.5}px, -${wave2 * 1.2}px, 60px)` }}
              >
                <Wind className="w-10 h-10 opacity-75 drop-shadow-[0_0_12px_currentColor]" />
              </div>
              <div 
                className={`absolute bottom-16 left-8 pointer-events-none transition-transform duration-300 ${currentConfig.cloudColor}`}
                style={{ transform: `translate3d(${wave2 * 1.8}px, -${wave1 * 0.8}px, 30px)` }}
              >
                <Sparkles className="w-6 h-6 opacity-90 animate-spin" style={{ animationDuration: '8s' }} />
              </div>

              {/* Floating Ki Particle Sparks */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div 
                  className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#ffffff] animate-ping" 
                  style={{ top: '25%', left: '30%', position: 'absolute' }} 
                />
                <div 
                  className="w-2 h-2 rounded-full shadow-[0_0_12px_currentColor] animate-ping" 
                  style={{ top: '50%', right: '25%', position: 'absolute', color: currentConfig.glowColor, animationDelay: '0.4s' }} 
                />
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_15px_currentColor] animate-ping" 
                  style={{ bottom: '32%', left: '40%', position: 'absolute', color: currentConfig.glowColor, animationDelay: '0.8s' }} 
                />
              </div>

              {/* Top HUD Telemetry Badge */}
              <div className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded-lg bg-black/80 border border-cyan-500/70 text-cyan-300 flex items-center gap-1.5 backdrop-blur-md">
                <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>KI: {kiIntensity}%</span>
              </div>

              {/* Bottom HUD Mode Badge */}
              <div className="absolute bottom-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded-lg bg-black/80 border border-slate-700 text-slate-300 backdrop-blur-md flex items-center gap-1">
                <Move3d className="w-3 h-3 text-amber-400" />
                <span>3D {motionMode.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* 3D Motion Orientation & Attitude Scouter Bar */}
          <div className="w-full bg-[#050812] p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>3D CELESTIAL POWER SCOUTER</span>
              </span>
              <span className="font-heading font-black text-cyan-300 tracking-wider">
                {currentConfig.powerDisplay}
              </span>
            </div>

            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full rounded-full transition-all duration-300 shadow-md"
                style={{ 
                  width: `${kiIntensity}%`,
                  background: `linear-gradient(to right, #06b6d4, ${currentConfig.glowColor}, #ffffff)`
                }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Ki Res: {currentConfig.frequency}</span>
              <span>Pitch: {tiltX.toFixed(1)}° | Roll: {tiltY.toFixed(1)}°</span>
              <span className="text-emerald-400 font-bold">3D SYNC 100%</span>
            </div>
          </div>

        </div>

        {/* Right Column: 3 Motion Modes, Combat Abilities & Spy Intercepts */}
        <div className="lg:col-span-6 space-y-3 flex flex-col justify-between">
          
          {/* Active Dragon Overview Card */}
          <div className="bg-[#050914] p-3.5 rounded-xl border border-cyan-500/40 relative space-y-2 shadow-lg">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: currentConfig.glowColor }} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">{currentConfig.name}</span>
              </div>
              <button
                type="button"
                onClick={handleTriggerRoar}
                className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 transition cursor-pointer"
                title="Trigger Dragon Roar Sound"
              >
                <Volume2 className="w-3 h-3 text-cyan-400" />
                <span>Roar Audio</span>
              </button>
            </div>

            <div className="text-xs text-slate-300 font-sans leading-relaxed italic bg-black/40 p-2.5 rounded-lg border border-slate-800/80">
              "{currentConfig.subtitle}"
            </div>

            {/* Satellite & Threat Association Status */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                Guarding Satellite: {activeFeed?.name || 'GEO-PK-09'}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                Flight Vector: {motionMode.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Threat Intercepts: {threatMarkers.length}
              </span>
            </div>
          </div>

          {/* 3 LIVE MOVE 3D MOTION MODES SELECTOR */}
          <div className="bg-[#050812] p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Move3d className="w-3.5 h-3.5 text-cyan-400" />
                <span>SELECT 3D LIVE MOVE MODE</span>
              </span>
              <span className="text-cyan-400 font-mono text-[10px] uppercase">Active: {motionMode}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['patrol', 'combat', 'warp'] as DragonMotionMode[]).map((mKey) => {
                const modeItem = motionModes[mKey];
                const isActive = motionMode === mKey;
                return (
                  <button
                    key={mKey}
                    type="button"
                    onClick={() => {
                      playTacticalBeep(850);
                      setMotionMode(mKey);
                      playSuccessChime();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-gradient-to-br from-cyan-950 via-[#0a1a38] to-[#050d1e] border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/40'
                        : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[11px] block">{modeItem.label}</span>
                      <p className="text-[10px] text-slate-400 font-sans line-clamp-2 mt-1">
                        {modeItem.description}
                      </p>
                    </div>
                    {isActive && (
                      <span className="text-[9px] text-cyan-400 font-mono font-bold mt-1.5 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>ACTIVE 3D</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Live 3D Tuning Sliders */}
          <div className="bg-[#050812] p-3 rounded-xl border border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Serpentine Flight Speed</span>
                <span className="font-mono text-cyan-300">{flightSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={flightSpeed}
                onChange={(e) => setFlightSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Ki Aura Intensity</span>
                <span className="font-mono text-cyan-300">{kiIntensity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="1"
                value={kiIntensity}
                onChange={(e) => setKiIntensity(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Combat Abilities & Dragon Breath Trigger Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Ability 1: Ki Breath Blast */}
            <button
              type="button"
              onClick={handleTriggerKiBreath}
              disabled={isBreathingBlast}
              className={`p-3 rounded-xl text-white font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/20 transition active:scale-95 cursor-pointer disabled:opacity-50 shadow-lg ${
                color === 'golden'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                  : color === 'purple'
                  ? 'bg-gradient-to-r from-purple-600 to-violet-700 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>3D Dragon Breath</span>
            </button>

            {/* Ability 2: Roar Tremor */}
            <button
              type="button"
              onClick={handleTriggerRoar}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Celestial Roar</span>
            </button>
          </div>

          {/* Spy Threat Intercept Targets */}
          <div className="bg-[#050811] p-2.5 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>DRAGON ORBITAL PATROL TARGETS</span>
              </span>
              <span className="text-cyan-400 font-mono text-[10px]">PATROL LOCK</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {threatMarkers.slice(0, 3).map((marker) => (
                <button
                  key={marker.id}
                  type="button"
                  onClick={() => {
                    playSuccessChime();
                    if (onSelectMarker) onSelectMarker(marker);
                    const speech = `Celestial Dragon circling above ${marker.title}! Lat ${marker.lat.toFixed(1)}, Lng ${marker.lng.toFixed(1)}.`;
                    speakAgentTTS(speech, 0.9, 1.1);
                  }}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/60 text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-200 truncate group-hover:text-cyan-300">
                      {marker.title.split(' ')[0]}...
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
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
