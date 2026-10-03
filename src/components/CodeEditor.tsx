import React, { useRef, useState, useEffect } from 'react';
import { 
  X, Save, Search, Check, FileCode, Code, AlignLeft, 
  Copy, CheckCheck, Play, Eye, Sparkles, Replace, 
  ArrowDown, ArrowUp, Hash, Zap 
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

interface AutocompleteItem {
  label: string;
  detail: string;
  snippet: string;
}

const KOTLIN_SUGGESTIONS: AutocompleteItem[] = [
  { label: 'findViewById', detail: 'View Binding', snippet: 'findViewById<TextView>(R.id.)' },
  { label: 'setOnClickListener', detail: 'Button Event', snippet: 'setOnClickListener { \n    \n}' },
  { label: 'Toast.makeText', detail: 'Android Toast', snippet: 'Toast.makeText(this, "Message", Toast.LENGTH_SHORT).show()' },
  { label: 'remember { mutableStateOf() }', detail: 'Compose State', snippet: 'var state by remember { mutableStateOf(0) }' },
  { label: 'Modifier.fillMaxWidth()', detail: 'Compose Modifier', snippet: 'Modifier.fillMaxWidth()' },
  { label: 'Column', detail: 'Compose Layout', snippet: 'Column(modifier = Modifier.padding(16.dp)) {\n    \n}' },
  { label: 'Button', detail: 'Compose Button', snippet: 'Button(onClick = { /* action */ }) {\n    Text("Click")\n}' },
  { label: 'override fun onCreate', detail: 'Lifecycle', snippet: 'override fun onCreate(savedInstanceState: Bundle?) {\n    super.onCreate(savedInstanceState)\n}' },
];

const XML_SUGGESTIONS: AutocompleteItem[] = [
  { label: '<LinearLayout', detail: 'Layout Container', snippet: '<LinearLayout\n    android:layout_width="match_parent"\n    android:layout_height="wrap_content"\n    android:orientation="vertical">\n</LinearLayout>' },
  { label: '<TextView', detail: 'Text Display', snippet: '<TextView\n    android:layout_width="wrap_content"\n    android:layout_height="wrap_content"\n    android:text="Text"\n    android:textSize="16sp" />' },
  { label: '<Button', detail: 'Action Button', snippet: '<Button\n    android:layout_width="match_parent"\n    android:layout_height="48dp"\n    android:text="Button" />' },
  { label: '<EditText', detail: 'User Input', snippet: '<EditText\n    android:layout_width="match_parent"\n    android:layout_height="wrap_content"\n    android:hint="Enter text..." />' },
  { label: 'android:layout_width="match_parent"', detail: 'Width Constraint', snippet: 'android:layout_width="match_parent"' },
  { label: 'android:layout_height="wrap_content"', detail: 'Height Constraint', snippet: 'android:layout_height="wrap_content"' },
];

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
  
  // Search & Replace state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  // Go to line state
  const [showGoToLine, setShowGoToLine] = useState(false);
  const [goToLineNum, setGoToLineNum] = useState('');

  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<AutocompleteItem[]>([]);

  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formatSuccess, setFormatSuccess] = useState(false);

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

  // Cursor movement
  const handleMoveCursor = (delta: number) => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    const newPos = Math.max(0, Math.min(ta.value.length, ta.selectionStart + delta));
    ta.selectionStart = ta.selectionEnd = newPos;
    ta.focus();
    handleCursorUpdate();
  };

  // Smart Auto-bracket matching
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeFile) return;
    const newVal = e.target.value;
    onContentChange(activeFile.id, newVal);
    handleCursorUpdate();

    // Check last word for autocomplete triggers
    const selStart = e.target.selectionStart;
    const textBefore = newVal.slice(0, selStart);
    const lastWord = textBefore.split(/[\s<({[;]/).pop() || '';

    if (lastWord.length >= 2) {
      const isXml = activeFile.name.endsWith('.xml');
      const list = isXml ? XML_SUGGESTIONS : KOTLIN_SUGGESTIONS;
      const matched = list.filter((item) =>
        item.label.toLowerCase().includes(lastWord.toLowerCase())
      );
      if (matched.length > 0) {
        setCurrentSuggestions(matched);
        setShowAutocomplete(true);
        return;
      }
    }
    setShowAutocomplete(false);
  };

  const applySuggestion = (item: AutocompleteItem) => {
    handleInsert(item.snippet);
    setShowAutocomplete(false);
  };

  // Search & Replace logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query || !activeFile?.content) {
      setMatchCount(0);
      return;
    }
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = activeFile.content.match(regex);
    setMatchCount(matches ? matches.length : 0);
  };

  const handleReplaceOne = () => {
    if (!searchQuery || !activeFile?.content) return;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const updated = activeFile.content.replace(regex, replaceQuery);
    onContentChange(activeFile.id, updated);
  };

  const handleReplaceAll = () => {
    if (!searchQuery || !activeFile?.content) return;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const updated = activeFile.content.replace(regex, replaceQuery);
    onContentChange(activeFile.id, updated);
    setMatchCount(0);
  };

  // Go to Line
  const handleGoToLineSubmit = () => {
    const num = parseInt(goToLineNum, 10);
    if (isNaN(num) || !textareaRef.current || !activeFile?.content) return;
    const lineIndex = Math.max(1, Math.min(lineCount, num)) - 1;
    const allLines = activeFile.content.split('\n');
    let targetPos = 0;
    for (let i = 0; i < lineIndex; i++) {
      targetPos += allLines[i].length + 1;
    }
    textareaRef.current.focus();
    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = targetPos;
    handleCursorUpdate();
    setShowGoToLine(false);
    setGoToLineNum('');
  };

  // Auto-format Code
  const handleFormatCode = () => {
    if (!activeFile?.content) return;
    const fileLines = activeFile.content.split('\n');
    let indent = 0;
    const formatted = fileLines
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.endsWith('}') || trimmed.startsWith('</') || trimmed.endsWith('/>')) {
          indent = Math.max(0, indent - 1);
        }
        const indentedLine = '    '.repeat(indent) + trimmed;
        if (trimmed.endsWith('{') || (trimmed.startsWith('<') && !trimmed.endsWith('/>') && !trimmed.startsWith('</') && !trimmed.startsWith('<?'))) {
          indent++;
        }
        return indentedLine;
      })
      .join('\n');

    onContentChange(activeFile.id, formatted);
    setFormatSuccess(true);
    setTimeout(() => setFormatSuccess(false), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleInsert('    ');
    } else if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setShowSearch((prev) => !prev);
    } else if (e.key === 'g' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setShowGoToLine((prev) => !prev);
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

  const getFileBadge = (name: string) => {
    if (name.endsWith('.kt') || name.endsWith('.kts')) return { label: 'KT', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
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
    <div className="h-full flex flex-col bg-[#14151A] overflow-hidden select-text relative">
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
                <span className="truncate max-w-[120px]">{file.name}</span>
                <button
                  type="button"
                  title="Close file"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseFile(file.id);
                  }}
                  className={`p-1 rounded-md transition-colors flex items-center justify-center ${
                    isActive
                      ? 'text-slate-300 hover:bg-white/10 hover:text-red-400'
                      : 'text-slate-500 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Toolbar Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {openFiles.length > 1 && (
            <button
              type="button"
              onClick={() => {
                openFiles.forEach((f) => {
                  if (f.id !== activeFile.id) onCloseFile(f.id);
                });
              }}
              title="Close other tabs"
              className="text-[10px] px-1.5 py-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            >
              Close Others
            </button>
          )}

          <button
            type="button"
            onClick={handleFormatCode}
            title="Auto-format code"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {formatSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlignLeft className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            title="Find & Replace (Ctrl+F)"
            className={`p-1.5 rounded transition-colors ${showSearch ? 'bg-sky-500 text-slate-950 font-bold' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowGoToLine(!showGoToLine)}
            title="Go to Line"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <Hash className="w-3.5 h-3.5" />
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

      {/* Find and Replace Bar */}
      {showSearch && (
        <div className="p-2.5 bg-[#1C1E26] border-b border-white/10 flex flex-wrap items-center gap-2 text-xs select-none">
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/10 flex-1 min-w-[140px]">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Find in file..."
              className="bg-transparent text-white outline-none w-full font-mono text-xs"
              autoFocus
            />
            {matchCount > 0 && (
              <span className="text-[10px] text-sky-400 font-mono px-1 rounded bg-sky-500/20 shrink-0">
                {matchCount} match{matchCount > 1 ? 'es' : ''}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/10 flex-1 min-w-[140px]">
            <Replace className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace with..."
              className="bg-transparent text-white outline-none w-full font-mono text-xs"
            />
          </div>

          <button
            onClick={handleReplaceOne}
            disabled={!matchCount}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-xs disabled:opacity-40"
          >
            Replace
          </button>
          <button
            onClick={handleReplaceAll}
            disabled={!matchCount}
            className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs disabled:opacity-40"
          >
            Replace All
          </button>
          <button
            onClick={() => setShowSearch(false)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Go to Line Bar */}
      {showGoToLine && (
        <div className="p-2 bg-[#1C1E26] border-b border-white/10 flex items-center gap-2 text-xs select-none">
          <Hash className="w-4 h-4 text-sky-400" />
          <span className="text-slate-300">Go to Line (1 - {lineCount}):</span>
          <input
            type="number"
            min="1"
            max={lineCount}
            value={goToLineNum}
            onChange={(e) => setGoToLineNum(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGoToLineSubmit()}
            placeholder={`1..${lineCount}`}
            className="w-24 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none font-mono"
            autoFocus
          />
          <button
            onClick={handleGoToLineSubmit}
            className="px-3 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
          >
            Jump
          </button>
          <button
            onClick={() => setShowGoToLine(false)}
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
          onChange={handleTextChange}
          onKeyUp={handleCursorUpdate}
          onClick={handleCursorUpdate}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 h-full py-3 px-3 bg-transparent text-slate-200 font-mono text-xs leading-5 outline-none resize-none overflow-auto whitespace-pre tab-4"
        />

        {/* Autocomplete Suggestions Popup */}
        {showAutocomplete && currentSuggestions.length > 0 && (
          <div className="absolute top-12 left-16 z-30 w-72 bg-[#1A1C24] border border-sky-500/40 rounded-xl shadow-2xl p-1.5 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-sky-400 flex items-center justify-between border-b border-white/10 uppercase tracking-wider">
              <span>Code Completion</span>
              <Zap className="w-3 h-3" />
            </div>
            {currentSuggestions.slice(0, 4).map((sug, idx) => (
              <div
                key={idx}
                onClick={() => applySuggestion(sug)}
                className="px-2 py-1.5 rounded-lg hover:bg-sky-500/20 cursor-pointer flex items-center justify-between text-xs transition-colors"
              >
                <span className="font-mono font-bold text-slate-200">{sug.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">{sug.detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Virtual Mobile Developer Keyboard Toolbar */}
      <VirtualKeyboardBar 
        onInsert={handleInsert}
        onUndo={() => document.execCommand('undo')}
        onRedo={() => document.execCommand('redo')}
      />

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
          <span>{lineCount} lines</span>
        </div>
      </div>
    </div>
  );
};
