import React, { useState, useMemo } from 'react';
import { GoldPuritySummary, ScraperLog } from '../types';
import { 
  Coins, 
  TrendingUp, 
  RefreshCw, 
  Calculator, 
  DollarSign, 
  Code2, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Activity,
  Maximize2
} from 'lucide-react';
import { playTacticalBeep } from '../utils/audio';

interface FinancialGoldTerminalProps {
  goldData: GoldPuritySummary;
  onRefreshScraper: () => void;
  isScraping: boolean;
  scraperLogs: ScraperLog[];
}

export const FinancialGoldTerminal: React.FC<FinancialGoldTerminalProps> = ({
  goldData,
  onRefreshScraper,
  isScraping,
  scraperLogs,
}) => {
  // Calculator state
  const [calcUnit, setCalcUnit] = useState<'tola' | 'gram' | '10g' | 'ounce'>('tola');
  const [calcPurity, setCalcPurity] = useState<'24k' | '22k' | '21k' | '18k'>('24k');
  const [calcQuantity, setCalcQuantity] = useState<number>(1);
  const [makingChargesPct, setMakingChargesPct] = useState<number>(3.5);

  // Sparkline interactive state
  const [timeframe, setTimeframe] = useState<'24H' | '12H' | '6H' | '1H'>('24H');
  const [hoveredPoint, setHoveredPoint] = useState<{ hour: string; price: number; diff: number; x: number; y: number } | null>(null);

  // Generate 24h historical price sequence around current 24k_tola_pkr
  const priceHistory = useMemo(() => {
    const currentPrice = goldData['24k_tola_pkr'];
    const change = goldData.change24h || 0.38;
    const baseOpen = currentPrice / (1 + change / 100);

    // 24 hourly intervals
    const pointsCount = timeframe === '24H' ? 24 : timeframe === '12H' ? 12 : timeframe === '6H' ? 6 : 4;
    const points: { hour: string; price: number; diff: number }[] = [];

    // Deterministic pseudo-random seed based on base price
    const seedDeltas = [
      -0.25, -0.40, -0.15, 0.10, 0.35, 0.20, -0.05, 0.45,
      0.60, 0.85, 0.70, 0.50, 0.30, 0.15, -0.10, 0.25,
      0.40, 0.65, 0.90, 0.75, 0.55, 0.40, 0.20, 0.00
    ];

    const currentHour = new Date().getHours();

    for (let i = 0; i < pointsCount; i++) {
      const idx = 24 - pointsCount + i;
      const progress = i / (pointsCount - 1);
      const deltaFactor = seedDeltas[idx % seedDeltas.length];
      const variance = (deltaFactor * (change >= 0 ? 1 : -1) * 350) + ((Math.sin(i * 0.9) * 220));
      
      const price = i === pointsCount - 1
        ? currentPrice
        : Math.round(baseOpen + (currentPrice - baseOpen) * progress + variance);

      const hourVal = (currentHour - (pointsCount - 1 - i) + 24) % 24;
      const hourStr = `${hourVal.toString().padStart(2, '0')}:00`;
      const diff = price - baseOpen;

      points.push({ hour: hourStr, price, diff });
    }

    return points;
  }, [goldData['24k_tola_pkr'], goldData.change24h, timeframe]);

  // Derived Sparkline Statistics
  const stats = useMemo(() => {
    const prices = priceHistory.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const spread = max - min;
    const volatilityPct = ((spread / min) * 100).toFixed(2);
    const mean = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    return { min, max, spread, volatilityPct, mean };
  }, [priceHistory]);

  // Compute calculated price
  const getRatePerUnit = () => {
    if (calcUnit === 'tola') {
      if (calcPurity === '24k') return goldData['24k_tola_pkr'];
      if (calcPurity === '22k') return goldData['22k_tola_pkr'];
      if (calcPurity === '21k') return goldData['21k_tola_pkr'];
      return goldData['18k_tola_pkr'];
    }
    if (calcUnit === 'gram') {
      if (calcPurity === '24k') return goldData['24k_gram_pkr'];
      return goldData['22k_gram_pkr'];
    }
    if (calcUnit === '10g') {
      return goldData['24k_10g_pkr'];
    }
    return goldData['24k_ounce_pkr'];
  };

  const basePrice = getRatePerUnit() * calcQuantity;
  const makingCharges = (basePrice * makingChargesPct) / 100;
  const grandTotal = basePrice + makingCharges;
  const grandTotalUSD = +(grandTotal / (goldData['usd_pkr_interbank'] || 278.45)).toFixed(2);

  // SVG Chart Geometry Calculations
  const chartWidth = 540;
  const chartHeight = 70;
  const paddingX = 14;
  const paddingY = 8;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;

  const minVal = stats.min - (stats.spread * 0.1 || 100);
  const maxVal = stats.max + (stats.spread * 0.1 || 100);
  const valRange = maxVal - minVal || 1;

  const coordinates = useMemo(() => {
    return priceHistory.map((pt, idx) => {
      const x = paddingX + (idx / (priceHistory.length - 1)) * plotWidth;
      const y = chartHeight - paddingY - ((pt.price - minVal) / valRange) * plotHeight;
      return { x, y, pt };
    });
  }, [priceHistory, minVal, valRange, plotWidth, plotHeight, chartHeight]);

  const svgPath = useMemo(() => {
    if (coordinates.length === 0) return '';
    return coordinates.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cpX = (prev.x + curr.x) / 2;
      return `${acc} C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }, '');
  }, [coordinates]);

  const areaPath = useMemo(() => {
    if (coordinates.length === 0) return '';
    const last = coordinates[coordinates.length - 1];
    const first = coordinates[0];
    return `${svgPath} L ${last.x} ${chartHeight} L ${first.x} ${chartHeight} Z`;
  }, [svgPath, coordinates, chartHeight]);

  return (
    <div id="financial-gold-terminal" className="tactical-card corner-bracket p-4 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-950/90 border border-amber-700/50 text-amber-400">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              FINANCIAL &amp; GOLD SCRAPER
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                SUB-AGENT 2 (Sam)
              </span>
            </h3>
            <p className="text-[11px] font-mono-code text-slate-400">
              Karachi Bullion Rates (PKR) &bull; Interbank USD/PKR Exchange
            </p>
          </div>
        </div>

        <button
          id="btn-scrape-gold-refresh"
          onClick={() => {
            playTacticalBeep(850);
            onRefreshScraper();
          }}
          disabled={isScraping}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-600/50 text-amber-300 text-xs font-mono-code transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
          <span>{isScraping ? 'PARSING REGEX...' : 'RUN SCRAPER'}</span>
        </button>
      </div>

      {/* Main Bullion Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {/* 24K 1 Tola */}
        <div className="bg-[#080d17] border border-amber-950/80 rounded-lg p-2.5 shadow-sm">
          <div className="text-[10px] font-mono-code text-slate-400 flex items-center justify-between">
            <span>24K GOLD (1 TOLA)</span>
            <span className="text-emerald-400 flex items-center text-[10px]">
              <ArrowUpRight className="w-3 h-3" /> +{goldData.change24h}%
            </span>
          </div>
          <div className="text-base font-mono-code font-bold text-amber-300 mt-1">
            ₨ {goldData['24k_tola_pkr'].toLocaleString()} <span className="text-[10px] font-normal text-slate-400">PKR</span>
          </div>
          <div className="text-[10px] font-mono-code text-slate-500 mt-0.5">
            11.6638 grams pure gold
          </div>
        </div>

        {/* 22K 1 Tola */}
        <div className="bg-[#080d17] border border-amber-950/80 rounded-lg p-2.5 shadow-sm">
          <div className="text-[10px] font-mono-code text-slate-400">22K GOLD (1 TOLA)</div>
          <div className="text-base font-mono-code font-bold text-amber-400 mt-1">
            ₨ {goldData['22k_tola_pkr'].toLocaleString()} <span className="text-[10px] font-normal text-slate-400">PKR</span>
          </div>
          <div className="text-[10px] font-mono-code text-slate-500 mt-0.5">
            Jewelry Standard (91.67%)
          </div>
        </div>

        {/* 24K 1 Gram */}
        <div className="bg-[#080d17] border border-amber-950/80 rounded-lg p-2.5 shadow-sm">
          <div className="text-[10px] font-mono-code text-slate-400">24K GOLD (1 GRAM)</div>
          <div className="text-base font-mono-code font-bold text-slate-100 mt-1">
            ₨ {goldData['24k_gram_pkr'].toLocaleString()} <span className="text-[10px] font-normal text-slate-400">PKR</span>
          </div>
          <div className="text-[10px] font-mono-code text-slate-500 mt-0.5">
            10g: ₨ {goldData['24k_10g_pkr'].toLocaleString()}
          </div>
        </div>

        {/* USD to PKR Exchange Rate */}
        <div className="bg-[#080d17] border border-emerald-950/80 rounded-lg p-2.5 shadow-sm">
          <div className="text-[10px] font-mono-code text-slate-400 flex items-center justify-between">
            <span>USD / PKR INTERBANK</span>
            <DollarSign className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-base font-mono-code font-bold text-emerald-400 mt-1">
            ₨ {goldData['usd_pkr_interbank'].toFixed(2)} <span className="text-[10px] font-normal text-slate-400">PKR</span>
          </div>
          <div className="text-[10px] font-mono-code text-slate-500 mt-0.5">
            Open Market: ₨ {goldData['usd_pkr_open_market'].toFixed(2)}
          </div>
        </div>
      </div>

      {/* 24H Price Volatility Sparkline Chart */}
      <div className="bg-[#060a12] border border-amber-950/60 rounded-lg p-2.5 mb-3 shadow-inner">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code font-semibold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              24K GOLD PRICE VOLATILITY SPARKLINE
            </span>
            <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-amber-950/70 text-amber-300 border border-amber-800/40">
              PKR / Tola
            </span>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-[#090e18] p-0.5 rounded border border-slate-800 text-[10px] font-mono-code">
            {(['24H', '12H', '6H', '1H'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  playTacticalBeep(620);
                  setTimeframe(tf);
                }}
                className={`px-1.5 py-0.5 rounded transition ${
                  timeframe === tf
                    ? 'bg-amber-950 border border-amber-600/70 text-amber-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Sparkline Canvas / SVG Area */}
        <div className="relative w-full h-[76px] bg-[#04070d] rounded border border-slate-900 overflow-hidden flex flex-col justify-end">
          
          {/* Subtle Grid Guidelines */}
          <div className="absolute inset-0 flex flex-col justify-between py-1.5 pointer-events-none opacity-20">
            <div className="w-full border-b border-dashed border-amber-400" />
            <div className="w-full border-b border-dashed border-amber-400" />
            <div className="w-full border-b border-dashed border-amber-400" />
          </div>

          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full cursor-crosshair"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="goldSparkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.38" />
                <stop offset="80%" stopColor="#d97706" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Fill Under Sparkline */}
            <path d={areaPath} fill="url(#goldSparkGradient)" />

            {/* Glowing Golden Stroke */}
            <path
              d={svgPath}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Latest Price Ping Dot */}
            {coordinates.length > 0 && (
              <>
                <circle
                  cx={coordinates[coordinates.length - 1].x}
                  cy={coordinates[coordinates.length - 1].y}
                  r="3.5"
                  className="fill-amber-400"
                />
                <circle
                  cx={coordinates[coordinates.length - 1].x}
                  cy={coordinates[coordinates.length - 1].y}
                  r="6.5"
                  className="stroke-amber-400/50 fill-none animate-ping"
                />
              </>
            )}

            {/* Interactive Hover Circles */}
            {coordinates.map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r="7"
                fill="transparent"
                className="hover:cursor-pointer"
                onMouseEnter={() => {
                  playTacticalBeep(920);
                  setHoveredPoint({
                    hour: c.pt.hour,
                    price: c.pt.price,
                    diff: c.pt.diff,
                    x: c.x,
                    y: c.y,
                  });
                }}
              />
            ))}

            {/* Active Hover Marker */}
            {hoveredPoint && (
              <>
                <line
                  x1={hoveredPoint.x}
                  y1={0}
                  x2={hoveredPoint.x}
                  y2={chartHeight}
                  stroke="#38bdf8"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="4"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </>
            )}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredPoint && (
            <div
              className="absolute top-1 pointer-events-none bg-[#0a1120]/95 border border-cyan-500/80 rounded px-2 py-0.5 text-[10px] font-mono-code text-slate-100 shadow-lg transform -translate-x-1/2 z-10 whitespace-nowrap"
              style={{
                left: `${(hoveredPoint.x / chartWidth) * 100}%`,
              }}
            >
              <span className="text-slate-400">{hoveredPoint.hour}: </span>
              <strong className="text-amber-300">₨ {hoveredPoint.price.toLocaleString()} PKR</strong>
              <span className={`ml-1 font-bold ${hoveredPoint.diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {hoveredPoint.diff >= 0 ? `+₨ ${Math.round(hoveredPoint.diff)}` : `-₨ ${Math.abs(Math.round(hoveredPoint.diff))}`}
              </span>
            </div>
          )}
        </div>

        {/* Volatility Telemetry Footer Strip */}
        <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 mt-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <span>24H HIGH: <strong className="text-emerald-400">₨ {stats.max.toLocaleString()}</strong></span>
            <span>24H LOW: <strong className="text-amber-400">₨ {stats.min.toLocaleString()}</strong></span>
            <span>SPREAD: <strong className="text-cyan-300">₨ {stats.spread.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span>VOLATILITY:</span>
            <span className="text-amber-300 font-bold">~{stats.volatilityPct}%</span>
          </div>
        </div>
      </div>

      {/* Secondary Purity Matrix & Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        
        {/* Left: Complete Purity & Units Matrix */}
        <div className="bg-[#070b13] border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-code font-semibold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                COMMODITY PURITIES (PKR)
              </span>
              <span className="text-[10px] font-mono-code text-slate-500">
                Live Feed Sync
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono-code">
              <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-900/60 border border-slate-800/50">
                <span className="text-slate-400">21 Karat (1 Tola):</span>
                <span className="text-slate-200 font-bold">₨ {goldData['21k_tola_pkr'].toLocaleString()} PKR</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-900/60 border border-slate-800/50">
                <span className="text-slate-400">18 Karat (1 Tola):</span>
                <span className="text-slate-200 font-bold">₨ {goldData['18k_tola_pkr'].toLocaleString()} PKR</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-900/60 border border-slate-800/50">
                <span className="text-slate-400">22 Karat (1 Gram):</span>
                <span className="text-slate-200 font-bold">₨ {goldData['22k_gram_pkr'].toLocaleString()} PKR</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-900/60 border border-slate-800/50">
                <span className="text-slate-400">24 Karat (1 Troy Ounce):</span>
                <span className="text-amber-300 font-bold">₨ {goldData['24k_ounce_pkr'].toLocaleString()} PKR</span>
              </div>
            </div>
          </div>

          {/* Regex Parser Telemetry */}
          <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] font-mono-code text-slate-400">
            <div className="flex items-center gap-1 text-cyan-400 mb-0.5">
              <Code2 className="w-3 h-3" />
              <span>PYTHON SCRAPING PATTERN:</span>
            </div>
            <code className="block bg-[#05080e] p-1.5 rounded border border-cyan-950 text-cyan-300 truncate">
              r"(?:Gold|24K|Tola)\s*(?:Rs\.?|PKR)?\s*([0-9,]+)"
            </code>
          </div>
        </div>

        {/* Right: Interactive PKR Gold Valuation Calculator */}
        <div className="bg-[#070b13] border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-code font-semibold text-slate-300 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                VALUATION CALCULATOR
              </span>
              <span className="text-[10px] font-mono-code text-cyan-400">
                Instant PKR + USD
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-code mb-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">PURITY</label>
                <select
                  value={calcPurity}
                  onChange={(e) => setCalcPurity(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="24k">24K (99.9% Pure)</option>
                  <option value="22k">22K (91.67% Jewelry)</option>
                  <option value="21k">21K (87.5% Standard)</option>
                  <option value="18k">18K (75.0% Alloy)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">UNIT</label>
                <select
                  value={calcUnit}
                  onChange={(e) => setCalcUnit(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="tola">Tola (11.66g)</option>
                  <option value="gram">Gram (1.0g)</option>
                  <option value="10g">10 Grams</option>
                  <option value="ounce">Troy Ounce (31.1g)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">QUANTITY</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Math.max(0.01, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">MAKING / TAX (%)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={makingChargesPct}
                  onChange={(e) => setMakingChargesPct(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Calculator Output Banner */}
          <div className="bg-[#05080f] border border-amber-950/80 rounded p-2.5 text-xs font-mono-code">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span>Base Bullion: ₨ {Math.round(basePrice).toLocaleString()}</span>
              <span>Making: ₨ {Math.round(makingCharges).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="font-bold text-amber-300">GRAND TOTAL:</span>
              <div className="text-right">
                <div className="text-sm font-bold text-amber-400">
                  ₨ {Math.round(grandTotal).toLocaleString()} PKR
                </div>
                <div className="text-[10px] text-emerald-400">
                  ≈ ${grandTotalUSD.toLocaleString()} USD
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
