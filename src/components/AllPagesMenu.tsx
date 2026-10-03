import React, { useState, useEffect, useRef } from 'react';
import { 
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
  Search, 
  X, 
  Grid, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Command,
  LayoutGrid,
  Zap,
  ArrowUpRight,
  Shield,
  Eye,
  Sliders,
  Cpu
} from 'lucide-react';
import { playTacticalBeep, playSuccessChime } from '../utils/audio';

export interface PageItem {
  id: string;
  number: string;
  name: string;
  category: 'Command & Espionage' | 'Agent Systems' | 'Quantum Spacetime' | 'Financial & Infra';
  description: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  hotkey: string;
  tags: string[];
}

export const ALL_PAGES: PageItem[] = [
  {
    id: 'dashboard',
    number: '01',
    name: 'Hermes Command Hub',
    category: 'Command & Espionage',
    description: 'Master system orchestrator, multi-agent dispatch, real-time telemetry gauges, and structured JSON logs.',
    icon: <Terminal className="w-5 h-5 text-cyan-400" />,
    badge: 'Core Engine',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    hotkey: 'Alt+1',
    tags: ['command', 'hub', 'core', 'hermes', 'dispatch', 'home', 'main']
  },
  {
    id: 'spy',
    number: '02',
    name: 'Spy & Sat-Link (3D Holographic Dragon & 4D Goku)',
    category: 'Command & Espionage',
    description: 'Orbital satellite reconnaissance, 3D Holographic Celestial Dragon (Blue, Golden, Purple with 3 live move 3D modes), and 4D AI Goku.',
    icon: <Radio className="w-5 h-5 text-amber-400" />,
    badge: '3D Hologram',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    hotkey: 'Alt+2',
    tags: ['spy', 'dragon', '3d holographic dragon', 'hologram', 'holo dragon', '3d dragon', 'goku', 'satellite', 'satlink', 'radar', 'recon', 'threats', 'shenron', 'blue', 'golden', 'purple']
  },
  {
    id: 'omni',
    number: '03',
    name: 'Omni Gem AI & Dollar-Bitcoin Studio',
    category: 'Agent Systems',
    description: 'Multimodal AI Assistant (answers any question & executes any open site task), Dollar & Bitcoin Live Chat Show, and Beautiful Girl Voice.',
    icon: <Sparkles className="w-5 h-5 text-pink-400" />,
    badge: 'Omni Gem',
    badgeColor: 'bg-pink-950 text-pink-300 border-pink-700',
    hotkey: 'Alt+O',
    tags: ['omni', 'gem', 'assistant', 'dollar', 'bitcoin', 'crypto', 'chat show', 'girl voice', 'voice', 'celeste', 'lyra', 'tasks', 'btc', 'usd', 'pkr']
  },
  {
    id: 'world',
    number: '04',
    name: 'World Monitor (3D Globe & Map)',
    category: 'Command & Espionage',
    description: 'Interactive 3D planetary globe and 2D tactical maps tracking geopolitical, seismic, tech and market hotspots.',
    icon: <Globe className="w-5 h-5 text-emerald-400" />,
    badge: 'Live 3D',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    hotkey: 'Alt+3',
    tags: ['world', 'globe', 'earth', 'map', 'tactical', 'hotspots', 'sensors', 'defense', 'maritime']
  },
  {
    id: 'voice',
    number: '04',
    name: 'Voice Assistant (4 Circuits)',
    category: 'Agent Systems',
    description: 'Neural voice architecture with 4 independent cognitive circuits: Short/Long Memory, Skills, Soul & Config.',
    icon: <Mic className="w-5 h-5 text-blue-400" />,
    badge: '4 Circuits',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    hotkey: 'Alt+4',
    tags: ['voice', 'assistant', 'circuits', 'memory', 'skills', 'soul', 'settings', 'tts', 'audio']
  },
  {
    id: 'town',
    number: '05',
    name: 'Agent Town Workspace',
    category: 'Agent Systems',
    description: 'Interactive pixel office for autonomous sub-agents Alice, Bob, Carol, and Dave with dynamic task queue kanbans.',
    icon: <Layers className="w-5 h-5 text-purple-400" />,
    badge: '4 Desks',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    hotkey: 'Alt+5',
    tags: ['agent town', 'alice', 'bob', 'carol', 'dave', 'office', 'pixel', 'tasks', 'desks', 'kanban']
  },
  {
    id: 'desktop',
    number: '06',
    name: 'Desktop Automation & Copilot',
    category: 'Agent Systems',
    description: 'Voice-directed desktop automation copilot, file system triggers, window managers, shell scripts and app launcher.',
    icon: <Monitor className="w-5 h-5 text-indigo-400" />,
    badge: 'Copilot',
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    hotkey: 'Alt+6',
    tags: ['desktop', 'copilot', 'automation', 'automation', 'os', 'windows', 'apps', 'voice control']
  },
  {
    id: 'hyper4d',
    number: '07',
    name: '4D Quantum CSS Matrix',
    category: 'Quantum Spacetime',
    description: 'High-dimensional 4D polyhedral visualizer: Tesseract, Orthoplex, Octaplex, Hypersphere & Chrono-Ghosting trails.',
    icon: <Move3d className="w-5 h-5 text-amber-400" />,
    badge: '4D CSS',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    hotkey: 'Alt+7',
    tags: ['4d', 'tesseract', 'quantum', 'spacetime', 'hypercube', 'orthoplex', 'matrix', 'ghosting', 'motion trails']
  },
  {
    id: 'bullion',
    number: '08',
    name: 'Financial & Gold Terminal',
    category: 'Financial & Infra',
    description: 'Karachi Sarafa bullion market rates in PKR/Tola, 24K/22K purity tables, currency FX spreads & regex scrapers.',
    icon: <TrendingUp className="w-5 h-5 text-yellow-400" />,
    badge: 'PKR Rates',
    badgeColor: 'bg-yellow-950 text-yellow-300 border-yellow-800',
    hotkey: 'Alt+8',
    tags: ['gold', 'bullion', 'finance', 'pkr', 'rates', 'karachi', 'currency', 'scraper', 'markets']
  },
  {
    id: 'files',
    number: '09',
    name: 'Stonic Virtual Files (VFS)',
    category: 'Financial & Infra',
    description: 'Multi-agent sandboxed virtual file system, code editor, syntax linter, diff inspector, and file metadata tracker.',
    icon: <FolderGit2 className="w-5 h-5 text-teal-400" />,
    badge: 'VFS Editor',
    badgeColor: 'bg-teal-950 text-teal-300 border-teal-800',
    hotkey: 'Alt+9',
    tags: ['files', 'vfs', 'virtual files', 'editor', 'code', 'markdown', 'json', 'linter', 'storage']
  },
  {
    id: 'console',
    number: '10',
    name: 'Console Logs & Telemetry',
    category: 'Financial & Infra',
    description: 'Live audit trail of Hermes execution plans, agent RPC requests, duration timings and structured debug payloads.',
    icon: <Activity className="w-5 h-5 text-slate-300" />,
    badge: 'Live Audit',
    badgeColor: 'bg-slate-900 text-slate-300 border-slate-700',
    hotkey: 'Alt+0',
    tags: ['console', 'logs', 'audit', 'telemetry', 'payloads', 'debugging', 'timing', 'trace']
  },
];

