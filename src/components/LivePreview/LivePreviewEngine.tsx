import React, { useState, useEffect } from 'react';
import { 
  Play, RotateCcw, Smartphone, Tablet, Monitor, 
  Sun, Moon, Wifi, BatteryCharging, Signal, ChevronDown, 
  Maximize2, Sparkles, RefreshCw, Eye, Flame, Code2 
} from 'lucide-react';
import { DeviceType, PreviewSettings } from '../../types';
import { XmlLayoutRenderer } from './XmlLayoutRenderer';
import { ComposePreviewRenderer } from './ComposePreviewRenderer';
import { FlutterPreviewRenderer } from './FlutterPreviewRenderer';
import { ReactPreviewRenderer } from './ReactPreviewRenderer';

interface LivePreviewEngineProps {
  xmlContent?: string;
  projectName: string;
  defaultEngine?: 'xml' | 'compose' | 'flutter' | 'react';
  onBuildRequest?: () => void;
}

export const LivePreviewEngine: React.FC<LivePreviewEngineProps> = ({
  xmlContent = '',
  projectName,
  defaultEngine = 'xml',
  onBuildRequest,
}) => {
  const [settings, setSettings] = useState<PreviewSettings>({
    device: 'pixel8',
    orientation: 'portrait',
    theme: 'dark',
    apiLevel: 35,
    zoom: 100,
    previewEngine: defaultEngine,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('08:12');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync engine if defaultEngine changes
  useEffect(() => {
    setSettings((s) => ({ ...s, previewEngine: defaultEngine }));
  }, [defaultEngine]);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    showToast('Live Preview reloaded');
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const isPortrait = settings.orientation === 'portrait';

  // Device dimensions
  const getDeviceDimensions = () => {
    switch (settings.device) {
      case 'tablet10':
        return isPortrait ? { width: 520, height: 680 } : { width: 680, height: 480 };
      case 'foldable':
        return isPortrait ? { width: 440, height: 620 } : { width: 620, height: 440 };
      case 'samsung_s24':
        return isPortrait ? { width: 360, height: 690 } : { width: 690, height: 360 };
      case 'pixel8':
      default:
        return isPortrait ? { width: 350, height: 680 } : { width: 680, height: 350 };
    }
  };

  const dims = getDeviceDimensions();

  return (
    <div className="h-full flex flex-col bg-[#111215] select-none overflow-hidden">
      {/* Top Preview Controls Toolbar */}
      <div className="shrink-0 h-11 px-3 border-b border-white/10 bg-[#18191E] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Left: Engine & Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE</span>
          </div>

          {/* Engine Picker */}
          <div className="flex items-center bg-black/30 rounded-lg p-0.5 border border-white/5 text-xs">
            <button
              onClick={() => setSettings({ ...settings, previewEngine: 'xml' })}
              className={`px-2 py-1 rounded-md transition-colors ${
                settings.previewEngine === 'xml'
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              XML Layout
            </button>
            <button
              onClick={() => setSettings({ ...settings, previewEngine: 'compose' })}
              className={`px-2 py-1 rounded-md transition-colors ${
                settings.previewEngine === 'compose'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Compose
            </button>
            <button
              onClick={() => setSettings({ ...settings, previewEngine: 'flutter' })}
              className={`px-2 py-1 rounded-md transition-colors ${
                settings.previewEngine === 'flutter'
                  ? 'bg-purple-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flutter
            </button>
            <button
              onClick={() => setSettings({ ...settings, previewEngine: 'react' })}
              className={`px-2 py-1 rounded-md transition-colors ${
                settings.previewEngine === 'react'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              React Web
            </button>
          </div>
        </div>

        {/* Center / Right: Device Configs */}
        <div className="flex items-center gap-1.5">
          {/* Device Model Selector */}
          <select
            value={settings.device}
            onChange={(e) => setSettings({ ...settings, device: e.target.value as DeviceType })}
            aria-label="Select Device Model"
            className="bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none cursor-pointer hover:border-white/20"
          >
            <option value="pixel8">Google Pixel 8</option>
            <option value="samsung_s24">Samsung Galaxy S24</option>
            <option value="tablet10">Galaxy Tab 10.5"</option>
            <option value="foldable">Pixel Fold (Unfolded)</option>
          </select>

          {/* Orientation Toggle */}
          <button
            onClick={() =>
              setSettings({
                ...settings,
                orientation: settings.orientation === 'portrait' ? 'landscape' : 'portrait',
              })
            }
            title={`Switch to ${isPortrait ? 'Landscape' : 'Portrait'}`}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-white/10 text-slate-300 transition-colors"
          >
            <Smartphone className={`w-4 h-4 transition-transform ${!isPortrait ? 'rotate-90' : ''}`} />
          </button>

          {/* Theme Toggle inside preview */}
          <button
            onClick={() =>
              setSettings({
                ...settings,
                theme: settings.theme === 'dark' ? 'light' : 'dark',
              })
            }
            title="Toggle Device Theme (Dark/Light)"
            className="p-1.5 rounded-lg bg-black/20 hover:bg-white/10 text-slate-300 transition-colors"
          >
            {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* API Level */}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-400 border border-white/5">
            API {settings.apiLevel}
          </span>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            title="Refresh Live Preview"
            className="p-1.5 rounded-lg bg-black/20 hover:bg-white/10 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Preview Canvas Frame */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-auto bg-radial from-[#1A1C23] to-[#0F1013]">
        <div
          style={{
            width: `${dims.width}px`,
            height: `${dims.height}px`,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          className="relative rounded-[36px] bg-black p-3 shadow-2xl ring-1 ring-white/15 flex flex-col transition-all duration-300 ease-out"
        >
          {/* Top Notch / Camera Cutout */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-b-xl flex items-center justify-center z-30 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#181818] ring-1 ring-white/10" />
          </div>

          {/* Inner Display Screen */}
          <div className="relative flex-1 rounded-[26px] overflow-hidden flex flex-col bg-slate-900 border border-white/5">
            {/* Real Android Status Bar */}
            <div className="shrink-0 h-6 px-4 bg-black/40 backdrop-blur-sm flex items-center justify-between text-[11px] font-medium text-slate-300 z-20">
              <span className="font-semibold tracking-tight">{currentTime}</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[9px] font-mono font-bold tracking-tighter text-sky-400">5G</span>
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px]">91%</span>
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Application Viewport */}
            <div className="flex-1 relative overflow-hidden">
              {settings.previewEngine === 'xml' && (
                <XmlLayoutRenderer
                  xmlContent={xmlContent}
                  theme={settings.theme}
                  onShowToast={showToast}
                />
              )}

              {settings.previewEngine === 'compose' && (
                <ComposePreviewRenderer
                  theme={settings.theme}
                  onShowToast={showToast}
                />
              )}

              {settings.previewEngine === 'flutter' && (
                <FlutterPreviewRenderer
                  theme={settings.theme}
                  onShowToast={showToast}
                />
              )}

              {settings.previewEngine === 'react' && (
                <ReactPreviewRenderer
                  theme={settings.theme}
                  onShowToast={showToast}
                />
              )}

              {/* Android Toast Notification Overlay */}
              {toastMessage && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-[85%] px-3.5 py-2 rounded-full bg-slate-900/90 text-white text-xs text-center border border-white/15 shadow-xl backdrop-blur-md animate-fade-in z-50 pointer-events-none">
                  {toastMessage}
                </div>
              )}
            </div>

            {/* Android Navigation Bar (Gesture Pill) */}
            <div className="shrink-0 h-4 bg-black/40 flex items-center justify-center z-20">
              <div className="w-24 h-1 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
