import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Cpu, 
  Database, 
  Zap, 
  Sparkles, 
  Settings as SettingsIcon, 
  Activity, 
  Layers, 
  Radio, 
  FolderGit2, 
  Terminal,
  RefreshCw,
  BellRing,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Globe,
  Mic,
  Palette,
  Key,
  ShieldCheck,
  TrendingUp,
  Monitor,
  Move3d,
  Box,
  LayoutGrid
} from 'lucide-react';
import { ThemeType, AIConnectionConfig, VirtualFile } from '../types';
import { playTacticalBeep } from '../utils/audio';
import { AllPagesMenu } from './AllPagesMenu';
import { GlobalSearchBar } from './GlobalSearchBar';

interface HeaderProps {
  isAiActive: boolean;
  onToggleAi: () => void;
  onOpenNode: (node: 'memory' | 'skills' | 'soul' | 'settings') => void;
  cycleCount: number;
  activeAgentsCount: number;
  onManualRefresh: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  activeToastCount?: number;
  onTriggerTestToast?: (type: 'high_priority' | 'runtime_error') => void;
  theme: ThemeType;
  onSetTheme: (t: ThemeType) => void;
  aiConfig: AIConnectionConfig;
  onOpenAiModal: () => void;
  virtualFiles?: VirtualFile[];
  onSelectFile?: (fileId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAiActive,
  onToggleAi,
  onOpenNode,
  cycleCount,
  activeAgentsCount,
  onManualRefresh,
  activeView,
  setActiveView,
  activeToastCount = 0,
  onTriggerTestToast,
  theme,
  onSetTheme,
  aiConfig,
  onOpenAiModal,
  virtualFiles = [],
  onSelectFile,
}) => {
  const [showToastMenu, setShowToastMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isAllPagesMenuOpen, setIsAllPagesMenuOpen] = useState(false);

  // Global keyboard shortcut to open All Pages Menu: Cmd+K / Ctrl+K or Alt+M
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAllPagesMenuOpen(prev => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsAllPagesMenuOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const themeColors: Record<ThemeType, { name: string; icon: string; border: string; text: string }> = {
    cyan: { name: 'Cyan Neon', icon: '💎', border: 'border-cyan-500', text: 'text-cyan-300' },
    crimson: { name: 'Crimson Matrix', icon: '🔴', border: 'border-rose-500', text: 'text-rose-300' },
    emerald: { name: 'Emerald Bio', icon: '🟢', border: 'border-emerald-500', text: 'text-emerald-300' },
  };

  return (
    <header id="stonic-header" className="w-full bg-[#080d1a]/95 backdrop-blur-xl border-b border-cyan-950/90 shadow-[0_4px_25px_rgba(0,0,0,0.6)] px-4 py-2.5 sticky top-0 z-40 transition-colors font-mono-code">
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Left: Brand & Hermes Core Status */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-950/90 to-blue-950/70 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Cpu className="w-4 h-4 text-cyan-300 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#080d1a] animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-base tracking-wider text-white">STONIC AI</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-600/50 rounded shadow-sm">
                    HERMES
                  </span>
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-[#050811] border border-slate-800">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAiActive ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]' : 'bg-amber-400'}`} />
                    <span className={isAiActive ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                      {isAiActive ? 'RUNNING' : 'STANDBY'}
                    </span>
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-sans">
                  <span>Voice Core • Agent Town • World Monitor • Copilot</span>
                </div>
              </div>
            </div>

            {/* Quick Mobile Loop Controls */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                type="button"
                onClick={onOpenAiModal}
                className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/50 text-[10px] text-cyan-300 font-bold"
              >
                {aiConfig.provider.toUpperCase()}
              </button>
            </div>
          </div>

          {/* Center: Global Search Bar (Big Prominent Command Search across all site) */}
          <div className="w-full lg:max-w-xl xl:max-w-2xl mx-auto flex-1 px-1">
            <GlobalSearchBar
              activeView={activeView}
              onSelectView={setActiveView}
              virtualFiles={virtualFiles}
              onSelectFile={onSelectFile}
              isAiActive={isAiActive}
              onToggleAi={onToggleAi}
              onOpenNode={onOpenNode}
              onOpenAiModal={onOpenAiModal}
              onOpenAllPagesMenu={() => setIsAllPagesMenuOpen(true)}
            />
          </div>

          {/* Right Header Action Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end shrink-0">
            {/* All Pages Directory Launcher Button */}
            <button
              id="btn-all-pages-menu"
              type="button"
              onClick={() => {
                playTacticalBeep(850);
                setIsAllPagesMenuOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 hover:from-cyan-900 hover:to-slate-800 border border-cyan-500/70 text-cyan-300 text-xs font-bold transition shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer group"
              title="Open All Pages Directory & Search Menu (Ctrl+K or Alt+M)"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
              <span>All Pages</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-900/80 text-cyan-200 border border-cyan-600/60 font-mono">
                10
              </span>
            </button>

            {/* AI Connection Provider Pill */}
            <button
              id="btn-ai-connection-pill"
              type="button"
              onClick={() => {
                playTacticalBeep(700);
                onOpenAiModal();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-cyan-800/60 hover:border-cyan-500 text-xs text-slate-200 transition cursor-pointer shadow-sm group"
              title="Configure AI Connection (ChatGPT, Gemini, OpenAI, Claude)"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-cyan-300">
                {aiConfig.provider === 'gemini' ? 'Gemini 2.5' : aiConfig.provider === 'chatgpt' ? 'ChatGPT' : aiConfig.provider === 'openai' ? 'OpenAI' : 'Claude 3.7'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Theme Selector Dropdown */}
            <div className="relative">
              <button
                id="btn-theme-switcher"
                type="button"
                onClick={() => {
                  playTacticalBeep(650);
                  setShowThemeMenu(!showThemeMenu);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                title="Switch Theme (Cyan, Crimson, Emerald)"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold">{themeColors[theme].name}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showThemeMenu && (
                <div 
                  className="absolute right-0 mt-2 w-44 rounded-xl tactical-card p-1.5 z-50 shadow-2xl border border-cyan-900/80 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(['cyan', 'crimson', 'emerald'] as ThemeType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        playTacticalBeep(800);
                        onSetTheme(t);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition cursor-pointer ${
                        theme === t ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/50' : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{themeColors[t].icon}</span>
                        <span>{themeColors[t].name}</span>
                      </span>
                      {theme === t && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4 Circuits Quick Nodes Buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-[#080c14] p-0.5 rounded-lg border border-slate-800/80">
              <button
                onClick={() => {
                  playTacticalBeep(700);
                  onOpenNode('memory');
                }}
                className="px-2 py-1 text-[11px] text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 rounded transition"
                title="Circuit 1: Memory"
              >
                [Mem]
              </button>
              <button
                onClick={() => {
                  playTacticalBeep(780);
                  onOpenNode('skills');
                }}
                className="px-2 py-1 text-[11px] text-slate-300 hover:text-amber-300 hover:bg-amber-950/40 rounded transition"
                title="Circuit 2: Skills"
              >
                [Skills]
              </button>
              <button
                onClick={() => {
                  playTacticalBeep(860);
                  onOpenNode('soul');
                }}
                className="px-2 py-1 text-[11px] text-slate-300 hover:text-rose-300 hover:bg-rose-950/40 rounded transition"
                title="Circuit 3: Soul"
              >
                [Soul]
              </button>
              <button
                onClick={() => {
                  playTacticalBeep(640);
                  onOpenNode('settings');
                }}
                className="px-2 py-1 text-[11px] text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/40 rounded transition"
                title="Circuit 4: Settings"
              >
                [Config]
              </button>
            </div>

            {/* Toast Notifications Simulation & Trigger Menu */}
            {onTriggerTestToast && (
              <div className="relative">
                <button
                  id="btn-toast-alerts-menu"
                  type="button"
                  onClick={() => {
                    playTacticalBeep(650);
                    setShowToastMenu(!showToastMenu);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition cursor-pointer ${
                    activeToastCount > 0
                      ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-cyan-300'
                  }`}
                  title="Toast Notifications & Simulation Trigger"
                >
                  <BellRing className={`w-3.5 h-3.5 ${activeToastCount > 0 ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline text-[11px]">Alerts</span>
                  {activeToastCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500 text-black font-extrabold">
                      {activeToastCount}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showToastMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-64 rounded-xl tactical-card p-2.5 z-50 shadow-2xl border border-cyan-900/80 text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase">
                      <span>Simulate Toast Events</span>
                      <span className="text-cyan-400">Live Telemetry</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onTriggerTestToast('high_priority');
                        setShowToastMenu(false);
                      }}
                      className="w-full flex items-start gap-2 p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/50 text-left transition cursor-pointer group"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-emerald-300 font-bold text-[11px]">High-Priority Completed</div>
                        <div className="text-[10px] text-slate-400">Alert when an agent finishes critical tasks</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTriggerTestToast('runtime_error');
                        setShowToastMenu(false);
                      }}
                      className="w-full flex items-start gap-2 p-2 rounded-lg bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/50 text-left transition cursor-pointer group"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-rose-300 font-bold text-[11px]">Runtime Error Alert</div>
                        <div className="text-[10px] text-slate-400">Alert on buffer lock, scraper or AST fail</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              id="btn-manual-sync"
              onClick={() => {
                playTacticalBeep(920);
                onManualRefresh();
              }}
              className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-700 transition cursor-pointer"
              title="Pulse Sub-Agent Telemetry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-toggle-ai-loop"
              onClick={() => {
                playTacticalBeep(isAiActive ? 440 : 880);
                onToggleAi();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer ${
                isAiActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/40 border border-emerald-400/40'
                  : 'bg-gradient-to-r from-rose-600 to-amber-700 hover:from-rose-500 hover:to-amber-600 text-white shadow-rose-900/40 border border-rose-400/40'
              }`}
            >
              {isAiActive ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>RUNNING</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>START AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Primary View Navigation Tabs Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-900 pt-2">
          {/* All Pages Hub Button */}
          <button
            id="tab-open-all-pages"
            type="button"
            onClick={() => {
              playTacticalBeep(850);
              setIsAllPagesMenuOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition cursor-pointer bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300/40 shrink-0 group"
            title="Open All Pages Directory & Search Menu (Ctrl+K or Alt+M)"
          >
            <LayoutGrid className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>☰ All Pages (10)</span>
          </button>

          {[
            { id: 'dashboard', label: 'Hermes Command Hub', icon: <Terminal className="w-3.5 h-3.5" />, badge: 'Core' },
            { id: 'spy', label: 'Spy: 3D Dragon & 4D Goku', icon: <Radio className="w-3.5 h-3.5" />, badge: '3D Dragon' },
            { id: 'voice', label: 'Voice Assistant (4 Circuits)', icon: <Mic className="w-3.5 h-3.5" />, badge: 'New' },
            { id: 'town', label: 'Agent Town (Alice, Bob, Carol, Dave)', icon: <Layers className="w-3.5 h-3.5" />, badge: '4 Desks' },
            { id: 'world', label: 'World Monitor (3D Globe & Map)', icon: <Globe className="w-3.5 h-3.5" />, badge: 'Live 3D' },
            { id: 'hyper4d', label: '4D Quantum CSS Matrix', icon: <Move3d className="w-3.5 h-3.5" />, badge: '4D CSS' },
            { id: 'desktop', label: 'Desktop Automation & Copilot', icon: <Monitor className="w-3.5 h-3.5" />, badge: 'Copilot' },
            { id: 'bullion', label: 'Financial & Gold Terminal', icon: <TrendingUp className="w-3.5 h-3.5" />, badge: 'PKR Rates' },
            { id: 'files', label: 'Stonic Virtual Files', icon: <FolderGit2 className="w-3.5 h-3.5" />, badge: 'VFS' },
            { id: 'console', label: 'Console Logs', icon: <Activity className="w-3.5 h-3.5" />, badge: 'Logs' },
          ].map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playTacticalBeep(700);
                  setActiveView(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/90 border border-cyan-500/70 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* All Pages Directory & Full Navigator Menu */}
      <AllPagesMenu
        isOpen={isAllPagesMenuOpen}
        onClose={() => setIsAllPagesMenuOpen(false)}
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          setIsAllPagesMenuOpen(false);
        }}
      />
    </header>
  );
};

