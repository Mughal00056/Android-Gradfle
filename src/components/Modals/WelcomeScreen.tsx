import React, { useState } from 'react';
import { 
  FolderOpen, Plus, Terminal, Settings, 
  Smartphone, BookOpen, Layers, CheckCircle2, ChevronRight, 
  X, ArrowRight, ArrowLeft, Check, Shield, Download, Trash2, HardDrive, PackageCheck, Wrench, RefreshCw
} from 'lucide-react';
import { Project } from '../../types';

interface WelcomeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
  onDownloadProject: (project: Project) => void;
  onOpenProperties: () => void;
  onOpenTerminal: () => void;
  onOpenLivePreview: () => void;
  isInitialSetup?: boolean;
  onFinishInitialSetup?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onDownloadProject,
  onOpenProperties,
  onOpenTerminal,
  onOpenLivePreview,
  isInitialSetup = false,
  onFinishInitialSetup,
}) => {
  // Wizard steps: 'welcome' -> 'permissions' -> 'sdk' -> 'hub'
  const [setupStep, setSetupStep] = useState<'welcome' | 'permissions' | 'sdk' | 'hub'>(
    isInitialSetup ? 'welcome' : 'hub'
  );
  const [storageGranted, setStorageGranted] = useState(true);
  const [installPackagesGranted, setInstallPackagesGranted] = useState(true);
  const [autoInstall, setAutoInstall] = useState(true);
  const [selectedSdk, setSelectedSdk] = useState('SDK 35.0.1');
  const [selectedJdk, setSelectedJdk] = useState('JDK 17');
  const [installGit, setInstallGit] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0F1014] z-50 flex flex-col justify-between overflow-y-auto no-scrollbar p-4 sm:p-8 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            {setupStep === 'welcome' && 'Step 1 of 3 · Welcome'}
            {setupStep === 'permissions' && 'Step 2 of 3 · Permissions'}
            {setupStep === 'sdk' && 'Step 3 of 3 · SDK Toolchain'}
            {setupStep === 'hub' && 'Android Code Studio · Mobile Launcher'}
          </span>
        </div>
        {!isInitialSetup && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* STEP 1: Welcome Screen (from user Screenshot 1) */}
      {setupStep === 'welcome' && (
        <div className="max-w-md w-full mx-auto my-auto flex flex-col items-center text-center py-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-4xl font-mono font-bold text-white shadow-2xl shadow-sky-500/20 mb-8 ring-4 ring-white/10">
            &#123;🤖&#125;
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Welcome
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mb-10 leading-relaxed">
            Learn, build, launch. All on your Android phone or tablet.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSetupStep('permissions')}
              className="w-14 h-14 rounded-full bg-slate-200 hover:bg-white text-slate-950 flex items-center justify-center shadow-xl active:scale-95 transition-transform"
            >
              <ArrowRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Permissions (from user Screenshot 13) */}
      {setupStep === 'permissions' && (
        <div className="max-w-md w-full mx-auto my-auto py-6">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Permissions
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            AndroidCS requires the following permissions to manage workspace projects and compile APKs.
          </p>

          <div className="space-y-3 mb-8">
            {/* Storage Permission Card */}
            <div
              onClick={() => setStorageGranted(!storageGranted)}
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                storageGranted
                  ? 'bg-slate-900 border-sky-500/40 text-white'
                  : 'bg-black/30 border-white/10 text-slate-400'
              }`}
            >
              <div>
                <div className="text-sm font-bold flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-sky-400" />
                  <span>Storage</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Required to access project files on device.
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            {/* Install Packages Permission Card */}
            <div
              onClick={() => setInstallPackagesGranted(!installPackagesGranted)}
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                installPackagesGranted
                  ? 'bg-slate-900 border-sky-500/40 text-white'
                  : 'bg-black/30 border-white/10 text-slate-400'
              }`}
            >
              <div>
                <div className="text-sm font-bold flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  <span>Install packages</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Allow installing APKs built with Android Code Studio.
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setSetupStep('welcome')}
              className="w-12 h-12 rounded-full bg-white/10 text-slate-300 flex items-center justify-center hover:bg-white/15 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setSetupStep('sdk')}
              className="w-12 h-12 rounded-full bg-slate-200 hover:bg-white text-slate-950 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SDK Installation (from user Screenshot 17) */}
      {setupStep === 'sdk' && (
        <div className="max-w-md w-full mx-auto my-auto py-6">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            SDK Installation
          </h2>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            The development tools must be installed for the IDE to work.
          </p>

          <div className="space-y-4 mb-8">
            {/* Automatic switch */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/30 border border-white/10">
              <span className="text-xs font-semibold text-slate-200">Automatic installation</span>
              <button
                type="button"
                onClick={() => setAutoInstall(!autoInstall)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoInstall ? 'bg-sky-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoInstall ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* SDK Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Android SDK version
              </label>
              <select
                value={selectedSdk}
                onChange={(e) => setSelectedSdk(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="SDK 36.1.0">SDK 36.1.0 (Android 15)</option>
                <option value="SDK 35.0.1">SDK 35.0.1 (Android 15 Preview)</option>
                <option value="SDK 34.0.0">SDK 34.0.0 (Android 14)</option>
              </select>
            </div>

            {/* JDK Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                JDK version
              </label>
              <select
                value={selectedJdk}
                onChange={(e) => setSelectedJdk(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="JDK 17">OpenJDK 17 (Recommended for Gradle 8.13)</option>
                <option value="JDK 21">OpenJDK 21 LTS</option>
              </select>
            </div>

            {/* Install Git checkbox */}
            <div
              onClick={() => setInstallGit(!installGit)}
              className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                installGit ? 'bg-sky-500 border-sky-400 text-slate-950 font-bold' : 'border-slate-600'
              }`}>
                {installGit && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Install Git and Termux developer tools</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setSetupStep('permissions')}
              className="w-12 h-12 rounded-full bg-white/10 text-slate-300 flex items-center justify-center hover:bg-white/15 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setSetupStep('hub');
                if (onFinishInitialSetup) onFinishInitialSetup();
              }}
              className="w-12 h-12 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <Check className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Android Code Studio Hub (from user Screenshot 2) */}
      {setupStep === 'hub' && (
        <div className="max-w-4xl w-full mx-auto my-auto py-4">
          {/* Brand Banner */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-3xl font-mono font-bold text-white shadow-xl shadow-sky-500/20 mb-2 ring-2 ring-white/10">
              &#123;🤖&#125;
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Android Code Studio
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Your Ideas, Anywhere · Gradle 8.13 & AAPT2 Termux Engine
            </p>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-6">
            <button
              onClick={() => {
                onClose();
                onNewProject();
              }}
              className="p-3.5 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-sky-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">+ Create project</div>
                <div className="text-[10px] text-slate-400">Choose template, Kotlin, Compose, Flutter</div>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenLivePreview();
              }}
              className="p-3.5 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-emerald-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Live Preview</div>
                <div className="text-[10px] text-slate-400">Interactive Android device emulator & UI</div>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenProperties();
              }}
              className="p-3.5 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-blue-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">IDE Configurations</div>
                <div className="text-[10px] text-slate-400">Termux AAPT2 override & local.properties</div>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenTerminal();
              }}
              className="p-3.5 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-amber-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Terminal</div>
                <div className="text-[10px] text-slate-400">Termux bash, ./gradlew & sdkmanager</div>
              </div>
            </button>

            <button
              onClick={onClose}
              className="p-3.5 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-purple-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
                <FolderOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Open Code Editor</div>
                <div className="text-[10px] text-slate-400">Resume editing active project files</div>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenProperties();
              }}
              className="p-3.5 rounded-2xl bg-[#17181F] hover:bg-[#1E202A] border border-white/10 hover:border-slate-500/40 text-left transition-all group active:scale-98 shadow-sm flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Documentation</div>
                <div className="text-[10px] text-slate-400">Gradle 8.13 & NDK setup guide</div>
              </div>
            </button>
          </div>

          {/* Recent Projects with Delete and Download Buttons */}
          <div className="bg-[#15161C] border border-white/10 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Workspace Projects ({projects.length})
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onNewProject();
                }}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> New Project
              </button>
            </div>

            <div className="space-y-2">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    proj.id === currentProjectId
                      ? 'bg-sky-500/10 border-sky-500/30 text-white'
                      : 'bg-[#191B22] border-white/5 hover:border-white/15 text-slate-300'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectProject(proj.id);
                      onClose();
                    }}
                    className="flex items-center gap-2.5 cursor-pointer flex-1"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs text-sky-400">
                      {proj.type === 'flutter' ? '💙' : proj.type === 'native_compose' ? '🧊' : '📱'}
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{proj.name}</span>
                        {proj.id === currentProjectId && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 font-mono">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {proj.packageName} · {proj.language} · API {proj.targetSdk}
                      </div>
                    </div>
                  </div>

                  {/* Actions for this project: Download Project ZIP & Delete Project */}
                  <div className="flex items-center gap-1">
                    {/* Project Download button */}
                    <button
                      type="button"
                      title="Download Project (ZIP)"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadProject(proj);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 hover:text-sky-300 text-slate-400 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Project Delete button */}
                    {projects.length > 1 && (
                      <button
                        type="button"
                        title="Delete Project"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete project "${proj.name}"?`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onSelectProject(proj.id);
                        onClose();
                      }}
                      className="px-2 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold ml-1"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-2xl w-full mx-auto text-center text-xs text-slate-500 pt-3">
        Android Code Studio Mobile · Termux AAPT2 & Gradle 8.13
      </div>
    </div>
  );
};
