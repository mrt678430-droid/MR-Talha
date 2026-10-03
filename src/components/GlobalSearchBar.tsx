import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Terminal, 
  Radio, 
  Mic, 
  Layers, 
  Globe, 
  Move3d, 
  Monitor, 
  TrendingUp, 
  FolderGit2, 
  Activity, 
  FileText, 
  FileCode, 
  File, 
  ArrowRight, 
  CornerDownLeft, 
  Sparkles, 
  ExternalLink,
  Command,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Zap,
  Flame,
  Shield,
  Crosshair,
  Sliders,
  Cpu,
  Play,
  Pause,
  Key,
  Database,
  LayoutGrid,
  Eye,
  Filter
} from 'lucide-react';
import { VirtualFile } from '../types';
import { ALL_PAGES, PageItem } from './AllPagesMenu';
import { playTacticalBeep, playSuccessChime } from '../utils/audio';

// Additional all-site quick actions
export interface SiteActionItem {
  id: string;
  name: string;
  category: 'Quick Action' | '4D Goku Mode' | 'Neural Circuit';
  description: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  action: () => void;
  tags: string[];
}

interface GlobalSearchBarProps {
  activeView: string;
  onSelectView: (viewId: string) => void;
  virtualFiles?: VirtualFile[];
  onSelectFile?: (fileId: string) => void;
  isAiActive?: boolean;
  onToggleAi?: () => void;
  onOpenNode?: (node: 'memory' | 'skills' | 'soul' | 'settings') => void;
  onOpenAiModal?: () => void;
  onOpenAllPagesMenu?: () => void;
}

interface MatchedFile {
  file: VirtualFile;
  matchSnippet?: string;
}

