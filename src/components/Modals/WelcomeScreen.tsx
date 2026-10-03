import React from 'react';
import { 
  FolderOpen, Plus, Terminal, Settings, 
  Smartphone, BookOpen, Layers, CheckCircle2, ChevronRight, X 
} from 'lucide-react';
import { Project } from '../../types';

interface WelcomeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onOpenProperties: () => void;
  onOpenTerminal: () => void;
  onOpenLivePreview: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onNewProject,
  onOpenProperties,
  onOpenTerminal,
  onOpenLivePreview,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0F1014] z-50 flex flex-col justify-between overflow-y-auto no-scrollbar p-4 sm:p-8 select-none">
      {/* Top Bar with Dismiss */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Android Code Studio Mobile · Termux Edition</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Hub */}
      <div className="max-w-4xl w-full mx-auto my-auto py-6">
        {/* Brand Banner with {🤖} Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-3xl font-mono font-bold text-white shadow-xl shadow-sky-500/20 ring-4 ring-white/10">
              &#123;🤖&#125;
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] tracking-wider uppercase shadow">
              ACS
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Android Code Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Your Ideas, Anywhere · Learn, build, launch. All on your Android with Live Preview & Gradle 8.13.
          </p>
        </div>

        {/* Action Grid matching screenshot 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => {
              onClose();
              onNewProject();
            }}
            className="p-4 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-sky-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Create project</div>
              <div className="text-[11px] text-slate-400">Choose from Kotlin, Compose, Flutter & XML</div>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenLivePreview();
            }}
            className="p-4 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-emerald-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Live Preview</div>
              <div className="text-[11px] text-slate-400">Interactive Android device emulator & UI tester</div>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenProperties();
            }}
            className="p-4 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-blue-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">IDE Configurations</div>
              <div className="text-[11px] text-slate-400">Termux AAPT2 override & local.properties</div>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenTerminal();
            }}
            className="p-4 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-amber-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Terminal Shell</div>
              <div className="text-[11px] text-slate-400">Termux bash, gradlew & sdkmanager</div>
            </div>
          </button>

          <button
            onClick={onClose}
            className="p-4 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-purple-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Open Code Editor</div>
              <div className="text-[11px] text-slate-400">Resume workspace in active project</div>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenProperties();
            }}
            className="p-4 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-slate-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Documentation</div>
              <div className="text-[11px] text-slate-400">Gradle 8.13 & NDK setup guide</div>
            </div>
          </button>
        </div>

        {/* Recent Projects List */}
        <div className="bg-[#15161C] border border-white/10 rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Recent Projects
          </h3>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj.id);
                  onClose();
                }}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-99 ${
                  proj.id === currentProjectId
                    ? 'bg-sky-500/10 border-sky-500/30 text-white'
                    : 'bg-[#191B22] border-white/5 hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs text-sky-400">
                    {proj.type === 'flutter' ? '💙' : proj.type === 'native_compose' ? '🧊' : '📱'}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{proj.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {proj.packageName} · {proj.language}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    API {proj.targetSdk}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-500 pt-4">
        Android Code Studio Mobile · Powered by Termux, Gradle 8.13 & OpenJDK 17
      </div>
    </div>
  );
};
