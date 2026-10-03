import React from 'react';
import { CornerDownLeft, Undo, Redo } from 'lucide-react';

interface VirtualKeyboardBarProps {
  onInsert: (text: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const VirtualKeyboardBar: React.FC<VirtualKeyboardBarProps> = ({
  onInsert,
  onUndo,
  onRedo,
}) => {
  const quickKeys = [
    { label: '{', value: '{' },
    { label: '}', value: '}' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '[', value: '[' },
    { label: ']', value: ']' },
    { label: '<', value: '<' },
    { label: '>', value: '>' },
    { label: '=', value: '=' },
    { label: ';', value: ';' },
    { label: ':', value: ':' },
    { label: '"', value: '"' },
    { label: "'", value: "'" },
    { label: '/', value: '/' },
    { label: '#', value: '#' },
    { label: '_', value: '_' },
    { label: '$', value: '$' },
    { label: '@', value: '@' },
    { label: '.', value: '.' },
    { label: 'Tab', value: '    ' },
  ];

  return (
    <div className="shrink-0 h-10 px-2 bg-[#1A1C23] border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none z-10">
      {onUndo && (
        <button
          type="button"
          onClick={onUndo}
          title="Undo"
          className="h-7 px-2.5 rounded-md bg-[#252833] hover:bg-[#323644] text-slate-300 flex items-center justify-center text-xs active:scale-90 transition-transform"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
      )}

      {onRedo && (
        <button
          type="button"
          onClick={onRedo}
          title="Redo"
          className="h-7 px-2.5 rounded-md bg-[#252833] hover:bg-[#323644] text-slate-300 flex items-center justify-center text-xs active:scale-90 transition-transform"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="w-[1px] h-5 bg-white/10 mx-0.5" />

      {quickKeys.map((k) => (
        <button
          key={k.label}
          type="button"
          onClick={() => onInsert(k.value)}
          className="h-7 min-w-[30px] px-2 rounded-md bg-[#252833] hover:bg-[#323644] text-slate-200 font-mono text-xs flex items-center justify-center active:bg-sky-500 active:text-slate-950 transition-colors shrink-0 shadow-sm"
        >
          {k.label}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onInsert('\n')}
        title="Enter / New Line"
        className="h-7 px-3 rounded-md bg-sky-500/20 border border-sky-500/30 text-sky-400 hover:bg-sky-500/30 flex items-center justify-center text-xs shrink-0 active:scale-95"
      >
        <CornerDownLeft className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
