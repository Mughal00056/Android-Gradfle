import React, { useState } from 'react';
import { Plus, Zap, RotateCcw, Terminal, Bug } from 'lucide-react';

interface FlutterPreviewRendererProps {
  theme: 'dark' | 'light';
  onShowToast: (message: string) => void;
}

export const FlutterPreviewRenderer: React.FC<FlutterPreviewRendererProps> = ({
  theme,
  onShowToast,
}) => {
  const [counter, setCounter] = useState(0);
  const [lastAction, setLastAction] = useState<string>('App started in debug mode');
  const [isHotReloading, setIsHotReloading] = useState(false);

  const isDark = theme === 'dark';

  const triggerHotReload = () => {
    setIsHotReloading(true);
    setLastAction('Performing hot reload...');
    onShowToast('⚡ Flutter Hot Reload: Reassembled application in 238ms');
    setTimeout(() => {
      setIsHotReloading(false);
      setLastAction('Reloaded 1 of 542 libraries in 238ms.');
    }, 400);
  };

  const triggerHotRestart = () => {
    setCounter(0);
    setLastAction('Restarting application...');
    onShowToast('↻ Flutter Hot Restart: App restarted in 820ms');
    setTimeout(() => {
      setLastAction('Restarted application in 820ms.');
    }, 300);
  };

  return (
    <div className={`h-full flex flex-col justify-between overflow-y-auto no-scrollbar relative ${
      isDark ? 'bg-[#121316] text-[#E0E0E0]' : 'bg-[#FAFAFA] text-[#212121]'
    }`}>
      {/* Flutter Debug Banner */}
      <div className="absolute top-1 right-1 z-20 pointer-events-none">
        <div className="bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 transform rotate-45 translate-x-3 translate-y-1 shadow">
          DEBUG
        </div>
      </div>

      {/* Flutter AppBar */}
      <div className="bg-[#6750A4] text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="font-medium text-sm">Flutter Demo Home Page</div>
        <div className="flex items-center gap-1">
          <button
            onClick={triggerHotReload}
            title="Hot Reload"
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors active:scale-90"
          >
            <Zap className={`w-3.5 h-3.5 fill-amber-300 text-amber-300 ${isHotReloading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={triggerHotRestart}
            title="Hot Restart"
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors active:scale-90"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Body with Counter */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-2xl mb-4 border border-sky-500/20">
          Flutter
        </div>
        <p className="text-xs text-slate-400 mb-2">
          You have pushed the button this many times:
        </p>
        <div className="text-5xl font-light font-mono text-[#6750A4] dark:text-[#D0BCFF] mb-6">
          {counter}
        </div>

        {/* Quick Debug Info Bar */}
        <div className={`w-full max-w-xs p-2.5 rounded-xl border text-left text-[11px] font-mono ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center gap-1.5 text-amber-400 mb-1 font-semibold">
            <Bug className="w-3 h-3" />
            <span>Dart VM / DevTools</span>
          </div>
          <div className="truncate text-slate-300">&gt; {lastAction}</div>
        </div>
      </div>

      {/* Bottom controls & Floating Action Button */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={triggerHotReload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-medium active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Hot Reload</span>
          </button>
        </div>

        <button
          onClick={() => {
            setCounter((c) => c + 1);
            setLastAction(`_incrementCounter() called -> ${counter + 1}`);
            onShowToast(`Flutter Counter: ${counter + 1}`);
          }}
          className="w-12 h-12 rounded-2xl bg-[#6750A4] hover:bg-[#7D64B8] text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
