import React, { useState } from 'react';
import { SatFeed, ThreatMarker, NewsHeadline } from '../types';
import { GokuInfinity4D } from './GokuInfinity4D';
import { SatLinkStreamMonitor } from './SatLinkStreamMonitor';
import { Radio, Eye, Sparkles, ShieldAlert, Satellite, Zap } from 'lucide-react';

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
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-wider">
                  SPY SATELLITE RECON &amp; 4D GOKU INFINITY
                </h2>
                <span className="badge-4d-hyper">
                  <Sparkles className="w-3 h-3" />
                  <span>D₄ KI MATRIX</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Galactic Espionage &bull; 4D AI Character Goku Ultra Instinct &bull; Multi-SAR Orbital Feeds &bull; Real-Time Threat Interception
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 text-xs font-bold">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>ORBITAL RECON ACTIVE</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4D AI Character Goku Infinity Hero Section */}
      <GokuInfinity4D
        activeFeed={activeFeed}
        threatMarkers={threatMarkers}
        onDispatchCommand={onDispatchCommand}
        onSelectMarker={(marker) => setSelectedThreat(marker)}
      />

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
