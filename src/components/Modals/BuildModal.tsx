import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, AlertTriangle, Download, 
  Smartphone, Share2, Terminal, Copy, Check, Play, Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SdkConfig, Project } from '../../types';
import { downloadApkFile } from '../../utils/zipUtils';

interface BuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  config: SdkConfig;
  onInstallApk: () => void;
  onOpenLivePreview: () => void;
}

export const BuildModal: React.FC<BuildModalProps> = ({
  isOpen,
  onClose,
  project,
  config,
  onInstallApk,
  onOpenLivePreview,
}) => {
  const [stage, setStage] = useState<'idle' | 'building' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const projectName = project.name;
  const packageName = project.packageName;

  const startBuild = () => {
    setStage('building');
    setProgress(5);
    setLogs([
      'Starting Gradle Daemon...',
      `Gradle 8.13-bin running on OpenJDK ${config.jdkVersion}`,
      `Using AAPT2 override: ${config.aapt2Override}`,
      `NDK: ${config.ndkDir}`,
      '> Configure project :app',
    ]);

    const buildSteps = [
      { progress: 20, log: '> Task :app:preBuild UP-TO-DATE' },
      { progress: 35, log: '> Task :app:generateDebugBuildConfig' },
      { progress: 50, log: '> Task :app:mergeDebugResources [Using custom AAPT2: 36.1.0]' },
      { progress: 65, log: '> Task :app:processDebugManifest' },
      { progress: 80, log: '> Task :app:compileDebugKotlin [JVM Target 17]' },
      { progress: 92, log: '> Task :app:dexBuilderDebug' },
      { progress: 98, log: '> Task :app:packageDebug' },
      { progress: 100, log: 'BUILD SUCCESSFUL in 2.84s\n24 actionable tasks: 22 executed, 2 up-to-date' },
    ];

    buildSteps.forEach((step, idx) => {
      setTimeout(() => {
        setProgress(step.progress);
        setLogs((prev) => [...prev, step.log]);

        if (idx === buildSteps.length - 1) {
          setStage('success');
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch (e) {
            // ignore
          }
        }
      }, (idx + 1) * 350);
    });
  };

  useEffect(() => {
    if (isOpen) {
      startBuild();
    } else {
      setStage('idle');
      setProgress(0);
      setLogs([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadRealApk = async () => {
    try {
      setDownloading(true);
      await downloadApkFile(project);
      setDownloading(false);
    } catch (e) {
      console.error('Failed to generate APK', e);
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 select-none">
      <div className="bg-[#18191F] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3.5 bg-[#1F2028] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              APK
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {stage === 'building' ? 'Building Debug APK...' : 'Build Finished'}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                :app:assembleDebug (Gradle 8.13)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/40 h-1.5 overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className={`h-full transition-all duration-300 ${
              stage === 'success' ? 'bg-emerald-400' : 'bg-sky-400'
            }`}
          />
        </div>

        {/* Success Card or In-Progress */}
        {stage === 'success' && (
          <div className="p-4 bg-emerald-950/20 border-b border-emerald-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-300 font-mono">
                  {projectName}-debug.apk
                </div>
                <div className="text-[11px] text-slate-300">
                  Size: 14.2 MB · targetSdk 35 · API 24+
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onInstallApk}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 active:scale-95 shadow-md transition-transform"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install APK</span>
              </button>
            </div>
          </div>
        )}

        {/* Build Terminal Logs */}
        <div className="p-3 bg-[#111216] max-h-56 overflow-y-auto no-scrollbar font-mono text-[11px] leading-relaxed space-y-1 text-slate-300">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`${
                log.includes('BUILD SUCCESSFUL')
                  ? 'text-emerald-400 font-bold'
                  : log.startsWith('> Task')
                  ? 'text-sky-300'
                  : 'text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-[#1F2028] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              navigator.clipboard.writeText(logs.join('\n'));
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Logs' : 'Copy Logs'}</span>
          </button>

          <div className="flex items-center gap-2">
            {stage === 'success' && (
              <>
                <button
                  onClick={handleDownloadRealApk}
                  disabled={downloading}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
                >
                  <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
                  <span>{downloading ? 'Packaging...' : 'Download APK'}</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenLivePreview();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Live Preview</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
