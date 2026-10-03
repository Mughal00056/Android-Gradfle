import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, Copy, Check, ArrowRight } from 'lucide-react';

interface TerminalViewProps {
  onRunBuild?: () => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ onRunBuild }) => {
  const [history, setHistory] = useState<string[]>([
    'Android Code Studio Shell v2.4 (aarch64-linux-android)',
    'Termux environment initialized at /data/data/com.termux/files/home',
    'Installed: OpenJDK 17, Gradle 8.13, Android SDK 36.1.0, AAPT2 override',
    'Type "help" or "./gradlew assembleDebug" to start building.',
    '',
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newHistory = [...history, `$ ${trimmed}`];

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();

    switch (mainCmd) {
      case 'help':
        newHistory.push(
          'Available commands:',
          '  ./gradlew assembleDebug - Compile APK using Gradle 8.13 and AAPT2',
          '  ./gradlew clean         - Clean build cache and dist artifacts',
          '  sdkmanager --list       - View installed Android SDK platforms and build-tools',
          '  properties              - Display active gradle.properties and local.properties',
          '  pwd                     - Print current working directory',
          '  ls                      - List project files',
          '  uname -m                - Print CPU architecture',
          '  clear                   - Clear terminal display'
        );
        break;

      case './gradlew':
      case 'gradle':
      case 'gradlew':
        if (parts[1] === 'assembledebug' || parts[1] === 'build' || !parts[1]) {
          newHistory.push(
            '> Task :app:preBuild UP-TO-DATE',
            '> Task :app:generateDebugBuildConfig',
            '> Task :app:mergeDebugResources [Using custom AAPT2: 36.1.0]',
            '> Task :app:compileDebugKotlin [Gradle 8.13-bin]',
            '> Task :app:dexBuilderDebug',
            '> Task :app:packageDebug',
            '> Task :app:assembleDebug',
            '',
            'BUILD SUCCESSFUL in 2.14s',
            'Output generated: app/build/outputs/apk/debug/app-debug.apk (14.2 MB)'
          );
          if (onRunBuild) {
            onRunBuild();
          }
        } else if (parts[1] === 'clean') {
          newHistory.push(
            '> Task :app:clean',
            'BUILD SUCCESSFUL in 0.42s'
          );
        } else {
          newHistory.push(`> Task ${parts[1] || ''} executed successfully.`);
        }
        break;

      case 'properties':
      case 'cat':
        newHistory.push(
          '=== EDIT APP PROPERTIES ===',
          '1. android/gradle.properties:',
          '   android.aapt2FromMavenOverride=/data/data/com.termux/files/usr/opt/android-sdk/build-tools/36.1.0/aapt2',
          '   android.useAndroidX=true',
          '',
          '2. android/local.properties:',
          '   sdk.dir=/data/data/com.termux/files/usr/opt/android-sdk',
          '   ndk.dir=/data/data/com.termux/files/usr/opt/android-sdk/ndk/29.0.14206865',
          '   cmake.dir=/data/data/com.termux/files/usr/opt/android-sdk/cmake/4.1.2',
          '',
          '3. gradle-wrapper.properties:',
          '   distributionUrl=https://services.gradle.org/distributions/gradle-8.13-bin.zip'
        );
        break;

      case 'pwd':
        newHistory.push('/data/data/com.termux/files/home/AndroidIDEProjects/no_ytgg');
        break;

      case 'uname':
        newHistory.push('aarch64');
        break;

      case 'ls':
        newHistory.push('app  build.gradle  gradle  gradle.properties  gradlew  local.properties  settings.gradle');
        break;

      case 'sdkmanager':
        newHistory.push(
          'Installed packages:',
          '  build-tools;36.1.0      | 36.1.0       | Android SDK Build-Tools 36.1.0',
          '  build-tools;35.0.1      | 35.0.1       | Android SDK Build-Tools 35.0.1',
          '  ndk;29.0.14206865       | 29.0.14206865| NDK (Side by side)',
          '  cmake;4.1.2             | 4.1.2        | CMake 4.1.2',
          '  platforms;android-35    | 1            | Android SDK Platform 35'
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        newHistory.push(`bash: ${trimmed}: command not found. Type "help" for valid commands.`);
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex + 1 < cmdHistory.length ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setInput(cmdHistory[cmdHistory.length - 1 - nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Virtual mobile key row matching user screenshots
  const accessoryKeys = ['ESC', '/', '—', 'HOME', '↑', 'END', 'PGUP', 'TAB', 'CTRL', 'ALT', '←', '↓', '→', 'PGDN'];

  return (
    <div className="h-full flex flex-col bg-[#0C0D10] text-[#E0E0E0] font-mono text-xs select-text overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="shrink-0 h-9 px-3 bg-[#141519] border-b border-white/10 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-300">Terminal (Termux bash)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleCommand('./gradlew assembleDebug')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold active:scale-95"
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>./gradlew</span>
          </button>
          <button
            onClick={() => setHistory([])}
            title="Clear terminal"
            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-3 overflow-y-auto no-scrollbar font-mono leading-relaxed space-y-1">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.startsWith('$')
                ? 'text-sky-400 font-bold'
                : line.includes('BUILD SUCCESSFUL')
                ? 'text-emerald-400 font-bold'
                : line.includes('Error') || line.includes('failed')
                ? 'text-red-400'
                : line.startsWith('> Task')
                ? 'text-amber-300'
                : 'text-slate-300'
            }`}
          >
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt */}
      <div className="shrink-0 px-3 py-2 bg-[#121316] border-t border-white/10 flex items-center gap-2">
        <span className="text-emerald-400 font-bold select-none">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command (e.g. ./gradlew assembleDebug, help)..."
          className="flex-1 bg-transparent text-white outline-none text-xs font-mono"
          autoFocus
        />
        <button
          onClick={() => handleCommand(input)}
          className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold"
        >
          Run
        </button>
      </div>

      {/* Virtual Terminal Accessory Keys (from Termux screenshot) */}
      <div className="shrink-0 h-9 px-2 bg-[#17181E] border-t border-white/5 flex items-center gap-1 overflow-x-auto no-scrollbar select-none">
        {accessoryKeys.map((key) => (
          <button
            key={key}
            onClick={() => {
              if (key === 'TAB') setInput((prev) => prev + '    ');
              else if (key === 'ESC') setInput('');
              else if (key === 'HOME') setInput((prev) => './gradlew ' + prev);
              else setInput((prev) => prev + (key === '—' ? '-' : key.toLowerCase()));
            }}
            className="h-6 px-2 rounded bg-[#22242D] hover:bg-[#2C2E3A] text-slate-300 text-[10px] font-mono flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};
