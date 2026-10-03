import React, { useState } from 'react';
import { ConsoleLogEntry } from '../types';
import { 
  Terminal, 
  Copy, 
  Check, 
  Trash2, 
  Filter, 
  ChevronRight, 
  Code2,
  Clock
} from 'lucide-react';
import { playTacticalBeep } from '../utils/audio';

interface HermesConsoleLogsProps {
  logs: ConsoleLogEntry[];
  onClearLogs: () => void;
}

export const HermesConsoleLogs: React.FC<HermesConsoleLogsProps> = ({
  logs,
  onClearLogs,
}) => {
  const [filterAgent, setFilterAgent] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = filterAgent === 'ALL'
    ? logs
    : logs.filter(l => l.agent.toLowerCase().includes(filterAgent.toLowerCase()));

  const handleCopyJSON = (entry: ConsoleLogEntry) => {
    playTacticalBeep(880);
    const jsonStr = JSON.stringify({
      status: entry.status.toLowerCase(),
      output: entry.message,
      duration_seconds: entry.duration_seconds,
      agent: entry.agent,
      timestamp: entry.timestamp,
      payload: entry.payload || {}
    }, null, 2);

    navigator.clipboard.writeText(jsonStr);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="hermes-code-console" className="tactical-card corner-bracket p-4 flex flex-col">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-cyan-950/90 border border-cyan-700/50 text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              HERMES CODE CONSOLE &bull; JSON OUTPUT STREAM
            </h3>
            <p className="text-[11px] font-mono-code text-slate-400">
              Structured Logs Schema: <code className="text-cyan-300">{"{ status, output, duration_seconds }"}</code>
            </p>
          </div>
        </div>

        {/* Filter Agents + Clear */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[10px] font-mono-code">
            {['ALL', 'Hermes', 'Agent_Town', 'Gold_Calc', 'SatLink', 'File_System'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  playTacticalBeep(600);
                  setFilterAgent(f);
                }}
                className={`px-2 py-0.5 rounded transition ${
                  filterAgent === f
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              playTacticalBeep(500);
              onClearLogs();
            }}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 transition"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Output Stream */}
      <div className="space-y-2 max-h-72 overflow-y-auto font-mono-code text-xs pr-1">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            Console initialized. Awaiting Hermes dispatch logs...
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-[#05080e] border border-slate-800/80 rounded-lg p-2.5 hover:border-cyan-900/60 transition group"
            >
              {/* Top Log Meta */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 pb-1 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-500 font-bold">[{log.agent}]</span>
                  <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                    log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    log.status === 'ERROR' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {log.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {log.duration_seconds.toFixed(2)}s
                  </span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>

                  <button
                    onClick={() => handleCopyJSON(log)}
                    className="p-1 rounded bg-slate-900 hover:bg-cyan-950 text-slate-400 hover:text-cyan-300 transition"
                    title="Copy Structured JSON Schema"
                  >
                    {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Message Output */}
              <div className="text-slate-200 text-xs mb-1.5">
                {log.message}
              </div>

              {/* JSON Code Snippet */}
              {log.payload && (
                <div className="bg-[#03050a] p-2 rounded border border-slate-900 text-[11px] text-cyan-300/90 overflow-x-auto max-h-32">
                  <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
