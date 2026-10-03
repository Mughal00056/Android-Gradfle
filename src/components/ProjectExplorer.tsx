import React, { useState } from 'react';
import { 
  Folder, FolderOpen, FileCode, FileText, ChevronRight, 
  ChevronDown, Plus, Trash2, Edit3, MoreVertical, 
  Settings, Layers, Terminal, Sparkles, Box 
} from 'lucide-react';
import { ProjectFile } from '../types';

interface ProjectExplorerProps {
  files: ProjectFile[];
  activeFileId: string;
  projectName: string;
  onSelectFile: (id: string) => void;
  onAddFile: (targetDirId: string | null, name: string, isDirectory: boolean) => void;
  onDeleteFile: (id: string) => void;
  onRenameFile: (id: string, newName: string) => void;
  onOpenProperties: () => void;
}

export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({
  files,
  activeFileId,
  projectName,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onRenameFile,
  onOpenProperties,
}) => {
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [showNewModal, setShowNewModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isFolder, setIsFolder] = useState(false);
  const [targetDirId, setTargetDirId] = useState<string | null>(null);

  const toggleFolder = (id: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreate = () => {
    if (!newFileName.trim()) return;
    onAddFile(targetDirId, newFileName.trim(), isFolder);
    setNewFileName('');
    setShowNewModal(false);
  };

  // Render appropriate file icon matching Android Studio / ACS screenshots
  const renderFileIcon = (file: ProjectFile) => {
    const name = file.name.toLowerCase();

    if (name.includes('gradle')) {
      // Elephant / Gradle icon representation
      return (
        <span className="text-emerald-400 font-bold text-xs select-none">
          🐘
        </span>
      );
    }
    if (name.endsWith('.properties')) {
      return <Settings className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
    if (name.endsWith('.xml')) {
      return (
        <span className="text-amber-400 font-mono text-[10px] font-bold shrink-0">
          &lt;/&gt;
        </span>
      );
    }
    if (name.endsWith('.kt') || name.endsWith('.kts')) {
      return (
        <span className="w-3.5 h-3.5 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[9px] shrink-0 border border-purple-500/30">
          K
        </span>
      );
    }
    if (name.endsWith('.java')) {
      return (
        <span className="w-3.5 h-3.5 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[9px] shrink-0 border border-orange-500/30">
          J
        </span>
      );
    }
    if (name.endsWith('.dart')) {
      return (
        <span className="w-3.5 h-3.5 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[9px] shrink-0 border border-sky-500/30">
          D
        </span>
      );
    }
    if (name === 'gradlew' || name === 'gradlew.bat') {
      return <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
    return <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  };

  const renderFileTree = (items: ProjectFile[], depth: number = 0) => {
    return items.map((file) => {
      const isCollapsed = collapsedFolders[file.id];
      const isActive = file.id === activeFileId;

      if (file.isDirectory) {
        return (
          <div key={file.id} className="flex flex-col">
            <div
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              onClick={() => toggleFolder(file.id)}
              className="group flex items-center justify-between py-1.5 pr-2 hover:bg-white/5 cursor-pointer text-xs text-slate-300 font-medium transition-colors"
            >
              <div className="flex items-center gap-1.5 truncate">
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
                {isCollapsed ? (
                  <Folder className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                ) : (
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="truncate">{file.name}</span>
              </div>

              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                <button
                  type="button"
                  title="Add file inside"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTargetDirId(file.id);
                    setIsFolder(false);
                    setShowNewModal(true);
                  }}
                  className="p-1 hover:text-sky-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {!isCollapsed && file.children && (
              <div>{renderFileTree(file.children, depth + 1)}</div>
            )}
          </div>
        );
      }

      return (
        <div
          key={file.id}
          style={{ paddingLeft: `${depth * 12 + 18}px` }}
          onClick={() => onSelectFile(file.id)}
          className={`group flex items-center justify-between py-1.5 pr-2 cursor-pointer text-xs transition-colors ${
            isActive
              ? 'bg-sky-500/15 text-sky-400 font-medium border-r-2 border-sky-400'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {renderFileIcon(file)}
            <span className="truncate font-mono text-[11px]">{file.name}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
            <button
              type="button"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${file.name}?`)) onDeleteFile(file.id);
              }}
              className="p-1 hover:text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#141519] border-r border-white/10 select-none overflow-hidden">
      {/* Explorer Header */}
      <div className="shrink-0 h-10 px-3 bg-[#18191E] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold tracking-tight text-slate-200 uppercase font-mono">
            {projectName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setTargetDirId(null);
              setIsFolder(false);
              setShowNewModal(true);
            }}
            title="New File"
            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onOpenProperties}
            title="Edit gradle.properties & local.properties"
            className="p-1 hover:bg-white/10 rounded text-blue-400 hover:text-blue-300"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Action Pill for Properties */}
      <div className="p-2 border-b border-white/5 bg-blue-950/20">
        <button
          onClick={onOpenProperties}
          className="w-full py-1.5 px-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[11px] font-medium flex items-center justify-between transition-colors"
        >
          <span>🛠️ Edit App Properties</span>
          <span className="text-[10px] font-mono text-blue-400">AAPT2 & SDK</span>
        </button>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        {renderFileTree(files)}
      </div>

      {/* New File Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1E24] border border-white/10 rounded-2xl p-4 w-full max-w-sm shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-3">
              Create New {isFolder ? 'Folder' : 'File'}
            </h3>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setIsFolder(false)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                  !isFolder
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                    : 'bg-black/30 border-white/10 text-slate-300'
                }`}
              >
                File
              </button>
              <button
                type="button"
                onClick={() => setIsFolder(true)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                  isFolder
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                    : 'bg-black/30 border-white/10 text-slate-300'
                }`}
              >
                Folder
              </button>
            </div>

            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder={isFolder ? 'e.g. components' : 'e.g. CustomView.kt'}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none mb-4 focus:border-sky-500"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="px-4 py-1.5 rounded-lg text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
