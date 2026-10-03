import React, { useState, useEffect, useRef } from 'react';
import { SatFeed, ThreatMarker, NewsHeadline } from '../types';
import { 
  Radio, 
  Globe2, 
  ShieldAlert, 
  Newspaper, 
  Satellite, 
  Crosshair, 
  Eye, 
  Signal, 
  Activity, 
  Maximize2,
  AlertTriangle,
  Flame,
  CheckCircle
} from 'lucide-react';
import { playTacticalBeep } from '../utils/audio';

interface SatLinkStreamMonitorProps {
  satFeeds: SatFeed[];
  activeFeedId: string;
  onSelectFeed: (feedId: string) => void;
  threatMarkers: ThreatMarker[];
  headlines: NewsHeadline[];
  streamStatus: 'ONLINE' | 'OFFLINE';
  onToggleStream: () => void;
}

export const SatLinkStreamMonitor: React.FC<SatLinkStreamMonitorProps> = ({
  satFeeds,
  activeFeedId,
  onSelectFeed,
  threatMarkers,
  headlines,
  streamStatus,
  onToggleStream,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<ThreatMarker | null>(threatMarkers[0] || null);
  const [scanAngle, setScanAngle] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeFeed = satFeeds.find(f => f.id === activeFeedId) || satFeeds[0];

  // Radar sweep animation on canvas
  useEffect(() => {
    let animationFrameId: number;
    let angle = 0;

    const renderRadar = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(cx, cy) - 10;

      ctx.clearRect(0, 0, width, height);

      // Background circles
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;

      for (let r = radius / 4; r <= radius; r += radius / 4) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.stroke();

      if (streamStatus === 'ONLINE') {
        // Rotating radar beam
        angle = (angle + 0.03) % (Math.PI * 2);
        setScanAngle(Math.round((angle * 180) / Math.PI));

        const gradient = ctx.createConicGradient(angle, cx, cy);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
        gradient.addColorStop(0.15, 'rgba(6, 182, 212, 0.05)');
        gradient.addColorStop(0.25, 'rgba(6, 182, 212, 0)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw threat markers on radar
        threatMarkers.forEach((marker, index) => {
          // Project lat/lng to radar coordinates
          const offsetAngle = (marker.lng * Math.PI) / 180 + 0.5;
          const dist = (Math.abs(marker.lat) / 90) * (radius * 0.75) + 20;
          const mx = cx + Math.cos(offsetAngle) * dist;
          const my = cy + Math.sin(offsetAngle) * dist;

          const isSelected = selectedMarker?.id === marker.id;

          ctx.fillStyle = marker.threatLevel === 'HIGH' || marker.threatLevel === 'CRITICAL'
            ? 'rgba(239, 68, 68, 0.9)'
            : 'rgba(245, 158, 11, 0.9)';

          ctx.beginPath();
          ctx.arc(mx, my, isSelected ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fill();

          if (isSelected) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(renderRadar);
    };

    renderRadar();
    return () => cancelAnimationFrame(animationFrameId);
  }, [streamStatus, threatMarkers, selectedMarker]);

  return (
    <div id="satlink-stream-panel" className="tactical-card corner-bracket p-4 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-cyan-950/90 border border-cyan-700/50 text-cyan-400">
            <Satellite className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              SAT-LINK &amp; GEOSPATIAL FEED
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                SUB-AGENT 3 (Sarah)
              </span>
            </h3>
            <p className="text-[11px] font-mono-code text-slate-400">
              Orbital Stream Feeds &bull; Threat Map &bull; News Ingestion
            </p>
          </div>
        </div>

        {/* Stream status control */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-mono-code text-slate-300">
            <span className={`w-2 h-2 rounded-full ${streamStatus === 'ONLINE' ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
            {streamStatus}
          </span>
          <button
            onClick={() => {
              playTacticalBeep(720);
              onToggleStream();
            }}
            className={`px-2.5 py-1 text-xs font-mono-code rounded border transition ${
              streamStatus === 'ONLINE'
                ? 'bg-cyan-950 border-cyan-700 text-cyan-300 hover:bg-cyan-900'
                : 'bg-rose-950 border-rose-700 text-rose-300 hover:bg-rose-900'
            }`}
          >
            {streamStatus === 'ONLINE' ? 'DISCONNECT' : 'RECONNECT'}
          </button>
        </div>
      </div>

      {/* Satellite Feeds Switcher Pills */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
        {satFeeds.map((feed) => (
          <button
            key={feed.id}
            id={`btn-sat-feed-${feed.id}`}
            onClick={() => {
              playTacticalBeep(680);
              onSelectFeed(feed.id);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono-code whitespace-nowrap transition ${
              activeFeedId === feed.id
                ? 'bg-cyan-950/90 border border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>{feed.name}</span>
            <span className="text-[10px] text-slate-500">({feed.mode})</span>
          </button>
        ))}
      </div>

      {/* Radar Map & Telemetry Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        
        {/* Radar Viewport with Live Sweep */}
        <div className="relative bg-[#060910] border border-cyan-900/50 rounded-lg p-2 flex flex-col items-center justify-center overflow-hidden shadow-inner h-52">
          <canvas
            ref={canvasRef}
            width={240}
            height={200}
            className="w-full h-full object-contain"
          />

          {/* HUD Overlay Text */}
          <div className="absolute top-2 left-2 text-[10px] font-mono-code text-cyan-400/80 bg-[#060910]/80 px-1.5 py-0.5 rounded border border-cyan-950">
            LOCK: {activeFeed.name} | AZ: {scanAngle}&deg;
          </div>

          <div className="absolute bottom-2 right-2 text-[10px] font-mono-code text-emerald-400 bg-[#060910]/80 px-1.5 py-0.5 rounded border border-cyan-950 flex items-center gap-1">
            <Signal className="w-3 h-3" />
            <span>SIG: {activeFeed.signalStrength}%</span>
          </div>
        </div>

        {/* Threat Markers & Active Zones */}
        <div className="bg-[#070b13] border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between h-52 overflow-hidden">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800">
            <span className="text-xs font-mono-code font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              ACTIVE THREAT MARKERS ({threatMarkers.length})
            </span>
            <span className="text-[10px] font-mono-code text-slate-500">
              Orbital Sync
            </span>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-32 pr-1">
            {threatMarkers.map((marker) => (
              <div
                key={marker.id}
                onClick={() => {
                  playTacticalBeep(820);
                  setSelectedMarker(marker);
                }}
                className={`p-1.5 rounded text-xs font-mono-code border cursor-pointer transition ${
                  selectedMarker?.id === marker.id
                    ? 'bg-cyan-950/60 border-cyan-500/80 text-slate-100'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{marker.title}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                    marker.threatLevel === 'CRITICAL' || marker.threatLevel === 'HIGH'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {marker.threatLevel}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {marker.region} &bull; Lat: {marker.lat.toFixed(2)}, Lng: {marker.lng.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {selectedMarker && (
            <div className="text-[10px] font-mono-code bg-[#05080e] p-1.5 rounded border border-slate-800 text-cyan-300 truncate">
              <strong>INTEL:</strong> {selectedMarker.details}
            </div>
          )}
        </div>

      </div>

      {/* Today Headlines Aggregator Feed */}
      <div className="bg-[#070b13] border border-slate-800/80 rounded-lg p-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono-code font-semibold text-slate-300 flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
            TODAY HEADLINES (TECH &bull; FINANCIAL &bull; COMMODITIES)
          </span>
          <span className="text-[10px] font-mono-code text-cyan-400 animate-pulse">
            LIVE STREAM
          </span>
        </div>

        <div className="space-y-1 text-xs font-mono-code max-h-24 overflow-y-auto">
          {headlines.map((item) => (
            <div key={item.id} className="flex items-start gap-2 py-1 px-2 rounded bg-slate-900/40 hover:bg-slate-900 border border-slate-800/40">
              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-cyan-300 font-bold uppercase mt-0.5">
                {item.category}
              </span>
              <span className="text-slate-200 flex-1">{item.headline}</span>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
