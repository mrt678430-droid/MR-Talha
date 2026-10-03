import { PixelAgent, Desk } from '../types';

export const INITIAL_AGENTS_ROSTER: PixelAgent[] = [
  // Core 4 Primary Desk Agents
  {
    id: 'Alice',
    name: 'Alice',
    role: 'Lead Researcher & Knowledge Architect',
    specialty: 'Virtual File System, Document Synthesis & Long-Term Memory',
    color: '#818cf8',
    avatarIcon: '👩‍🔬',
    deskAssignment: 2,
    actionState: 'IDLE',
    currentTask: 'Synthesizing market research & memory node index',
    ttsResponse: 'Alice ready. Research knowledge buffer mounted and synchronized.',
    x: 25,
    y: 50,
    targetDesk: 2,
    taskQueue: [
      { id: 't-al-1', title: 'Synthesize Markdown intelligence brief for intraday bullion spread', category: 'STORAGE', priority: 'HIGH', estimatedDuration: '4s', status: 'PENDING', addedAt: '08:12:00' },
      { id: 't-al-2', title: 'Validate schema consistency across Stonic Data memory stores', category: 'SYSTEM', priority: 'MEDIUM', estimatedDuration: '6s', status: 'PENDING', addedAt: '08:12:05' },
      { id: 't-al-3', title: 'Index short-term conversation context into vector embeddings', category: 'ANALYSIS', priority: 'LOW', estimatedDuration: '10s', status: 'PENDING', addedAt: '08:12:10' }
    ]
  },
  {
    id: 'Bob',
    name: 'Bob',
    role: 'Code & Financial Scraper Specialist',
    specialty: 'Python bs4 Scraper, Regex Parser & Currency Conversion Engine',
    color: '#f59e0b',
    avatarIcon: '👨‍💻',
    deskAssignment: 3,
    actionState: 'EXECUTING',
    currentTask: 'Scraping Karachi & Lahore bullion exchange spot rates in PKR',
    ttsResponse: 'Bob executing high-frequency python scraper across market feeds.',
    x: 40,
    y: 50,
    targetDesk: 3,
    taskQueue: [
      { id: 't-bb-1', title: 'Parse Karachi 24K, 22K, 21K, 18K per Tola rates in PKR', category: 'SCRAPER', priority: 'CRITICAL', estimatedDuration: '5s', status: 'PENDING', addedAt: '08:12:00' },
      { id: 't-bb-2', title: 'Compute USD/PKR interbank vs open market arbitrage spreads', category: 'ANALYSIS', priority: 'HIGH', estimatedDuration: '8s', status: 'PENDING', addedAt: '08:12:04' },
      { id: 't-bb-3', title: 'Validate AST tree of dynamically generated Python scripts', category: 'SYSTEM', priority: 'MEDIUM', estimatedDuration: '12s', status: 'PENDING', addedAt: '08:12:12' }
    ]
  },
  {
    id: 'Carol',
    name: 'Carol',
    role: 'Threat Recon & Geospatial Radar',
    specialty: 'SAR Radar, 3D Globe Hotspots & Orbital Telemetry',
    color: '#06b6d4',
    avatarIcon: '👩‍🚀',
    deskAssignment: 5,
    actionState: 'IDLE',
    currentTask: 'Monitoring 3D World Globe hotspots & GEO-PK-09 radar stream',
    ttsResponse: 'Carol tracking orbital telemetry and global news radar.',
    x: 70,
    y: 50,
    targetDesk: 5,
    taskQueue: [
      { id: 't-cr-1', title: 'Multispectral SAR radar sweep across strategic maritime corridors', category: 'SURVEILLANCE', priority: 'HIGH', estimatedDuration: '6s', status: 'PENDING', addedAt: '08:12:00' },
      { id: 't-cr-2', title: 'Triangulate breaking geopolitical hotspot telemetry & risk score', category: 'ANALYSIS', priority: 'CRITICAL', estimatedDuration: '9s', status: 'PENDING', addedAt: '08:12:08' },
      { id: 't-cr-3', title: 'Sync SAT-USA-04 orbital downlink bandwidth and optical sensors', category: 'SYSTEM', priority: 'LOW', estimatedDuration: '15s', status: 'PENDING', addedAt: '08:12:15' }
    ]
  },
  {
    id: 'Dave',
    name: 'Dave',
    role: 'DevOps & System Automation Copilot',
    specialty: 'Desktop Process Control, Heartbeat Diagnostics & File Automation',
    color: '#10b981',
    avatarIcon: '👨‍🔧',
    deskAssignment: 7,
    actionState: 'IDLE',
    currentTask: 'Monitoring system processes, CPU/RAM telemetry & mesh RPC',
    ttsResponse: 'Dave monitoring desktop automation and system heartbeats. Systems nominal.',
    x: 95,
    y: 50,
    targetDesk: 7,
    taskQueue: [
      { id: 't-dv-1', title: 'Audit background daemon process CPU/RAM load and memory buffers', category: 'SYSTEM', priority: 'MEDIUM', estimatedDuration: '4s', status: 'PENDING', addedAt: '08:12:00' },
      { id: 't-dv-2', title: 'Execute desktop file backup & auto-recovery circuit health check', category: 'ANALYSIS', priority: 'HIGH', estimatedDuration: '7s', status: 'PENDING', addedAt: '08:12:06' },
      { id: 't-dv-3', title: 'Run garbage collection on transient IPC event streams', category: 'SYSTEM', priority: 'LOW', estimatedDuration: '10s', status: 'PENDING', addedAt: '08:12:14' }
    ]
  },

  // 16 Additional Specialized Agents (Total 20 Agents)
  {
    id: 'Cipher',
    name: 'Cipher',
    role: 'Cryptographic Security & Audit',
    specialty: 'Quantum-Resistant Encryption & Key Rotation',
    color: '#ec4899',
    avatarIcon: '🔐',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Verifying end-to-end TLS 1.3 handshakes and token signatures',
    ttsResponse: 'Cipher online. Zero cryptographic vulnerabilities found.',
    x: 10,
    y: 20,
    targetDesk: 0,
    taskQueue: [
      { id: 't-cp-1', title: 'Audit JWT token signatures and rotate AES-256 session keys', category: 'SYSTEM', priority: 'CRITICAL', estimatedDuration: '3s', status: 'PENDING', addedAt: '08:15:00' },
      { id: 't-cp-2', title: 'Inspect memory buffers for credential leakage in runtime logs', category: 'SURVEILLANCE', priority: 'HIGH', estimatedDuration: '5s', status: 'PENDING', addedAt: '08:15:10' }
    ]
  },
  {
    id: 'Aria',
    name: 'Aria',
    role: 'Acoustic & Voice Synthesis',
    specialty: 'Natural TTS Modulation & Realtime Audio DSP',
    color: '#a855f7',
    avatarIcon: '🎙️',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Synthesizing tactical speech wave tables',
    ttsResponse: 'Aria audio processor online and calibrated.',
    x: 20,
    y: 20,
    targetDesk: 0,
    taskQueue: [
      { id: 't-ar-1', title: 'Generate speech audio buffers for high-priority sat alerts', category: 'SYSTEM', priority: 'HIGH', estimatedDuration: '2s', status: 'PENDING', addedAt: '08:15:00' },
      { id: 't-ar-2', title: 'Filter ambient noise and synthesize multi-pitch feedback chimes', category: 'SYSTEM', priority: 'LOW', estimatedDuration: '4s', status: 'PENDING', addedAt: '08:15:20' }
    ]
  },
  {
    id: 'Vortex',
    name: 'Vortex',
    role: 'High-Frequency Market Arbitrage',
    specialty: 'Cross-Exchange Gold & FX Spreads Engine',
    color: '#eab308',
    avatarIcon: '⚡',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Computing millisecond interbank arbitrage deltas',
    ttsResponse: 'Vortex engine tracking market liquidity imbalances.',
    x: 35,
    y: 20,
    targetDesk: 0,
    taskQueue: [
      { id: 't-vx-1', title: 'Simulate cross-market bullion triangular arbitrage pipeline', category: 'ANALYSIS', priority: 'CRITICAL', estimatedDuration: '4s', status: 'PENDING', addedAt: '08:16:00' },
      { id: 't-vx-2', title: 'Forecast intraday gold support/resistance pivot thresholds', category: 'ANALYSIS', priority: 'HIGH', estimatedDuration: '6s', status: 'PENDING', addedAt: '08:16:15' }
    ]
  },
  {
    id: 'Echo',
    name: 'Echo',
    role: 'Distributed Network Telemetry',
    specialty: 'Socket Handshakes, Packet Latency & Mesh Pings',
    color: '#14b8a6',
    avatarIcon: '📡',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Pinging global edge nodes across 12 availability zones',
    ttsResponse: 'Echo ping matrix optimal. 0.03ms jitter detected.',
    x: 50,
    y: 20,
    targetDesk: 0,
    taskQueue: [
      { id: 't-ec-1', title: 'Perform traceroute analysis across regional proxy relays', category: 'SYSTEM', priority: 'MEDIUM', estimatedDuration: '5s', status: 'PENDING', addedAt: '08:16:00' }
    ]
  },
  {
    id: 'Nyx',
    name: 'Nyx',
    role: 'Threat Intelligence & Darknet Recon',
    specialty: 'Zero-Day Vulnerability Scanning & IP Blacklisting',
    color: '#8b5cf6',
    avatarIcon: '🕵️',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Scouring public CVE feeds and blacklisting malicious CIDR ranges',
    ttsResponse: 'Nyx monitoring perimeter traffic. No incursions reported.',
    x: 65,
    y: 20,
    targetDesk: 0,
    taskQueue: [
      { id: 't-nx-1', title: 'Correlate anomalous request headers with global attack signatures', category: 'SURVEILLANCE', priority: 'CRITICAL', estimatedDuration: '7s', status: 'PENDING', addedAt: '08:17:00' },
      { id: 't-nx-2', title: 'Generate firewall IP drop list for unverified user-agents', category: 'SYSTEM', priority: 'HIGH', estimatedDuration: '3s', status: 'PENDING', addedAt: '08:17:20' }
    ]
  },
  {
    id: 'Atlas',
    name: 'Atlas',
    role: 'Geospatial Cartography & GIS',
    specialty: '3D Elevation, Terrain Vectoring & Coordinate Meshes',
    color: '#3b82f6',
    avatarIcon: '🗺️',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Rendering topographic geo-tiles for South Asia corridor',
    ttsResponse: 'Atlas spatial coordinates locked and calibrated.',
    x: 80,
    y: 20,
    targetDesk: 0,
    taskQueue: [
      { id: 't-at-1', title: 'Re-project satellite GeoJSON coordinates to WGS-84 grid', category: 'SURVEILLANCE', priority: 'MEDIUM', estimatedDuration: '5s', status: 'PENDING', addedAt: '08:17:00' }
    ]
  },
  {
    id: 'Chronos',
    name: 'Chronos',
    role: 'Temporal Log & Time-Series Engine',
    specialty: 'Historical Rate Aggregation & Predictive Trending',
    color: '#f97316',
    avatarIcon: '⏳',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Backtesting 30-day bullion momentum against inflation indices',
    ttsResponse: 'Chronos temporal engine indexing 7-year gold trend lines.',
    x: 10,
    y: 80,
    targetDesk: 0,
    taskQueue: [
      { id: 't-ch-1', title: 'Build 10-year rolling volatility index for Karachi bullion', category: 'ANALYSIS', priority: 'HIGH', estimatedDuration: '8s', status: 'PENDING', addedAt: '08:18:00' }
    ]
  },
  {
    id: 'Nexus',
    name: 'Nexus',
    role: 'GraphQL & Inter-Agent RPC Broker',
    specialty: 'High-Concurrency Message Bus & Schema Serialization',
    color: '#0284c7',
    avatarIcon: '🔗',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Routing asynchronous RPC calls between sub-agent processes',
    ttsResponse: 'Nexus bus streaming at 45,000 operations per second.',
    x: 25,
    y: 80,
    targetDesk: 0,
    taskQueue: [
      { id: 't-nx-1', title: 'Serialize multi-agent shared state into immutable JSON binary', category: 'SYSTEM', priority: 'MEDIUM', estimatedDuration: '3s', status: 'PENDING', addedAt: '08:18:00' }
    ]
  },
  {
    id: 'Kira',
    name: 'Kira',
    role: 'AST Code Compiler & Linter',
    specialty: 'TypeScript AST Transformation & Static Type Checking',
    color: '#10b981',
    avatarIcon: '⚙️',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Validating TypeScript AST and running tsc compile checks',
    ttsResponse: 'Kira compiler active. Zero syntax errors detected.',
    x: 40,
    y: 80,
    targetDesk: 0,
    taskQueue: [
      { id: 't-kr-1', title: 'Run TypeScript compiler and produce zero-defect build bundle', category: 'SYSTEM', priority: 'HIGH', estimatedDuration: '4s', status: 'PENDING', addedAt: '08:19:00' }
    ]
  },
  {
    id: 'Helios',
    name: 'Helios',
    role: 'Solar & Space Weather Telemetry',
    specialty: 'Coronal Mass Ejection & Magnetosphere Tracking',
    color: '#f59e0b',
    avatarIcon: '☀️',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Tracking geomagnetic solar flares and ionosphere refraction',
    ttsResponse: 'Helios solar telemetry nominal. K-index at 2 (calm).',
    x: 55,
    y: 80,
    targetDesk: 0,
    taskQueue: [
      { id: 't-hl-1', title: 'Scan NOAA solar flux indices and adjust satellite transmission power', category: 'SURVEILLANCE', priority: 'MEDIUM', estimatedDuration: '6s', status: 'PENDING', addedAt: '08:19:00' }
    ]
  },
  {
    id: 'Sentry',
    name: 'Sentry',
    role: 'Infrastructure Health & Failover',
    specialty: 'Container Auto-Recovery & Circuit Breaker Logic',
    color: '#ef4444',
    avatarIcon: '🛡️',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Monitoring Cloud Run memory limits and pod auto-scaling',
    ttsResponse: 'Sentry health checks passing. Cluster status: GREEN.',
    x: 70,
    y: 80,
    targetDesk: 0,
    taskQueue: [
      { id: 't-st-1', title: 'Test automated failover fallback routes for Gemini API tiers', category: 'SYSTEM', priority: 'CRITICAL', estimatedDuration: '3s', status: 'PENDING', addedAt: '08:20:00' }
    ]
  },
  {
    id: 'Iris',
    name: 'Iris',
    role: 'Computer Vision & Optical OCR',
    specialty: 'Thermal Imaging, Document OCR & Chart Digitization',
    color: '#06b6d4',
    avatarIcon: '👁️',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Extracting price tables from scanned bullion market receipts',
    ttsResponse: 'Iris optical recognition processing image inputs.',
    x: 85,
    y: 80,
    targetDesk: 0,
    taskQueue: [
      { id: 't-ir-1', title: 'Perform OCR over Urdu & English newspaper bullion price tables', category: 'SCRAPER', priority: 'HIGH', estimatedDuration: '5s', status: 'PENDING', addedAt: '08:20:00' }
    ]
  },
  {
    id: 'Vega',
    name: 'Vega',
    role: 'Deep Learning Embedding Engine',
    specialty: 'Vector Embeddings, RAG Cosine Search & Semantic Memory',
    color: '#6366f1',
    avatarIcon: '🧠',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Indexing short-term conversation context into 768-dim vector store',
    ttsResponse: 'Vega vector store updated with latest memory embeddings.',
    x: 15,
    y: 35,
    targetDesk: 0,
    taskQueue: [
      { id: 't-vg-1', title: 'Execute cosine similarity search on user query history', category: 'ANALYSIS', priority: 'MEDIUM', estimatedDuration: '3s', status: 'PENDING', addedAt: '08:21:00' }
    ]
  },
  {
    id: 'Orion',
    name: 'Orion',
    role: 'Strategic Warfare & Maritime Analyst',
    specialty: 'Naval Chokepoint Tracking & Maritime AIS Feeds',
    color: '#0ea5e9',
    avatarIcon: '⚓',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Triangulating tanker transponders in the Arabian Sea & Hormuz',
    ttsResponse: 'Orion naval telemetry online. 182 vessels tracked.',
    x: 35,
    y: 35,
    targetDesk: 0,
    taskQueue: [
      { id: 't-or-1', title: 'Detect AIS transponder spoofing along strategic trade routes', category: 'SURVEILLANCE', priority: 'HIGH', estimatedDuration: '6s', status: 'PENDING', addedAt: '08:21:00' }
    ]
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    role: 'Atmospheric & Climate Intelligence',
    specialty: 'Severe Weather Radar, Jet Stream & Monsoonal Forecasting',
    color: '#38bdf8',
    avatarIcon: '🌪️',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Processing Doppler weather radar sweeps across coastal stations',
    ttsResponse: 'Zephyr meteorological models calibrated and live.',
    x: 65,
    y: 35,
    targetDesk: 0,
    taskQueue: [
      { id: 't-zp-1', title: 'Correlate monsoon rain patterns with regional logistics delays', category: 'ANALYSIS', priority: 'LOW', estimatedDuration: '7s', status: 'PENDING', addedAt: '08:22:00' }
    ]
  },
  {
    id: 'Titan',
    name: 'Titan',
    role: 'Database Sharding & Data Warehouse',
    specialty: 'PostgreSQL Partitioning, Parquet Compression & Cold Storage',
    color: '#64748b',
    avatarIcon: '🏛️',
    deskAssignment: 0,
    actionState: 'IDLE',
    currentTask: 'Compressing intraday tick data into Snappy Parquet archives',
    ttsResponse: 'Titan storage warehouse online with 99.999% retention.',
    x: 85,
    y: 35,
    targetDesk: 0,
    taskQueue: [
      { id: 't-tt-1', title: 'Archive raw scraper HTML dumps into cold storage partitions', category: 'STORAGE', priority: 'LOW', estimatedDuration: '8s', status: 'PENDING', addedAt: '08:22:00' }
    ]
  }
];

