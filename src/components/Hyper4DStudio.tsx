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
export type GhostChroma = 'prism' | 'cyan_azure' | 'electric_violet' | 'matrix_emerald';

export const GHOST_PALETTES: Record<GhostChroma, Array<{ border: string; inner: string; glow: string; node: string; name: string }>> = {
  prism: [
    { border: 'rgba(6, 182, 212, 0.75)', inner: 'rgba(99, 102, 241, 0.75)', glow: 'rgba(6, 182, 212, 0.55)', node: '#06b6d4', name: 'Cyan' },
    { border: 'rgba(99, 102, 241, 0.7)', inner: 'rgba(168, 85, 247, 0.7)', glow: 'rgba(99, 102, 241, 0.5)', node: '#818cf8', name: 'Indigo' },
    { border: 'rgba(168, 85, 247, 0.65)', inner: 'rgba(236, 72, 153, 0.65)', glow: 'rgba(168, 85, 247, 0.45)', node: '#c084fc', name: 'Violet' },
    { border: 'rgba(244, 63, 94, 0.6)', inner: 'rgba(245, 158, 11, 0.6)', glow: 'rgba(244, 63, 94, 0.4)', node: '#fb7185', name: 'Rose' },
    { border: 'rgba(245, 158, 11, 0.55)', inner: 'rgba(16, 185, 129, 0.55)', glow: 'rgba(245, 158, 11, 0.35)', node: '#fcd34d', name: 'Amber' },
  ],
  cyan_azure: [
    { border: 'rgba(6, 182, 212, 0.8)', inner: 'rgba(14, 165, 233, 0.8)', glow: 'rgba(6, 182, 212, 0.6)', node: '#22d3ee', name: 'Cyan' },
    { border: 'rgba(14, 165, 233, 0.7)', inner: 'rgba(59, 130, 246, 0.7)', glow: 'rgba(14, 165, 233, 0.5)', node: '#38bdf8', name: 'Azure' },
    { border: 'rgba(59, 130, 246, 0.6)', inner: 'rgba(99, 102, 241, 0.6)', glow: 'rgba(59, 130, 246, 0.4)', node: '#60a5fa', name: 'Cobalt' },
    { border: 'rgba(37, 99, 235, 0.5)', inner: 'rgba(79, 70, 229, 0.5)', glow: 'rgba(37, 99, 235, 0.3)', node: '#93c5fd', name: 'Electric Blue' },
    { border: 'rgba(29, 78, 216, 0.4)', inner: 'rgba(67, 56, 202, 0.4)', glow: 'rgba(29, 78, 216, 0.25)', node: '#bfdbfe', name: 'Deep Abyss' },
  ],
  electric_violet: [
    { border: 'rgba(168, 85, 247, 0.8)', inner: 'rgba(236, 72, 153, 0.8)', glow: 'rgba(168, 85, 247, 0.6)', node: '#c084fc', name: 'Purple' },
    { border: 'rgba(192, 132, 252, 0.7)', inner: 'rgba(244, 63, 94, 0.7)', glow: 'rgba(192, 132, 252, 0.5)', node: '#d8b4fe', name: 'Lilac' },
    { border: 'rgba(236, 72, 153, 0.6)', inner: 'rgba(217, 70, 239, 0.6)', glow: 'rgba(236, 72, 153, 0.4)', node: '#f472b6', name: 'Hot Pink' },
    { border: 'rgba(217, 70, 239, 0.5)', inner: 'rgba(168, 85, 247, 0.5)', glow: 'rgba(217, 70, 239, 0.3)', node: '#e879f9', name: 'Fuchsia' },
    { border: 'rgba(147, 51, 234, 0.4)', inner: 'rgba(126, 34, 206, 0.4)', glow: 'rgba(147, 51, 234, 0.25)', node: '#a855f7', name: 'Deep Orchid' },
  ],
  matrix_emerald: [
    { border: 'rgba(16, 185, 129, 0.8)', inner: 'rgba(5, 150, 105, 0.8)', glow: 'rgba(16, 185, 129, 0.6)', node: '#34d399', name: 'Emerald' },
    { border: 'rgba(52, 211, 153, 0.7)', inner: 'rgba(20, 184, 166, 0.7)', glow: 'rgba(52, 211, 153, 0.5)', node: '#6ee7b7', name: 'Mint' },
    { border: 'rgba(20, 184, 166, 0.6)', inner: 'rgba(6, 182, 212, 0.6)', glow: 'rgba(20, 184, 166, 0.4)', node: '#2dd4bf', name: 'Teal' },
    { border: 'rgba(13, 148, 136, 0.5)', inner: 'rgba(14, 165, 233, 0.5)', glow: 'rgba(13, 148, 136, 0.3)', node: '#5eead4', name: 'Aqua' },
    { border: 'rgba(15, 118, 110, 0.4)', inner: 'rgba(3, 105, 161, 0.4)', glow: 'rgba(15, 118, 110, 0.25)', node: '#99f6e4', name: 'Deep Jade' },
  ],
};

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

  // Motion Trail & Ghosting parameters
  const [motionTrailEnabled, setMotionTrailEnabled] = useState<boolean>(true);
  const [trailCount, setTrailCount] = useState<number>(4);
  const [trailEngine, setTrailEngine] = useState<'raf' | 'css'>('raf');
  const [trailSeparation, setTrailSeparation] = useState<number>(4);
  const [trailDecay, setTrailDecay] = useState<number>(0.65);
  const [chromaticShift, setChromaticShift] = useState<GhostChroma>('prism');
  const [trailBlur, setTrailBlur] = useState<boolean>(true);

  // rAF Trail History Buffer & Frame Snapshots
  const historyBufferRef = useRef<Array<{
    rotX: number;
    rotY: number;
    rotZ: number;
    innerRotX: number;
    innerRotY: number;
    timestamp: number;
  }>>([]);
  const animFrameRef = useRef<number | null>(null);
  const tickRef = useRef<number>(0);
  const [trailSnapshots, setTrailSnapshots] = useState<Array<{
    rotX: number;
    rotY: number;
    rotZ: number;
    innerRotX: number;
    innerRotY: number;
  }>>([]);

  // Mouse parallax state for interactive 3D/4D card
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardRotateX, setCardRotateX] = useState<number>(0);
  const [cardRotateY, setCardRotateY] = useState<number>(0);
  const [isCardHovered, setIsCardHovered] = useState<boolean>(false);

  // Auto-rotation time counter for 4D projection matrix
  const [hyperTick, setHyperTick] = useState<number>(0);

  // High-performance requestAnimationFrame loop for continuous physics & historical frame tracking
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (isRotating) {
        tickRef.current += delta * 25 * rotationSpeed * timeDilation;
        setHyperTick(Math.floor(tickRef.current) % 3600);
      }

      const currentTick = tickRef.current;
      const curRx = xwAngle + (isRotating ? currentTick * 0.4 : 0);
      const curRy = ywAngle + (isRotating ? currentTick * 0.6 : 0);
      const curRz = zwAngle + (isRotating ? currentTick * 0.2 : 0);
      const curInnerRx = currentTick * 0.3;
      const curInnerRy = currentTick * 0.5;

      const currentSnapshot = {
        rotX: curRx,
        rotY: curRy,
        rotZ: curRz,
        innerRotX: curInnerRx,
        innerRotY: curInnerRy,
        timestamp: currentTime,
      };

      const buf = historyBufferRef.current;
      buf.push(currentSnapshot);
      if (buf.length > 50) {
        buf.shift();
      }

      if (motionTrailEnabled && trailEngine === 'raf') {
        const sampled: Array<{
          rotX: number;
          rotY: number;
          rotZ: number;
          innerRotX: number;
          innerRotY: number;
        }> = [];
        for (let i = 1; i <= trailCount; i++) {
          const targetIndex = Math.max(0, buf.length - 1 - i * trailSeparation);
          if (buf[targetIndex]) {
            sampled.push({
              rotX: buf[targetIndex].rotX,
              rotY: buf[targetIndex].rotY,
              rotZ: buf[targetIndex].rotZ,
              innerRotX: buf[targetIndex].innerRotX,
              innerRotY: buf[targetIndex].innerRotY,
            });
          }
        }
        setTrailSnapshots(sampled);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRotating, rotationSpeed, timeDilation, xwAngle, ywAngle, zwAngle, motionTrailEnabled, trailEngine, trailCount, trailSeparation]);

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

  // Reusable Tesseract Wireframe Renderer for Lead and Ghost Echos
  const renderTesseractWireframe = (
    id: string,
    isGhost: boolean,
    ghostIdx: number,
    rotX: number,
    rotY: number,
    rotZ: number,
    innerRotX: number,
    innerRotY: number,
    opacity: number,
    borderColor: string,
    innerBorderColor: string,
    glowColor: string,
    nodeColor: string,
    blurPx: number,
    cssTransitionClass: string = ''
  ) => {
    const outerW = wDepth * 1.5;
    const innerW = wDepth * 0.75;
    const outerOffset = wDepth * 0.75;
    const innerOffset = wDepth * 0.375;

    return (
      <div 
        key={id}
        className={`tesseract-container-4d ${isGhost ? 'tesseract-ghost-layer' : 'relative'} ${cssTransitionClass}`}
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
          transformStyle: 'preserve-3d',
          opacity: isGhost ? opacity : 1,
          filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
          zIndex: isGhost ? 5 - ghostIdx : 10,
        }}
      >
        {/* 1. OUTER 3D CUBE OF TESSERACT */}
        <div 
          className="tesseract-cube outer-cube"
          style={{
            width: `${outerW}px`,
            height: `${outerW}px`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className={isGhost ? "tesseract-face-ghost" : "tesseract-face"} style={{ transform: `translateZ(${outerOffset}px)`, borderColor, boxShadow: `0 0 12px ${glowColor}` }} />
          <div className={isGhost ? "tesseract-face-ghost" : "tesseract-face"} style={{ transform: `rotateY(180deg) translateZ(${outerOffset}px)`, borderColor, boxShadow: `0 0 12px ${glowColor}` }} />
          <div className={isGhost ? "tesseract-face-ghost" : "tesseract-face"} style={{ transform: `rotateY(90deg) translateZ(${outerOffset}px)`, borderColor, boxShadow: `0 0 12px ${glowColor}` }} />
          <div className={isGhost ? "tesseract-face-ghost" : "tesseract-face"} style={{ transform: `rotateY(-90deg) translateZ(${outerOffset}px)`, borderColor, boxShadow: `0 0 12px ${glowColor}` }} />
          <div className={isGhost ? "tesseract-face-ghost" : "tesseract-face"} style={{ transform: `rotateX(90deg) translateZ(${outerOffset}px)`, borderColor, boxShadow: `0 0 12px ${glowColor}` }} />
          <div className={isGhost ? "tesseract-face-ghost" : "tesseract-face"} style={{ transform: `rotateX(-90deg) translateZ(${outerOffset}px)`, borderColor, boxShadow: `0 0 12px ${glowColor}` }} />
        </div>

        {/* 2. INNER 3D CUBE OF TESSERACT (W-Axis Projected) */}
        <div 
          className="tesseract-cube inner-cube"
          style={{
            width: `${innerW}px`,
            height: `${innerW}px`,
            transform: `rotateX(${innerRotX}deg) rotateY(${innerRotY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className={isGhost ? "tesseract-inner-ghost" : "tesseract-face inner-face"} style={{ transform: `translateZ(${innerOffset}px)`, borderColor: innerBorderColor, boxShadow: `0 0 15px ${glowColor}` }} />
          <div className={isGhost ? "tesseract-inner-ghost" : "tesseract-face inner-face"} style={{ transform: `rotateY(180deg) translateZ(${innerOffset}px)`, borderColor: innerBorderColor, boxShadow: `0 0 15px ${glowColor}` }} />
          <div className={isGhost ? "tesseract-inner-ghost" : "tesseract-face inner-face"} style={{ transform: `rotateY(90deg) translateZ(${innerOffset}px)`, borderColor: innerBorderColor, boxShadow: `0 0 15px ${glowColor}` }} />
          <div className={isGhost ? "tesseract-inner-ghost" : "tesseract-face inner-face"} style={{ transform: `rotateY(-90deg) translateZ(${innerOffset}px)`, borderColor: innerBorderColor, boxShadow: `0 0 15px ${glowColor}` }} />
          <div className={isGhost ? "tesseract-inner-ghost" : "tesseract-face inner-face"} style={{ transform: `rotateX(90deg) translateZ(${innerOffset}px)`, borderColor: innerBorderColor, boxShadow: `0 0 15px ${glowColor}` }} />
          <div className={isGhost ? "tesseract-inner-ghost" : "tesseract-face inner-face"} style={{ transform: `rotateX(-90deg) translateZ(${innerOffset}px)`, borderColor: innerBorderColor, boxShadow: `0 0 15px ${glowColor}` }} />
        </div>

        {/* 3. 4D CONNECTING STRUTS & VERTICES */}
        <div className={isGhost ? "ghost-vertex-node" : "hyper-vertex v1"} style={{ transform: `translate3d(${outerOffset}px, ${outerOffset}px, ${outerOffset}px)`, background: nodeColor, boxShadow: `0 0 8px ${glowColor}` }} />
        <div className={isGhost ? "ghost-vertex-node" : "hyper-vertex v2"} style={{ transform: `translate3d(-${outerOffset}px, ${outerOffset}px, ${outerOffset}px)`, background: nodeColor, boxShadow: `0 0 8px ${glowColor}` }} />
        <div className={isGhost ? "ghost-vertex-node" : "hyper-vertex v3"} style={{ transform: `translate3d(${outerOffset}px, -${outerOffset}px, ${outerOffset}px)`, background: nodeColor, boxShadow: `0 0 8px ${glowColor}` }} />
        <div className={isGhost ? "ghost-vertex-node" : "hyper-vertex v4"} style={{ transform: `translate3d(-${outerOffset}px, -${outerOffset}px, ${outerOffset}px)`, background: nodeColor, boxShadow: `0 0 8px ${glowColor}` }} />
        <div className={isGhost ? "ghost-vertex-node" : "hyper-vertex v5"} style={{ transform: `translate3d(${outerOffset}px, ${outerOffset}px, -${outerOffset}px)`, background: nodeColor, boxShadow: `0 0 8px ${glowColor}` }} />
        <div className={isGhost ? "ghost-vertex-node" : "hyper-vertex v6"} style={{ transform: `translate3d(-${outerOffset}px, ${outerOffset}px, -${outerOffset}px)`, background: nodeColor, boxShadow: `0 0 8px ${glowColor}` }} />
        <div className={isGhost ? "ghost-vertex-node" : "hyper-vertex v7"} style={{ transform: `translate3d(${outerOffset}px, -${outerOffset}px, -${outerOffset}px)`, background: nodeColor, boxShadow: `0 0 8px ${glowColor}` }} />
        <div className={isGhost ? "ghost-vertex-node" : "hyper-vertex v8"} style={{ transform: `translate3d(-${outerOffset}px, -${outerOffset}px, -${outerOffset}px)`, background: nodeColor, boxShadow: `0 0 8px ${glowColor}` }} />

        {/* Singularity Core */}
        {!isGhost && (
          <div className="absolute w-6 h-6 rounded-full bg-cyan-300/80 shadow-[0_0_30px_#06b6d4] animate-pulse" />
        )}
        {isGhost && ghostIdx === 0 && (
          <div className="absolute w-4 h-4 rounded-full bg-indigo-400/40 shadow-[0_0_15px_#6366f1] opacity-50" />
        )}
      </div>
    );
  };

  const leadRotX = xwAngle + (isRotating ? hyperTick * 0.4 * rotationSpeed : 0);
  const leadRotY = ywAngle + (isRotating ? hyperTick * 0.6 * rotationSpeed : 0);
  const leadRotZ = zwAngle + (isRotating ? hyperTick * 0.2 * rotationSpeed : 0);
  const leadInnerRotX = hyperTick * 0.3;
  const leadInnerRotY = hyperTick * 0.5;

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
                Volumetric tesseract wireframes, 4D Minkowski spacetime rotations, motion trail chrono-echoes & pure CSS hyper-dimensional shaders.
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
            <div className="space-y-2 z-10 pb-2 border-b border-slate-800/80">
              <div className="flex flex-wrap items-center justify-between gap-2">
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

              {/* 4D Motion Trail & Ghosting Engine Control Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#060a16]/95 rounded-lg border border-cyan-900/60 text-[11px]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMotionTrailEnabled(!motionTrailEnabled);
                      playTacticalBeep(motionTrailEnabled ? 450 : 850);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold uppercase transition cursor-pointer ${
                      motionTrailEnabled
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <Orbit className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{motionTrailEnabled ? 'GHOST TRAIL: ON' : 'GHOST TRAIL: OFF'}</span>
                  </button>

                  {/* Engine Toggle: rAF vs CSS */}
                  <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setTrailEngine('raf');
                        playTacticalBeep(700);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition cursor-pointer ${
                        trailEngine === 'raf' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="requestAnimationFrame sliding buffer with temporal historical coordinates"
                    >
                      rAF Loop
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTrailEngine('css');
                        playTacticalBeep(800);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition cursor-pointer ${
                        trailEngine === 'css' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="CSS transitions multi-tier easing lag"
                    >
                      CSS Lag
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Ghost count */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-[10px]">Echoes:</span>
                    {[2, 3, 4, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => {
                          setTrailCount(cnt);
                          playTacticalBeep(650 + cnt * 50);
                        }}
                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold transition cursor-pointer ${
                          trailCount === cnt
                            ? 'bg-cyan-500 text-black shadow-sm'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>

                  {/* Chromatic Palette */}
                  <select
                    value={chromaticShift}
                    onChange={(e) => {
                      setChromaticShift(e.target.value as GhostChroma);
                      playTacticalBeep(900);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-cyan-300 font-bold cursor-pointer"
                  >
                    <option value="prism">Spectrum Prism</option>
                    <option value="cyan_azure">Cyan-Azure</option>
                    <option value="electric_violet">Electric Violet</option>
                    <option value="matrix_emerald">Matrix Emerald</option>
                  </select>

                  {/* Blur toggle */}
                  <button
                    type="button"
                    onClick={() => setTrailBlur(!trailBlur)}
                    className={`px-1.5 py-0.5 rounded text-[10px] border transition cursor-pointer ${
                      trailBlur ? 'border-cyan-500/60 bg-cyan-950/60 text-cyan-300' : 'border-slate-800 text-slate-500'
                    }`}
                    title="Gaussian motion blur on trailing echoes"
                  >
                    Blur
                  </button>
                </div>
              </div>
            </div>

            {/* 3D/4D STAGE VIEWPORT CANVAS */}
            <div className="relative flex-1 flex items-center justify-center my-4 min-h-[320px] perspective-[1200px] select-none">
              
              {/* Spacetime Grid Backdrop */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-[320px] h-[320px] rounded-full border border-dashed border-cyan-500/30 animate-spin" style={{ animationDuration: '40s' }} />
                <div className="absolute w-[240px] h-[240px] rounded-full border border-dotted border-indigo-500/40 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
                <div className="absolute w-[380px] h-[380px] rounded-full border border-cyan-800/20" />
              </div>

              {/* 4D Gyroscopic Reticle Rings */}
              <div className="absolute chrono-dilation-ring w-[280px] h-[280px]" style={{ transform: `rotateX(60deg) rotateZ(${hyperTick * 0.8}deg)` }} />
              <div className="absolute chrono-dilation-ring w-[240px] h-[240px]" style={{ transform: `rotateY(60deg) rotateZ(-${hyperTick * 0.6}deg)` }} />

              {/* THE PURE CSS 4D TESSERACT HYPERCUBE WITH MOTION TRAILS & CHRONO-GHOSTING */}
              <div className="relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {/* 1. GHOST MOTION TRAILS (Trailing behind the primary tesseract) */}
                {motionTrailEnabled && (
                  trailEngine === 'raf' ? (
                    // requestAnimationFrame temporal history buffer mode
                    trailSnapshots.map((snap, i) => {
                      const palette = GHOST_PALETTES[chromaticShift][i % GHOST_PALETTES[chromaticShift].length];
                      const opacity = Math.pow(trailDecay, i + 1) * 0.75;
                      const blur = trailBlur ? (i + 1) * 0.6 : 0;
                      return renderTesseractWireframe(
                        `ghost-raf-${i}`,
                        true,
                        i,
                        snap.rotX,
                        snap.rotY,
                        snap.rotZ,
                        snap.innerRotX,
                        snap.innerRotY,
                        opacity,
                        palette.border,
                        palette.inner,
                        palette.glow,
                        palette.node,
                        blur
                      );
                    })
                  ) : (
                    // CSS transition stepped lag inertia mode
                    Array.from({ length: trailCount }).map((_, i) => {
                      const palette = GHOST_PALETTES[chromaticShift][i % GHOST_PALETTES[chromaticShift].length];
                      const opacity = Math.pow(trailDecay, i + 1) * 0.75;
                      const blur = trailBlur ? (i + 1) * 0.6 : 0;
                      const transitionClass = `ghost-transition-${Math.min(5, i + 1)}`;
                      return renderTesseractWireframe(
                        `ghost-css-${i}`,
                        true,
                        i,
                        leadRotX,
                        leadRotY,
                        leadRotZ,
                        leadInnerRotX,
                        leadInnerRotY,
                        opacity,
                        palette.border,
                        palette.inner,
                        palette.glow,
                        palette.node,
                        blur,
                        transitionClass
                      );
                    })
                  )
                )}

                {/* 2. PRIMARY LEAD TESSERACT */}
                {renderTesseractWireframe(
                  'lead-tesseract',
                  false,
                  0,
                  leadRotX,
                  leadRotY,
                  leadRotZ,
                  leadInnerRotX,
                  leadInnerRotY,
                  1,
                  'rgba(6, 182, 212, 0.75)',
                  'rgba(129, 140, 248, 0.85)',
                  'rgba(6, 182, 212, 0.45)',
                  '#ffffff',
                  0
                )}
              </div>

              {/* Live coordinate overlay HUD with Motion Trail Telemetry */}
              <div className="absolute bottom-2 left-2 text-[10px] text-cyan-400/80 space-y-0.5 bg-[#050914]/85 p-2 rounded-lg border border-cyan-950 backdrop-blur-md">
                <div>[4D VECTOR]: (X:{((xwAngle + hyperTick) % 360).toFixed(0)}°, Y:{((ywAngle + hyperTick * 1.2) % 360).toFixed(0)}°, Z:{((zwAngle + hyperTick * 0.7) % 360).toFixed(0)}°, W:{(wDepth * Math.cos(hyperTick * 0.05)).toFixed(1)}px)</div>
                <div>[MOTION TRAIL]: {motionTrailEnabled ? `${trailCount} Echoes (${trailEngine.toUpperCase()} Engine) • Shift: ${chromaticShift} • Lag: ~${(trailCount * trailSeparation * 16.6).toFixed(0)}ms` : 'Disabled'} • Spacetime Dilation: {timeDilation}x</div>
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

            {/* Motion Trail Fine-tuning Sliders when Trail is enabled */}
            {motionTrailEnabled && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs bg-[#050814]/60 p-2 rounded-lg mt-2">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Echo Persistence</span>
                    </span>
                    <span className="text-cyan-400">{Math.round(trailDecay * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="0.9"
                    step="0.05"
                    value={trailDecay}
                    onChange={(e) => setTrailDecay(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Orbit className="w-3 h-3 text-indigo-400" />
                      <span>Chrono-Lag Offset</span>
                    </span>
                    <span className="text-indigo-400">{trailSeparation} frames (~{(trailSeparation * 16.6).toFixed(0)}ms)</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={trailSeparation}
                    onChange={(e) => setTrailSeparation(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                </div>
              </div>
            )}
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

        {/* 4-Column Interactive 4D Elements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          
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
              <span className="font-bold text-slate-300">3. Multi-Axial Reticle</span>
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
                3-Axis Gyroscope Sync
              </div>
            </div>
          </div>

          {/* Item 4: 4D Motion Trail & Ghosting CSS Engine */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">4. 4D Motion Trail Ghosting</span>
              <button
                type="button"
                onClick={() => handleCopyCode('ghost-4d', `/* 4D Motion Trail & Ghosting CSS */
.tesseract-ghost-layer {
  position: absolute;
  transform-style: preserve-3d;
  pointer-events: none;
  mix-blend-mode: screen;
}
.ghost-transition-1 {
  transition: transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 0.15s ease-out;
}
.ghost-transition-2 {
  transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 0.2s ease-out;
}
.ghost-transition-3 {
  transition: transform 0.38s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 0.25s ease-out;
}
.tesseract-face-ghost {
  border: 1px solid rgba(6,182,212,0.6);
  box-shadow: 0 0 10px rgba(6,182,212,0.4);
}`)}
                className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-200 cursor-pointer"
              >
                {copiedKey === 'ghost-4d' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'ghost-4d' ? 'Copied!' : 'Copy CSS'}</span>
              </button>
            </div>

            <div className="bg-[#070c18] p-4 rounded-xl border border-slate-800 min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              {/* Mini 3D Viewport with Live Ghosting */}
              <div className="relative flex-1 flex items-center justify-center min-h-[140px] perspective-[600px] select-none">
                {/* Background warp ring */}
                <div className="absolute w-28 h-28 rounded-full border border-dashed border-cyan-500/20 animate-spin" style={{ animationDuration: '15s' }} />
                
                {/* Ghost 2 (Indigo) */}
                <div 
                  className="absolute w-14 h-14 border border-indigo-400/50 rounded-lg pointer-events-none"
                  style={{
                    transform: `rotateX(${(hyperTick * 0.7) - 18}deg) rotateY(${(hyperTick * 1.1) - 22}deg) rotateZ(15deg)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 0 15px rgba(99,102,241,0.3)',
                    mixBlendMode: 'screen',
                    opacity: 0.35,
                    filter: 'blur(0.5px)',
                  }}
                />

                {/* Ghost 1 (Cyan) */}
                <div 
                  className="absolute w-16 h-16 border border-cyan-400/60 rounded-lg pointer-events-none"
                  style={{
                    transform: `rotateX(${(hyperTick * 0.7) - 9}deg) rotateY(${(hyperTick * 1.1) - 11}deg) rotateZ(10deg)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 0 15px rgba(6,182,212,0.4)',
                    mixBlendMode: 'screen',
                    opacity: 0.6,
                  }}
                />

                {/* Lead Mini Cube */}
                <div 
                  className="relative w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center"
                  style={{
                    transform: `rotateX(${hyperTick * 0.7}deg) rotateY(${hyperTick * 1.1}deg) rotateZ(5deg)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 0 20px #06b6d4, inset 0 0 10px rgba(6,182,212,0.5)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
                </div>
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="text-cyan-300 font-mono">mix-blend-mode: screen</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  CHRONO-ECHO
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
