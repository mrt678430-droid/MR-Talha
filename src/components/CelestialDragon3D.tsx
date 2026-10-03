import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  Wind,
  Layers,
  Cpu,
  RefreshCw,
  Scan,
  ZapOff
} from 'lucide-react';
import { ThreatMarker, SatFeed } from '../types';
import { 
  playTacticalBeep, 
  playSuccessChime, 
  speakAgentTTS, 
  playDragonRoarSound, 
  playDragonKiBreathSound 
} from '../utils/audio';

// Import the generated dragon visual textures
import dragonBlueImg from '../assets/images/dragon_blue_3d_1791054265249.jpg';
import dragonGoldenImg from '../assets/images/dragon_golden_3d_1791054280260.jpg';
import dragonPurpleImg from '../assets/images/dragon_purple_3d_1791054298834.jpg';

export type DragonColor = 'blue' | 'golden' | 'purple';
export type DragonMotionMode = 'patrol' | 'combat' | 'warp';
export type HoloDisplayType = 'volumetric' | 'wireframe' | 'particles';

interface CelestialDragon3DProps {
  activeFeed?: SatFeed;
  threatMarkers?: ThreatMarker[];
  onDispatchCommand?: (cmd: string) => void;
  onSelectMarker?: (marker: ThreatMarker) => void;
}

// Particle interface for holographic ki field
interface HoloParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  baseAlpha: number;
}

