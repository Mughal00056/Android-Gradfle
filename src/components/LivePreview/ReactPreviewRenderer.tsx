import React, { useState } from 'react';
import { Atom, CheckCircle, Plus, Trash2 } from 'lucide-react';

interface ReactPreviewRendererProps {
  theme: 'dark' | 'light';
  onShowToast: (message: string) => void;
}

export const ReactPreviewRenderer: React.FC<ReactPreviewRendererProps> = ({
  theme,
  onShowToast,
}) => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Configure Android SDK 36.1.0', completed: true },
    { id: 2, text: 'Verify gradle-8.13-bin.zip wrapper', completed: true },
    { id: 3, text: 'Test AAPT2 Termux override', completed: false },
  ]);
  const [inputVal, setInputVal] = useState('');

  const isDark = theme === 'dark';

  const addTask = () => {
    if (!inputVal.trim()) return;
    const newTask = { id: Date.now(), text: inputVal.trim(), completed: false };
    setTasks([...tasks, newTask]);
    setInputVal('');
    onShowToast(`Task added: "${newTask.text}"`);
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
    onShowToast('Task removed');
  };

  return (
    <div className={`h-full flex flex-col justify-between overflow-y-auto no-scrollbar ${
      isDark ? 'bg-[#0E1117] text-[#E6EDF3]' : 'bg-white text-slate-900'
    }`}>
      {/* Header */}
      <div className={`px-4 py-3.5 border-b flex items-center justify-between ${
        isDark ? 'bg-[#161B22] border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <Atom className="w-5 h-5 text-sky-400 animate-spin-slow" />
          <span className="font-semibold text-sm">React Mobile Preview</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400">
          Vite + React 19
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add new mobile feature..."
            className={`flex-1 py-2 px-3 rounded-xl border text-xs outline-none ${
              isDark
                ? 'bg-[#161B22] border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-sky-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-sky-600'
            }`}
          />
          <button
            onClick={addTask}
            className="px-3 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl font-semibold text-xs active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                isDark ? 'bg-[#161B22] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-2 flex-1 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-sky-500 border-sky-500 text-slate-950'
                      : isDark
                      ? 'border-slate-600'
                      : 'border-slate-400'
                  }`}
                >
                  {task.completed && <CheckCircle className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={task.completed ? 'line-through text-slate-500' : ''}>
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-500 hover:text-red-400 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
