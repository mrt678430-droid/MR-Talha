export type AgentName = 
  | 'Alice'
  | 'Bob'
  | 'Carol'
  | 'Dave'
  | 'Oliver' 
  | 'Sam' 
  | 'Sarah' 
  | 'Cipher'
  | 'Aria'
  | 'Vortex'
  | 'Echo'
  | 'Nyx'
  | 'Atlas'
  | 'Chronos'
  | 'Nexus'
  | 'Kira'
  | 'Helios'
  | 'Sentry'
  | 'Iris'
  | 'Vega'
  | 'Orion'
  | 'Zephyr'
  | 'Titan';

export type ThemeType = 'cyan' | 'crimson' | 'emerald';

export type AIProvider = 'gemini' | 'openai' | 'claude' | 'chatgpt';

export interface AIConnectionConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  isConnected: boolean;
  isChatGptPlus: boolean;
  monthlyTokensUsed: number;
  monthlyTokenLimit: number;
  latencyMs: number;
  lastPing: string;
}

export interface WorldHotspot {
  id: string;
  title: string;
  category: 'GEOPOLITICAL' | 'TECH' | 'MARKETS' | 'DEFENSE' | 'CLIMATE';
  city: string;
  country: string;
  lat: number;
  lng: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  newsSummary: string;
  source: string;
  timestamp: string;
  activeSensors: number;
  telemetry: {
    temperatureC?: number;
    radiationUsv?: number;
    rfActivity?: string;
    satellitePass?: string;
  };
}

export interface DesktopProcessItem {
  pid: number;
  name: string;
  type: 'AI_AGENT' | 'SYSTEM' | 'NETWORK' | 'FILE_IO' | 'BACKGROUND';
  cpuPercent: number;
  memoryMb: number;
  status: 'RUNNING' | 'SLEEPING' | 'BOOSTED' | 'PAUSED';
  uptimeSec: number;
  command: string;
}

export interface DesktopAppItem {
  id: string;
  name: string;
  icon: string;
  category: 'PRODUCTIVITY' | 'TERMINAL' | 'ANALYSIS' | 'MEDIA' | 'SETTINGS';
  description: string;
  path: string;
  isFavorite: boolean;
}

export interface SystemTelemetry {
  cpuUsage: number;
  ramUsage: number;
  totalRamGb: number;
  meshLatencyMs: number;
  networkRxKbps: number;
  networkTxKbps: number;
  diskIoMb: number;
  activeProcessesCount: number;
  uptimeSeconds: number;
}

export type AgentActionState = 'THINKING' | 'EXECUTING' | 'IDLE';

export interface AgentTaskItem {
  id: string;
  title: string;
  category: 'SCRAPER' | 'ANALYSIS' | 'SURVEILLANCE' | 'STORAGE' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedDuration: string; // e.g. "4s", "8s"
  status: 'IN_PROGRESS' | 'PENDING' | 'COMPLETED';
  addedAt?: string;
}

export interface PixelAgent {
  id: AgentName;
  name: string;
  role: string;
  specialty: string;
  color: string;
  avatarIcon: string;
  deskAssignment: number; // 1 to 7
  actionState: AgentActionState;
  currentTask: string;
  ttsResponse: string;
  x: number; // grid coordinate or %
  y: number;
  targetDesk: number;
  speechBubbleTimer?: number;
  taskQueue?: AgentTaskItem[];
}

export interface Desk {
  id: number;
  label: string;
  occupiedBy: AgentName | null;
  x: number;
  y: number;
  type: 'terminal' | 'workbench' | 'command' | 'research';
}

export interface GoldPuritySummary {
  '24k_tola_pkr': number;
  '22k_tola_pkr': number;
  '21k_tola_pkr': number;
  '18k_tola_pkr': number;
  '24k_10g_pkr': number;
  '24k_gram_pkr': number;
  '22k_gram_pkr': number;
  '24k_ounce_pkr': number;
  'usd_pkr_interbank': number;
  'usd_pkr_open_market': number;
  lastUpdated: string;
  change24h: number;
}

export interface ScraperLog {
  id: string;
  timestamp: string;
  regexPattern: string;
  matchedItems: number;
  source: string;
  status: 'SUCCESS' | 'PARSING' | 'FAILED';
  durationMs: number;
}

export interface ThreatMarker {
  id: string;
  title: string;
  region: string;
  lat: number;
  lng: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'RESOLVING' | 'MONITORED';
  details: string;
  timestamp: string;
}

export interface SatFeed {
  id: string;
  name: string;
  orbit: string;
  bandwidth: string;
  resolution: string;
  status: 'ONLINE' | 'STANDBY' | 'CALIBRATING';
  mode: 'OPTICAL' | 'INFRARED' | 'SAR_RADAR' | 'SPECTROMETRY';
  coverageArea: string;
  signalStrength: number; // 0 - 100
}

