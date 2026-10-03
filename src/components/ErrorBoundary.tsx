import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#111827]/90 border border-rose-500/40 rounded-xl p-8 shadow-2xl backdrop-blur-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-2">
              Neural Telemetry Fault Intercepted
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              An unexpected runtime error occurred during rendering. The Stonic AI safe-mode boundary prevented a blank screen.
            </p>
            {this.state.error && (
              <div className="bg-black/60 border border-slate-800 rounded-lg p-3 text-left font-mono text-xs text-rose-300 mb-6 overflow-x-auto max-h-36">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reboot Command Console
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
