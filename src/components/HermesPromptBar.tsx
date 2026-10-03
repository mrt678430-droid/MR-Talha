import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Bot, 
  CornerDownLeft, 
  Loader2, 
  Compass, 
  TrendingUp, 
  Radio, 
  FileText, 
  Zap,
  Terminal,
  Mic,
  Shield,
  Server,
  Layers,
  ChevronDown
} from 'lucide-react';
import { playDispatchChirp, playTacticalBeep } from '../utils/audio';
import { HermesVoiceOrb } from './HermesVoiceOrb';
import { COMMAND_PRESETS } from '../data/agentRoster';

interface HermesPromptBarProps {
  onDispatchCommand: (command: string) => Promise<void>;
  isProcessing: boolean;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  lastParsedIntent?: string;
  executionTime?: number;
  activeAgentResponse?: string;
}

export const HermesPromptBar: React.FC<HermesPromptBarProps> = ({
  onDispatchCommand,
  isProcessing,
  ttsEnabled,
  onToggleTts,
  lastParsedIntent,
  executionTime,
  activeAgentResponse,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAllPresets, setShowAllPresets] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isProcessing) return;
    playDispatchChirp();
    onDispatchCommand(inputVal.trim());
    setInputVal('');
  };

  const handleSelectPreset = (presetPrompt: string) => {
    if (isProcessing) return;
    setInputVal(presetPrompt);
    playDispatchChirp();
    onDispatchCommand(presetPrompt);
  };

  const categories = ['ALL', 'FINANCE', 'SECURITY', 'INFRASTRUCTURE', 'RESEARCH', 'SURVEILLANCE'];

  const filteredPresets = selectedCategory === 'ALL'
    ? COMMAND_PRESETS
    : COMMAND_PRESETS.filter(p => p.category === selectedCategory);

  const displayedPresets = showAllPresets ? filteredPresets : filteredPresets.slice(0, 5);

  return (
    <div id="hermes-command-bar" className="w-full tactical-card corner-bracket p-3 md:p-4 mb-4 relative overflow-hidden">
      {/* Background ambient grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#164e63_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Top row: Master Router Label + Voice Orb + Quick Stats */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-mono-code font-bold tracking-wider text-cyan-300 uppercase">
              Hermes Master Router &bull; Neural Intelligence Terminal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Integrated Glowing Voice Core Orb */}
          <HermesVoiceOrb
            onDispatchVoiceCommand={onDispatchCommand}
            isProcessing={isProcessing}
            ttsEnabled={ttsEnabled}
            onToggleTts={onToggleTts}
            lastIntent={lastParsedIntent}
            activeAgentResponse={activeAgentResponse}
          />

          <button
            onClick={() => {
              playTacticalBeep(600);
              onToggleTts();
            }}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono-code border transition ${
              ttsEnabled
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                : 'bg-slate-900 border-slate-700/60 text-slate-400'
            }`}
            title="Toggle Agent TTS Voice Responses"
          >
            {ttsEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span>TTS {ttsEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {executionTime !== undefined && (
            <span className="text-[11px] font-mono-code text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 hidden sm:inline-block">
              Latency: <span className="text-cyan-400">{executionTime.toFixed(2)}s</span>
            </span>
          )}
        </div>
      </div>


      {/* Main Command Input Box */}
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="relative flex items-center bg-[#070b12] border border-cyan-900/60 rounded-lg focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-500/40 transition-all shadow-inner">
          <div className="pl-3 pr-2 text-cyan-500 font-mono-code text-xs select-none">
            HERMES&gt;
          </div>

          <input
            id="hermes-command-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isProcessing}
            placeholder="Instruct Hermes (e.g., 'Scrape PKR gold rates and send brief to Oliver at Desk 2')..."
            className="w-full bg-transparent py-2.5 px-1 text-sm font-mono-code text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
          />

          <div className="pr-2 flex items-center gap-1.5">
            <button
              id="btn-hermes-submit"
              type="submit"
              disabled={!inputVal.trim() || isProcessing}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-mono-code font-bold uppercase transition ${
                inputVal.trim() && !isProcessing
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                  <span>ROUTING...</span>
                </>
              ) : (
                <>
                  <span>DISPATCH</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Preset Mission Quick Actions & Category Filter */}
      <div className="relative z-10 mt-3 pt-2.5 border-t border-slate-800/80">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[11px] font-mono-code text-slate-400 flex items-center gap-1 mr-1 shrink-0">
              <Zap className="w-3 h-3 text-amber-400" /> Command Matrix:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  playTacticalBeep(550);
                  setSelectedCategory(cat);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-code transition shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAllPresets(!showAllPresets)}
            className="text-[10px] font-mono-code text-cyan-400 hover:text-cyan-300 underline shrink-0 whitespace-nowrap"
          >
            {showAllPresets ? `Show Less` : `View All (${filteredPresets.length})`}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {displayedPresets.map((m) => (
            <button
              key={m.id}
              id={`btn-preset-mission-${m.id}`}
              onClick={() => handleSelectPreset(m.command)}
              disabled={isProcessing}
              title={`${m.command} (Target: ${m.agent})`}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono-code bg-[#080d17] border border-cyan-900/60 hover:border-cyan-500/80 hover:bg-cyan-950/40 text-slate-200 rounded-md transition disabled:opacity-50 group"
            >
              <span className="text-xs group-hover:scale-110 transition-transform">{m.icon}</span>
              <span className="font-semibold text-cyan-300">{m.title}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                @{m.agent}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Last parsed intent indicator banner */}
      {lastParsedIntent && (
        <div className="relative z-10 mt-2.5 px-3 py-1.5 bg-cyan-950/30 border border-cyan-800/40 rounded-lg flex items-center justify-between text-xs font-mono-code text-cyan-200">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <strong className="text-cyan-400">ROUTED INTENT:</strong>
            <span className="truncate text-slate-300">{lastParsedIntent}</span>
          </div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold whitespace-nowrap pl-2">
            SYNCHRONIZED
          </span>
        </div>
      )}
    </div>
  );
};
