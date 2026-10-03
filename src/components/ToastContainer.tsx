import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  X, 
  Flame, 
  Sparkles, 
  Terminal, 
  ExternalLink,
  RotateCcw,
  BellRing,
  Trash2
} from 'lucide-react';
import { ToastNotification } from '../types';
import { playTacticalBeep } from '../utils/audio';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onActionClick?: (toast: ToastNotification) => void;
}

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
  onActionClick?: (toast: ToastNotification) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss, onActionClick }) => {
  const duration = toast.duration || 5500;
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, isPaused, toast.id, onDismiss]);

  const isCriticalOrHigh = toast.priority === 'CRITICAL' || toast.priority === 'HIGH';

  // Card theme styling according to toast type
  let borderClass = 'border-cyan-500/40 shadow-[0_4px_25px_rgba(6,182,212,0.25)]';
  let bgClass = 'bg-[#0b1222]/95';
  let iconComponent = <Info className="w-5 h-5 text-cyan-400" />;
  let accentBarClass = 'bg-cyan-400';
  let badgeColor = 'bg-cyan-950 text-cyan-300 border-cyan-700/60';

  if (toast.type === 'error') {
    borderClass = 'border-rose-500/70 shadow-[0_4px_30px_rgba(244,63,94,0.35)]';
    bgClass = 'bg-[#18070d]/95';
    iconComponent = <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />;
    accentBarClass = 'bg-rose-500';
    badgeColor = 'bg-rose-950 text-rose-300 border-rose-700/80';
  } else if (toast.type === 'success') {
    borderClass = isCriticalOrHigh 
      ? 'border-emerald-400/80 shadow-[0_4px_30px_rgba(16,185,129,0.4)]'
      : 'border-emerald-500/50 shadow-[0_4px_20px_rgba(16,185,129,0.25)]';
    bgClass = 'bg-[#071714]/95';
    iconComponent = isCriticalOrHigh ? (
      <Sparkles className="w-5 h-5 text-emerald-300 animate-bounce" />
    ) : (
      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
    );
    accentBarClass = 'bg-emerald-400';
    badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
  } else if (toast.type === 'warning') {
    borderClass = 'border-amber-500/60 shadow-[0_4px_25px_rgba(245,158,11,0.3)]';
    bgClass = 'bg-[#181206]/95';
    iconComponent = <AlertCircle className="w-5 h-5 text-amber-400" />;
    accentBarClass = 'bg-amber-400';
    badgeColor = 'bg-amber-950 text-amber-300 border-amber-700/60';
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full max-w-sm rounded-xl border backdrop-blur-xl p-3.5 ${bgClass} ${borderClass} overflow-hidden pointer-events-auto transition-all`}
    >
      {/* Top progress countdown indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800/80 overflow-hidden">
        <div 
          className={`h-full ${accentBarClass} transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        {/* Left Icon with Agent Avatar badge if available */}
        <div className="relative shrink-0 mt-0.5">
          <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
            {iconComponent}
          </div>
          {toast.agentIcon && (
            <span className="absolute -bottom-1 -right-1 text-xs bg-[#0b0f19] p-0.5 rounded-full border border-slate-700 shadow">
              {toast.agentIcon}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <h5 className="text-xs font-heading font-bold text-slate-100 tracking-wide truncate">
              {toast.title}
            </h5>
            
            {toast.priority && (
              <span className={`text-[9px] font-mono-code px-1.5 py-0.2 rounded border font-bold ${
                toast.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-600' :
                toast.priority === 'HIGH' ? 'bg-amber-950 text-amber-300 border-amber-600' :
                'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                {toast.priority}
              </span>
            )}

            {toast.agentName && (
              <span className={`text-[9px] font-mono-code px-1.5 py-0.2 rounded border ${badgeColor}`}>
                @{toast.agentName}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-mono-code break-words line-clamp-3">
            {toast.message}
          </p>

          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px] font-mono-code text-slate-400">
            <span>{toast.timestamp}</span>

            {toast.actionLabel && onActionClick && (
              <button
                type="button"
                onClick={() => onActionClick(toast)}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition cursor-pointer"
              >
                <span>{toast.actionLabel}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            playTacticalBeep(750, 'sine', 0.05);
            onDismiss(toast.id);
          }}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition cursor-pointer"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onClearAll,
  onActionClick,
}) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <aside 
      id="toast-notification-system" 
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2.5 max-w-sm w-full pointer-events-none px-3 md:px-0"
    >
      {toasts.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-between w-full max-w-sm px-3 py-1.5 rounded-lg bg-[#060a14]/90 border border-cyan-950 backdrop-blur-md text-[10px] font-mono-code text-slate-400 pointer-events-auto shadow-md"
        >
          <span className="flex items-center gap-1.5 text-cyan-300">
            <BellRing className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>{toasts.length} Active System Alerts</span>
          </span>
          <button
            type="button"
            onClick={() => {
              playTacticalBeep(500, 'sine', 0.06);
              onClearAll();
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-300 transition cursor-pointer"
          >
            <Trash2 className="w-2.5 h-2.5" />
            <span>Clear All</span>
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            onActionClick={onActionClick}
          />
        ))}
      </AnimatePresence>
    </aside>
  );
};