export const INITIAL_DESKS: Desk[] = [
  { id: 1, label: 'Station 01', occupiedBy: null, x: 10, y: 50, type: 'terminal' },
  { id: 2, label: 'Station 02 (Alice)', occupiedBy: 'Alice', x: 25, y: 50, type: 'workbench' },
  { id: 3, label: 'Station 03 (Bob)', occupiedBy: 'Bob', x: 40, y: 50, type: 'command' },
  { id: 4, label: 'Station 04', occupiedBy: null, x: 55, y: 50, type: 'terminal' },
  { id: 5, label: 'Station 05 (Carol)', occupiedBy: 'Carol', x: 70, y: 50, type: 'research' },
  { id: 6, label: 'Station 06', occupiedBy: null, x: 85, y: 50, type: 'terminal' },
  { id: 7, label: 'Station 07 (Dave)', occupiedBy: 'Dave', x: 95, y: 50, type: 'command' },
];

export const COMMAND_PRESETS = [
  {
    id: 'cmd-1',
    category: 'FINANCE',
    title: 'Scrape Karachi & Lahore Bullion Rates',
    command: 'Scrape live gold bullion rates (24K, 22K, 21K, 18K per Tola/Gram in PKR) and USD/PKR interbank rates, then write a structured market brief.',
    agent: 'Bob' as const,
    icon: '📈'
  },
  {
    id: 'cmd-2',
    category: 'SURVEILLANCE',
    title: 'SAR Radar Sweep & Threat Telemetry',
    command: 'Activate Sat-Link GEO-PK-09 stream, monitor threat markers across strategic sectors, and ingest breaking tech headlines.',
    agent: 'Carol' as const,
    icon: '🛰️'
  },
  {
    id: 'cmd-3',
    category: 'INFRASTRUCTURE',
    title: 'Rebalance Agent Seating & Heartbeat Ping',
    command: 'Reassign Agent Town avatars: Alice to Research, Bob to Python Scraper, Carol to Geospatial Radar, Dave to Log Heartbeats.',
    agent: 'Dave' as const,
    icon: '💻'
  },
  {
    id: 'cmd-4',
    category: 'SECURITY',
    title: 'Quantum Key Rotation & Token Audit',
    command: 'Task Cipher to execute key rotation and verify memory buffers for zero credential leakage.',
    agent: 'Cipher' as const,
    icon: '🔐'
  },
  {
    id: 'cmd-5',
    category: 'FINANCE',
    title: 'Triangular Gold Arbitrage Engine',
    command: 'Task Vortex to compute millisecond triangular arbitrage spreads between Karachi and Dubai gold spot rates.',
    agent: 'Vortex' as const,
    icon: '⚡'
  },
  {
    id: 'cmd-6',
    category: 'RESEARCH',
    title: 'Compile Stonic Data Archive & Report',
    command: 'Compile full intelligence report with live bullion pricing, orbital feeds, and agent state into C:\\Users\\Admin\\Stonic Data\\.',
    agent: 'Alice' as const,
    icon: '📁'
  },
  {
    id: 'cmd-7',
    category: 'INFRASTRUCTURE',
    title: 'Global Edge Node Ping & Jitter Sweep',
    command: 'Task Echo to ping 12 global availability zones and optimize mesh packet routing latency.',
    agent: 'Echo' as const,
    icon: '📡'
  },
  {
    id: 'cmd-8',
    category: 'SECURITY',
    title: 'Darknet CVE Scan & Firewall Drop List',
    command: 'Task Nyx to correlate anomalous request headers and generate a firewall IP drop list.',
    agent: 'Nyx' as const,
    icon: '🛡️'
  },
  {
    id: 'cmd-9',
    category: 'SURVEILLANCE',
    title: 'GIS Topographic Vector Elevation Map',
    command: 'Task Atlas to render 3D terrain elevation layers across northern strategic transit corridors.',
    agent: 'Atlas' as const,
    icon: '🗺️'
  },
  {
    id: 'cmd-10',
    category: 'RESEARCH',
    title: '7-Year Historic Gold Inflation Volatility',
    command: 'Task Chronos to analyze historical bullion cycles during monetary devaluations.',
    agent: 'Chronos' as const,
    icon: '⏳'
  },
  {
    id: 'cmd-11',
    category: 'INFRASTRUCTURE',
    title: 'High-Concurrency RPC Message Bus Sweep',
    command: 'Task Nexus to flush message queues and balance inter-agent event subscriptions.',
    agent: 'Nexus' as const,
    icon: '🔀'
  },
  {
    id: 'cmd-12',
    category: 'RESEARCH',
    title: 'AST TypeScript Code & Lint Verification',
    command: 'Task Kira to parse codebase AST nodes and generate static verification telemetry.',
    agent: 'Kira' as const,
    icon: '⚙️'
  },
  {
    id: 'cmd-13',
    category: 'SURVEILLANCE',
    title: 'Space Weather & Solar Flare Refraction',
    command: 'Task Helios to monitor geomagnetic storms and radio communication blackout indexes.',
    agent: 'Helios' as const,
    icon: '☀️'
  },
  {
    id: 'cmd-14',
    category: 'INFRASTRUCTURE',
    title: 'Container Pod Health & Auto-Failover',
    command: 'Task Sentry to run Kubernetes daemon checks and initiate auto-healing test triggers.',
    agent: 'Sentry' as const,
    icon: '🚨'
  },
  {
    id: 'cmd-15',
    category: 'RESEARCH',
    title: 'Optical Receipt OCR & Ledger Extraction',
    command: 'Task Iris to ingest scanned bullion bazaar receipts and output clean JSON invoice structs.',
    agent: 'Iris' as const,
    icon: '🔍'
  },
  {
    id: 'cmd-16',
    category: 'RESEARCH',
    title: 'Vector Knowledge Base Cosine Indexing',
    command: 'Task Vega to embed and cluster new market intelligence summaries in 768-dim space.',
    agent: 'Vega' as const,
    icon: '🌌'
  },
  {
    id: 'cmd-17',
    category: 'SURVEILLANCE',
    title: 'Maritime AIS Vessel Track & Cargo Manifests',
    command: 'Task Orion to ingest AIS signals from oil tankers in Strait of Hormuz.',
    agent: 'Orion' as const,
    icon: '⚓'
  },
  {
    id: 'cmd-18',
    category: 'SURVEILLANCE',
    title: 'Atmospheric Radar & Supply Chain Logistics',
    command: 'Task Zephyr to overlay monsoon precipitation patterns onto trade route corridors.',
    agent: 'Zephyr' as const,
    icon: '🌪️'
  },
  {
    id: 'cmd-19',
    category: 'RESEARCH',
    title: 'Compress Bullion Ticks to Snappy Parquet',
    command: 'Task Titan to serialize intraday tick streams into compressed parquet cold storage.',
    agent: 'Titan' as const,
    icon: '💾'
  },
  {
    id: 'cmd-20',
    category: 'INFRASTRUCTURE',
    title: 'Neural Audio TTS Pitch & Wave Synthesis',
    command: 'Task Aria to synthesize tactical mission broadcast audio across all active audio channels.',
    agent: 'Aria' as const,
    icon: '🎵'
  }
];
