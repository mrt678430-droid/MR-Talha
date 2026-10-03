import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Layers, 
  Orbit, 
  Sparkles, 
  RotateCw, 
  Sliders, 
  Cpu, 
  Compass, 
  Activity, 
  Copy, 
  Check, 
  Maximize2, 
  Zap, 
  Play, 
  Pause, 
  ShieldAlert, 
  Radio, 
  Move3d, 
  Eye, 
  CornerDownRight, 
  Flame
} from 'lucide-react';
import { playSuccessChime, playTacticalBeep, playHighPriorityAlert } from '../utils/audio';

interface Hyper4DStudioProps {
  onExecuteCommand?: (cmd: string) => void;
}

export type Geometry4D = 'tesseract' | 'orthoplex16' | 'octaplex24' | 'hypersphere' | 'wormhole';

export const Hyper4DStudio: React.FC<Hyper4DStudioProps> = ({ onExecuteCommand }) => {
  // 4D Rotation & Physics parameters
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [xwAngle, setXwAngle] = useState<number>(45);
  const [ywAngle, setYwAngle] = useState<number>(30);
  const [zwAngle, setZwAngle] = useState<number>(60);
  const [wDepth, setWDepth] = useState<number>(120);
  const [timeDilation, setTimeDilation] = useState<number>(1.0);
  const [glowIntensity, setGlowIntensity] = useState<number>(85);
  const [activeGeometry, setActiveGeometry] = useState<Geometry4D>('tesseract');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hologramColor, setHologramColor] = useState<'cyan' | 'neon-purple' | 'amber-gold' | 'emerald-bio'>('cyan');

  // Mouse parallax state for interactive 3D/4D card
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardRotateX, setCardRotateX] = useState<number>(0);
  const [cardRotateY, setCardRotateY] = useState<number>(0);
  const [isCardHovered, setIsCardHovered] = useState<boolean>(false);

  // Auto-rotation time counter for 4D projection matrix
  const [hyperTick, setHyperTick] = useState<number>(0);

  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setHyperTick(t => (t + 1) % 3600);
    }, 40);
    return () => clearInterval(interval);
  }, [isRotating]);

  // Handle card mouse movement for true 4D spatial parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / (rect.height / 2)) * 18;
    const rotY = (x / (rect.width / 2)) * 18;
    setCardRotateX(rotX);
    setCardRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    setCardRotateX(0);
    setCardRotateY(0);
  };

  // Copy CSS code snippet
  const handleCopyCode = (key: string, cssText: string) => {
    navigator.clipboard.writeText(cssText);
    setCopiedKey(key);
    playTacticalBeep(980);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Dispatch 4D Quantum Protocol to Hermes Core
  const handleDispatch4DProtocol = (protocolName: string) => {
    playSuccessChime();
    if (onExecuteCommand) {
      onExecuteCommand(`Execute 4D Hyper-Spatial Matrix synchronization: ${protocolName} with W-depth ${wDepth}px and time-dilation factor ${timeDilation}x.`);
    }
  };

  // Calculated 4D metrics
  const hyperVolume = Math.pow(wDepth / 10, 4).toFixed(0);
  const surfaceArea4D = (8 * Math.pow(wDepth / 10, 3)).toFixed(0);
  const quantumFlux = ((Math.sin(hyperTick * 0.05 * timeDilation) * 0.5 + 0.5) * 100).toFixed(1);
  const entanglementEntropy = (2.718 + Math.cos(hyperTick * 0.03) * 0.42).toFixed(4);

  return (
    <div id="hyper-4d-studio" className="space-y-4 font-mono-code">
      {/* 4D Header Banner */}
      <div className="tactical-card p-4 relative overflow-hidden border-cyan-500/40 bg-gradient-to-r from-[#070e1e]/95 via-[#0c162d]/90 to-[#070e1e]/95">
        {/* Background 4D grid line animation */}
        <div className="absolute inset-0 warp-grid-4d opacity-25 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <Move3d className="w-6 h-6 text-cyan-300 animate-spin" style={{ animationDuration: `${12 / (rotationSpeed || 1)}s` }} />
              <div className="absolute inset-0 rounded-xl border border-cyan-300/30 animate-ping opacity-30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-wider">
                  4D HYPER-SPATIAL CSS MATRIX
                </h2>
                <span className="badge-4d-hyper">
                  <Sparkles className="w-3 h-3" />
                  <span>D₄ PROJECTION</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Volumetric tesseract wireframes, 4D Minkowski spacetime rotations, quantum parallax holograms & pure CSS hyper-dimensional shaders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                setIsRotating(!isRotating);
                playTacticalBeep(isRotating ? 400 : 800);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                isRotating 
                  ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'bg-slate-900 border border-slate-700 text-slate-400'
              }`}
            >
              {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRotating ? '4D ROTATION ACTIVE' : 'FROZEN IN TIME'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDispatch4DProtocol('Quantum Calibration & Warp Stabilization')}
              className="btn-4d-hyper flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-black uppercase cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SYNC 4D DIRECTIVE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Stage (4D Tesseract Hologram) + Right Panel (4D CSS Parameters & Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 Columns: Real-Time 4D Tesseract Hologram Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="tactical-card p-4 relative overflow-hidden border-cyan-900/80 min-h-[460px] flex flex-col justify-between">
            {/* Viewport Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 z-10 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-bold text-slate-200">HYPER-DIMENSIONAL PROJECTION CHAMBER</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {activeGeometry.toUpperCase()}
                </span>
              </div>

              {/* Geometry selector tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['tesseract', 'orthoplex16', 'octaplex24', 'hypersphere'] as Geometry4D[]).map((geo) => (
                  <button
                    key={geo}
                    type="button"
                    onClick={() => {
                      playTacticalBeep(750);
                      setActiveGeometry(geo);
                    }}
                    className={`px-2 py-0.8 rounded text-[10px] font-bold uppercase transition cursor-pointer ${
                      activeGeometry === geo
                        ? 'bg-cyan-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {geo === 'tesseract' ? 'Tesseract' : geo === 'orthoplex16' ? '16-Cell' : geo === 'octaplex24' ? '24-Cell' : 'S³ Sphere'}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D/4D STAGE VIEWPORT CANVAS */}
            <div className="relative flex-1 flex items-center justify-center my-4 min-h-[300px] perspective-[1200px] select-none">
              
              {/* Spacetime Grid Backdrop */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-[320px] h-[320px] rounded-full border border-dashed border-cyan-500/30 animate-spin" style={{ animationDuration: '40s' }} />
                <div className="absolute w-[240px] h-[240px] rounded-full border border-dotted border-indigo-500/40 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
                <div className="absolute w-[380px] h-[380px] rounded-full border border-cyan-800/20" />
              </div>

              {/* 4D Gyroscopic Reticle Rings */}
              <div className="absolute chrono-dilation-ring w-[280px] h-[280px]" style={{ transform: `rotateX(60deg) rotateZ(${hyperTick * 0.8}deg)` }} />
              <div className="absolute chrono-dilation-ring w-[240px] h-[240px]" style={{ transform: `rotateY(60deg) rotateZ(-${hyperTick * 0.6}deg)` }} />

              {/* THE PURE CSS 4D TESSERACT HYPERCUBE */}
              <div 
                className="tesseract-container-4d relative"
                style={{
                  transform: `rotateX(${xwAngle + (isRotating ? hyperTick * 0.4 * rotationSpeed : 0)}deg) rotateY(${ywAngle + (isRotating ? hyperTick * 0.6 * rotationSpeed : 0)}deg) rotateZ(${zwAngle + (isRotating ? hyperTick * 0.2 * rotationSpeed : 0)}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 1. OUTER 3D CUBE OF TESSERACT */}
                <div 
                  className="tesseract-cube outer-cube"
                  style={{
                    width: `${wDepth * 1.5}px`,
                    height: `${wDepth * 1.5}px`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* 6 Outer Faces */}
                  <div className="tesseract-face face-front" style={{ transform: `translateZ(${wDepth * 0.75}px)` }} />
                  <div className="tesseract-face face-back" style={{ transform: `rotateY(180deg) translateZ(${wDepth * 0.75}px)` }} />
                  <div className="tesseract-face face-right" style={{ transform: `rotateY(90deg) translateZ(${wDepth * 0.75}px)` }} />
                  <div className="tesseract-face face-left" style={{ transform: `rotateY(-90deg) translateZ(${wDepth * 0.75}px)` }} />
                  <div className="tesseract-face face-top" style={{ transform: `rotateX(90deg) translateZ(${wDepth * 0.75}px)` }} />
                  <div className="tesseract-face face-bottom" style={{ transform: `rotateX(-90deg) translateZ(${wDepth * 0.75}px)` }} />
                </div>

                {/* 2. INNER 3D CUBE OF TESSERACT (W-Axis Projected) */}
                <div 
                  className="tesseract-cube inner-cube"
                  style={{
                    width: `${wDepth * 0.75}px`,
                    height: `${wDepth * 0.75}px`,
                    transform: `rotateX(${hyperTick * 0.3}deg) rotateY(${hyperTick * 0.5}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* 6 Inner Faces */}
                  <div className="tesseract-face inner-face face-front" style={{ transform: `translateZ(${wDepth * 0.375}px)` }} />
                  <div className="tesseract-face inner-face face-back" style={{ transform: `rotateY(180deg) translateZ(${wDepth * 0.375}px)` }} />
                  <div className="tesseract-face inner-face face-right" style={{ transform: `rotateY(90deg) translateZ(${wDepth * 0.375}px)` }} />
                  <div className="tesseract-face inner-face face-left" style={{ transform: `rotateY(-90deg) translateZ(${wDepth * 0.375}px)` }} />
                  <div className="tesseract-face inner-face face-top" style={{ transform: `rotateX(90deg) translateZ(${wDepth * 0.375}px)` }} />
                  <div className="tesseract-face inner-face face-bottom" style={{ transform: `rotateX(-90deg) translateZ(${wDepth * 0.375}px)` }} />
                </div>

                {/* 3. 4D CONNECTING STRUTS (Linking 8 vertices of outer cube to 8 vertices of inner cube) */}
                <div className="hyper-vertex v1" style={{ transform: `translate3d(${wDepth * 0.75}px, ${wDepth * 0.75}px, ${wDepth * 0.75}px)` }} />
                <div className="hyper-vertex v2" style={{ transform: `translate3d(-${wDepth * 0.75}px, ${wDepth * 0.75}px, ${wDepth * 0.75}px)` }} />
                <div className="hyper-vertex v3" style={{ transform: `translate3d(${wDepth * 0.75}px, -${wDepth * 0.75}px, ${wDepth * 0.75}px)` }} />
                <div className="hyper-vertex v4" style={{ transform: `translate3d(-${wDepth * 0.75}px, -${wDepth * 0.75}px, ${wDepth * 0.75}px)` }} />
                <div className="hyper-vertex v5" style={{ transform: `translate3d(${wDepth * 0.75}px, ${wDepth * 0.75}px, -${wDepth * 0.75}px)` }} />
                <div className="hyper-vertex v6" style={{ transform: `translate3d(-${wDepth * 0.75}px, ${wDepth * 0.75}px, -${wDepth * 0.75}px)` }} />
                <div className="hyper-vertex v7" style={{ transform: `translate3d(${wDepth * 0.75}px, -${wDepth * 0.75}px, -${wDepth * 0.75}px)` }} />
                <div className="hyper-vertex v8" style={{ transform: `translate3d(-${wDepth * 0.75}px, -${wDepth * 0.75}px, -${wDepth * 0.75}px)` }} />

                {/* Central 4D Singularity Quantum Core */}
                <div className="absolute w-6 h-6 rounded-full bg-cyan-300/80 shadow-[0_0_30px_#06b6d4] animate-pulse" />
              </div>

              {/* Live coordinate overlay HUD */}
              <div className="absolute bottom-2 left-2 text-[10px] text-cyan-400/80 space-y-0.5 bg-[#050914]/80 p-2 rounded-lg border border-cyan-950 backdrop-blur-md">
                <div>[4D VECTOR]: (X:{((xwAngle + hyperTick) % 360).toFixed(0)}°, Y:{((ywAngle + hyperTick * 1.2) % 360).toFixed(0)}°, Z:{((zwAngle + hyperTick * 0.7) % 360).toFixed(0)}°, W:{(wDepth * Math.cos(hyperTick * 0.05)).toFixed(1)}px)</div>
                <div>[METRIC]: η_μν = diag(-1, 1, 1, 1) • Spacetime Dilation: {timeDilation}x</div>
              </div>
            </div>

            {/* Quick 4D Axis Control Sliders Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-xs">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>XW Plane</span>
                  <span className="text-cyan-400">{xwAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={xwAngle}
                  onChange={(e) => setXwAngle(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>YW Plane</span>
                  <span className="text-cyan-400">{ywAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={ywAngle}
                  onChange={(e) => setYwAngle(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>W-Scale</span>
                  <span className="text-cyan-400">{wDepth}px</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={wDepth}
                  onChange={(e) => setWDepth(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Velocity</span>
                  <span className="text-cyan-400">{rotationSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: 4D Spacetime Telemetry & Hypervolume Matrix */}
        <div className="lg:col-span-5 space-y-4">
          {/* Telemetry Matrix Card */}
          <div className="tactical-card p-4 border-cyan-900/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-bold text-sm text-white">4D QUANTUM TELEMETRY</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold">
                STABLE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">4D Hypervolume (V₄)</div>
                <div className="text-lg font-extrabold text-cyan-300 mt-0.5 font-heading">
                  {Number(hyperVolume).toLocaleString()} <span className="text-xs text-slate-500 font-mono">μm⁴</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 font-mono">V₄ = a⁴ (8 cells)</div>
              </div>

              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">3D Boundary Area (A₄)</div>
                <div className="text-lg font-extrabold text-indigo-300 mt-0.5 font-heading">
                  {Number(surfaceArea4D).toLocaleString()} <span className="text-xs text-slate-500 font-mono">μm³</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 font-mono">A₄ = 8a³ (24 faces)</div>
              </div>

              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">Entanglement (S_E)</div>
                <div className="text-lg font-extrabold text-amber-300 mt-0.5 font-heading">
                  {entanglementEntropy} <span className="text-xs text-slate-500 font-mono">nats</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 font-mono">Von Neumann Entropy</div>
              </div>

              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">Quantum Flux (Ψ)</div>
                <div className="text-lg font-extrabold text-emerald-300 mt-0.5 font-heading">
                  {quantumFlux}%
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 font-mono">Phase Alignment</div>
              </div>
            </div>

            {/* Minkowski Spacetime Tensor Matrix */}
            <div className="bg-[#050811] p-3 rounded-xl border border-cyan-950 font-mono text-[10px] text-slate-300 space-y-1.5">
              <div className="flex justify-between text-slate-400 font-bold border-b border-slate-800 pb-1">
                <span>MINKOWSKI METRIC TENSOR η_μν</span>
                <span className="text-cyan-400">4x4 MATRIX</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center py-1 bg-black/40 rounded p-1">
                <span className="text-rose-400 font-bold">-1.000</span>
                <span className="text-slate-600">0.000</span>
                <span className="text-slate-600">0.000</span>
                <span className="text-slate-600">0.000</span>

                <span className="text-slate-600">0.000</span>
                <span className="text-cyan-400 font-bold">+1.000</span>
                <span className="text-slate-600">0.000</span>
                <span className="text-slate-600">0.000</span>

                <span className="text-slate-600">0.000</span>
                <span className="text-slate-600">0.000</span>
                <span className="text-cyan-400 font-bold">+1.000</span>
                <span className="text-slate-600">0.000</span>

                <span className="text-slate-600">0.000</span>
                <span className="text-slate-600">0.000</span>
                <span className="text-slate-600">0.000</span>
                <span className="text-cyan-400 font-bold">+1.000</span>
              </div>
              <div className="text-[9px] text-slate-500 text-center">
                Interval: ds² = -c²dt² + dx² + dy² + dz²
              </div>
            </div>

            {/* Quick Action Trigger Buttons */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleDispatch4DProtocol('Calabi-Yau 6D Manifold Compactification')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/50 text-left transition cursor-pointer text-xs text-cyan-300 group"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>Compactify 4D Metric Tensor</span>
                </div>
                <CornerDownRight className="w-3 h-3 text-cyan-500" />
              </button>

              <button
                type="button"
                onClick={() => handleDispatch4DProtocol('Quantum Parallax Wavefront Flush')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-800/50 text-left transition cursor-pointer text-xs text-indigo-300 group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span>Flush Quantum Parallax Buffer</span>
                </div>
                <CornerDownRight className="w-3 h-3 text-indigo-500" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: INTERACTIVE 4D CSS ELEMENT PLAYGROUND & CODE SHOWCASE */}
      <div className="tactical-card p-4 border-cyan-900/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>4D INTERACTIVE CSS ELEMENT SHOWCASE</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Hover, drag, and interact with live multi-layer 4D CSS components with dynamic depth extrusion.
            </p>
          </div>

          {/* Color theme presets */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 mr-1">Chroma:</span>
            {[
              { id: 'cyan', color: 'bg-cyan-500' },
              { id: 'neon-purple', color: 'bg-indigo-500' },
              { id: 'amber-gold', color: 'bg-amber-500' },
              { id: 'emerald-bio', color: 'bg-emerald-500' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  playTacticalBeep(850);
                  setHologramColor(c.id as any);
                }}
                className={`w-5 h-5 rounded-full ${c.color} cursor-pointer transition ${
                  hologramColor === c.id ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3-Column Interactive 4D Elements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Item 1: Interactive 4D Parallax Hologram Card */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">1. Parallax 4D Hologram Card</span>
              <button
                type="button"
                onClick={() => handleCopyCode('card-4d', `.tactical-card-4d {
  transform-style: preserve-3d;
  perspective: 1200px;
  background: linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(15,23,42,0.9) 100%);
  border: 1px solid rgba(6,182,212,0.4);
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.8), inset 0 0 20px rgba(6,182,212,0.2);
}
.layer-depth-z30 { transform: translateZ(30px); }
.layer-depth-z60 { transform: translateZ(60px); }`)}
                className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-200 cursor-pointer"
              >
                {copiedKey === 'card-4d' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'card-4d' ? 'Copied!' : 'Copy CSS'}</span>
              </button>
            </div>

            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="tactical-card-4d p-4 rounded-xl relative select-none cursor-pointer min-h-[220px] flex flex-col justify-between overflow-hidden"
              style={{
                transform: `rotateX(${cardRotateX}deg) rotateY(${cardRotateY}deg) scale(${isCardHovered ? 1.03 : 1})`,
                transition: isCardHovered ? 'transform 0.05s ease-out' : 'transform 0.5s ease-out',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Background 4D Hologram Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-indigo-500/20 pointer-events-none" />
              
              {/* Floating Reticle Layer at Z=30px */}
              <div className="layer-depth-z30 flex items-center justify-between pointer-events-none">
                <span className="badge-4d-tesseract">
                  <Box className="w-3 h-3 text-cyan-300" />
                  <span>Z-DEPTH: 40PX</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">TESSERACT-V4</span>
              </div>

              {/* Floating Content at Z=60px */}
              <div className="layer-depth-z60 my-auto pointer-events-none space-y-1">
                <div className="text-xs text-slate-400">HERMES 4D SUBSTRATE</div>
                <div className="font-heading font-extrabold text-base text-white tracking-wide">
                  Hyper-Volumetric Hologram
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Move your mouse across this card to observe 3-layer parallax depth extrusion.
                </p>
              </div>

              {/* Floating Bottom Status at Z=20px */}
              <div className="layer-depth-z30 flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-cyan-900/50 pointer-events-none">
                <span>Angle: ({cardRotateX.toFixed(1)}°, {cardRotateY.toFixed(1)}°)</span>
                <span className="text-emerald-400 font-bold">4D ALIGNED</span>
              </div>
            </div>
          </div>

          {/* Item 2: 4D Time-Dilation Buttons & Badges */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">2. 4D Quantum Buttons & Badges</span>
              <button
                type="button"
                onClick={() => handleCopyCode('btn-4d', `.btn-4d-hyper {
  position: relative;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%);
  box-shadow: 0 0 20px rgba(6,182,212,0.6), inset 0 1px 0 rgba(255,255,255,0.4);
  transform-style: preserve-3d;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-4d-hyper:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 0 30px rgba(6,182,212,0.9);
}`)}
                className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-200 cursor-pointer"
              >
                {copiedKey === 'btn-4d' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'btn-4d' ? 'Copied!' : 'Copy CSS'}</span>
              </button>
            </div>

            <div className="bg-[#070c18] p-4 rounded-xl border border-slate-800 min-h-[220px] flex flex-col justify-around space-y-3">
              {/* Button 1: Quantum Hyper Button */}
              <button
                type="button"
                onClick={() => playSuccessChime()}
                className="btn-4d-hyper w-full py-2.5 px-4 rounded-xl font-bold text-xs text-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Trigger 4D Energy Pulse</span>
              </button>

              {/* Button 2: Chrono Shift Button */}
              <button
                type="button"
                onClick={() => playTacticalBeep(900)}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-cyan-300 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition active:scale-95"
              >
                <RotateCw className="w-4 h-4 text-cyan-400" />
                <span>Rotate W-Axis Hyperplane</span>
              </button>

              {/* 4D Badges row */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="badge-4d-hyper">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>D₄-FLUX</span>
                </span>
                <span className="badge-4d-tesseract">
                  <Box className="w-2.5 h-2.5" />
                  <span>TESSERACT</span>
                </span>
                <span className="badge-4d-warp">
                  <Orbit className="w-2.5 h-2.5" />
                  <span>WARP-9</span>
                </span>
              </div>
            </div>
          </div>

          {/* Item 3: Concentric Chrono-Orbital Rings & Reticle */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">3. Multi-Axial Gyroscopic Reticle</span>
              <button
                type="button"
                onClick={() => handleCopyCode('reticle-4d', `.chrono-dilation-ring {
  border: 1.5px solid rgba(6,182,212,0.6);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(6,182,212,0.4);
  animation: rotate4dRing 8s linear infinite;
}`)}
                className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-200 cursor-pointer"
              >
                {copiedKey === 'reticle-4d' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'reticle-4d' ? 'Copied!' : 'Copy CSS'}</span>
              </button>
            </div>

            <div className="bg-[#070c18] p-4 rounded-xl border border-slate-800 min-h-[220px] flex items-center justify-center relative overflow-hidden">
              {/* Inner Gyroscopic 3-Ring assembly */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <div 
                  className="absolute w-36 h-36 rounded-full border border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  style={{
                    transform: `rotateX(${hyperTick * 1.5}deg) rotateY(${hyperTick * 0.8}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                />
                <div 
                  className="absolute w-28 h-28 rounded-full border border-indigo-400/80 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  style={{
                    transform: `rotateY(${hyperTick * 1.2}deg) rotateZ(${hyperTick * 1.8}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                />
                <div 
                  className="absolute w-20 h-20 rounded-full border border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  style={{
                    transform: `rotateX(${hyperTick * 2.0}deg) rotateZ(${hyperTick * 1.0}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                />
                
                {/* Central Quantum Node */}
                <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_#ffffff] animate-ping" />
              </div>

              <div className="absolute bottom-2 text-[9px] text-slate-400 font-mono">
                3-Axis Quantum Gyroscope Sync
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
