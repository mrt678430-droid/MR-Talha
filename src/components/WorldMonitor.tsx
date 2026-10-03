import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Globe as GlobeIcon, 
  Map as MapIcon, 
  Radio, 
  Satellite, 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  RefreshCw, 
  Filter, 
  Maximize2, 
  Zap, 
  Compass, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Eye
} from 'lucide-react';
import { WorldHotspot, NewsHeadline } from '../types';
import { playTacticalBeep, playHighPriorityAlert } from '../utils/audio';

const WORLD_HOTSPOTS_DATA: WorldHotspot[] = [
  {
    id: 'hs-1',
    title: 'Strait of Hormuz Maritime Corridor',
    category: 'DEFENSE',
    city: 'Hormuz Strait',
    country: 'International Waters',
    lat: 26.5,
    lng: 56.2,
    threatLevel: 'CRITICAL',
    newsSummary: 'SAR radar detects 14 crude supertankers navigating convoy routes under heightened electronic warfare jamming.',
    source: 'GEO-PK-09 SAR Recon',
    timestamp: 'Just now',
    activeSensors: 42,
    telemetry: {
      temperatureC: 34.2,
      rfActivity: 'HIGH_JAMMING_DETECTED',
      satellitePass: 'SAT-09 in 12m'
    }
  },
  {
    id: 'hs-2',
    title: 'Karachi & Lahore Bullion Hub',
    category: 'MARKETS',
    city: 'Karachi',
    country: 'Pakistan',
    lat: 24.86,
    lng: 67.0,
    threatLevel: 'HIGH',
    newsSummary: '24K Gold spot price surged to ₨ 284,500/Tola. Interbank USD/PKR liquidity rebalances after central bank reserve release.',
    source: 'Sam Market Scraper',
    timestamp: '2m ago',
    activeSensors: 16,
    telemetry: {
      temperatureC: 28.5,
      rfActivity: 'NOMINAL',
      satellitePass: 'GEO-PK-09 Live'
    }
  },
  {
    id: 'hs-3',
    title: 'Washington DC Cyber Defense Command',
    category: 'GEOPOLITICAL',
    city: 'Washington DC',
    country: 'United States',
    lat: 38.9,
    lng: -77.0,
    threatLevel: 'MEDIUM',
    newsSummary: 'Global AI safety accord drafted for autonomous swarm coordination and quantum-resistant key rotation standards.',
    source: 'Cyber Intel Feed',
    timestamp: '5m ago',
    activeSensors: 38,
    telemetry: {
      temperatureC: 18.0,
      rfActivity: 'SECURE_ENCRYPTED',
      satellitePass: 'USA-SAT-04 Live'
    }
  },
  {
    id: 'hs-4',
    title: 'Tokyo Quantum Silicon Cluster',
    category: 'TECH',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.67,
    lng: 139.65,
    threatLevel: 'LOW',
    newsSummary: 'New 2nm superconducting neural chip architecture delivers 4x inference speed for edge autonomous agents.',
    source: 'Tech Global Wire',
    timestamp: '14m ago',
    activeSensors: 29,
    telemetry: {
      temperatureC: 15.4,
      rfActivity: 'NOMINAL',
      satellitePass: 'ORBIT-ASIA-02'
    }
  },
  {
    id: 'hs-5',
    title: 'London Commodity Exchange',
    category: 'MARKETS',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5,
    lng: -0.12,
    threatLevel: 'MEDIUM',
    newsSummary: 'Precious metals arbitrate between LBMA spot fix and COMEX futures amidst central bank bullion accumulation.',
    source: 'Reuters / Financial Stream',
    timestamp: '18m ago',
    activeSensors: 22,
    telemetry: {
      temperatureC: 12.1,
      rfActivity: 'NOMINAL',
      satellitePass: 'SAT-EU-01'
    }
  },
  {
    id: 'hs-6',
    title: 'Singapore Maritime & Sat Gateway',
    category: 'DEFENSE',
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.35,
    lng: 103.8,
    threatLevel: 'LOW',
    newsSummary: 'Malacca Strait optical sensor network reports record commercial vessel throughput with zero piracy incursions.',
    source: 'Maritime AIS Tracker',
    timestamp: '25m ago',
    activeSensors: 31,
    telemetry: {
      temperatureC: 30.2,
      rfActivity: 'NOMINAL',
      satellitePass: 'SAT-SG-03'
    }
  },
  {
    id: 'hs-7',
    title: 'Geneva Global Protocol Summit',
    category: 'GEOPOLITICAL',
    city: 'Geneva',
    country: 'Switzerland',
    lat: 46.2,
    lng: 6.14,
    threatLevel: 'LOW',
    newsSummary: 'International Telecommunication Union approves new multi-agent orbital spectrum allocation for autonomous satellite meshes.',
    source: 'ITU Dispatch',
    timestamp: '32m ago',
    activeSensors: 19,
    telemetry: {
      temperatureC: 9.8,
      rfActivity: 'SECURE',
      satellitePass: 'EU-PASS-07'
    }
  },
  {
    id: 'hs-8',
    title: 'San Francisco Neural Agent Labs',
    category: 'TECH',
    city: 'San Francisco',
    country: 'United States',
    lat: 37.77,
    lng: -122.41,
    threatLevel: 'LOW',
    newsSummary: 'Open-weight multimodal agent models demonstrate real-time spatial navigation and desktop OS control with zero latency.',
    source: 'Silicon Valley AI Stream',
    timestamp: '40m ago',
    activeSensors: 45,
    telemetry: {
      temperatureC: 16.5,
      rfActivity: 'NOMINAL',
      satellitePass: 'USA-SAT-02'
    }
  },
];

