import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Check, Sparkles, Smartphone, Layers, Box, Cpu } from 'lucide-react';
import { Project, ProjectType } from '../../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Partial<Project>) => void;
}

interface TemplateOption {
  id: ProjectType;
  title: string;
  description: string;
  icon: string;
  language: 'Kotlin' | 'Java' | 'Dart' | 'TypeScript';
  defaultMinSdk: number;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'native_kotlin',
    title: 'Basic Activity',
    description: 'XML layout with Material toolbar, button, and FloatingActionButton.',
    icon: '📱',
    language: 'Kotlin',
    defaultMinSdk: 24,
  },
  {
    id: 'native_compose',
    title: 'Compose Activity',
    description: 'Jetpack Compose Material 3 UI with declarative reactive state.',
    icon: '🧊',
    language: 'Kotlin',
    defaultMinSdk: 26,
  },
  {
    id: 'bottom_nav',
    title: 'Bottom Navigation',
    description: 'Activity with 4 navigation fragments and bottom bar tabs.',
    icon: '🧭',
    language: 'Kotlin',
    defaultMinSdk: 24,
  },
  {
    id: 'native_java',
    title: 'Java XML Activity',
    description: 'Classic Android Java Activity with XML layout and Gradle.',
    icon: '☕',
    language: 'Java',
    defaultMinSdk: 21,
  },
  {
    id: 'flutter',
    title: 'Flutter Application',
    description: 'Cross-platform Material 3 counter app with Dart and hot reload.',
    icon: '💙',
    language: 'Dart',
    defaultMinSdk: 21,
  },
  {
    id: 'react',
    title: 'React Mobile App',
    description: 'Mobile responsive web app with Vite, React 19, and interactive state.',
    icon: '⚛️',
    language: 'TypeScript',
    defaultMinSdk: 21,
  },
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [step, setStep] = useState<'template' | 'config'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>(TEMPLATES[0]);
  const [projectName, setProjectName] = useState('MyAndroidApp');
  const [packageName, setPackageName] = useState('com.example.myandroidapp');
  const [location, setLocation] = useState('/data/data/com.termux/files/home/AndroidIDEProjects');
  const [language, setLanguage] = useState<'Kotlin' | 'Java' | 'Dart' | 'TypeScript'>('Kotlin');
  const [minSdk, setMinSdk] = useState(24);
  const [useKotlinDsl, setUseKotlinDsl] = useState(false);

  if (!isOpen) return null;

  const handleSelectTemplate = (tmpl: TemplateOption) => {
    setSelectedTemplate(tmpl);
    setLanguage(tmpl.language);
    setMinSdk(tmpl.defaultMinSdk);
    const sanitized = tmpl.title.replace(/\s+/g, '');
    setProjectName(sanitized);
    setPackageName(`com.example.${sanitized.toLowerCase()}`);
    setStep('config');
  };

  const handleFinish = () => {
    onCreateProject({
      name: projectName.trim() || 'MyAndroidApp',
      packageName: packageName.trim() || 'com.example.app',
      type: selectedTemplate.id,
      language,
      minSdk,
      targetSdk: 35,
      compileSdk: 35,
      useKotlinDsl,
    });
    setStep('template');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 select-none">
      <div className="bg-[#18191F] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3.5 bg-[#1F2028] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step === 'config' && (
              <button
                onClick={() => setStep('template')}
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {step === 'template' ? 'Choose Template' : 'Project Configuration'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {step === 'template'
                  ? 'Select an activity template to begin'
                  : `Configuring ${selectedTemplate.title}`}
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

        {/* Step 1: Template Grid (matching ACS / Android Studio screenshots) */}
        {step === 'template' && (
          <div className="p-4 overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all active:scale-98 ${
                  selectedTemplate.id === tmpl.id
                    ? 'bg-sky-500/10 border-sky-400 shadow-md'
                    : 'bg-[#14151A] border-white/5 hover:border-white/20 hover:bg-[#1A1C22]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-white/5 text-xl flex items-center justify-center border border-white/10">
                    {tmpl.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                    {tmpl.language}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{tmpl.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {tmpl.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Project Configuration Form (from screenshot 16) */}
        {step === 'config' && (
          <div className="p-4 overflow-y-auto no-scrollbar space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Package Name
              </label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Save Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  aria-label="Select Programming Language"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Kotlin">Kotlin</option>
                  <option value="Java">Java</option>
                  <option value="Dart">Dart (Flutter)</option>
                  <option value="TypeScript">TypeScript (React)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Minimum SDK
                </label>
                <select
                  value={minSdk}
                  onChange={(e) => setMinSdk(Number(e.target.value))}
                  aria-label="Select Minimum Android SDK"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value={21}>API 21: Android 5.0 (Lollipop)</option>
                  <option value={24}>API 24: Android 7.0 (Nougat)</option>
                  <option value={26}>API 26: Android 8.0 (Oreo)</option>
                  <option value={31}>API 31: Android 12</option>
                  <option value={35}>API 35: Android 15</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
              <div>
                <div className="text-xs font-medium text-slate-200">
                  Use Gradle Kotlin DSL (.kts)
                </div>
                <div className="text-[10px] text-slate-400">
                  Configure build scripts with Kotlin syntax
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUseKotlinDsl(!useKotlinDsl)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  useKotlinDsl ? 'bg-sky-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    useKotlinDsl ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 bg-[#1F2028] border-t border-white/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          {step === 'config' ? (
            <button
              type="button"
              onClick={handleFinish}
              className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span>Create Project</span>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSelectTemplate(selectedTemplate)}
              className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
