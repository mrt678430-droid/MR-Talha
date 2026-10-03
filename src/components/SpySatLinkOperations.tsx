import React, { useState } from 'react';
import { SatFeed, ThreatMarker, NewsHeadline } from '../types';
import { GokuInfinity4D } from './GokuInfinity4D';
import { CelestialDragon3D } from './CelestialDragon3D';
import { SatLinkStreamMonitor } from './SatLinkStreamMonitor';
import { Radio, Eye, Sparkles, ShieldAlert, Satellite, Zap, Flame } from 'lucide-react';
import { playTacticalBeep } from '../utils/audio';

interface SpySatLinkOperationsProps {
  satFeeds: SatFeed[];
  activeFeedId: string;
  onSelectFeed: (feedId: string) => void;
  threatMarkers: ThreatMarker[];
  headlines: NewsHeadline[];
  streamStatus: 'ONLINE' | 'OFFLINE';
  onToggleStream: () => void;
  onDispatchCommand?: (cmd: string) => void;
}

export const SpySatLinkOperations: React.FC<SpySatLinkOperationsProps> = ({
  satFeeds,
  activeFeedId,
  onSelectFeed,
  threatMarkers,
  headlines,
  streamStatus,
  onToggleStream,
  onDispatchCommand,
}) => {
  const activeFeed = satFeeds.find(f => f.id === activeFeedId) || satFeeds[0];
  const [selectedThreat, setSelectedThreat] = useState<ThreatMarker | null>(threatMarkers[0] || null);
  const [activeGuardianView, setActiveGuardianView] = useState<'dragon' | 'goku' | 'both'>('dragon');

  return (
    <div id="spy-operations-page" className="space-y-4 font-mono-code">
      
      {/* Spy Mission Control Banner */}
      <div className="tactical-card p-4 relative overflow-hidden border-cyan-500/50 bg-gradient-to-r from-[#060c1d]/95 via-[#0b152e]/90 to-[#060c1d]/95">
        <div className="absolute inset-0 warp-grid-4d opacity-25 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <Eye className="w-6 h-6 text-cyan-300 animate-pulse" />
              <div className="absolute inset-0 rounded-xl border border-cyan-300/30 animate-ping opacity-30" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-wider">
                  SPY SATELLITE RECON &amp; 3D HOLOGRAPHIC DRAGON
                </h2>
                <span className="badge-4d-hyper">
                  <Sparkles className="w-3 h-3" />
                  <span>3D HOLO KI MATRIX</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Galactic Espionage &bull; 3D Holographic Dragon (Blue, Golden, Purple &bull; 3 Modes) &bull; Goku Infinity 4D &bull; SAR Orbital Radar
              </p>
            </div>
          </div>

          {/* Guardian Switcher Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-cyan-900/60 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(850);
                  setActiveGuardianView('dragon');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeGuardianView === 'dragon'
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-extrabold shadow-[0_0_20px_rgba(234,179,8,0.6)] ring-1 ring-white/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🐉 3D Holographic Dragon</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 text-amber-300 font-mono font-bold">3 Colors &bull; 3 Modes</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(800);
                  setActiveGuardianView('goku');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeGuardianView === 'goku'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>⚡ 4D Goku</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/50 text-white font-mono">4 Modes</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playTacticalBeep(900);
                  setActiveGuardianView('both');
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer hidden sm:flex items-center gap-1 ${
                  activeGuardianView === 'both'
                    ? 'bg-purple-600 text-white font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>⚔ Dual View</span>
              </button>
            </div>

            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 text-xs font-bold shrink-0">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>ORBITAL RECON ACTIVE</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3D Celestial Dragon & Goku Infinity Hero Presentation */}
      {activeGuardianView === 'dragon' && (
        <CelestialDragon3D
          activeFeed={activeFeed}
          threatMarkers={threatMarkers}
          onDispatchCommand={onDispatchCommand}
          onSelectMarker={(marker) => setSelectedThreat(marker)}
        />
      )}

      {activeGuardianView === 'goku' && (
        <GokuInfinity4D
          activeFeed={activeFeed}
          threatMarkers={threatMarkers}
          onDispatchCommand={onDispatchCommand}
          onSelectMarker={(marker) => setSelectedThreat(marker)}
        />
      )}

      {activeGuardianView === 'both' && (
        <div className="space-y-4">
          <CelestialDragon3D
            activeFeed={activeFeed}
            threatMarkers={threatMarkers}
            onDispatchCommand={onDispatchCommand}
            onSelectMarker={(marker) => setSelectedThreat(marker)}
          />
          <GokuInfinity4D
            activeFeed={activeFeed}
            threatMarkers={threatMarkers}
            onDispatchCommand={onDispatchCommand}
            onSelectMarker={(marker) => setSelectedThreat(marker)}
          />
        </div>
      )}

      {/* Satellite Feeds & Live Radar Spy Intelligence Section */}
      <SatLinkStreamMonitor
        satFeeds={satFeeds}
        activeFeedId={activeFeedId}
        onSelectFeed={onSelectFeed}
        threatMarkers={threatMarkers}
        headlines={headlines}
        streamStatus={streamStatus}
        onToggleStream={onToggleStream}
      />

    </div>
  );
};