type UniversalItem = 
  | { type: 'view'; data: PageItem }
  | { type: 'file'; data: VirtualFile; matchSnippet?: string }
  | { type: 'action'; data: SiteActionItem };

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  activeView,
  onSelectView,
  virtualFiles = [],
  onSelectFile,
  isAiActive = false,
  onToggleAi,
  onOpenNode,
  onOpenAiModal,
  onOpenAllPagesMenu,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pages' | 'files' | 'actions' | 'goku' | 'circuits'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // All-Site Quick Actions & Features
  const siteActions: SiteActionItem[] = useMemo(() => [
    {
      id: 'action-toggle-ai',
      name: isAiActive ? 'Pause AI Orchestration Loop' : 'Start Autonomous AI Loop',
      category: 'Quick Action',
      description: isAiActive 
        ? 'Pause the Hermes 15-second autonomous multi-agent simulation loop.' 
        : 'Engage autonomous multi-agent processing, telemetry generation & scraping.',
      icon: isAiActive ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />,
      badge: isAiActive ? 'RUNNING' : 'STANDBY',
      badgeColor: isAiActive ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800',
      action: () => {
        if (onToggleAi) onToggleAi();
      },
      tags: ['start', 'stop', 'pause', 'ai', 'loop', 'hermes', 'agents', 'telemetry']
    },
    {
      id: 'action-ai-provider',
      name: 'Configure AI Connection Provider',
      category: 'Quick Action',
      description: 'Switch between Gemini 2.5, OpenAI GPT-4o, Claude 3.7 Sonnet, and ChatGPT Plus API proxies.',
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      badge: 'AI Config',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      action: () => {
        if (onOpenAiModal) onOpenAiModal();
      },
      tags: ['ai', 'gemini', 'openai', 'claude', 'chatgpt', 'model', 'api key', 'proxy']
    },
    {
      id: 'action-all-pages',
      name: 'Open All Pages Directory & Mega Menu',
      category: 'Quick Action',
      description: 'Launch full-screen directory displaying all 10 application views with direct shortcuts.',
      icon: <LayoutGrid className="w-4 h-4 text-purple-400" />,
      badge: '10 Modules',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
      action: () => {
        if (onOpenAllPagesMenu) onOpenAllPagesMenu();
      },
      tags: ['all', 'pages', 'menu', 'directory', 'navigation', 'modules']
    },
    {
      id: 'action-kamehameha',
      name: '4D Infinity Kamehameha Orbital Purge',
      category: '4D Goku Mode',
      description: 'Jump to Spy & Sat-Link center and trigger Goku 4D energy blast to clear orbital frequencies.',
      icon: <Zap className="w-4 h-4 text-cyan-300" />,
      badge: 'Spy Combat',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      action: () => {
        onSelectView('spy');
      },
      tags: ['kamehameha', 'goku', '4d', 'spy', 'blast', 'orbital', 'combat']
    },
    {
      id: 'goku-mode-1',
      name: 'Goku 4D Mode 1: Basic (Base / Super Saiyan)',
      category: '4D Goku Mode',
      description: 'Dark purple cosmic spiky hair, galaxy texture, purple energy swirl at feet. Power: 1.25B.',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      badge: 'Mode 1',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
      action: () => {
        onSelectView('spy');
      },
      tags: ['goku', 'basic', 'ssj', 'purple', 'mode 1', 'base']
    },
    {
      id: 'goku-mode-2',
      name: 'Goku 4D Mode 2: Pro (SSJ4 Primal Galaxy)',
      category: '4D Goku Mode',
      description: 'Long dark purple hair, furry cosmic tail, cyan/purple torso, cosmic galaxy vortex. Power: 550B.',
      icon: <Flame className="w-4 h-4 text-cyan-400" />,
      badge: 'Mode 2',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      action: () => {
        onSelectView('spy');
      },
      tags: ['goku', 'pro', 'ssj4', 'primal', 'tail', 'vortex', 'mode 2']
    },
    {
      id: 'goku-mode-3',
      name: 'Goku 4D Mode 3: Ultra / Pro Max (SSJ3 Long-Hair)',
      category: '4D Goku Mode',
      description: 'Massive silver-white long hair, star constellations across muscles, radiant white ring aura. Power: 8.8T.',
      icon: <Sparkles className="w-4 h-4 text-slate-200" />,
      badge: 'Mode 3',
      badgeColor: 'bg-slate-900 text-slate-200 border-slate-700',
      action: () => {
        onSelectView('spy');
      },
      tags: ['goku', 'ultra', 'ssj3', 'pro max', 'silver', 'hair', 'mode 3']
    },
    {
      id: 'goku-mode-4',
      name: 'Goku 4D Mode 4: Cosmic God (Red Shenron)',
      category: '4D Goku Mode',
      description: 'Galaxy skin texture, red cosmic dragon Shenron coiling in deep space, fiery eyes. Power: ∞ Infinity.',
      icon: <Flame className="w-4 h-4 text-red-500" />,
      badge: 'Mode 4',
      badgeColor: 'bg-red-950 text-red-300 border-red-800',
      action: () => {
        onSelectView('spy');
      },
      tags: ['goku', 'shenron', 'dragon', 'god', 'cosmic', 'red', 'infinity', 'mode 4']
    },
    {
      id: 'node-memory',
      name: 'Neural Circuit 1: Memory (Short & Long Term)',
      category: 'Neural Circuit',
      description: 'Inspect short-term context tokens and persistent key-value long-term knowledge graph.',
      icon: <Database className="w-4 h-4 text-cyan-400" />,
      badge: 'Circuit 1',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      action: () => {
        if (onOpenNode) onOpenNode('memory');
      },
      tags: ['memory', 'circuit', 'tokens', 'knowledge', 'short-term', 'long-term']
    },
    {
      id: 'node-skills',
      name: 'Neural Circuit 2: Skills Registry',
      category: 'Neural Circuit',
      description: 'Audit autonomous skill execution rules, tools, and assigned sub-agent capabilities.',
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      badge: 'Circuit 2',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
      action: () => {
        if (onOpenNode) onOpenNode('skills');
      },
      tags: ['skills', 'circuit', 'tools', 'capabilities', 'agent skills']
    },
    {
      id: 'node-soul',
      name: 'Neural Circuit 3: Soul (Directives & Temperament)',
      category: 'Neural Circuit',
      description: 'Configure core identity, safety alignment, creativity index, and operational philosophy.',
      icon: <Sparkles className="w-4 h-4 text-rose-400" />,
      badge: 'Circuit 3',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
      action: () => {
        if (onOpenNode) onOpenNode('soul');
      },
      tags: ['soul', 'circuit', 'identity', 'directive', 'temperament', 'safety']
    },
    {
      id: 'node-settings',
      name: 'Neural Circuit 4: Settings & Hyper-Parameters',
      category: 'Neural Circuit',
      description: 'Tune temperature, reasoning effort, latency profile, sound pack, and auto-healing.',
      icon: <Sliders className="w-4 h-4 text-emerald-400" />,
      badge: 'Circuit 4',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      action: () => {
        if (onOpenNode) onOpenNode('settings');
      },
      tags: ['settings', 'circuit', 'temperature', 'latency', 'sound', 'hyper-parameters']
    }
  ], [isAiActive, onToggleAi, onOpenAiModal, onOpenAllPagesMenu, onSelectView, onOpenNode]);

  // Global shortcut to focus search input: '/' or 'Ctrl+/' or 'Cmd+/' or 'Cmd+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      
      if (!isInput && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '/' || e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items across Views, Files, and Site Actions
  const { filteredViews, filteredFiles, filteredActions, allVisibleItems } = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Views
    const views = ALL_PAGES.filter(p => {
      if (activeTab === 'files' || activeTab === 'actions' || activeTab === 'goku' || activeTab === 'circuits') return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.badge.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });

    // 2. Files
    const files: MatchedFile[] = [];
    if (activeTab === 'all' || activeTab === 'files') {
      virtualFiles.forEach(f => {
        if (!q) {
          files.push({ file: f, matchSnippet: undefined });
          return;
        }

        const nameMatch = f.name.toLowerCase().includes(q);
        const pathMatch = f.path.toLowerCase().includes(q);
        const authorMatch = f.authorAgent.toLowerCase().includes(q);
        const extMatch = f.extension.toLowerCase().includes(q);

        let snippet: string | undefined;
        const contentLower = f.content.toLowerCase();
        const contentIdx = contentLower.indexOf(q);
        if (contentIdx !== -1) {
          const start = Math.max(0, contentIdx - 30);
          const end = Math.min(f.content.length, contentIdx + q.length + 50);
          snippet = (start > 0 ? '...' : '') + f.content.slice(start, end).replace(/\n/g, ' ') + (end < f.content.length ? '...' : '');
        }

        if (nameMatch || pathMatch || authorMatch || extMatch || snippet) {
          files.push({ file: f, matchSnippet: snippet });
        }
      });
    }

    // 3. Actions
    const actions = siteActions.filter(act => {
      if (activeTab === 'pages' || activeTab === 'files') return false;
      if (activeTab === 'goku' && act.category !== '4D Goku Mode') return false;
      if (activeTab === 'circuits' && act.category !== 'Neural Circuit') return false;
      if (activeTab === 'actions' && act.category !== 'Quick Action') return false;

      if (!q) return true;
      return (
        act.name.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        act.category.toLowerCase().includes(q) ||
        act.tags.some(t => t.toLowerCase().includes(q))
      );
    });

    const unifiedList: UniversalItem[] = [
      ...views.map(v => ({ type: 'view' as const, data: v })),
      ...files.map(f => ({ type: 'file' as const, data: f.file, matchSnippet: f.matchSnippet })),
      ...actions.map(a => ({ type: 'action' as const, data: a })),
    ];

    return {
      filteredViews: views,
      filteredFiles: files,
      filteredActions: actions,
      allVisibleItems: unifiedList,
    };
  }, [query, activeTab, virtualFiles, siteActions]);

  // Keep selected index in bound
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  const handleSelectItem = (item: UniversalItem) => {
    if (item.type === 'view') {
      playSuccessChime();
      onSelectView(item.data.id);
    } else if (item.type === 'file') {
      playTacticalBeep(920);
      onSelectView('files');
      if (onSelectFile) onSelectFile(item.data.id);
    } else if (item.type === 'action') {
      playSuccessChime();
      item.data.action();
    }
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, allVisibleItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allVisibleItems.length) % Math.max(1, allVisibleItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allVisibleItems[selectedIndex]) {
        handleSelectItem(allVisibleItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const selectedItem = allVisibleItems[selectedIndex];

  return (
    <div ref={containerRef} className="relative w-full font-mono-code z-40">
      
      {/* BIG TOP HEADER COMMAND SEARCH BAR */}
      <div 
        className={`relative flex items-center h-11 sm:h-12 w-full rounded-2xl border transition-all duration-200 select-none ${
          isOpen
            ? 'border-cyan-400 bg-[#060c1d] shadow-[0_0_30px_rgba(6,182,212,0.45)] ring-2 ring-cyan-500/40'
            : 'border-cyan-900/80 hover:border-cyan-500/80 bg-gradient-to-r from-[#060a16] via-[#091126] to-[#060a16] shadow-[0_2px_15px_rgba(0,0,0,0.6)]'
        }`}
      >
        {/* Glowing Search Status Icon */}
        <div className="flex items-center pl-3.5 pr-2 shrink-0">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Search className={`w-3.5 h-3.5 ${isOpen ? 'text-cyan-300 animate-pulse' : 'text-cyan-400'}`} />
            <div className={`absolute inset-0 rounded-lg border border-cyan-400/40 ${isOpen ? 'animate-ping opacity-30' : 'opacity-0'}`} />
          </div>
        </div>
        
        {/* Main Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            playTacticalBeep(650);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Global Command Search: all 10 pages, virtual files, 4D Goku, quick actions (/ to focus)..."
          className="w-full bg-transparent px-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-sans font-medium"
        />

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-1.5 pr-2.5 shrink-0">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}

          {/* Quick "All Site Options" Expand Button */}
          <button
            type="button"
            onClick={() => {
              playTacticalBeep(750);
              setIsOpen(!isOpen);
              if (!isOpen) inputRef.current?.focus();
            }}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
              isOpen
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm font-extrabold'
                : 'bg-slate-900/90 text-cyan-300 border-cyan-800/80 hover:border-cyan-500 hover:bg-slate-800'
            }`}
            title="Toggle All Site Options & Command Palette"
          >
            <Filter className="w-3 h-3" />
            <span>Options</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Hotkey Badge */}
          <div className="hidden md:flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono shadow-sm">
              /
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono shadow-sm">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* ADVANCED ALL-SITE COMMAND PALETTE & OPTIONS POPUP */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#060c1d]/98 border-2 border-cyan-500/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col z-50">
          
          {/* Subtle Background Warping Grid */}
          <div className="absolute inset-0 warp-grid-4d opacity-15 pointer-events-none" />

          {/* Top Options Bar: Filter Tabs & Stats */}
          <div className="relative z-10 px-3 sm:px-4 py-2.5 border-b border-cyan-900/70 bg-[#081226]/95 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Site Options', count: allVisibleItems.length },
                { id: 'pages', label: '🏢 Pages (10)', count: filteredViews.length },
                { id: 'files', label: '📂 Virtual Files', count: filteredFiles.length },
                { id: 'actions', label: '⚡ Actions', count: filteredActions.length },
                { id: 'goku', label: '🐉 4D Goku', count: siteActions.filter(a => a.category === '4D Goku Mode').length },
                { id: 'circuits', label: '🧠 Circuits', count: siteActions.filter(a => a.category === 'Neural Circuit').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playTacticalBeep(800);
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 shrink-0">
              <span className="text-cyan-300 font-bold">{allVisibleItems.length} matches</span>
              <span>•</span>
              <span>Use ↑↓ to browse, ↵ to jump</span>
            </div>
          </div>

          {/* Main Body: 2-Column Split (List on Left, Live Preview on Right on Desktop) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 max-h-[62vh] min-h-[320px] overflow-hidden">
            
            {/* Left Column: Filtered Items List (7 cols) */}
            <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-slate-800/80 overflow-y-auto p-2 sm:p-3 space-y-3 max-h-[62vh]">
              
              {/* Empty state */}
              {allVisibleItems.length === 0 && (
                <div className="text-center py-12 space-y-2">
                  <Search className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">No results found for "{query}"</p>
                  <p className="text-[11px] text-slate-500">
                    Try searching for "goku", "gold", "town", "radar", "files", or click another tab.
                  </p>
                </div>
              )}

              {/* 1. Pages Section */}
              {filteredViews.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    <span>Application Views ({filteredViews.length})</span>
                  </div>

                  {filteredViews.map((view, idx) => {
                    const itemIndex = idx;
                    const isSelected = selectedIndex === itemIndex;
                    const isCurrentView = activeView === view.id;

                    return (
                      <div
                        key={view.id}
                        onClick={() => handleSelectItem({ type: 'view', data: view })}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-950 via-[#0a1f3d] to-[#061426] border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/40'
                            : 'bg-black/30 border-transparent hover:border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-1.5 rounded-lg border shrink-0 ${isSelected ? 'bg-cyan-900 border-cyan-400' : 'bg-slate-900 border-slate-800'}`}>
                            {view.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-cyan-400 font-bold">#{view.number}</span>
                              <span className="text-xs font-bold truncate text-slate-100">{view.name}</span>
                              {isCurrentView && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shrink-0">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate font-sans">{view.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${view.badgeColor}`}>
                            {view.badge}
                          </span>
                          {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. Virtual Files Section */}
              {filteredFiles.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    <span>Virtual File System ({filteredFiles.length})</span>
                  </div>

                  {filteredFiles.map((item, idx) => {
                    const itemIndex = filteredViews.length + idx;
                    const isSelected = selectedIndex === itemIndex;
                    const file = item.file;

                    return (
                      <div
                        key={file.id}
                        onClick={() => handleSelectItem({ type: 'file', data: file, matchSnippet: item.matchSnippet })}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                        className={`p-2.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition select-none ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-950 via-[#1f1606] to-[#120d04] border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                            : 'bg-black/30 border-transparent hover:border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`p-1.5 rounded-lg border shrink-0 ${isSelected ? 'bg-amber-900 border-amber-400' : 'bg-slate-900 border-slate-800'}`}>
                              <FileText className="w-4 h-4 text-amber-300" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold truncate text-slate-100 block">
                                {file.name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono truncate block">
                                {file.path}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-slate-400 border border-slate-800 font-mono">
                              By {file.authorAgent}
                            </span>
                            {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                        </div>

                        {item.matchSnippet && (
                          <div className="text-[10px] font-mono text-cyan-200 bg-black/60 p-1.5 rounded border border-slate-800 truncate">
                            <span className="text-slate-500 mr-1.5 font-sans">Matched:</span>
                            <span className="italic">"{item.matchSnippet}"</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. Actions, Goku Modes & Neural Circuits Section */}
              {filteredActions.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                    <span>Actions, 4D Modes &amp; Circuits ({filteredActions.length})</span>
                  </div>

                  {filteredActions.map((act, idx) => {
                    const itemIndex = filteredViews.length + filteredFiles.length + idx;
                    const isSelected = selectedIndex === itemIndex;

                    return (
                      <div
                        key={act.id}
                        onClick={() => handleSelectItem({ type: 'action', data: act })}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                          isSelected
                            ? 'bg-gradient-to-r from-rose-950 via-[#260e18] to-[#14060c] border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.25)] ring-1 ring-rose-400/40'
                            : 'bg-black/30 border-transparent hover:border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-1.5 rounded-lg border shrink-0 ${isSelected ? 'bg-rose-900 border-rose-400' : 'bg-slate-900 border-slate-800'}`}>
                            {act.icon}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold truncate block text-slate-100">
                              {act.name}
                            </span>
                            <p className="text-[10px] text-slate-400 truncate font-sans">
                              {act.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${act.badgeColor}`}>
                            {act.badge}
                          </span>
                          {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Right Column: Live Advanced Inspector & Quick Launch Preview (5 cols) */}
            <div className="hidden lg:flex lg:col-span-5 bg-[#050813] p-4 flex-col justify-between overflow-y-auto max-h-[62vh]">
              {selectedItem ? (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-extrabold">
                      LIVE OPTION INSPECTION
                    </span>

                    {selectedItem.type === 'view' && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/60">
                            {selectedItem.data.icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {selectedItem.data.name}
                            </span>
                            <span className="text-[10px] text-cyan-300 font-mono">
                              Category: {selectedItem.data.category}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2">
                          {selectedItem.data.description}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-2">
                          {selectedItem.data.tags.map(t => (
                            <span key={t} className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 text-slate-400 border border-slate-800">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedItem.type === 'file' && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/60">
                            <FileText className="w-5 h-5 text-amber-300" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {selectedItem.data.name}
                            </span>
                            <span className="text-[10px] text-amber-300 font-mono">
                              Author: {selectedItem.data.authorAgent} • {selectedItem.data.bytesWritten} bytes
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 break-all pt-2 bg-black/50 p-2 rounded border border-slate-800">
                          {selectedItem.data.path}
                        </p>
                        <div className="pt-2">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Content Preview:</span>
                          <div className="text-[11px] font-mono text-slate-300 bg-black/70 p-2.5 rounded border border-slate-800 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                            {selectedItem.data.content.slice(0, 300)}...
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedItem.type === 'action' && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-rose-950 border border-rose-500/60">
                            {selectedItem.data.icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {selectedItem.data.name}
                            </span>
                            <span className="text-[10px] text-rose-300 font-mono">
                              {selectedItem.data.category}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2">
                          {selectedItem.data.description}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-2">
                          {selectedItem.data.tags.map(t => (
                            <span key={t} className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 text-slate-400 border border-slate-800">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Direct Jump / Launch Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectItem(selectedItem)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition active:scale-98 cursor-pointer"
                  >
                    <span>Execute / Jump (↵ Enter)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-6 text-slate-500">
                  <LayoutGrid className="w-10 h-10 text-slate-700" />
                  <p className="text-xs font-bold text-slate-400">Select any option to inspect live details</p>
                  <p className="text-[11px] text-slate-600">Browse application views, virtual files, and commands</p>
                </div>
              )}

              {/* Bottom Quick Chips */}
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 block mb-1.5 font-bold uppercase tracking-wider">
                  Quick Actions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onToggleAi) onToggleAi();
                      setIsOpen(false);
                    }}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-bold transition cursor-pointer"
                  >
                    {isAiActive ? '⏸ Pause AI' : '▶ Start AI'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectView('spy');
                      setIsOpen(false);
                    }}
                    className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-[10px] text-cyan-300 font-bold transition cursor-pointer"
                  >
                    🐉 4D Goku Spy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectView('files');
                      setIsOpen(false);
                    }}
                    className="px-2 py-1 rounded bg-amber-950 hover:bg-amber-900 border border-amber-800 text-[10px] text-amber-300 font-bold transition cursor-pointer"
                  >
                    📂 Virtual Files
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Shortcuts & Status Bar */}
          <div className="relative z-10 px-4 py-2 border-t border-cyan-950/80 bg-[#050812] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">↵</kbd>
                <span>Execute &amp; Jump</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Esc</kbd>
                <span>Close</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 font-bold">ALL-SITE COMMAND PALETTE ONLINE</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
