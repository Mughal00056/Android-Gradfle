import React, { useState } from 'react';
import { X, Check, Copy, Settings, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { SdkConfig } from '../../types';

interface AppPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SdkConfig;
  onSaveConfig: (updatedConfig: SdkConfig) => void;
}

export const AppPropertiesModal: React.FC<AppPropertiesModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'gradle' | 'local' | 'wrapper'>('gradle');
  const [aapt2Override, setAapt2Override] = useState(config.aapt2Override);
  const [sdkDir, setSdkDir] = useState(config.sdkDir);
  const [ndkDir, setNdkDir] = useState(config.ndkDir);
  const [cmakeDir, setCmakeDir] = useState(config.cmakeDir);
  const [distributionUrl, setDistributionUrl] = useState(config.gradleDistributionUrl);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    const text = `=== EDIT APP PROPERTIES ===

1. Edit android/gradle.properties:
   Add: android.aapt2FromMavenOverride=${aapt2Override}

2. Edit android/local.properties:
   Add:
   sdk.dir=${sdkDir}
   ndk.dir=${ndkDir}
   cmake.dir=${cmakeDir}

3. Edit gradle/wrapper/gradle-wrapper.properties:
   distributionUrl=${distributionUrl}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onSaveConfig({
      ...config,
      aapt2Override,
      sdkDir,
      ndkDir,
      cmakeDir,
      gradleDistributionUrl: distributionUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetToDefaults = () => {
    setAapt2Override('/data/data/com.termux/files/usr/opt/android-sdk/build-tools/36.1.0/aapt2');
    setSdkDir('/data/data/com.termux/files/usr/opt/android-sdk');
    setNdkDir('/data/data/com.termux/files/usr/opt/android-sdk/ndk/29.0.14206865');
    setCmakeDir('/data/data/com.termux/files/usr/opt/android-sdk/cmake/4.1.2');
    setDistributionUrl('https://services.gradle.org/distributions/gradle-8.13-bin.zip');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 select-none">
      <div className="bg-[#18191F] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3.5 bg-[#1F2028] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                App Properties & Toolchains
              </h2>
              <p className="text-[11px] text-slate-400">
                Termux Android SDK, AAPT2 override & Gradle 8.13
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

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-white/10 bg-[#14151A] px-2 text-xs">
          <button
            onClick={() => setActiveTab('gradle')}
            className={`py-2 px-3 border-b-2 font-mono transition-colors ${
              activeTab === 'gradle'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            gradle.properties
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`py-2 px-3 border-b-2 font-mono transition-colors ${
              activeTab === 'local'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            local.properties
          </button>
          <button
            onClick={() => setActiveTab('wrapper')}
            className={`py-2 px-3 border-b-2 font-mono transition-colors ${
              activeTab === 'wrapper'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            gradle-wrapper
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-4">
          {activeTab === 'gradle' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  1. AAPT2 From Maven Override (Termux)
                </label>
                <div className="text-[11px] text-slate-400 mb-1.5 font-mono">
                  android.aapt2FromMavenOverride
                </div>
                <input
                  type="text"
                  value={aapt2Override}
                  onChange={(e) => setAapt2Override(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-sky-300 font-mono outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5 font-mono text-[11px] text-slate-300 space-y-1">
                <div className="text-slate-500"># android/gradle.properties content:</div>
                <div>org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8</div>
                <div>android.useAndroidX=true</div>
                <div className="text-sky-400 font-bold">
                  android.aapt2FromMavenOverride={aapt2Override}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'local' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  sdk.dir (Android SDK Path)
                </label>
                <input
                  type="text"
                  value={sdkDir}
                  onChange={(e) => setSdkDir(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-sky-300 font-mono outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ndk.dir (Android NDK Path)
                </label>
                <input
                  type="text"
                  value={ndkDir}
                  onChange={(e) => setNdkDir(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-sky-300 font-mono outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  cmake.dir (CMake Path)
                </label>
                <input
                  type="text"
                  value={cmakeDir}
                  onChange={(e) => setCmakeDir(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-sky-300 font-mono outline-none focus:border-sky-500"
                />
              </div>

              <div className="text-[11px] text-amber-400/90 font-medium">
                Note: No PATH or environment variables needed. Managed automatically.
              </div>
            </div>
          )}

          {activeTab === 'wrapper' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  distributionUrl (Gradle Wrapper)
                </label>
                <input
                  type="text"
                  value={distributionUrl}
                  onChange={(e) => setDistributionUrl(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-sky-300 font-mono outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5 font-mono text-[11px] text-slate-300 space-y-1">
                <div className="text-slate-500"># gradle/wrapper/gradle-wrapper.properties:</div>
                <div>distributionBase=GRADLE_USER_HOME</div>
                <div>distributionPath=wrapper/dists</div>
                <div className="text-emerald-400 font-bold">
                  distributionUrl={distributionUrl}
                </div>
                <div>zipStoreBase=GRADLE_USER_HOME</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-[#1F2028] border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>
            <button
              onClick={handleResetToDefaults}
              title="Reset to recommended"
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
              <span>{savedSuccess ? 'Applied!' : 'Apply Properties'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