export interface NewsHeadline {
  id: string;
  category: 'TECH' | 'MARKETS' | 'DEFENSE' | 'COMMODITIES';
  headline: string;
  source: string;
  timeAgo: string;
  urgency: 'HIGH' | 'MEDIUM' | 'NORMAL';
}

export interface VirtualFile {
  id: string;
  name: string;
  path: string;
  extension: 'md' | 'json' | 'txt' | 'py';
  content: string;
  bytesWritten: number;
  lastModified: string;
  authorAgent: AgentName | 'Hermes';
  lint: {
    status: 'passed' | 'skipped' | 'warning';
    details?: string;
  };
}

export interface ConsoleLogEntry {
  id: string;
  timestamp: string;
  agent: 'Hermes' | 'Agent_Town_Orchestrator' | 'Data_Scraper_Gold_Calc' | 'SatLink_Stream_Agent' | 'File_System_Agent';
  status: 'SUCCESS' | 'EXECUTING' | 'QUEUED' | 'ERROR';
  duration_seconds: number;
  message: string;
  payload?: Record<string, any>;
}

export interface SystemMemoryNode {
  shortTermContext: string[];
  longTermKnowledge: { key: string; val: string; timestamp: string }[];
  activeTokensCount: number;
  maxContextTokens: number;
}

export interface SystemSkillsNode {
  skillsList: {
    id: string;
    name: string;
    description: string;
    agentAssigned: AgentName;
    enabled: boolean;
  }[];
}

export interface SystemSoulNode {
  identity: string;
  temperament: string;
  coreDirective: string;
  creativityLevel: number;
  safetyAlignment: string;
}

export interface SystemSettingsNode {
  autoLoopInterval: number; // seconds
  ttsVoiceEnabled: boolean;
  audioFeedbackVolume: number;
  modelName: string;
  themeMode: 'cyber-dark' | 'tactical-slate';
  temperature: number; // 0.0 to 1.0
  maxOutputTokens: number; // e.g. 2048, 4096, 8192
  reasoningEffort: 'low' | 'medium' | 'high';
  autoHealing: boolean; // auto-recover failed sub-agents
  latencyProfile: 'ultra-low-latency' | 'balanced' | 'deep-reasoning';
  debugPayloadsVisible: boolean;
  soundPack: 'tactical-beeps' | 'ambient-synth' | 'silent';
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  agentName?: AgentName | string;
  agentIcon?: string;
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  duration?: number; // duration in ms, default 5000
  actionLabel?: string;
  actionPayload?: any;
}

export interface HermesExecutionPlan {
  command: string;
  intentSummary: string;
  delegations: {
    agentTown?: {
      active_agent: AgentName;
      desk_assignment: number;
      action_state: AgentActionState;
      tts_response: string;
    };
    goldCalculator?: {
      status: string;
      tables_parsed: number;
      gold_purity_summary: Partial<GoldPuritySummary>;
      duration_seconds: number;
      reportSummary: string;
    };
    satLink?: {
      stream_status: 'ONLINE' | 'OFFLINE';
      sat_feed_id: string;
      threat_markers_active: number;
      top_headlines: string[];
      geoNotes: string;
    };
    fileSystem?: {
      bytes_written: number;
      dirs_created: boolean;
      lint: { status: 'skipped' | 'passed' };
      resolved_path: string;
      files_modified: string[];
      fileContentToCreate?: {
        name: string;
        content: string;
        author: AgentName | 'Hermes';
      };
    };
  };
  hermesLog: {
    status: 'success' | 'partial' | 'error';
    output: string;
    duration_seconds: number;
  };
}

export interface OmniTaskAction {
  type: 
    | 'NAVIGATE' 
    | 'SET_THEME' 
    | 'DRAGON_COMMAND' 
    | 'DISPATCH_HERMES' 
    | 'QUERY_CRYPTO_DOLLAR' 
    | 'READ_FILE'
    | 'TRIGGER_VOICE_ALERT';
  label: string;
  payload: any;
  executed?: boolean;
}

export interface OmniChatMessage {
  id: string;
  sender: 'user' | 'gem';
  text: string;
  timestamp: string;
  taskAction?: OmniTaskAction;
  isVoiceSpoken?: boolean;
}

export interface CryptoMarketData {
  btcUsd: number;
  btcPkr: number;
  btcChange24h: number;
  btcHigh24h: number;
  btcLow24h: number;
  btcVolume24h: string;
  usdPkrInterbank: number;
  usdPkrOpenMarket: number;
  usdChange24h: number;
  dxyIndex: number;
  marketFearGreed: number;
  sentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  lastUpdated: string;
}

export interface ChatShowComment {
  id: string;
  speaker: string;
  role: string;
  avatar: string;
  text: string;
  timestamp: string;
  badge?: string;
  badgeColor?: string;
  isHost?: boolean;
}

export interface FemaleVoicePersona {
  id: string;
  name: string;
  title: string;
  description: string;
  pitch: number;
  rate: number;
  avatar: string;
  accent: string;
}

