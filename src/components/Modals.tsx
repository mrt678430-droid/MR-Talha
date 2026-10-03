import React, { useState } from 'react';
import { 
  SystemMemoryNode, 
  SystemSkillsNode, 
  SystemSoulNode, 
  SystemSettingsNode 
} from '../types';
import { 
  X, 
  Database, 
  Zap, 
  Sparkles, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Check, 
  Volume2, 
  Layers, 
  ShieldCheck, 
  Sliders
} from 'lucide-react';
import { playSuccessChime, playTacticalBeep } from '../utils/audio';

interface ModalsProps {
  activeNodeModal: 'memory' | 'skills' | 'soul' | 'settings' | null;
  onClose: () => void;
  memory: SystemMemoryNode;
  onUpdateMemory: (newMem: SystemMemoryNode) => void;
  skills: SystemSkillsNode;
  onToggleSkill: (skillId: string) => void;
  soul: SystemSoulNode;
  onUpdateSoul: (newSoul: SystemSoulNode) => void;
  settings: SystemSettingsNode;
  onUpdateSettings: (newSettings: SystemSettingsNode) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  activeNodeModal,
  onClose,
  memory,
  onUpdateMemory,
  skills,
  onToggleSkill,
  soul,
  onUpdateSoul,
  settings,
  onUpdateSettings,
}) => {
  if (!activeNodeModal) return null;

  // New Memory Input State
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newVal.trim()) return;
    playSuccessChime();
    onUpdateMemory({
      ...memory,
      longTermKnowledge: [
        ...memory.longTermKnowledge,
        { key: newKey.trim(), val: newVal.trim(), timestamp: new Date().toISOString() },
      ],
      activeTokensCount: memory.activeTokensCount + 45,
    });
    setNewKey('');
    setNewVal('');
  };

  const handleDeleteMemory = (index: number) => {
    playTacticalBeep(500);
    const updated = [...memory.longTermKnowledge];
    updated.splice(index, 1);
    onUpdateMemory({
      ...memory,
      longTermKnowledge: updated,
      activeTokensCount: Math.max(0, memory.activeTokensCount - 45),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e1626] border border-cyan-500/40 rounded-xl max-w-2xl w-full p-5 shadow-[0_0_30px_rgba(6,182,212,0.15)] max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            {activeNodeModal === 'memory' && <Database className="w-5 h-5 text-cyan-400" />}
            {activeNodeModal === 'skills' && <Zap className="w-5 h-5 text-amber-400" />}
            {activeNodeModal === 'soul' && <Sparkles className="w-5 h-5 text-purple-400" />}
            {activeNodeModal === 'settings' && <SettingsIcon className="w-5 h-5 text-slate-400" />}

            <div>
              <h3 className="font-heading font-bold text-base text-slate-100 uppercase tracking-wider">
                SYSTEM NODE &bull; [{activeNodeModal.toUpperCase()}]
              </h3>
              <p className="text-xs font-mono-code text-slate-400">
                Stonic Core Architecture Component Module
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTacticalBeep(500);
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="py-4 overflow-y-auto flex-1 font-mono-code text-xs">
          
          {/* 1. MEMORY NODE */}
          {activeNodeModal === 'memory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#080d17] p-3 rounded border border-cyan-950">
                <div>
                  <span className="text-slate-400">ACTIVE CONTEXT TOKENS:</span>
                  <div className="text-base font-bold text-cyan-400">
                    {memory.activeTokensCount} / {memory.maxContextTokens} TOKENS
                  </div>
                </div>
                <div className="w-32 bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-cyan-400 h-full rounded-full" 
                    style={{ width: `${(memory.activeTokensCount / memory.maxContextTokens) * 100}%` }}
                  />
                </div>
              </div>

              {/* Long-term Knowledge Store */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  PERSISTENT LONG-TERM KNOWLEDGE BASE
                </h4>

                <div className="space-y-2 mb-3 max-h-44 overflow-y-auto">
                  {memory.longTermKnowledge.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                      <div>
                        <span className="font-bold text-cyan-300">{item.key}:</span>
                        <p className="text-slate-200 mt-0.5">{item.val}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMemory(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add knowledge entry */}
                <form onSubmit={handleAddMemory} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Key (e.g. Bullion_Standard)"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-1/3 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 1 Tola = 11.6638g)"
                    value={newVal}
                    onChange={(e) => setNewVal(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold"
                  >
                    ADD
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 2. SKILLS NODE */}
          {activeNodeModal === 'skills' && (
            <div className="space-y-3">
              <p className="text-slate-400 mb-2">
                Operational skill modules dispatched dynamically by the Hermes Master Router:
              </p>

              <div className="space-y-2">
                {skills.skillsList.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-amber-950"
                  >
                    <div className="pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{skill.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                          {skill.agentAssigned}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{skill.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        playTacticalBeep(700);
                        onToggleSkill(skill.id);
                      }}
                      className={`px-3 py-1 rounded font-bold transition ${
                        skill.enabled
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {skill.enabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SOUL NODE */}
          {activeNodeModal === 'soul' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1">HERMES CORE IDENTITY</label>
                <input
                  type="text"
                  value={soul.identity}
                  onChange={(e) => onUpdateSoul({ ...soul, identity: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-purple-300"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">TEMPERAMENT &amp; TONE</label>
                <select
                  value={soul.temperament}
                  onChange={(e) => onUpdateSoul({ ...soul, temperament: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="Tactical, Direct, Dashboard-Optimized">Tactical, Direct, Dashboard-Optimized (Default)</option>
                  <option value="Analytical & Research Focused">Analytical &amp; Research Focused</option>
                  <option value="High-Speed Autonomous Execution">High-Speed Autonomous Execution</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">CORE DIRECTIVE</label>
                <textarea
                  rows={3}
                  value={soul.coreDirective}
                  onChange={(e) => onUpdateSoul({ ...soul, coreDirective: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 resize-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">SAFETY ALIGNMENT</label>
                <input
                  type="text"
                  value={soul.safetyAlignment}
                  onChange={(e) => onUpdateSoul({ ...soul, safetyAlignment: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>
            </div>
          )}

          {/* 4. SETTINGS NODE */}
          {activeNodeModal === 'settings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Auto-run interval */}
                <div className="bg-[#080d17] p-3 rounded border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-400 font-bold">AUTO-RUN CYCLE SPEED</label>
                    <span className="text-cyan-400 font-bold">{settings.autoLoopInterval}s</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    value={settings.autoLoopInterval}
                    onChange={(e) => onUpdateSettings({ ...settings, autoLoopInterval: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Frequency of autonomous agent loop triggers</span>
                </div>

                {/* Temperature */}
                <div className="bg-[#080d17] p-3 rounded border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-400 font-bold">TEMPERATURE (CREATIVITY)</label>
                    <span className="text-amber-400 font-bold">{settings.temperature ?? 0.2}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round((settings.temperature ?? 0.2) * 100)}
                    onChange={(e) => onUpdateSettings({ ...settings, temperature: parseFloat((parseInt(e.target.value) / 100).toFixed(2)) })}
                    className="w-full accent-amber-400"
                  />
                  <span className="text-[10px] text-slate-500">Lower = deterministic precision, Higher = speculative reasoning</span>
                </div>
              </div>

              {/* Gemini Orchestration Model */}
              <div className="bg-[#080d17] p-3 rounded border border-slate-800">
                <label className="text-slate-400 font-bold block mb-1">GEMINI ORCHESTRATION MODEL</label>
                <select
                  value={settings.modelName}
                  onChange={(e) => onUpdateSettings({ ...settings, modelName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-cyan-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (High Availability &amp; Low Latency - Default)</option>
                  <option value="gemini-3.7-flash">gemini-3.7-flash (Deep Reasoning &amp; Complex Orchestration)</option>
                  <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite (Ultra-Lightweight Speed)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Advanced Multi-Agent Frontier)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Multi-tier cascade router handles token rate limits and failovers automatically.</p>
              </div>

              {/* Latency & Reasoning Profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#080d17] p-3 rounded border border-slate-800">
                  <label className="text-slate-400 font-bold block mb-1">LATENCY PROFILE</label>
                  <select
                    value={settings.latencyProfile || 'ultra-low-latency'}
                    onChange={(e) => onUpdateSettings({ ...settings, latencyProfile: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="ultra-low-latency">Ultra-Low-Latency (Fast sub-agent dispatches)</option>
                    <option value="balanced">Balanced (Optimal throughput and depth)</option>
                    <option value="deep-reasoning">Deep Reasoning (Exhaustive chain-of-thought)</option>
                  </select>
                </div>

                <div className="bg-[#080d17] p-3 rounded border border-slate-800">
                  <label className="text-slate-400 font-bold block mb-1">REASONING EFFORT</label>
                  <select
                    value={settings.reasoningEffort || 'low'}
                    onChange={(e) => onUpdateSettings({ ...settings, reasoningEffort: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="low">Low (Fast stream execution)</option>
                    <option value="medium">Medium (Detailed decomposition)</option>
                    <option value="high">High (Maximum verification passes)</option>
                  </select>
                </div>
              </div>

              {/* Toggles: TTS, Auto-Healing, Debug Payloads */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200">TTS SPEECH SYNTHESIS</span>
                    <p className="text-[11px] text-slate-400">Play spoken tactical status audio on sub-agent dispatches</p>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ ...settings, ttsVoiceEnabled: !settings.ttsVoiceEnabled })}
                    className={`px-3 py-1 rounded font-bold transition ${
                      settings.ttsVoiceEnabled ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {settings.ttsVoiceEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200">AUTO-HEALING AGENT SUBSYSTEM</span>
                    <p className="text-[11px] text-slate-400">Automatically re-route stalled tasks to idle agents</p>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ ...settings, autoHealing: !(settings.autoHealing ?? true) })}
                    className={`px-3 py-1 rounded font-bold transition ${
                      (settings.autoHealing ?? true) ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {(settings.autoHealing ?? true) ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-slate-200">RAW CONSOLE TELEMETRY PAYLOADS</span>
                    <p className="text-[11px] text-slate-400">Show full JSON payloads and memory addresses in right console</p>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ ...settings, debugPayloadsVisible: !(settings.debugPayloadsVisible ?? true) })}
                    className={`px-3 py-1 rounded font-bold transition ${
                      (settings.debugPayloadsVisible ?? true) ? 'bg-purple-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {(settings.debugPayloadsVisible ?? true) ? 'EXPANDED' : 'COLLAPSED'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={() => {
              playSuccessChime();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-mono-code font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg shadow-sm transition"
          >
            CONFIRM &amp; CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
