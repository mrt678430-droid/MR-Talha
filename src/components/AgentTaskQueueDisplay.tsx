import React, { useState } from 'react';
import { 
  PixelAgent, 
  AgentTaskItem, 
  AgentName 
} from '../types';
import { 
  ListOrdered, 
  Clock, 
  Play, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Sparkles, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  Layers, 
  Bot, 
  Zap,
  Activity,
  Workflow
} from 'lucide-react';
import { playTacticalBeep, playSuccessChime, playDispatchChirp } from '../utils/audio';

interface AgentTaskQueueDisplayProps {
  agents: PixelAgent[];
  selectedAgentId: AgentName | null;
  onSelectAgent: (agentId: AgentName) => void;
  onAdvanceTask: (agentId: AgentName) => void;
  onAddTask: (agentId: AgentName, task: Omit<AgentTaskItem, 'id' | 'status'>) => void;
  onDeleteTask: (agentId: AgentName, taskId: string) => void;
  onMoveTask: (agentId: AgentName, index: number, direction: 'up' | 'down') => void;
}

const CATEGORY_STYLES: Record<AgentTaskItem['category'], { bg: string; text: string; border: string }> = {
  SCRAPER: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-700/60' },
  ANALYSIS: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/60' },
  SURVEILLANCE: { bg: 'bg-cyan-950/80', text: 'text-cyan-300', border: 'border-cyan-700/60' },
  STORAGE: { bg: 'bg-indigo-950/80', text: 'text-indigo-300', border: 'border-indigo-700/60' },
  SYSTEM: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-700/60' },
};

const PRIORITY_STYLES: Record<AgentTaskItem['priority'], { bg: string; dot: string }> = {
  CRITICAL: { bg: 'bg-rose-950/80 text-rose-300 border-rose-600', dot: 'bg-rose-500' },
  HIGH: { bg: 'bg-amber-950/80 text-amber-300 border-amber-600', dot: 'bg-amber-400' },
  MEDIUM: { bg: 'bg-blue-950/80 text-blue-300 border-blue-600', dot: 'bg-blue-400' },
  LOW: { bg: 'bg-slate-900 text-slate-400 border-slate-700', dot: 'bg-slate-500' },
};

