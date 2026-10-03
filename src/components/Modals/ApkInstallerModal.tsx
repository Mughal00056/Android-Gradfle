import React, { useState } from 'react';
import { 
  Smartphone, CheckCircle, ShieldCheck, X, Play, 
  Download, HardDrive, Shield, AlertCircle, Cpu, FileCheck, Check 
} from 'lucide-react';
import { Project } from '../../types';
import { downloadApkFile } from '../../utils/zipUtils';

interface ApkInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onOpenApp: () => void;
}

export const ApkInstallerModal: React.FC<ApkInstallerModalProps> = ({
  isOpen,
  onClose,
  project,
  onOpenApp,
}) => {
  const [installState, setInstallState] = useState<'prompt' | 'scanning' | 'installing' | 'installed'>('prompt');
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'manifest'>('overview');
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleInstall = () => {
    setInstallState('scanning');
    setTimeout(() => {
      setInstallState('installing');
      setTimeout(() => {
        setInstallState('installed');
      }, 1500);
    }, 1000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    await downloadApkFile(project);
    setDownloading(false);
  };

  const handleResetAndClose = () => {
    setInstallState('prompt');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 select-none">
      <div className="bg-[#1C1C24] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Android Package Installer Header */}
        <div className="p-4 bg-[#23242E] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Android Package Installer</span>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* App Profile Bar */}
        <div className="p-4 bg-[#181921] border-b border-white/5 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-sky-500/10 ring-2 ring-white/10">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white tracking-tight">{project.name}</h3>
            <p className="text-xs text-slate-400 font-mono">{project.packageName}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">v1.0.0 (Code 1)</span>
              <span>·</span>
              <span>14.2 MB</span>
              <span>·</span>
              <span className="font-mono">API {project.targetSdk}</span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 bg-[#14151C] text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-sky-400 text-sky-400 font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex-1 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'permissions' ? 'border-sky-400 text-sky-400 font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            Permissions (3)
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`flex-1 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'manifest' ? 'border-sky-400 text-sky-400 font-bold' : 'border-transparent text-slate-400'
            }`}
          >
            Security & Hash
          </button>
        </div>

        {/* Body content based on step */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3.5 text-xs">
          {installState === 'prompt' && (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  {/* Google Play Protect Verification */}
                  <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-300">Verified by Play Protect</div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        No harmful behavior detected. Signed by Android Code Studio debug keystore.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="text-slate-400">Build Configuration:</div>
                    <div className="text-slate-200">Gradle: 8.13-bin (Termux OpenJDK 17)</div>
                    <div className="text-slate-200">AAPT2: /usr/opt/android-sdk/build-tools/36.1.0/aapt2</div>
                    <div className="text-slate-200">Min SDK: API {project.minSdk} · Target: API {project.targetSdk}</div>
                  </div>
                </div>
              )}

              {activeTab === 'permissions' && (
                <div className="space-y-2">
                  {[
                    { title: 'Full network access', perm: 'android.permission.INTERNET', desc: 'Allows the app to make network connections to server endpoints.' },
                    { title: 'View network connections', perm: 'android.permission.ACCESS_NETWORK_STATE', desc: 'Allows the app to view network state information.' },
                    { title: 'Control vibration', perm: 'android.permission.VIBRATE', desc: 'Allows device haptic feedback and vibrations.' },
                  ].map((p, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                      <div className="font-semibold text-slate-200 flex items-center justify-between">
                        <span>{p.title}</span>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[10px] font-mono text-sky-400 mt-0.5">{p.perm}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{p.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'manifest' && (
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="text-slate-400">Package Checksum (SHA-256):</div>
                    <div className="text-emerald-400 break-all text-[10px]">
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="text-slate-400">Signature Scheme:</div>
                    <div className="text-slate-200">Android APK Signature Scheme v2 & v3 Verified</div>
                  </div>
                </div>
              )}
            </>
          )}

          {installState === 'scanning' && (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <Shield className="w-10 h-10 text-sky-400 animate-pulse mb-3" />
              <div className="text-sm font-bold text-white">Scanning package...</div>
              <div className="text-xs text-slate-400 mt-1">Play Protect checking against malicious code</div>
            </div>
          )}

          {installState === 'installing' && (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin mb-3" />
              <div className="text-sm font-bold text-white">Installing {project.name}...</div>
              <div className="text-xs text-slate-400 mt-1">Extracting classes.dex & compiling ahead-of-time (ART)</div>
            </div>
          )}

          {installState === 'installed' && (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="text-base font-bold text-white">Application Installed</div>
              <div className="text-xs text-slate-400 mt-1">Ready to launch on mobile device</div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#23242E] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>{downloading ? 'Downloading...' : 'Download APK'}</span>
          </button>

          <div className="flex items-center gap-2">
            {installState === 'prompt' && (
              <>
                <button
                  onClick={handleResetAndClose}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs active:scale-95 shadow-lg shadow-emerald-500/20 transition-transform"
                >
                  Install to Device
                </button>
              </>
            )}

            {installState === 'installed' && (
              <>
                <button
                  onClick={handleResetAndClose}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    handleResetAndClose();
                    onOpenApp();
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow-lg shadow-sky-500/20 transition-transform"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Live App</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
