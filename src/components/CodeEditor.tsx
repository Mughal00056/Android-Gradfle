import React, { useRef, useState, useEffect } from 'react';
import { 
  X, Save, Search, Check, FileCode, Code, AlignLeft, 
  Copy, CheckCheck, Play, Eye, Sparkles 
} from 'lucide-react';
import { ProjectFile } from '../types';
import { VirtualKeyboardBar } from './VirtualKeyboardBar';

interface CodeEditorProps {
  activeFile: ProjectFile | null;
  openFiles: ProjectFile[];
  onSelectFile: (id: string) => void;
  onCloseFile: (id: string) => void;
  onContentChange: (id: string, newContent: string) => void;
  onRunPreview: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  activeFile,
  openFiles,
  onSelectFile,
  onCloseFile,
  onContentChange,
  onRunPreview,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute line count
  const lines = (activeFile?.content || '').split('\n');
  const lineCount = lines.length;

  const handleCursorUpdate = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    const selStart = textareaRef.current.selectionStart;
    const linesBefore = text.slice(0, selStart).split('\n');
    setCursorPos({
      line: linesBefore.length,
      col: linesBefore[linesBefore.length - 1].length + 1,
    });
  };

  const handleInsert = (textToInsert: string) => {
    if (!textareaRef.current || !activeFile) return;
    const ta = textareaRef.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;

    const newVal = val.substring(0, start) + textToInsert + val.substring(end);
    onContentChange(activeFile.id, newVal);

    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + textToInsert.length;
      handleCursorUpdate();
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleInsert('    ');
    }
  };

  const handleCopyCode = () => {
    if (!activeFile?.content) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1500);
  };

  // Get file type badge color
  const getFileBadge = (name: string) => {
    if (name.endsWith('.kt')) return { label: 'KT', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
    if (name.endsWith('.xml')) return { label: 'XML', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (name.endsWith('.gradle') || name.endsWith('.gradle.kts')) return { label: 'GDL', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (name.endsWith('.properties')) return { label: 'CFG', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (name.endsWith('.dart')) return { label: 'DART', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' };
    return { label: 'TXT', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
  };

  if (!activeFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#131418] text-slate-500 p-6 text-center">
        <FileCode className="w-12 h-12 mb-3 opacity-40 text-slate-400" />
        <p className="text-sm font-medium text-slate-300">No File Selected</p>
        <p className="text-xs text-slate-500 mt-1">Select a file from the project explorer on the left</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#14151A] overflow-hidden select-text">
      {/* File Tabs Bar */}
      <div className="shrink-0 h-10 px-2 bg-[#191A20] border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar select-none">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {openFiles.map((file) => {
            const isActive = file.id === activeFile.id;
            const badge = getFileBadge(file.name);

            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-t-2 text-xs font-mono cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#14151A] border-sky-400 text-slate-100 font-medium'
                    : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span className={`text-[9px] px-1 py-0.2 rounded border ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="truncate max-w-[130px]">{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseFile(file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Toolbar Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            title="Find (Ctrl+F)"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            title="Copy Code"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleSave}
            title="Save file"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onRunPreview}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 text-xs font-semibold active:scale-95 transition-all"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* Find Box if active */}
      {showSearch && (
        <div className="p-2 bg-[#1A1C23] border-b border-white/10 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code..."
            className="bg-black/30 text-xs text-white px-2 py-1 rounded border border-white/10 outline-none flex-1"
          />
          <button
            onClick={() => setShowSearch(false)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Code Viewport with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers gutter */}
        <div className="shrink-0 w-11 py-3 bg-[#111216] border-r border-white/5 text-right pr-2.5 font-mono text-xs text-slate-600 select-none overflow-hidden">
          {Array.from({ length: Math.max(lineCount, 20) }).map((_, i) => (
            <div
              key={i}
              className={`h-5 leading-5 ${cursorPos.line === i + 1 ? 'text-sky-400 font-bold' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={activeFile.content || ''}
          onChange={(e) => onContentChange(activeFile.id, e.target.value)}
          onKeyUp={handleCursorUpdate}
          onClick={handleCursorUpdate}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 h-full py-3 px-3 bg-transparent text-slate-200 font-mono text-xs leading-5 outline-none resize-none overflow-auto whitespace-pre tab-4"
        />
      </div>

      {/* Virtual Mobile Developer Keyboard Toolbar */}
      <VirtualKeyboardBar onInsert={handleInsert} />

      {/* Bottom Editor Status Bar */}
      <div className="shrink-0 h-6 px-3 bg-[#111216] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span className="text-slate-600">|</span>
          <span>{activeFile.language?.toUpperCase() || 'CODE'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span className="text-slate-600">|</span>
          <span>4 spaces</span>
        </div>
      </div>
    </div>
  );
};