export const CelestialDragon3D: React.FC<CelestialDragon3DProps> = ({
  activeFeed,
  threatMarkers = [],
  onDispatchCommand,
  onSelectMarker,
}) => {
  // 3 Primary Colors: Blue, Golden, Purple
  const [color, setColor] = useState<DragonColor>('golden');
  
  // 3 Live Move 3D Modes: Patrol, Combat, Warp
  const [motionMode, setMotionMode] = useState<DragonMotionMode>('combat');
  
  // Hologram Visualization Sub-mode: Volumetric Projection, Wireframe Matrix, Quantum Particles
  const [holoDisplay, setHoloDisplay] = useState<HoloDisplayType>('volumetric');
  
  // 3D Motion & Hologram Tuning
  const [flightSpeed, setFlightSpeed] = useState<number>(1.2);
  const [kiIntensity, setKiIntensity] = useState<number>(95);
  const [holoFlicker, setHoloFlicker] = useState<boolean>(true);
  const [showScanlines, setShowScanlines] = useState<boolean>(true);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [isRoaring, setIsRoaring] = useState<boolean>(false);
  const [isBreathingBlast, setIsBreathingBlast] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // 3D Orbit Angles (User drag interactive rotation)
  const [rotX, setRotX] = useState<number>(12); // Pitch (degrees)
  const [rotY, setRotY] = useState<number>(-15); // Yaw (degrees)
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Canvas Ref for real-time 3D Serpentine Hologram rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3 Color Configurations (Blue, Golden, Purple)
  const colorConfigs = useMemo(() => ({
    blue: {
      name: 'Azure Celestial Dragon (Cosmic Blue)',
      title: 'Azure Dragon of the East',
      subtitle: 'Electric Cyan Scales • High-Frequency Plasma Ki • Stellar Whispers',
      image: dragonBlueImg,
      primaryHex: '#00f3ff',
      secondaryHex: '#3b82f6',
      ambientRgb: '0, 243, 255',
      glowColor: '#00f3ff',
      badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-700',
      pillActive: 'bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_#00f3ff]',
      borderGlow: 'border-cyan-400 shadow-[0_0_40px_rgba(0,243,255,0.45)]',
      gradientAura: 'from-cyan-500/40 via-blue-600/30 to-transparent',
      ringBorder: 'border-cyan-400',
      coneClass: 'holo-emitter-cone',
      element: 'Cosmic Water & Lightning Qi',
      powerDisplay: '770,000,000,000',
      frequency: '432.8 THz',
      cloudColor: 'text-cyan-300/70',
      blastColor: 'from-cyan-300 via-blue-500 to-indigo-700',
      roarGreeting: 'The Azure Celestial Dragon roars! Holographic plasma radar sweeps the satellite grid!'
    },
    golden: {
      name: 'Imperial Solar Dragon (24K Gold Shenron)',
      title: 'Divine Emperor of the Sun',
      subtitle: 'Gleaming 24K Bullion Scales • Solar Crown Horns • Imperial Auspicious Ki',
      image: dragonGoldenImg,
      primaryHex: '#ffd700',
      secondaryHex: '#eab308',
      ambientRgb: '255, 215, 0',
      glowColor: '#ffd700',
      badgeBg: 'bg-yellow-950 text-yellow-300 border-yellow-700',
      pillActive: 'bg-amber-400 text-black font-extrabold shadow-[0_0_15px_#ffd700]',
      borderGlow: 'border-amber-400 shadow-[0_0_40px_rgba(255,215,0,0.45)]',
      gradientAura: 'from-amber-400/40 via-yellow-600/30 to-transparent',
      ringBorder: 'border-amber-400',
      coneClass: 'holo-emitter-cone-golden',
      element: 'Solar Divine Ki & Vault Guardian',
      powerDisplay: '8,888,888,888,000',
      frequency: '888.8 THz',
      cloudColor: 'text-amber-300/80',
      blastColor: 'from-yellow-200 via-amber-400 to-amber-700',
      roarGreeting: 'The Imperial Golden Dragon descends! Solar 3D hologram secures orbital coordinates!'
    },
    purple: {
      name: 'Void Nebula Dragon (Deep Space Purple)',
      title: 'Transcendental Void Serpent',
      subtitle: 'Dark Matter Obsidian Scales • Ultraviolet Eye Rays • Galaxy Nebula Vortex',
      image: dragonPurpleImg,
      primaryHex: '#c084fc',
      secondaryHex: '#9333ea',
      ambientRgb: '192, 132, 252',
      glowColor: '#c084fc',
      badgeBg: 'bg-purple-950 text-purple-300 border-purple-700',
      pillActive: 'bg-purple-500 text-white font-extrabold shadow-[0_0_15px_#c084fc]',
      borderGlow: 'border-purple-400 shadow-[0_0_40px_rgba(192,132,252,0.45)]',
      gradientAura: 'from-purple-500/40 via-violet-700/30 to-transparent',
      ringBorder: 'border-purple-400',
      coneClass: 'holo-emitter-cone-purple',
      element: 'Dark Matter Spacetime & Void Graviton',
      powerDisplay: '∞ (TRANSCENDENT VOID)',
      frequency: '999.9 THz',
      cloudColor: 'text-purple-300/80',
      blastColor: 'from-fuchsia-300 via-purple-600 to-indigo-900',
      roarGreeting: 'The Void Nebula Dragon awakens! Ultraviolet gravitational lenses warp space!'
    }
  }), []);

  const currentConfig = colorConfigs[color];

  // 3 Motion Modes: Patrol, Combat, Warp
  const motionModes: Record<DragonMotionMode, {
    label: string;
    description: string;
    speedFactor: number;
    serpentineFlex: number;
    pitchOffset: number;
    pearlOrbitSpeed: number;
  }> = {
    patrol: {
      label: '1. Orbital Recon Patrol',
      description: 'Smooth gliding serpentine undulation patrolling low-earth satellite trajectories with wide sine sweep.',
      speedFactor: 0.85,
      serpentineFlex: 22,
      pitchOffset: 4,
      pearlOrbitSpeed: 0.04,
    },
    combat: {
      label: '2. Celestial Combat Coil',
      description: 'Aggressive coiling stance with high-frequency serpentine undulation and ready breath ki beam.',
      speedFactor: 1.45,
      serpentineFlex: 36,
      pitchOffset: 12,
      pearlOrbitSpeed: 0.09,
    },
    warp: {
      label: '3. Spacetime Warp Ascension',
      description: 'Rapid 3D helical vortex rotation jumping across relativistic spacetime dimensions.',
      speedFactor: 2.4,
      serpentineFlex: 48,
      pitchOffset: 24,
      pearlOrbitSpeed: 0.16,
    }
  };

  const currentMotion = motionModes[motionMode];

  // 3D Particles initialization for holographic depth
  const particlesRef = useRef<HoloParticle[]>([]);
  useEffect(() => {
    const pts: HoloParticle[] = [];
    for (let i = 0; i < 180; i++) {
      pts.push({
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 400,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.4 - Math.random() * 1.2, // Floats upward towards hologram beam
        vz: (Math.random() - 0.5) * 0.8,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6,
        baseAlpha: 0.2 + Math.random() * 0.6,
      });
    }
    particlesRef.current = pts;
  }, []);

  // 3D Interactive Mouse / Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => prev + deltaX * 0.6);
    setRotX((prev) => Math.max(-60, Math.min(60, prev - deltaY * 0.6)));
  }, []);

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setRotY((prev) => prev + deltaX * 0.6);
    setRotX((prev) => Math.max(-60, Math.min(60, prev - deltaY * 0.6)));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Sound & combat triggers
  const handleTriggerRoar = () => {
    setIsRoaring(true);
    playDragonRoarSound();
    playTacticalBeep(940);
    setIsGlitching(true);
    speakAgentTTS(currentConfig.roarGreeting, 0.85, 1.05);

    setTimeout(() => {
      setIsRoaring(false);
      setIsGlitching(false);
      playSuccessChime();
    }, 1400);
  };

  const handleTriggerKiBreath = () => {
    if (isBreathingBlast) return;
    setIsBreathingBlast(true);
    playDragonKiBreathSound();
    playTacticalBeep(1100);

    const speech = `${currentConfig.title} unleashes divine 3D Holographic ${currentConfig.element} Ki Breath! Threat cleared!`;
    speakAgentTTS(speech, 0.9, 1.1);

    if (onDispatchCommand) {
      onDispatchCommand(`3D Holographic Celestial Dragon (${color.toUpperCase()}) executed ${currentConfig.element} breath blast across satellite recon feed.`);
    }

    setTimeout(() => {
      setIsBreathingBlast(false);
      playSuccessChime();
    }, 2200);
  };

  const handleGlitchPulse = () => {
    setIsGlitching(true);
    playTacticalBeep(1200);
    setTimeout(() => setIsGlitching(false), 500);
  };

  // Real-time 3D Holographic Canvas Rendering Loop
  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Clear with deep transparent alpha for trail glow
      ctx.clearRect(0, 0, width, height);

      t += 0.03 * flightSpeed * currentMotion.speedFactor;

      // Auto-rotation when enabled and not dragging
      if (autoRotate && !isDraggingRef.current) {
        setRotY((y) => (y + 0.45 * flightSpeed * currentMotion.speedFactor) % 360);
      }

      // Convert angles to radians
      const radX = (rotX * Math.PI) / 180;
      const radY = (rotY * Math.PI) / 180;
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      // 3D Perspective Projection helper
      const fov = 450;
      const project3D = (x: number, y: number, z: number) => {
        // Rotate around Y axis (yaw)
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotate around X axis (pitch)
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        // Apply Zoom & Perspective
        const depth = z2 + 500;
        const scale = depth > 1 ? (fov / depth) * zoomLevel : 1;
        const projX = cx + x1 * scale;
        const projY = cy + y2 * scale;

        return { x: projX, y: projY, scale, z: z2, visible: depth > 10 };
      };

      // 1. Draw Hologram Base Grid (Pedestal Projection Matrix)
      ctx.save();
      ctx.lineWidth = 1;
      const gridSize = 240;
      const gridSteps = 8;
      const gridY = 160;

      for (let i = -gridSteps; i <= gridSteps; i++) {
        const p1 = project3D(i * (gridSize / gridSteps), gridY, -gridSize);
        const p2 = project3D(i * (gridSize / gridSteps), gridY, gridSize);
        if (p1.visible && p2.visible) {
          ctx.strokeStyle = `rgba(${currentConfig.ambientRgb}, 0.12)`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        const p3 = project3D(-gridSize, gridY, i * (gridSize / gridSteps));
        const p4 = project3D(gridSize, gridY, i * (gridSize / gridSteps));
        if (p3.visible && p4.visible) {
          ctx.strokeStyle = `rgba(${currentConfig.ambientRgb}, 0.12)`;
          ctx.beginPath();
          ctx.moveTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.stroke();
        }
      }

      // Draw Hologram Concentric Emitter Rings on base
      for (let r = 40; r <= 180; r += 50) {
        ctx.beginPath();
        let first = true;
        for (let a = 0; a <= 360; a += 15) {
          const aRad = (a * Math.PI) / 180;
          const p = project3D(Math.cos(aRad) * r, gridY, Math.sin(aRad) * r);
          if (p.visible) {
            if (first) {
              ctx.moveTo(p.x, p.y);
              first = false;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          }
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(${currentConfig.ambientRgb}, 0.25)`;
        ctx.stroke();
      }
      ctx.restore();

      // 2. Render Holographic Floating Particles
      ctx.save();
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        const pt = pts[i];
        pt.x += pt.vx * flightSpeed;
        pt.y += pt.vy * flightSpeed;
        pt.z += pt.vz * flightSpeed;

        // Reset particle if floated out of bounds
        if (pt.y < -220) {
          pt.y = 150;
          pt.x = (Math.random() - 0.5) * 350;
          pt.z = (Math.random() - 0.5) * 350;
        }

        const proj = project3D(pt.x, pt.y, pt.z);
        if (proj.visible) {
          const alpha = pt.alpha * (kiIntensity / 100);
          ctx.fillStyle = `rgba(${currentConfig.ambientRgb}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(0.8, pt.size * proj.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 3. Mathematical 3D Celestial Serpentine Dragon Spine Calculation
      // Classic Eastern Dragon (Shenron style) undulating S-curve
      const numSegments = 38;
      const spinePoints: { x: number; y: number; z: number }[] = [];
      const flex = currentMotion.serpentineFlex;

      for (let i = 0; i < numSegments; i++) {
        const progress = i / numSegments; // 0 (head) to 1 (tail)
        
        // Serpentine wave mathematics
        let sx = 0;
        let sy = 0;
        let sz = 0;

        if (motionMode === 'patrol') {
          // Gentle gliding S-curves
          sx = Math.sin(t * 1.8 - progress * 4.2) * (flex * (1 - progress * 0.4));
          sy = Math.cos(t * 1.2 - progress * 3.5) * (flex * 0.6) - 20 + progress * 40;
          sz = Math.sin(t * 1.5 + progress * 3.8) * (flex * 0.8) + (progress - 0.5) * 160;
        } else if (motionMode === 'combat') {
          // Tight coiled posture ready to strike
          const angle = progress * Math.PI * 2.8 + t * 2.2;
          const radius = (60 + progress * 70) * (1 - progress * 0.3);
          sx = Math.cos(angle) * radius;
          sy = (progress - 0.5) * 160 + Math.sin(t * 3.2 + progress * 5) * (flex * 0.5);
          sz = Math.sin(angle) * radius;
        } else {
          // Warp Ascension: Helical vortex climbing through wormhole
          const angle = progress * Math.PI * 4 + t * 4.5;
          const radius = (40 + progress * 90);
          sx = Math.sin(angle) * radius;
          sy = (progress - 0.5) * 220 + Math.cos(t * 4 + progress * 3) * flex;
          sz = Math.cos(angle) * radius;
        }

        spinePoints.push({ x: sx, y: sy, z: sz });
      }

      // Project spine to 2D screen with 3D depth
      const projectedSpine = spinePoints.map((pt) => project3D(pt.x, pt.y, pt.z));

      // 4. Draw 3D Dragon Wireframe / Ribcage Segments if wireframe or volumetric mode
      if (holoDisplay === 'wireframe' || holoDisplay === 'volumetric') {
        ctx.save();

        // Connect spine nodes
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < projectedSpine.length; i++) {
          const p = projectedSpine[i];
          if (p.visible) {
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          }
        }
        ctx.strokeStyle = currentConfig.primaryHex;
        ctx.lineWidth = 2.5 * zoomLevel;
        ctx.shadowColor = currentConfig.primaryHex;
        ctx.shadowBlur = 15;
        ctx.stroke();

        // Draw segmented ribs & dorsal spikes along dragon body
        for (let i = 1; i < spinePoints.length - 2; i += 2) {
          const curr = spinePoints[i];
          const next = spinePoints[i + 1];
          // Tangent vector
          const dx = next.x - curr.x;
          const dy = next.y - curr.y;
          const dz = next.z - curr.z;
          const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

          // Normal vector for perpendicular rib extension
          const ribRadius = (1 - (i / numSegments) * 0.6) * 18;
          const nx = (-dy / len) * ribRadius;
          const ny = (dx / len) * ribRadius;
          const nz = 0;

          const rib1 = project3D(curr.x + nx, curr.y + ny, curr.z + nz);
          const rib2 = project3D(curr.x - nx, curr.y - ny, curr.z - nz);
          const dorsalSpike = project3D(curr.x, curr.y - ribRadius * 1.4, curr.z);

          if (rib1.visible && rib2.visible) {
            ctx.beginPath();
            ctx.moveTo(rib1.x, rib1.y);
            ctx.lineTo(rib2.x, rib2.y);
            ctx.strokeStyle = `rgba(${currentConfig.ambientRgb}, 0.6)`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Dorsal flame spine spike
            if (dorsalSpike.visible) {
              ctx.beginPath();
              ctx.moveTo(projectedSpine[i].x, projectedSpine[i].y);
              ctx.lineTo(dorsalSpike.x, dorsalSpike.y);
              ctx.strokeStyle = currentConfig.secondaryHex;
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }
        }

        // Dragon Head Wireframe (Antlers, Whiskers, Eyes, Claws)
        const headPt = spinePoints[0];
        const headProj = projectedSpine[0];
        if (headProj && headProj.visible) {
          // Glowing Celestial Eyes
          const eyeL = project3D(headPt.x - 12, headPt.y - 8, headPt.z + 8);
          const eyeR = project3D(headPt.x + 12, headPt.y - 8, headPt.z + 8);

          if (eyeL.visible) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(eyeL.x, eyeL.y, 3.5 * headProj.scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = currentConfig.primaryHex;
            ctx.beginPath();
            ctx.arc(eyeL.x, eyeL.y, 5 * headProj.scale, 0, Math.PI * 2);
            ctx.stroke();
          }

          if (eyeR.visible) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(eyeR.x, eyeR.y, 3.5 * headProj.scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = currentConfig.primaryHex;
            ctx.beginPath();
            ctx.arc(eyeR.x, eyeR.y, 5 * headProj.scale, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Whiskers waving with physics
          const whiskerWaveL = Math.sin(t * 3.5) * 16;
          const whiskerWaveR = Math.cos(t * 3.5) * 16;
          const whTipL = project3D(headPt.x - 38 + whiskerWaveL, headPt.y + 18, headPt.z + 24);
          const whTipR = project3D(headPt.x + 38 + whiskerWaveR, headPt.y + 18, headPt.z + 24);

          if (whTipL.visible) {
            ctx.beginPath();
            ctx.moveTo(headProj.x, headProj.y);
            ctx.quadraticCurveTo(headProj.x - 20, headProj.y + 10, whTipL.x, whTipL.y);
            ctx.strokeStyle = `rgba(${currentConfig.ambientRgb}, 0.85)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          if (whTipR.visible) {
            ctx.beginPath();
            ctx.moveTo(headProj.x, headProj.y);
            ctx.quadraticCurveTo(headProj.x + 20, headProj.y + 10, whTipR.x, whTipR.y);
            ctx.strokeStyle = `rgba(${currentConfig.ambientRgb}, 0.85)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Dragon Horns
          const hornTipL = project3D(headPt.x - 28, headPt.y - 38, headPt.z - 15);
          const hornTipR = project3D(headPt.x + 28, headPt.y - 38, headPt.z - 15);
          if (hornTipL.visible && hornTipR.visible) {
            ctx.beginPath();
            ctx.moveTo(headProj.x - 6, headProj.y - 8);
            ctx.lineTo(hornTipL.x, hornTipL.y);
            ctx.moveTo(headProj.x + 6, headProj.y - 8);
            ctx.lineTo(hornTipR.x, hornTipR.y);
            ctx.strokeStyle = currentConfig.primaryHex;
            ctx.lineWidth = 2.2;
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      // 5. Draw 3D Celestial Dragon Pearl of Wisdom (Flaming Orb) orbiting head
      const pearlAngle = t * currentMotion.pearlOrbitSpeed * 30;
      const pearlRadius = 75;
      const headOrigin = spinePoints[0] || { x: 0, y: 0, z: 0 };
      const pearlX = headOrigin.x + Math.cos(pearlAngle) * pearlRadius;
      const pearlY = headOrigin.y + Math.sin(pearlAngle * 0.7) * 35 - 15;
      const pearlZ = headOrigin.z + Math.sin(pearlAngle) * pearlRadius;

      const pearlProj = project3D(pearlX, pearlY, pearlZ);
      if (pearlProj.visible) {
        ctx.save();
        // Pearl glow aura
        const rad = 10 * pearlProj.scale;
        const grad = ctx.createRadialGradient(
          pearlProj.x, pearlProj.y, 1,
          pearlProj.x, pearlProj.y, rad * 2.5
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, currentConfig.primaryHex);
        grad.addColorStop(0.8, currentConfig.secondaryHex);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pearlProj.x, pearlProj.y, rad * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Pearl Solid Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pearlProj.x, pearlProj.y, rad * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Flaming Ki tendrils around Pearl
        for (let k = 0; k < 4; k++) {
          const flameA = t * 4 + k * (Math.PI / 2);
          const fx = pearlProj.x + Math.cos(flameA) * (rad * 1.4);
          const fy = pearlProj.y + Math.sin(flameA) * (rad * 1.4);
          ctx.strokeStyle = currentConfig.primaryHex;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(fx, fy, rad * 0.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 6. Draw Ki Breath Blast Particle Beam if firing
      if (isBreathingBlast && projectedSpine[0]?.visible) {
        ctx.save();
        const head = projectedSpine[0];
        const beamAngle = (rotY * Math.PI) / 180 + Math.PI / 2;
        const beamTargetX = head.x + Math.cos(beamAngle) * 280;
        const beamTargetY = head.y + Math.sin(beamAngle) * 80 + 40;

        // Beam gradient
        const beamGrad = ctx.createLinearGradient(head.x, head.y, beamTargetX, beamTargetY);
        beamGrad.addColorStop(0, '#ffffff');
        beamGrad.addColorStop(0.3, currentConfig.primaryHex);
        beamGrad.addColorStop(0.7, currentConfig.secondaryHex);
        beamGrad.addColorStop(1, 'transparent');

        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = (14 + Math.sin(t * 15) * 6) * zoomLevel;
        ctx.shadowColor = currentConfig.primaryHex;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.moveTo(head.x, head.y);
        ctx.lineTo(beamTargetX, beamTargetY);
        ctx.stroke();

        // Energy burst rings at head
        for (let b = 1; b <= 3; b++) {
          const ringRad = ((t * 50 + b * 20) % 60) * head.scale;
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - ringRad / 60})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(head.x, head.y, ringRad, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    color,
    motionMode,
    holoDisplay,
    flightSpeed,
    kiIntensity,
    autoRotate,
    rotX,
    rotY,
    zoomLevel,
    isBreathingBlast,
    currentConfig,
    currentMotion
  ]);

  return (
    <div 
      id="celestial-dragon-3d-panel" 
      className={`tactical-card p-4 space-y-4 font-mono-code relative overflow-hidden transition-all duration-300 border-2 ${currentConfig.borderGlow} bg-[#040814]/95`}
    >
      {/* Background 4D Spacetime Ki Warping Grid */}
      <div className="absolute inset-0 warp-grid-4d opacity-30 pointer-events-none" />

      {/* Roar Screen Tremor Overlay */}
      {isRoaring && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center animate-pulse">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
          <div className="text-xl sm:text-3xl font-heading font-black tracking-widest text-white drop-shadow-[0_0_25px_#ffffff] uppercase text-center px-4 holo-rgb-split">
            🐉 3D HOLOGRAPHIC DRAGON ROAR 🐉
          </div>
        </div>
      )}

      {/* Ki Breath Blast Beam Flash */}
      {isBreathingBlast && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-white/20 animate-pulse backdrop-blur-[2px]" />
          <div className={`w-full h-32 bg-gradient-to-r ${currentConfig.blastColor} blur-md opacity-90 animate-pulse shadow-[0_0_60px_#ffffff]`} />
          <div className="absolute font-heading font-black text-xl sm:text-3xl text-white tracking-widest drop-shadow-[0_0_25px_#ffffff] text-center px-2">
            3D HOLOGRAPHIC {color.toUpperCase()} KI BREATH PURGE
          </div>
        </div>
      )}

      {/* TOP HEADER BAR: TITLE, 3 COLOR AURA BUTTONS & QUICK TOGGLES */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-cyan-900/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-950 border border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <span className="text-2xl animate-pulse">🐉</span>
            <div className="absolute inset-0 rounded-xl border border-cyan-300/40 animate-ping opacity-30" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
                <span>3D HOLOGRAPHIC CELESTIAL DRAGON</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 animate-pulse">
                  LIVE 3D
                </span>
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${currentConfig.badgeBg}`}>
                {currentConfig.element}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              3 Holographic Colors (Blue, Golden, Purple) &bull; 3 Live 3D Move Modes &bull; Interactive 360&deg; Orbit Canvas
            </p>
          </div>
        </div>

        {/* 3 COLOR SELECTOR TABS (Blue, Golden, Purple) */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden sm:inline">
            Holo Color:
          </span>
          <div className="flex items-center gap-1.5 bg-black/85 p-1 rounded-xl border border-slate-800 shadow-inner">
            {(['blue', 'golden', 'purple'] as DragonColor[]).map((cKey) => {
              const cfg = colorConfigs[cKey];
              const isSelected = color === cKey;
              return (
                <button
                  key={cKey}
                  type="button"
                  onClick={() => {
                    playTacticalBeep(cKey === 'golden' ? 980 : cKey === 'purple' ? 880 : 750);
                    setColor(cKey);
                    playSuccessChime();
                    speakAgentTTS(`${cfg.title} holographic projection active!`, 0.95, 1.1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? cfg.pillActive
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
                  }`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-white/50" 
                    style={{ backgroundColor: cfg.primaryHex }} 
                  />
                  <span className="capitalize">{cKey}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT: 3D HOLOGRAPHIC STAGE (LEFT) + LIVE CONTROLS & SPY DEFENSE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* LEFT COLUMN: 3D HOLOGRAPHIC DRAGON VIEWPORT */}
        <div className="lg:col-span-7 flex flex-col items-center justify-between space-y-3">
          
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative w-full aspect-square max-w-[460px] rounded-2xl p-2 flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden border-2 transition-all duration-200 ${
              currentConfig.borderGlow
            } ${isGlitching ? 'holo-rgb-split' : ''}`}
            style={{
              perspective: '1200px',
              background: 'radial-gradient(circle at center, #071026 0%, #030510 100%)',
              boxShadow: `0 0 50px ${currentConfig.glowColor}30, inset 0 0 40px ${currentConfig.glowColor}20`,
            }}
          >
            {/* Hologram Base Projector Light Cone Beaming Upwards */}
            <div className={`absolute inset-0 pointer-events-none ${currentConfig.coneClass}`} />

            {/* Hologram Scanlines Overlay */}
            {showScanlines && (
              <div className="absolute inset-0 holo-scanlines z-20 pointer-events-none opacity-60" />
            )}

            {/* Vertical Laser Beam Sweep Effect */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-40 holo-beam-sweep pointer-events-none z-20" />

            {/* Orbiting Quantum Hologram Rings */}
            <div 
              className={`absolute w-[360px] h-[360px] rounded-full border border-dashed ${currentConfig.ringBorder}/30 pointer-events-none animate-spin`} 
              style={{ animationDuration: '24s', transform: `rotateX(68deg) rotateZ(${rotY}deg)` }} 
            />
            <div 
              className="absolute w-[280px] h-[280px] rounded-full border border-dotted border-white/20 pointer-events-none animate-spin" 
              style={{ animationDuration: '16s', animationDirection: 'reverse', transform: `rotateY(60deg) rotateZ(-${rotY}deg)` }} 
            />

            {/* VOLUMETRIC TEXTURE ARTWORK LAYER (blended with holographic shader) */}
            {holoDisplay === 'volumetric' && (
              <div
                className={`absolute inset-0 p-8 flex items-center justify-center pointer-events-none transition-transform duration-100 ${
                  holoFlicker ? 'holo-flicker-active' : ''
                }`}
                style={{
                  transform: `rotateX(${rotX * 0.4}deg) rotateY(${rotY * 0.4}deg) scale(${zoomLevel})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src={currentConfig.image}
                  alt={currentConfig.name}
                  className={`w-full h-full object-contain rounded-xl filter ${
                    isRoaring ? 'brightness-140 contrast-125' : 'brightness-110'
                  } ${isBreathingBlast ? 'brightness-150 saturate-150' : ''}`}
                  style={{
                    mixBlendMode: 'screen',
                    opacity: 0.85,
                    filter: `drop-shadow(0 0 25px ${currentConfig.glowColor})`,
                  }}
                />
              </div>
            )}

            {/* 3D HOLOGRAPHIC VECTOR & PARTICLE CANVAS */}
            <canvas
              ref={canvasRef}
              width={460}
              height={460}
              className="relative z-10 w-full h-full pointer-events-none"
            />

            {/* Top HUD Telemetry Info */}
            <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-lg bg-black/80 border border-cyan-500/70 text-cyan-300 flex items-center gap-1.5 backdrop-blur-md">
                <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>KI: {kiIntensity}%</span>
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-lg bg-black/80 border border-slate-700 text-slate-300 backdrop-blur-md hidden sm:inline-flex items-center gap-1">
                <Scan className="w-3 h-3 text-amber-400" />
                <span>{currentConfig.frequency}</span>
              </span>
            </div>

            {/* Top Right Quick Holo View Mode Switcher */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-black/85 p-1 rounded-lg border border-slate-800 backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(800);
                  setHoloDisplay('volumetric');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                  holoDisplay === 'volumetric' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
                title="Volumetric Solid Hologram"
              >
                Solid
              </button>
              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(850);
                  setHoloDisplay('wireframe');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                  holoDisplay === 'wireframe' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
                title="Wireframe Vector Matrix"
              >
                Wire
              </button>
              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(900);
                  setHoloDisplay('particles');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                  holoDisplay === 'particles' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
                title="Quantum Particle Field"
              >
                Points
              </button>
            </div>

            {/* Bottom HUD: 3D Motion Mode & Drag Hint */}
            <div className="absolute bottom-3 left-3 z-30 text-[9px] font-mono px-2.5 py-1 rounded-lg bg-black/85 border border-slate-700 text-slate-300 backdrop-blur-md flex items-center gap-1.5">
              <Move3d className="w-3 h-3 text-cyan-400" />
              <span>MODE: {motionMode.toUpperCase()} &bull; Drag to rotate 360&deg;</span>
            </div>

            {/* Bottom Right Zoom & Reset HUD */}
            <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1 bg-black/85 p-1 rounded-lg border border-slate-800 backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(700);
                  setZoomLevel((z) => Math.max(0.6, z - 0.15));
                }}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-[10px] font-mono text-cyan-300 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(750);
                  setZoomLevel((z) => Math.min(1.8, z + 0.15));
                }}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(650);
                  setRotX(12);
                  setRotY(-15);
                  setZoomLevel(1.0);
                }}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer ml-1"
                title="Reset 3D Angle"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 3D Attitude & Scouter Status Bar */}
          <div className="w-full bg-[#050812] p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>3D HOLOGRAPHIC POWER SCOUTER</span>
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

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Ki Res: {currentConfig.frequency}</span>
              <span>Pitch: {rotX.toFixed(0)}&deg; | Yaw: {rotY.toFixed(0)}&deg;</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>HOLO SYNC 100%</span>
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 3 LIVE MOVE 3D MODES, COMBAT ABILITIES & SPY PATROL */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          
          {/* Active Dragon Overview Card */}
          <div className="bg-[#050914] p-3.5 rounded-xl border border-cyan-500/40 relative space-y-2 shadow-lg">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: currentConfig.primaryHex }} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">{currentConfig.name}</span>
              </div>
              <button
                type="button"
                onClick={handleTriggerRoar}
                className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 transition cursor-pointer"
                title="Trigger Dragon Roar Sound"
              >
                <Volume2 className="w-3 h-3 text-cyan-400" />
                <span>Roar</span>
              </button>
            </div>

            <div className="text-xs text-slate-300 font-sans leading-relaxed italic bg-black/40 p-2.5 rounded-lg border border-slate-800/80">
              "{currentConfig.subtitle}"
            </div>

            {/* Satellite & Threat Association Status */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                Guarding: {activeFeed?.name || 'GEO-PK-09'}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                Mode: {motionMode.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Threats: {threatMarkers.length}
              </span>
            </div>
          </div>

          {/* 3 LIVE MOVE 3D MOTION MODES SELECTOR */}
          <div className="bg-[#050812] p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Move3d className="w-3.5 h-3.5 text-cyan-400" />
                <span>3 LIVE MOVE 3D MODES</span>
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

          {/* Interactive Live 3D Tuning Sliders & Hologram Matrix Controls */}
          <div className="bg-[#050812] p-3 rounded-xl border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>HOLOGRAPHIC MATRIX CONTROLS</span>
              </span>
              <button
                type="button"
                onClick={handleGlitchPulse}
                className="text-[10px] text-pink-400 hover:text-pink-300 font-mono flex items-center gap-1 cursor-pointer bg-pink-950/60 px-2 py-0.5 rounded border border-pink-800"
              >
                <Zap className="w-2.5 h-2.5" />
                <span>Glitch Pulse</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>3D Flight Speed</span>
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
                  <span>Ki Field Intensity</span>
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

            {/* Quick Feature Toggles */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Auto-Orbit 360&deg;</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showScanlines}
                  onChange={(e) => setShowScanlines(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Scanlines</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={holoFlicker}
                  onChange={(e) => setHoloFlicker(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Laser Shimmer</span>
              </label>
            </div>
          </div>

          {/* Combat Abilities & Dragon Breath Trigger Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Ability 1: 3D Holographic Ki Breath */}
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
              <span>3D Ki Breath</span>
            </button>

            {/* Ability 2: Celestial Roar */}
            <button
              type="button"
              onClick={handleTriggerRoar}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Celestial Roar</span>
            </button>
          </div>

          {/* Spy Threat Intercept Targets - Dragon locks holographic focus */}
          <div className="bg-[#050811] p-2.5 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>HOLOGRAPHIC RECON PATROL TARGETS</span>
              </span>
              <span className="text-cyan-400 font-mono text-[10px]">COORDINATE LOCK</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {threatMarkers.slice(0, 3).map((marker) => (
                <button
                  key={marker.id}
                  type="button"
                  onClick={() => {
                    playSuccessChime();
                    if (onSelectMarker) onSelectMarker(marker);
                    setMotionMode('combat');
                    const speech = `Holographic Dragon pivoting to intercept threat over ${marker.title}! Lat ${marker.lat.toFixed(1)}, Lng ${marker.lng.toFixed(1)}.`;
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
