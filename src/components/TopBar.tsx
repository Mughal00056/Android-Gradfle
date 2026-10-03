import React from 'react';
import { 
  Play, Hammer, Terminal, Smartphone, Settings, 
  Menu, ChevronDown, Plus, Eye, Columns, Code2, 
  Layers, Sparkles, Home 
} from 'lucide-react';
import { Project, ViewMode } from '../types';

interface TopBarProps {
  currentProject: Project;
  projects: Project[];
  viewMode: ViewMode;
  onSelectProject: (id: string) => void;
  onChangeViewMode: (mode: ViewMode) => void;
  onRunBuild: () => void;
  onRunLivePreview: () => void;
  onOpenProperties: () => void;
  onToggleExplorer: () => void;
  onOpenHome: () => void;
  onNewProject: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentProject,
  projects,
  viewMode,
  onSelectProject,
  onChangeViewMode,
  onRunBuild,
  onRunLivePreview,
  onOpenProperties,
  onToggleExplorer,
  onOpenHome,
  onNewProject,
}) => {
  return (
    <header className="shrink-0 h-12 bg-[#121317] border-b border-white/10 px-2 sm:px-3 flex items-center justify-between gap-2 select-none z-30">
      {/* Zone 1: Menu, Brand & Project Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleExplorer}
          title="Toggle Project Explorer"
          className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenHome}
          title="Home / Welcome Screen"
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-mono text-xs font-bold border border-sky-500/20 transition-colors"
        >
          <span>&#123;🤖&#125;</span>
          <span className="hidden md:inline font-sans text-white font-semibold">ACS</span>
        </button>

        {/* Project Selector dropdown */}
        <div className="relative flex items-center">
          <select
            value={currentProject.id}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                onNewProject();
              } else {
                onSelectProject(e.target.value);
              }
            }}
            aria-label="Select Active Project"
            className="bg-[#1A1C24] hover:bg-[#222530] text-slate-100 font-mono text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-white/10 outline-none cursor-pointer pr-7 transition-colors truncate max-w-[130px] sm:max-w-[180px]"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.language})
              </option>
            ))}
            <option value="__new__">+ New Project...</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* Zone 2: Workspace View Mode Switcher (Editor / Split / Preview / Terminal) */}
      <div className="flex items-center bg-[#181920] p-0.5 rounded-xl border border-white/10 text-xs">
        <button
          onClick={() => onChangeViewMode('editor')}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-colors ${
            viewMode === 'editor'
              ? 'bg-sky-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Editor</span>
        </button>

        <button
          onClick={() => onChangeViewMode('split')}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-colors ${
            viewMode === 'split'
              ? 'bg-sky-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Split</span>
        </button>

        <button
          onClick={() => onChangeViewMode('preview')}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-colors ${
            viewMode === 'preview'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          onClick={() => onChangeViewMode('terminal')}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-colors ${
            viewMode === 'terminal'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Terminal</span>
        </button>
      </div>

      {/* Zone 3: Primary Actions (Run, Build, Properties) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Properties Quick Settings */}
        <button
          onClick={onOpenProperties}
          title="App Properties & AAPT2 Override"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors hidden sm:flex items-center"
        >
          <Settings className="w-4 h-4 text-blue-400" />
        </button>

        {/* Build APK button */}
        <button
          onClick={onRunBuild}
          title="Build Debug APK (:app:assembleDebug)"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#22242F] hover:bg-[#2A2D3B] text-slate-200 border border-white/10 text-xs font-semibold active:scale-95 transition-all"
        >
          <Hammer className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Build APK</span>
        </button>

        {/* LIVE PREVIEW Master Button */}
        <button
          onClick={onRunLivePreview}
          title="Launch Live Interactive Preview"
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="tracking-wide">LIVE PREVIEW</span>
        </button>
      </div>
    </header>
  );
};
