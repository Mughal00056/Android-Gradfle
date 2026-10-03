import React, { useState } from 'react';
import { 
  Plus, Minus, RefreshCw, Smartphone, Sparkles, 
  Terminal, Sliders, ToggleLeft, ToggleRight, CheckCircle2 
} from 'lucide-react';

interface ComposePreviewRendererProps {
  theme: 'dark' | 'light';
  onShowToast: (message: string) => void;
}

export const ComposePreviewRenderer: React.FC<ComposePreviewRendererProps> = ({
  theme,
  onShowToast,
}) => {
  const [counter, setCounter] = useState(0);
  const [sliderVal, setSliderVal] = useState(65);
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(true);
  const [selectedChip, setSelectedChip] = useState('All');

  const isDark = theme === 'dark';

  return (
    <div className={`h-full flex flex-col justify-between overflow-y-auto no-scrollbar ${
      isDark ? 'bg-[#131316] text-[#E5E7EB]' : 'bg-[#F9FAFB] text-[#111827]'
    }`}>
      {/* Jetpack Compose Material 3 TopAppBar */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${
        isDark ? 'bg-[#1C1C22] border-[#2A2B33]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            C
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Jetpack Compose UI</div>
            <div className="text-[10px] text-slate-400">@Composable preview active</div>
          </div>
        </div>
        <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
          M3 Material
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 flex flex-col gap-3.5">
        {/* Counter Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-[#1C1C22] border-[#2A2B33]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="text-xs font-medium text-slate-400 mb-1">
            remember &#123; mutableStateOf(0) &#125;
          </div>
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-2xl font-bold font-mono tracking-tight">
              State: {counter}
            </div>
            <button
              onClick={() => {
                setCounter(0);
                onShowToast('State reset to 0');
              }}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setCounter((c) => c + 1);
                onShowToast(`State incremented (+1) -> ${counter + 1}`);
              }}
              className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Increment (+1)</span>
            </button>

            <button
              onClick={() => {
                setCounter((c) => Math.max(0, c - 1));
                onShowToast(`State decremented (-1) -> ${Math.max(0, counter - 1)}`);
              }}
              className={`py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform border ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Decrement (-1)</span>
            </button>
          </div>
        </div>

        {/* Filter Chips row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['All', 'Stateful', 'Modifiers', 'Animations', 'LazyColumn'].map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setSelectedChip(chip);
                onShowToast(`Compose Filter: ${chip}`);
              }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                selectedChip === chip
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Compose Slider & Toggle Box */}
        <div className={`p-3.5 rounded-2xl border ${
          isDark ? 'bg-[#1C1C22] border-[#2A2B33]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Compose Slider Value</span>
            <span className="text-xs font-mono text-sky-400">{sliderVal}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500 mb-3"
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <span className="text-xs">Dynamic Recomposition</span>
            <button
              onClick={() => {
                setIsFeatureEnabled(!isFeatureEnabled);
                onShowToast(`Recomposition: ${!isFeatureEnabled ? 'Active' : 'Paused'}`);
              }}
              className="text-sky-400"
            >
              {isFeatureEnabled ? (
                <ToggleRight className="w-6 h-6 text-sky-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* LazyColumn simulation */}
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            LazyColumn (Items List)
          </div>
          {[
            { name: 'Modifier.fillMaxWidth().padding(16.dp)', desc: 'Standard layout constraint' },
            { name: 'rememberCoroutineScope()', desc: 'Asynchronous event handler' },
            { name: 'AnimatedVisibility(visible = true)', desc: 'Material spring transition' },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onShowToast(`Tapped Composable: ${item.name}`)}
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer active:scale-98 transition-all ${
                isDark ? 'bg-[#18181D] border-[#2A2B33] hover:border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="text-xs font-mono text-emerald-400">{item.name}</div>
                <div className="text-[10px] text-slate-400">{item.desc}</div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="p-4 flex justify-end">
        <button
          onClick={() => {
            setCounter((c) => c + 10);
            onShowToast('Compose FAB: Fast Increment (+10)');
          }}
          className="w-12 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <Sparkles className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
};