export const AgentTaskQueueDisplay: React.FC<AgentTaskQueueDisplayProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onAdvanceTask,
  onAddTask,
  onDeleteTask,
  onMoveTask,
}) => {
  const [viewMode, setViewMode] = useState<'focused' | 'matrix'>('focused');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskCategory, setNewTaskCategory] = useState<AgentTaskItem['category']>('ANALYSIS');
  const [newTaskPriority, setNewTaskPriority] = useState<AgentTaskItem['priority']>('MEDIUM');
  const [newTaskDuration, setNewTaskDuration] = useState<string>('8s');

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeAgent) return;
    
    playDispatchChirp();
    onAddTask(activeAgent.id, {
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      estimatedDuration: newTaskDuration.trim() || '6s',
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const totalPendingAcrossAll = agents.reduce((acc, a) => acc + (a.taskQueue?.length || 0), 0);

  return (
    <div className="bg-[#070c16] border border-cyan-950/80 rounded-xl p-3.5 flex flex-col shadow-inner">
      
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-400">
            <Workflow className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-mono-code font-bold text-slate-100 flex items-center gap-1.5">
              AUTONOMOUS TASK QUEUE &amp; WORKFLOW PIPELINE
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                {totalPendingAcrossAll} PENDING
              </span>
            </h4>
            <p className="text-[10px] font-mono-code text-slate-400">
              Predictive sequential task queue &bull; Next actions for sub-agents
            </p>
          </div>
        </div>

        {/* View mode toggle & Action */}
        <div className="flex items-center gap-1.5">
          <div className="bg-slate-900 p-0.5 rounded border border-slate-800 flex items-center text-[10px] font-mono-code">
            <button
              onClick={() => {
                playTacticalBeep(600);
                setViewMode('focused');
              }}
              className={`px-2 py-0.5 rounded transition ${
                viewMode === 'focused'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FOCUSED AGENT
            </button>
            <button
              onClick={() => {
                playTacticalBeep(600);
                setViewMode('matrix');
              }}
              className={`px-2 py-0.5 rounded transition ${
                viewMode === 'matrix'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL AGENTS MATRIX
            </button>
          </div>

          <button
            onClick={() => {
              playTacticalBeep(700);
              setIsAddingTask(!isAddingTask);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 rounded text-[11px] font-mono-code transition shadow-sm"
          >
            <Plus className="w-3 h-3" />
            <span>ENQUEUE TASK</span>
          </button>
        </div>
      </div>

      {/* Inline Add Task Form */}
      {isAddingTask && (
        <form onSubmit={handleCreateTaskSubmit} className="mb-3 p-3 rounded-lg bg-[#0b1322] border border-cyan-800/60 text-xs font-mono-code animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              INJECT NEXT WORKFLOW TASK FOR [{activeAgent.name.toUpperCase()}]
            </span>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="text-slate-400 hover:text-slate-200 text-[10px]"
            >
              CANCEL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-6">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Scrape Lahore spot delta, write markdown report..."
                className="w-full px-2.5 py-1.5 bg-[#060a12] border border-slate-700 rounded text-slate-200 focus:border-cyan-400 focus:outline-none placeholder:text-slate-600"
                autoFocus
              />
            </div>

            <div className="sm:col-span-2">
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="w-full px-2 py-1.5 bg-[#060a12] border border-slate-700 rounded text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="ANALYSIS">ANALYSIS</option>
                <option value="SCRAPER">SCRAPER</option>
                <option value="SURVEILLANCE">SURVEILLANCE</option>
                <option value="STORAGE">STORAGE</option>
                <option value="SYSTEM">SYSTEM</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="w-full px-2 py-1.5 bg-[#060a12] border border-slate-700 rounded text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-1.5">
              <input
                type="text"
                value={newTaskDuration}
                onChange={(e) => setNewTaskDuration(e.target.value)}
                placeholder="Est: 6s"
                className="w-16 px-1.5 py-1.5 bg-[#060a12] border border-slate-700 rounded text-slate-200 focus:border-cyan-400 focus:outline-none text-center"
              />
              <button
                type="submit"
                className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition shadow"
              >
                ADD
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Mode 1: Focused Agent Queue Breakdown */}
      {viewMode === 'focused' ? (
        <div className="space-y-3">
          
          {/* Agent Selection Pill Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono-code text-slate-400 uppercase shrink-0">AGENT PIPELINE:</span>
            {agents.map((ag) => {
              const qCount = ag.taskQueue?.length || 0;
              const isSelected = ag.id === activeAgent.id;
              return (
                <button
                  key={ag.id}
                  onClick={() => {
                    playTacticalBeep(600);
                    onSelectAgent(ag.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono-code transition shrink-0 border ${
                    isSelected
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.3)] font-bold'
                      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{ag.avatarIcon}</span>
                  <span>{ag.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    qCount > 0 
                      ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/50' 
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {qCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Currently Running Task Box */}
          <div className="p-3 rounded-lg bg-[#0a1120] border border-cyan-900/80 shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-mono-code font-bold text-cyan-300 flex items-center gap-1">
                  CURRENT ACTIVE EXECUTION [{activeAgent.name}]
                </span>
                <span className={`text-[9px] font-mono-code uppercase px-1.5 py-0.5 rounded ${
                  activeAgent.actionState === 'EXECUTING'
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-300'
                    : activeAgent.actionState === 'THINKING'
                    ? 'bg-purple-950 border border-purple-500 text-purple-300'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {activeAgent.actionState}
                </span>
              </div>

              {/* Fast track next queued task button */}
              <button
                onClick={() => {
                  playSuccessChime();
                  onAdvanceTask(activeAgent.id);
                }}
                disabled={!activeAgent.taskQueue || activeAgent.taskQueue.length === 0}
                className="flex items-center gap-1 px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 rounded text-[10px] font-mono-code transition disabled:opacity-40 disabled:cursor-not-allowed"
                title="Complete current task and advance to next pending task in queue"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>COMPLETE &amp; ADVANCE NEXT</span>
              </button>
            </div>

            <div className="flex items-start justify-between gap-4 mt-2">
              <div className="flex-1">
                <p className="text-xs font-mono-code font-semibold text-slate-100">
                  {activeAgent.currentTask || 'Idle - standing by for autonomous dispatch'}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono-code text-slate-400">
                  <span className="text-slate-500">ASSIGNED STATION:</span>
                  <span className="text-cyan-400">DESK #{activeAgent.deskAssignment || 'UNASSIGNED'}</span>
                  <span>&bull;</span>
                  <span className="text-slate-500">SPECIALTY:</span>
                  <span className="text-slate-300">{activeAgent.specialty}</span>
                </div>
              </div>

              {/* Progress animation bar */}
              <div className="w-28 text-right hidden sm:block">
                <div className="text-[10px] font-mono-code text-cyan-400 mb-1">IN PROGRESS</div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse rounded-full w-3/4" />
                </div>
              </div>
            </div>
          </div>

          {/* Sequential Pending Queue Pipeline */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 mb-2 px-1">
              <span className="flex items-center gap-1 font-bold text-slate-300">
                <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
                PENDING QUEUE SEQUENCE ({activeAgent.taskQueue?.length || 0} IN PIPELINE)
              </span>
              <span className="text-[10px] text-slate-500">Autonomous loop auto-executes in order</span>
            </div>

            {activeAgent.taskQueue && activeAgent.taskQueue.length > 0 ? (
              <div className="space-y-1.5">
                {activeAgent.taskQueue.map((task, idx) => {
                  const catStyle = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.ANALYSIS;
                  const priStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.MEDIUM;
                  const isNextUp = idx === 0;

                  return (
                    <div
                      key={task.id}
                      className={`relative flex items-center justify-between p-2.5 rounded-lg border transition ${
                        isNextUp
                          ? 'bg-[#0a1324] border-cyan-600/70 shadow-[0_0_10px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                          : 'bg-[#080d19] border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Left indicator & sequence number */}
                      <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono-code font-bold shrink-0 ${
                          isNextUp
                            ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_6px_#22d3ee]'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {idx + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            {isNextUp && (
                              <span className="text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase">
                                NEXT UP
                              </span>
                            )}
                            <span className={`text-[9px] font-mono-code px-1.5 py-0.2 rounded border uppercase font-semibold ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                              {task.category}
                            </span>
                            <span className={`text-[9px] font-mono-code px-1.5 py-0.2 rounded border flex items-center gap-1 uppercase ${priStyle.bg}`}>
                              <span className={`w-1 h-1 rounded-full ${priStyle.dot}`} />
                              {task.priority}
                            </span>
                          </div>

                          <p className="text-xs font-mono-code text-slate-200 truncate">
                            {task.title}
                          </p>
                        </div>
                      </div>

                      {/* Right Meta & Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono-code text-slate-400 flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          <Clock className="w-2.5 h-2.5 text-slate-500" />
                          {task.estimatedDuration}
                        </span>

                        {/* Reorder and Delete controls */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => {
                              playTacticalBeep(650);
                              onMoveTask(activeAgent.id, idx, 'up');
                            }}
                            disabled={idx === 0}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-20 transition"
                            title="Prioritize (Move Up)"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => {
                              playTacticalBeep(650);
                              onMoveTask(activeAgent.id, idx, 'down');
                            }}
                            disabled={idx === activeAgent.taskQueue!.length - 1}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-20 transition"
                            title="De-prioritize (Move Down)"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => {
                              playTacticalBeep(500);
                              onDeleteTask(activeAgent.id, task.id);
                            }}
                            className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition"
                            title="Remove from queue"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#060a12] border border-dashed border-slate-800 text-center text-xs font-mono-code text-slate-500">
                No pending tasks in {activeAgent.name}'s queue. Click <strong>"ENQUEUE TASK"</strong> to add upcoming workflow actions.
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Mode 2: Multi-Agent Matrix View (Side-by-side all 4 agents) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {agents.map((ag) => {
            const isSelected = ag.id === activeAgent.id;
            const queueItems = ag.taskQueue || [];

            return (
              <div
                key={ag.id}
                onClick={() => {
                  playTacticalBeep(600);
                  onSelectAgent(ag.id);
                }}
                className={`p-2.5 rounded-lg border flex flex-col justify-between transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#091122] border-cyan-500/70 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-[#080d17] border-slate-800/80 hover:border-slate-700 hover:bg-[#0c1220]'
                }`}
              >
                <div>
                  {/* Agent Header */}
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{ag.avatarIcon}</span>
                      <span className="text-xs font-mono-code font-bold text-slate-200">{ag.name}</span>
                    </div>
                    <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/50">
                      {queueItems.length} queued
                    </span>
                  </div>

                  {/* Active Task */}
                  <div className="mb-2">
                    <div className="text-[9px] font-mono-code text-cyan-400 font-bold uppercase mb-0.5">
                      ACTIVE EXECUTION:
                    </div>
                    <p className="text-[11px] font-mono-code text-slate-200 line-clamp-2 bg-[#050810] p-1.5 rounded border border-slate-800/60">
                      {ag.currentTask || 'Idle'}
                    </p>
                  </div>

                  {/* Pending Next Items */}
                  <div className="space-y-1">
                    <div className="text-[9px] font-mono-code text-slate-400 font-bold uppercase">
                      NEXT UP:
                    </div>
                    {queueItems.slice(0, 2).map((qItem, idx) => (
                      <div
                        key={qItem.id}
                        className="text-[10px] font-mono-code text-slate-300 p-1 rounded bg-slate-900/60 border border-slate-800/60 flex items-center justify-between"
                      >
                        <span className="truncate pr-1">#{idx + 1} {qItem.title}</span>
                        <span className="text-[8px] text-slate-500 shrink-0">{qItem.estimatedDuration}</span>
                      </div>
                    ))}
                    {queueItems.length > 2 && (
                      <div className="text-[9px] font-mono-code text-cyan-400 text-center pt-0.5">
                        +{queueItems.length - 2} more pending...
                      </div>
                    )}
                    {queueItems.length === 0 && (
                      <div className="text-[10px] font-mono-code text-slate-600 italic">
                        Queue empty
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono-code text-slate-400">
                  <span>DESK #{ag.deskAssignment || 'NONE'}</span>
                  <span className="text-cyan-400 hover:underline">Select &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
