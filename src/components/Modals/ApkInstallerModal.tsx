import React, { useState } from 'react';
import { Smartphone, CheckCircle, ShieldCheck, X, Play } from 'lucide-react';

interface ApkInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  packageName: string;
  onOpenApp: () => void;
}

export const ApkInstallerModal: React.FC<ApkInstallerModalProps> = ({
  isOpen,
  onClose,
  appName,
  packageName,
  onOpenApp,
}) => {
  const [installState, setInstallState] = useState<'prompt' | 'installing' | 'installed'>('prompt');

  if (!isOpen) return null;

  const handleInstall = () => {
    setInstallState('installing');
    setTimeout(() => {
      setInstallState('installed');
    }, 1800);
  };

  const handleResetAndClose = () => {
    setInstallState('prompt');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#1C1C24] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl p-5 flex flex-col">
        {/* App Lockup */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center text-2xl font-bold">
            🤖
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{appName}</h3>
            <p className="text-xs text-slate-400 font-mono">{packageName}</p>
          </div>
        </div>

        {/* Content depending on state */}
        {installState === 'prompt' && (
          <div>
            <p className="text-xs text-slate-300 mb-3">
              Do you want to install this application? It requires access to:
            </p>

            <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-2 mb-5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Full network access (INTERNET)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>View network connections</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Control vibration & device sensors</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInstall}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs active:scale-95 transition-transform"
              >
                Install
              </button>
            </div>
          </div>
        )}

        {installState === 'installing' && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-200">Installing application...</p>
            <p className="text-xs text-slate-400 mt-1">Verifying APK signature & resources</p>
          </div>
        )}

        {installState === 'installed' && (
          <div>
            <div className="py-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
              <span className="text-sm font-bold text-white">App installed.</span>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => {
                  handleResetAndClose();
                  onOpenApp();
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-transform"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open in Live Preview</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
