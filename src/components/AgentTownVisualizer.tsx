import React, { useState } from 'react';
import { 
  PixelAgent, 
  Desk, 
  AgentName, 
  AgentActionState,
  AgentTaskItem
} from '../types';
import { 
  Users, 
  Monitor, 
  Coffee, 
  Server, 
  Volume2, 
  Sparkles, 
  Activity,
  CheckCircle2,
  Clock,
  Laptop,
  ListOrdered,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { playTacticalBeep, speakAgentTTS } from '../utils/audio';
import { AgentTaskQueueDisplay } from './AgentTaskQueueDisplay';

interface AgentTownVisualizerProps {
  agents: PixelAgent[];
  desks: Desk[];
  onAssignDesk: (agentId: AgentName, deskId: number) => void;
  onUpdateActionState: (agentId: AgentName, state: AgentActionState) => void;
  onAdvanceTask: (agentId: AgentName) => void;
  onAddTaskToQueue: (agentId: AgentName, task: Omit<AgentTaskItem, 'id' | 'status'>) => void;
  onDeleteTaskFromQueue: (agentId: AgentName, taskId: string) => void;
  onMoveTaskInQueue: (agentId: AgentName, index: number, direction: 'up' | 'down') => void;
  isAiActive: boolean;
  ttsEnabled: boolean;
}

export const AgentTownVisualizer: React.FC<AgentTownVisualizerProps> = ({
  agents,
  desks,
  onAssignDesk,
  onUpdateActionState,
  onAdvanceTask,
  onAddTaskToQueue,
  onDeleteTaskFromQueue,
  onMoveTaskInQueue,
  isAiActive,
  ttsEnabled,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<AgentName | null>('Oliver');
  const [visualizerTab, setVisualizerTab] = useState<'all' | 'floor' | 'queue'>('all');

  const busyCount = agents.filter(a => a.actionState === 'EXECUTING' || a.actionState === 'THINKING').length;
  const seatedCount = agents.filter(a => a.deskAssignment > 0).length;
  const totalQueuedCount = agents.reduce((acc, a) => acc + (a.taskQueue?.length || 0), 0);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  const handleAgentClick = (agent: PixelAgent) => {
    setSelectedAgentId(agent.id);
    playTacticalBeep(650);
    if (ttsEnabled && agent.ttsResponse) {
      speakAgentTTS(`${agent.name} reports: ${agent.ttsResponse}`);
    }
  };

  const handleDeskClick = (desk: Desk) => {
    if (!selectedAgentId) return;
    playTacticalBeep(800);
    onAssignDesk(selectedAgentId, desk.id);
  };

  return (
    <div id="agent-town-panel" className="tactical-card corner-bracket p-4 flex flex-col h-full gap-3">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-cyan-950/90 border border-cyan-700/50 text-cyan-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              AGENT TOWN WORKSPACE
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60">
                SUB-AGENT 1
              </span>
            </h3>
            <p className="text-[11px] font-mono-code text-slate-400">
              Multi-Agent Seating, Pixel Office &amp; Autonomous Task Queue
            </p>
          </div>
        </div>

        {/* View mode buttons & metrics */}
        <div className="flex items-center gap-2">
          {/* Tab Selector */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded border border-slate-800 text-[10px] font-mono-code">
            <button
              onClick={() => {
                playTacticalBeep(600);
                setVisualizerTab('all');
              }}
              className={`px-2 py-0.5 rounded transition ${
                visualizerTab === 'all'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL-IN-ONE
            </button>
            <button
              onClick={() => {
                playTacticalBeep(600);
                setVisualizerTab('floor');
              }}
              className={`px-2 py-0.5 rounded transition ${
                visualizerTab === 'floor'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              OFFICE FLOOR
            </button>
            <button
              onClick={() => {
                playTacticalBeep(600);
                setVisualizerTab('queue');
              }}
              className={`px-2 py-0.5 rounded transition ${
                visualizerTab === 'queue'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              QUEUE PIPELINE
            </button>
          </div>

          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono-code text-slate-300 hidden sm:inline-block">
            SEATING: <strong className="text-cyan-400">{seatedCount}/7</strong>
          </span>
          <span className={`px-2 py-0.5 rounded border text-[11px] font-mono-code ${
            busyCount > 0 
              ? 'bg-amber-950/60 border-amber-800/60 text-amber-300 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-emerald-400'
          }`}>
            QUEUED: <strong className="text-cyan-300">{totalQueuedCount}</strong>
          </span>
        </div>
      </div>

      {/* Section 1: Interactive Pixel Office Map Area (Visible in 'all' and 'floor' tabs) */}
      {(visualizerTab === 'all' || visualizerTab === 'floor') && (
        <div className="relative w-full h-64 sm:h-72 bg-[#060a12] border border-cyan-900/40 rounded-lg p-3 overflow-hidden shadow-inner flex flex-col justify-between select-none">
          
          {/* Isometric Grid Floor Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e1a2d_1px,transparent_1px),linear-gradient(to_bottom,#0e1a2d_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

          {/* Top Facility Zone: Server Rack & Coffee Lounge */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono-code text-slate-500">
            <div className="flex items-center gap-2 bg-[#0a111e]/90 border border-slate-800 px-2.5 py-1 rounded">
              <Server className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-slate-300">CORE SERVER RACK (0.02ms latency)</span>
            </div>

            <div className="flex items-center gap-2 bg-[#0a111e]/90 border border-slate-800 px-2.5 py-1 rounded">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-300">AGENTS LOUNGE / SYNAPSE COFFEE</span>
            </div>
          </div>

          {/* Central Desks Grid (7 Desk Stations) */}
          <div className="relative z-10 grid grid-cols-4 sm:grid-cols-7 gap-2 my-auto">
            {desks.map((desk) => {
              const assignedAgent = agents.find(a => a.deskAssignment === desk.id);
              const isTarget = selectedAgent?.deskAssignment === desk.id;
              const pendingCount = assignedAgent?.taskQueue?.length || 0;
              const nextTaskTitle = assignedAgent?.taskQueue?.[0]?.title;

              return (
                <div
                  key={desk.id}
                  id={`desk-station-${desk.id}`}
                  onClick={() => handleDeskClick(desk)}
                  className={`relative flex flex-col items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer h-28 ${
                    assignedAgent
                      ? 'bg-[#0d1627] border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : isTarget
                      ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400'
                      : 'bg-[#090d16] border-slate-800 hover:border-slate-700 hover:bg-[#0c1220]'
                  }`}
                  title={assignedAgent ? `${assignedAgent.name} - Active: ${assignedAgent.currentTask}\nNext in Queue: ${nextTaskTitle || 'None'}` : `Desk #${desk.id} (Free)`}
                >
                  {/* Desk Station Header with Queue Indicator */}
                  <div className="w-full flex items-center justify-between text-[9px] font-mono-code text-slate-400">
                    <span className="font-bold text-slate-300">#{desk.id}</span>
                    {assignedAgent ? (
                      <div className="flex items-center gap-1">
                        {pendingCount > 0 && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold" title={`${pendingCount} tasks queued`}>
                            Q:{pendingCount}
                          </span>
                        )}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                    ) : (
                      <span className="text-[8px] text-slate-600">FREE</span>
                    )}
                  </div>

                  {/* Desk Computer Screen Sprite */}
                  <div className="relative my-0.5 flex items-center justify-center">
                    <div className={`w-8 h-6 rounded-t border flex items-center justify-center transition ${
                      assignedAgent?.actionState === 'EXECUTING'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                        : assignedAgent?.actionState === 'THINKING'
                        ? 'bg-purple-950 border-purple-400 text-purple-300'
                        : 'bg-slate-900 border-slate-700 text-slate-600'
                    }`}>
                      <Monitor className="w-3.5 h-3.5" />
                    </div>
                    <div className="absolute -bottom-1 w-10 h-1 bg-slate-700 rounded-sm" />
                  </div>

                  {/* Seated Agent Avatar */}
                  {assignedAgent ? (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAgentClick(assignedAgent);
                      }}
                      className="relative group flex flex-col items-center"
                    >
                      {/* Animated speech bubble if agent has active TTS */}
                      {assignedAgent.ttsResponse && (
                        <div className="absolute -top-10 -left-6 bg-slate-900 border border-cyan-500/80 text-cyan-200 text-[9px] font-mono-code px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none animate-bounce">
                          {assignedAgent.ttsResponse.slice(0, 18)}...
                        </div>
                      )}

                      {/* Pixel Avatar Representation */}
                      <div className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-bold transition transform group-hover:scale-110 ${
                        assignedAgent.id === 'Oliver'
                          ? 'bg-indigo-950 border-indigo-400 text-indigo-300 shadow-indigo-500/30'
                          : assignedAgent.id === 'Sam'
                          ? 'bg-amber-950 border-amber-400 text-amber-300 shadow-amber-500/30'
                          : assignedAgent.id === 'Sarah'
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-cyan-500/30'
                          : 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-emerald-500/30'
                      } shadow-md`}>
                        {assignedAgent.avatarIcon}
                      </div>

                      <span className="text-[9px] font-mono-code font-semibold text-slate-200 mt-0.5 truncate max-w-[50px]">
                        {assignedAgent.name}
                      </span>

                      {/* Action State Badge */}
                      <span className={`text-[8px] font-mono-code uppercase px-1 rounded ${
                        assignedAgent.actionState === 'EXECUTING'
                          ? 'bg-cyan-900/80 text-cyan-300 animate-pulse'
                          : assignedAgent.actionState === 'THINKING'
                          ? 'bg-purple-900/80 text-purple-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {assignedAgent.actionState}
                      </span>
                    </div>
                  ) : (
                    <div className="text-[9px] font-mono-code text-slate-600 py-1">
                      Assign
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Meeting Station & Pathway */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono-code text-slate-500 pt-1 border-t border-slate-800/80">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              HERMES WORKFLOW SEQUENCER
            </span>
            <span className="text-slate-400">Click avatar to view queue &bull; Click desk to seat worker</span>
          </div>
        </div>
      )}

      {/* Section 2: Active Agent Inspector Card (Shown in 'floor' or 'all' mode) */}
      {visualizerTab === 'floor' && selectedAgent && (
        <div className="bg-[#080d17] border border-cyan-950 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-[70%]">
              <span className="text-xs font-mono-code text-slate-400 shrink-0">SELECT AGENT:</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    id={`btn-agent-select-${agent.id}`}
                    onClick={() => handleAgentClick(agent)}
                    className={`px-2 py-1 rounded text-xs font-mono-code transition shrink-0 flex items-center gap-1 ${
                      selectedAgentId === agent.id
                        ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)] font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{agent.avatarIcon}</span>
                    <span>{agent.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playTacticalBeep(750);
                  const nextState: AgentActionState = 
                    selectedAgent.actionState === 'IDLE' ? 'THINKING' :
                    selectedAgent.actionState === 'THINKING' ? 'EXECUTING' : 'IDLE';
                  onUpdateActionState(selectedAgent.id, nextState);
                }}
                className="px-2 py-0.5 text-[10px] font-mono-code bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 rounded"
              >
                TOGGLE STATE
              </button>
              {selectedAgent.ttsResponse && (
                <button
                  onClick={() => {
                    playTacticalBeep(600);
                    speakAgentTTS(`${selectedAgent.name} says: ${selectedAgent.ttsResponse}`);
                  }}
                  className="p-1 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-400 hover:bg-cyan-900"
                  title="Play TTS Voice"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono-code pt-1 border-t border-slate-800/80">
            <div>
              <span className="text-slate-500">ROLE &amp; MODULE:</span>
              <p className="text-slate-200 font-semibold">{selectedAgent.role}</p>
              <p className="text-[11px] text-slate-400">{selectedAgent.specialty}</p>
            </div>
            <div>
              <span className="text-slate-500">CURRENT SUB-TASK:</span>
              <p className="text-cyan-300">{selectedAgent.currentTask || 'Awaiting Hermes dispatch directive'}</p>
            </div>
            <div>
              <span className="text-slate-500">TTS RESPONSE UPDATE:</span>
              <p className="text-slate-300 italic text-[11px]">"{selectedAgent.ttsResponse || 'Nominal execution in progress.'}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Visual Task Queue & Pipeline Display (Visible in 'all' and 'queue' modes) */}
      {(visualizerTab === 'all' || visualizerTab === 'queue') && (
        <AgentTaskQueueDisplay
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          onAdvanceTask={onAdvanceTask}
          onAddTask={onAddTaskToQueue}
          onDeleteTask={onDeleteTaskFromQueue}
          onMoveTask={onMoveTaskInQueue}
        />
      )}

    </div>
  );
};