interface WorldMonitorProps {
  onSelectHotspot?: (hotspot: WorldHotspot) => void;
  accentColor?: string;
}

export const WorldMonitor: React.FC<WorldMonitorProps> = ({
  onSelectHotspot,
  accentColor = '#06b6d4'
}) => {
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedHotspot, setSelectedHotspot] = useState<WorldHotspot>(WORLD_HOTSPOTS_DATA[0]);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.003);
  const [hotspots] = useState<WorldHotspot[]>(WORLD_HOTSPOTS_DATA);
  const [lastRefreshTime, setLastRefreshTime] = useState<string>('Live');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // Convert lat/lng to 3D sphere coordinates
  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Initialize Three.js 3D Globe
  useEffect(() => {
    if (viewMode !== '3D' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 1.8);
    dirLight1.position.set(5, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x6366f1, 0.9);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    // Globe Core Sphere with glowing wireframe
    const globeRadius = 1;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 48, 48);
    
    // Custom dark high-tech globe material
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x071120,
      emissive: 0x030810,
      specular: 0x06b6d4,
      shininess: 25,
      wireframe: false,
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globeMesh);
    sphereRef.current = globeMesh;

    // Outer Wireframe Grid Shell
    const wireGeometry = new THREE.SphereGeometry(globeRadius * 1.002, 28, 28);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x15385b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    globeMesh.add(wireMesh);

    // Outer Atmosphere Glow Ring
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.15, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // Orbital Ring Particle Belt
    const orbitalGroup = new THREE.Group();
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = globeRadius * 1.35 + (Math.random() - 0.5) * 0.15;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.02,
      transparent: true,
      opacity: 0.65,
    });
    const orbitalParticles = new THREE.Points(particleGeometry, particleMaterial);
    orbitalGroup.add(orbitalParticles);
    scene.add(orbitalGroup);

    // Hotspot Pinned Markers
    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;
    globeMesh.add(markersGroup);

    hotspots.forEach((hs) => {
      const pos = latLngToVector3(hs.lat, hs.lng, globeRadius * 1.01);
      
      // Pin Sphere
      const pinColor = hs.threatLevel === 'CRITICAL' ? 0xf43f5e : hs.threatLevel === 'HIGH' ? 0xf59e0b : 0x06b6d4;
      const pinGeometry = new THREE.SphereGeometry(0.028, 12, 12);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: pinColor });
      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      pinMesh.position.copy(pos);
      
      // Pin Beacon Stalk
      const stalkPos = latLngToVector3(hs.lat, hs.lng, globeRadius * 1.06);
      const stalkGeometry = new THREE.BufferGeometry().setFromPoints([pos, stalkPos]);
      const stalkMaterial = new THREE.LineBasicMaterial({ color: pinColor, transparent: true, opacity: 0.8 });
      const stalkLine = new THREE.Line(stalkGeometry, stalkMaterial);

      // Radar Ripple Ring
      const ringGeometry = new THREE.RingGeometry(0.01, 0.045, 16);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: pinColor, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.position.copy(stalkPos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));

      const markerNode = new THREE.Group();
      markerNode.name = hs.id;
      markerNode.add(pinMesh);
      markerNode.add(stalkLine);
      markerNode.add(ringMesh);
      markersGroup.add(markerNode);
    });

    // Mouse Interaction Handlers for Drag & Rotate
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !sphereRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      sphereRef.current.rotation.y += deltaX * 0.008;
      sphereRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      
      if (globeMesh && autoRotate && !isDraggingRef.current) {
        globeMesh.rotation.y += rotationSpeed;
      }

      if (orbitalGroup) {
        orbitalGroup.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      const newWidth = canvas.clientWidth;
      const newHeight = canvas.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [viewMode, autoRotate, rotationSpeed, hotspots]);

  // Focus globe rotation on selected hotspot
  const focusOnHotspot = (hs: WorldHotspot) => {
    setSelectedHotspot(hs);
    playTacticalBeep(650);
    if (onSelectHotspot) onSelectHotspot(hs);

    if (sphereRef.current) {
      // Calculate target Y & X rotation to face camera
      const targetY = -(hs.lng * (Math.PI / 180)) - Math.PI / 2;
      const targetX = hs.lat * (Math.PI / 180);
      sphereRef.current.rotation.y = targetY;
      sphereRef.current.rotation.x = targetX * 0.5;
    }
  };

  const filteredHotspots = selectedCategory === 'ALL'
    ? hotspots
    : hotspots.filter(h => h.category === selectedCategory);

  return (
    <div id="stonic-world-monitor" className="w-full space-y-4 font-mono-code">
      {/* Top Mission Control Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl tactical-card border border-cyan-900/60 bg-gradient-to-r from-slate-950 via-[#0a1224] to-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <GlobeIcon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-slate-100">
                World Monitor & Mission Control
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE SAT LINK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Interactive 3D Globe with breaking geopolitical, market, and cyber defense hotspots.
            </p>
          </div>
        </div>

        {/* 3D Globe vs 2D Tactical Command Map Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                playTacticalBeep(600);
                setViewMode('3D');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === '3D'
                  ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GlobeIcon className="w-3.5 h-3.5" />
              3D Globe
            </button>
            <button
              type="button"
              onClick={() => {
                playTacticalBeep(600);
                setViewMode('2D');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === '2D'
                  ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              2D Command Map
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              playTacticalBeep(700);
              setLastRefreshTime(new Date().toLocaleTimeString());
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-700 transition cursor-pointer"
            title="Refresh Orbital Downlink"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Mission Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive 3D / 2D Canvas View (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full h-[450px] rounded-xl tactical-card border border-cyan-950/80 overflow-hidden bg-slate-950/90 flex items-center justify-center shadow-2xl">
            {/* Top Canvas Telemetry HUD Overlays */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-slate-950/80 border border-cyan-900/60 text-[10px] text-cyan-400 font-bold backdrop-blur-md">
                FOV: 45° | ORBITAL MESH: ACTIVE
              </span>
              <span className="px-2 py-1 rounded bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 backdrop-blur-md">
                HOTSPOTS: {hotspots.length}
              </span>
            </div>

            {/* 3D Canvas Controls */}
            {viewMode === '3D' && (
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 backdrop-blur-md bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                    autoRotate ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {autoRotate ? 'Auto-Spin [ON]' : 'Auto-Spin [PAUSED]'}
                </button>
                <button
                  type="button"
                  onClick={() => focusOnHotspot(WORLD_HOTSPOTS_DATA[0])}
                  className="px-2 py-1 rounded text-[11px] text-slate-400 hover:text-cyan-300 transition"
                >
                  Reset View
                </button>
              </div>
            )}

            {/* View Mode Rendering: 3D WebGL Globe or 2D Vector Radar Map */}
            {viewMode === '3D' ? (
              <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                <canvas ref={canvasRef} className="w-full h-full" />
                <div className="absolute bottom-3 right-3 z-10 text-[10px] text-slate-500 pointer-events-none">
                  Drag to rotate • Pinch to zoom
                </div>
              </div>
            ) : (
              /* 2D Tactical Command Map */
              <div className="w-full h-full relative p-4 flex flex-col justify-between cyber-grid-bg">
                {/* 2D Radar Overlay Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />
                
                {/* Tactical Scanlines & Radar Sweep */}
                <div className="absolute inset-0 scanline-bg pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-cyan-900/40 pointer-events-none">
                  <div className="w-full h-full rounded-full border border-cyan-500/20 animate-radar-sweep origin-center" />
                </div>

                {/* 2D Vector Map Hotspots */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {hotspots.map((hs) => {
                    // Map lat/lng to 2D % coordinates
                    const xPercent = ((hs.lng + 180) / 360) * 85 + 7;
                    const yPercent = ((90 - hs.lat) / 180) * 80 + 10;
                    const isSelected = selectedHotspot?.id === hs.id;
                    const isCrit = hs.threatLevel === 'CRITICAL';

                    return (
                      <div
                        key={hs.id}
                        onClick={() => focusOnHotspot(hs)}
                        style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      >
                        <div className="relative flex items-center justify-center">
                          <span className={`w-3 h-3 rounded-full ${
                            isCrit ? 'bg-rose-500 animate-ping' : isSelected ? 'bg-cyan-400 animate-ping' : 'bg-cyan-600'
                          } absolute opacity-75`} />
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            isCrit ? 'bg-rose-400' : isSelected ? 'bg-cyan-300 ring-2 ring-cyan-400' : 'bg-cyan-500'
                          } shadow-[0_0_8px_#06b6d4]`} />
                        </div>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden group-hover:block whitespace-nowrap px-2 py-1 rounded bg-slate-950/90 border border-cyan-500 text-[10px] text-cyan-300 shadow-xl z-30">
                          {hs.city} ({hs.threatLevel})
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>MERCATOR SECTOR PROJECTION</span>
                  <span className="text-cyan-400">LAT/LONG GRID SYNCHRONIZED</span>
                </div>
              </div>
            )}
          </div>

          {/* Selected Hotspot Deep Telemetry Card */}
          {selectedHotspot && (
            <div className="p-4 rounded-xl tactical-card border border-cyan-900/60 bg-gradient-to-r from-slate-950 via-[#0a1428] to-slate-950 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                      {selectedHotspot.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">
                      {selectedHotspot.title}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{selectedHotspot.city}, {selectedHotspot.country}</span>
                    <span>•</span>
                    <span className="font-mono-code text-cyan-400">
                      {selectedHotspot.lat.toFixed(2)}°N, {selectedHotspot.lng.toFixed(2)}°E
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                  selectedHotspot.threatLevel === 'CRITICAL'
                    ? 'bg-rose-950/80 border-rose-600 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                    : selectedHotspot.threatLevel === 'HIGH'
                    ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                    : 'bg-cyan-950/80 border-cyan-600 text-cyan-300'
                }`}>
                  THREAT: {selectedHotspot.threatLevel}
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-sans leading-relaxed">
                {selectedHotspot.newsSummary}
              </p>

              {/* Sensor & Telemetry Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Active Sensors</div>
                  <div className="text-xs font-bold text-cyan-300">{selectedHotspot.activeSensors} Nodes</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Surface Temp</div>
                  <div className="text-xs font-bold text-slate-200">{selectedHotspot.telemetry.temperatureC}°C</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">RF Jamming State</div>
                  <div className="text-xs font-bold text-amber-300">{selectedHotspot.telemetry.rfActivity}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Satellite Pass</div>
                  <div className="text-xs font-bold text-emerald-300">{selectedHotspot.telemetry.satellitePass}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Hotspots & Breaking News Feed (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['ALL', 'DEFENSE', 'MARKETS', 'GEOPOLITICAL', 'TECH'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  playTacticalBeep(600);
                  setSelectedCategory(cat);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Hotspots Feed List */}
          <div className="space-y-2 overflow-y-auto max-h-[560px] pr-1">
            {filteredHotspots.map((hs) => {
              const isSelected = selectedHotspot?.id === hs.id;
              return (
                <div
                  key={hs.id}
                  onClick={() => focusOnHotspot(hs)}
                  className={`p-3 rounded-xl border transition cursor-pointer group ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        hs.threatLevel === 'CRITICAL' ? 'bg-rose-500 animate-ping' : hs.threatLevel === 'HIGH' ? 'bg-amber-400' : 'bg-cyan-400'
                      }`} />
                      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition">
                        {hs.city}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {hs.country}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      {hs.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 font-sans">
                    {hs.newsSummary}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-900 text-[10px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-cyan-400" />
                      {hs.source}
                    </span>
                    <span className="text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Inspect Telemetry <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
