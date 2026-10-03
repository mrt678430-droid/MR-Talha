import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  HardDrive, 
  Activity, 
  Play, 
  Square, 
  Zap, 
  RefreshCw, 
  ShieldCheck, 
  FolderPlus, 
  FileCode, 
  CheckCircle2, 
  AlertOctagon, 
  Layers, 
  Sliders, 
  Mic, 
  Flame, 
  Power,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { DesktopProcessItem, DesktopAppItem, SystemTelemetry } from '../types';
import { playTacticalBeep, playSuccessChime, playErrorAlarm } from '../utils/audio';

const INITIAL_PROCESSES: DesktopProcessItem[] = [
  {
    pid: 1042,
    name: 'python3_bs4_scraper_daemon.py',
    type: 'AI_AGENT',
    cpuPercent: 14.2,
    memoryMb: 128.4,
    status: 'RUNNING',
    uptimeSec: 3420,
    command: 'python -u /workers/scraper_bullion.py --region=karachi --rate=5s'
  },
  {
    pid: 1088,
    name: 'sar_radar_orbital_stream_node',
    type: 'NETWORK',
    cpuPercent: 8.5,
    memoryMb: 245.1,
    status: 'RUNNING',
    uptimeSec: 4120,
    command: 'satlink-client --feed=GEO-PK-09 --format=raw-spectrometry'
  },
  {
    pid: 1120,
    name: 'stonic_virtual_fs_daemon',
    type: 'FILE_IO',
    cpuPercent: 2.1,
    memoryMb: 64.0,
    status: 'RUNNING',
    uptimeSec: 8900,
    command: 'vfs-manager --root=/workspace/stonic_data --ast-lint=enabled'
  },
  {
    pid: 1204,
    name: 'vector_embeddings_768_indexer',
    type: 'AI_AGENT',
    cpuPercent: 18.9,
    memoryMb: 512.6,
    status: 'BOOSTED',
    uptimeSec: 1240,
    command: 'hnsw-indexer --dim=768 --metric=cosine --cache=persistent'
  },
  {
    pid: 1340,
    name: 'hermes_neural_router_orchestrator',
    type: 'SYSTEM',
    cpuPercent: 4.8,
    memoryMb: 180.2,
    status: 'RUNNING',
    uptimeSec: 9200,
    command: 'hermes-core --subagents=20 --model=gemini-2.5-flash'
  },
  {
    pid: 1422,
    name: 'audio_dsp_speech_synthesizer',
    type: 'BACKGROUND',
    cpuPercent: 1.2,
    memoryMb: 45.0,
    status: 'SLEEPING',
    uptimeSec: 450,
    command: 'dsp-synth --channels=stereo --sample-rate=48000'
  },
];

const DESKTOP_APPS: DesktopAppItem[] = [
  { id: 'app-terminal', name: 'Hermes Master Terminal', icon: '⚡', category: 'TERMINAL', description: 'Interactive AI command dispatch & sub-agent orchestrator', path: '/apps/hermes_cli.exe', isFavorite: true },
  { id: 'app-scraper', name: 'Bullion Rates Scraper', icon: '📈', category: 'ANALYSIS', description: 'Real-time Karachi bullion tables & FX spread parser', path: '/apps/gold_scraper.py', isFavorite: true },
  { id: 'app-world', name: '3D World Mission Control', icon: '🌐', category: 'ANALYSIS', description: 'Geopolitical, defense and market news hotspot radar', path: '/apps/world_monitor.bin', isFavorite: true },
  { id: 'app-fs', name: 'Stonic File System', icon: '📁', category: 'PRODUCTIVITY', description: 'Virtual memory workspace with AST linting & JSON briefs', path: '/apps/stonic_vfs.app', isFavorite: true },
  { id: 'app-process', name: 'Process & Task Manager', icon: '💻', category: 'SETTINGS', description: 'Lightweight Copilot system load optimizer and manager', path: '/sys/taskmgr.exe', isFavorite: false },
  { id: 'app-speech', name: 'Audio Speech Synthesizer', icon: '🎙️', category: 'MEDIA', description: 'Real-time TTS voice modulator & sound effects pack', path: '/sys/audio_dsp.service', isFavorite: false },
];