interface AllPagesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onSelectView: (viewId: string) => void;
}

export const AllPagesMenu: React.FC<AllPagesMenuProps> = ({
  isOpen,
  onClose,
  activeView,
  onSelectView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when menu opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter pages based on search query and category
  const filteredPages = ALL_PAGES.filter((page) => {
    const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      page.name.toLowerCase().includes(q) ||
      page.description.toLowerCase().includes(q) ||
      page.category.toLowerCase().includes(q) ||
      page.badge.toLowerCase().includes(q) ||
      page.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  const categories = [
    { id: 'all', label: 'All Pages (10)' },
    { id: 'Command & Espionage', label: 'Command & Spy' },
    { id: 'Agent Systems', label: 'Agent Systems' },
    { id: 'Quantum Spacetime', label: '4D Quantum' },
    { id: 'Financial & Infra', label: 'Finance & Infra' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 font-mono-code">
      
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Menu Modal Dialog */}
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] bg-[#070d1e] border-2 border-cyan-500/70 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.35)] flex flex-col overflow-hidden text-slate-200 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Subtle 4D Grid Matrix */}
        <div className="absolute inset-0 warp-grid-4d opacity-15 pointer-events-none" />

        {/* Top Header Strip */}
        <div className="relative z-10 p-4 sm:p-5 border-b border-cyan-900/70 bg-[#091124]/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/80 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <LayoutGrid className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-wide">
                  ALL PAGES &amp; APPLICATIONS DIRECTORY
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold">
                  {ALL_PAGES.length} Modules
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Instant one-click navigation across all Hermes AI Command, Agent Town, World Radar &amp; 4D Spy centers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playTacticalBeep(600);
              onClose();
            }}
            className="self-end sm:self-center p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Close menu (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="relative z-10 p-4 border-b border-slate-800 bg-[#060a17]/95 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by page name, keyword (e.g. goku, gold, town, 4d, agent, voice)..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-black/60 border border-slate-700/80 hover:border-cyan-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-xs text-white placeholder-slate-500 outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  playTacticalBeep(750);
                  setSelectedCategory(cat.id);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-black shadow-md font-extrabold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Grid of All Pages */}
        <div className="relative z-10 p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 max-h-[58vh]">
          {filteredPages.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-400">No pages found matching "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                Clear search filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPages.map((page) => {
                const isActive = activeView === page.id;
                return (
                  <div
                    key={page.id}
                    onClick={() => {
                      playSuccessChime();
                      onSelectView(page.id);
                      onClose();
                    }}
                    className={`group p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden select-none ${
                      isActive
                        ? 'bg-gradient-to-br from-cyan-950/80 via-[#0a1b38] to-[#071329] border-cyan-400/90 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                        : 'bg-[#060b18]/80 hover:bg-[#0c152e]/90 border-slate-800 hover:border-cyan-500/60 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Top Row: Icon, Number, Name & Badges */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl border ${isActive ? 'bg-cyan-900/60 border-cyan-400' : 'bg-slate-900 border-slate-700/80 group-hover:border-cyan-500/50'} transition`}>
                            {page.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-cyan-400 font-extrabold">
                                #{page.number}
                              </span>
                              <h3 className="font-heading font-bold text-sm text-white group-hover:text-cyan-300 transition">
                                {page.name}
                              </h3>
                            </div>
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">
                              {page.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isActive ? (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500 text-black shadow-sm">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>ACTIVE</span>
                            </span>
                          ) : (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${page.badgeColor}`}>
                              {page.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                        {page.description}
                      </p>
                    </div>

                    {/* Bottom Row: Tags & Direct Launch Prompt */}
                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/80 text-[10px]">
                      <div className="flex items-center gap-1 flex-wrap">
                        {page.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-1.5 py-0.2 rounded bg-black/50 text-slate-400 border border-slate-800">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                        <span>Launch Page</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Quick Bar */}
        <div className="relative z-10 p-3 sm:p-4 border-t border-cyan-950/90 bg-[#050812] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Select any module to navigate instantly.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">Esc</kbd> to close
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