interface DesktopAutomationProps {
  onExecuteCommand?: (cmd: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const DesktopAutomation: React.FC<DesktopAutomationProps> = ({
  onExecuteCommand,
  onNavigateTab,
}) => {
  const [processes, setProcesses] = useState<DesktopProcessItem[]>(INITIAL_PROCESSES);
  const [selectedProcess, setSelectedProcess] = useState<DesktopProcessItem | null>(processes[0]);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [systemTelemetry, setSystemTelemetry] = useState<SystemTelemetry>({
    cpuUsage: 34.2,
    ramUsage: 6.4,
    totalRamGb: 16.0,
    meshLatencyMs: 0.42,
    networkRxKbps: 842.5,
    networkTxKbps: 312.1,
    diskIoMb: 14.8,
    activeProcessesCount: 6,
    uptimeSeconds: 14280,
  });
  const [lastActionStatus, setLastActionStatus] = useState<string>('Copilot Automation Engine Ready');

  // Real-time telemetry oscillation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTelemetry(prev => ({
        ...prev,
        cpuUsage: Math.max(12, Math.min(88, +(prev.cpuUsage + (Math.random() * 8 - 4)).toFixed(1))),
        ramUsage: +(6.2 + (Math.random() * 0.5)).toFixed(1),
        networkRxKbps: Math.max(200, Math.min(1800, +(prev.networkRxKbps + (Math.random() * 80 - 40)).toFixed(1))),
        networkTxKbps: Math.max(100, Math.min(900, +(prev.networkTxKbps + (Math.random() * 40 - 20)).toFixed(1))),
        uptimeSeconds: prev.uptimeSeconds + 2,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleProcess = (pid: number, action: 'BOOST' | 'PAUSE' | 'KILL' | 'RESTART') => {
    playTacticalBeep(650);
    setProcesses(prev =>
      prev.map(p => {
        if (p.pid !== pid) return p;
        if (action === 'BOOST') {
          playSuccessChime();
          setLastActionStatus(`Boosted priority for ${p.name} (PID: ${pid})`);
          return { ...p, status: 'BOOSTED', cpuPercent: +(p.cpuPercent * 1.4).toFixed(1) };
        } else if (action === 'PAUSE') {
          setLastActionStatus(`Paused ${p.name} (PID: ${pid})`);
          return { ...p, status: 'SLEEPING', cpuPercent: 0.1 };
        } else if (action === 'KILL') {
          playErrorAlarm();
          setLastActionStatus(`Terminated process ${p.name} (PID: ${pid})`);
          return { ...p, status: 'SLEEPING', cpuPercent: 0 };
        } else {
          playSuccessChime();
          setLastActionStatus(`Restarted process ${p.name} (PID: ${pid})`);
          return { ...p, status: 'RUNNING', cpuPercent: 12.0 };
        }
      })
    );
  };

  const handleLaunchApp = (app: DesktopAppItem) => {
    playTacticalBeep(700);
    setLastActionStatus(`Launched: ${app.name} (${app.path})`);
    if (app.id === 'app-terminal' && onNavigateTab) onNavigateTab('dashboard');
    if (app.id === 'app-scraper' && onNavigateTab) onNavigateTab('bullion');
    if (app.id === 'app-world' && onNavigateTab) onNavigateTab('world');
    if (app.id === 'app-fs' && onNavigateTab) onNavigateTab('files');
  };

  const handleRunMacro = (macroTitle: string, command: string) => {
    playSuccessChime();
    setLastActionStatus(`Macro Executing: ${macroTitle}`);
    if (onExecuteCommand) onExecuteCommand(command);
  };

  return (
    <div id="stonic-desktop-automation" className="w-full space-y-4 font-mono-code">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl tactical-card border border-cyan-900/60 bg-gradient-to-r from-slate-950 via-[#091326] to-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-bold text-slate-100">
                Desktop Automation & Copilot Control
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold">
                LIGHTWEIGHT COPILOT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Voice-driven file/app execution, live process throttling, and hardware telemetry.
            </p>
          </div>
        </div>

        <div className="text-right text-xs text-slate-400">
          <div>Engine Status: <strong className="text-emerald-400">NOMINAL</strong></div>
          <div className="text-[10px] text-cyan-400 font-mono-code">{lastActionStatus}</div>
        </div>
      </div>

      {/* Real-time Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* CPU Load */}
        <div className="p-3 rounded-xl tactical-card border border-cyan-950/80 bg-slate-950/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Core Load</span>
            <span className="font-bold text-cyan-300">{systemTelemetry.cpuUsage}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${systemTelemetry.cpuUsage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500">8 Virtual Cores @ 3.8 GHz</div>
        </div>

        {/* RAM Usage */}
        <div className="p-3 rounded-xl tactical-card border border-cyan-950/80 bg-slate-950/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Memory Buffer</span>
            <span className="font-bold text-emerald-300">{systemTelemetry.ramUsage} / {systemTelemetry.totalRamGb} GB</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${(systemTelemetry.ramUsage / systemTelemetry.totalRamGb) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500">Fast DDR5 Low-Latency</div>
        </div>

        {/* Mesh Network */}
        <div className="p-3 rounded-xl tactical-card border border-cyan-950/80 bg-slate-950/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Mesh Network</span>
            <span className="font-bold text-amber-300">{systemTelemetry.meshLatencyMs} ms</span>
          </div>
          <div className="text-xs text-slate-300 font-bold flex items-center justify-between">
            <span>Rx: {systemTelemetry.networkRxKbps} KB/s</span>
            <span>Tx: {systemTelemetry.networkTxKbps} KB/s</span>
          </div>
          <div className="text-[10px] text-slate-500">TLS 1.3 Multiplexed Socket</div>
        </div>

        {/* Disk I/O & VFS */}
        <div className="p-3 rounded-xl tactical-card border border-cyan-950/80 bg-slate-950/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Disk & VFS I/O</span>
            <span className="font-bold text-indigo-300">{systemTelemetry.diskIoMb} MB/s</span>
          </div>
          <div className="text-xs text-slate-300 font-bold">
            Stonic Workspace Mounted
          </div>
          <div className="text-[10px] text-slate-500">AST Lint Auto-Passed</div>
        </div>
      </div>

      {/* Main Grid: Process Manager (7 cols) + Quick Apps & Automation Macros (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Active Desktop Process Manager */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Active Desktop Daemon Processes ({processes.length})
            </h3>
            <span className="text-[10px] text-slate-500">Auto-throttled by Copilot</span>
          </div>

          <div className="space-y-2">
            {processes.map((proc) => {
              const isSelected = selectedProcess?.pid === proc.pid;
              return (
                <div
                  key={proc.pid}
                  onClick={() => setSelectedProcess(proc)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        proc.status === 'BOOSTED'
                          ? 'bg-amber-950 border border-amber-600 text-amber-300'
                          : proc.status === 'RUNNING'
                          ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        PID {proc.pid}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{proc.name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-cyan-300 font-bold">{proc.cpuPercent}% CPU</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-300">{proc.memoryMb} MB</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono-code bg-slate-950/80 px-2 py-1 rounded mt-2 truncate">
                    $ {proc.command}
                  </div>

                  {/* Process Action Controls */}
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-900 text-xs">
                    <span className="text-[10px] text-slate-500">
                      Uptime: {Math.floor(proc.uptimeSec / 60)}m {proc.uptimeSec % 60}s
                    </span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleToggleProcess(proc.pid, 'BOOST')}
                        className="px-2 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900 border border-amber-700/60 text-amber-300 text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                        title="Boost thread CPU priority"
                      >
                        <Flame className="w-2.5 h-2.5" /> Boost
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleProcess(proc.pid, 'PAUSE')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition cursor-pointer"
                        title="Pause process execution"
                      >
                        Pause
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleProcess(proc.pid, 'RESTART')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition cursor-pointer"
                        title="Restart process"
                      >
                        Restart
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleProcess(proc.pid, 'KILL')}
                        className="px-2 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-[10px] transition cursor-pointer"
                        title="Kill process"
                      >
                        Kill
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quick App Launcher & Automation Macros */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick App Launcher */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Quick App & Terminal Launcher
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {DESKTOP_APPS.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleLaunchApp(app)}
                  className="p-2.5 rounded-xl tactical-card border border-slate-800 hover:border-cyan-500/60 bg-slate-950/70 hover:bg-slate-900/60 transition cursor-pointer group"
                >
                  <div className="text-lg mb-1">{app.icon}</div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition">
                    {app.name}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-sans">
                    {app.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automation One-Click Macros */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Automated Copilot System Macros
            </h3>
            <div className="space-y-2">
              {[
                {
                  title: 'Clean Memory Buffers & Socket Cache',
                  desc: 'Purges transient IPC sockets and garbage collects dormant AST nodes',
                  cmd: 'Run memory garbage collection & clean transient socket descriptors',
                  icon: '🧹'
                },
                {
                  title: 'Run AST Lint & JSON Brief Backup',
                  desc: 'Validates Stonic Data workspace files against JSON schema',
                  cmd: 'Execute ESLint & JSON Schema validation on Stonic Data files',
                  icon: '📦'
                },
                {
                  title: 'Rebalance Agent Town Roster',
                  desc: 'Optimizes seat assignments for Alice, Bob, Carol, and Dave',
                  cmd: 'Reassign Agent Town avatars: Alice to Research, Bob to Python Scraper, Carol to Geospatial Radar, Dave to Log Heartbeats.',
                  icon: '👥'
                },
              ].map((macro, idx) => (
                <div
                  key={idx}
                  onClick={() => handleRunMacro(macro.title, macro.cmd)}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900/70 hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{macro.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition">
                        {macro.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">
                        {macro.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
