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
  language: 'Kotlin' | 'Java' | 'Dart' | 'TypeScript';
  defaultMinSdk: number;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'native_kotlin',
    title: 'Basic Activity',
    description: 'XML layout with Material toolbar, button, and FloatingActionButton.',
    language: 'Kotlin',
    defaultMinSdk: 24,
  },
  {
    id: 'native_compose',
    title: 'Compose Activity',
    description: 'Jetpack Compose Material 3 UI with declarative reactive state.',
    language: 'Kotlin',
    defaultMinSdk: 26,
  },
  {
    id: 'bottom_nav',
    title: 'Bottom Navigation',
    description: 'Activity with 4 navigation fragments and bottom bar tabs.',
    language: 'Kotlin',
    defaultMinSdk: 24,
  },
  {
    id: 'native_java',
    title: 'Navigation Drawer',
    description: 'Activity with slide-out navigation drawer and fragment containers.',
    language: 'Java',
    defaultMinSdk: 21,
  },
  {
    id: 'flutter',
    title: 'Flutter Application',
    description: 'Cross-platform Material 3 counter app with Dart and hot reload.',
    language: 'Dart',
    defaultMinSdk: 21,
  },
  {
    id: 'react',
    title: 'Game Activity',
    description: 'Native mobile game loop canvas with touch controllers.',
    language: 'Kotlin',
    defaultMinSdk: 24,
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

  // High-fidelity phone card illustrations matching user's ACS / Android Studio screenshots
  const renderTemplateIllustration = (id: ProjectType | string) => {
    switch (id) {
      case 'native_kotlin': // Basic Activity (white phone with green top bar and green FAB)
        return (
          <div className="w-24 h-32 rounded-xl bg-white shadow-md relative overflow-hidden flex flex-col justify-between p-1 border border-slate-200">
            {/* Top Bar with back arrow & dots */}
            <div className="h-4 bg-[#22C55E] rounded-t-lg flex items-center justify-between px-1.5">
              <span className="w-1 h-1 bg-white/80 rounded-full" />
              <div className="flex gap-0.5">
                <span className="w-0.5 h-0.5 bg-white/80 rounded-full" />
                <span className="w-0.5 h-0.5 bg-white/80 rounded-full" />
                <span className="w-0.5 h-0.5 bg-white/80 rounded-full" />
              </div>
            </div>
            {/* Content area */}
            <div className="flex-1 p-1 flex flex-col justify-end items-end">
              {/* Circular Green FAB with Plus */}
              <div className="w-5 h-5 rounded-full bg-[#84CC16] text-white flex items-center justify-center font-bold text-xs shadow">
                +
              </div>
            </div>
          </div>
        );

      case 'native_compose': // Compose Activity (3D isometric cube)
        return (
          <div className="w-24 h-32 rounded-xl bg-white shadow-md relative overflow-hidden flex flex-col items-center justify-between p-1 border border-slate-200">
            <div className="w-full h-4 bg-[#22C55E] rounded-t-lg flex items-center px-1.5">
              <span className="w-1 h-1 bg-white/80 rounded-full" />
            </div>
            {/* Compose 3D Cube */}
            <div className="my-auto flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                <path d="M50 15 L85 35 L50 55 L15 35 Z" fill="#38BDF8" />
                <path d="M15 35 L50 55 L50 90 L15 70 Z" fill="#1D4ED8" />
                <path d="M85 35 L50 55 L50 90 L85 70 Z" fill="#22C55E" />
              </svg>
            </div>
            <div className="h-2" />
          </div>
        );

      case 'bottom_nav': // Bottom Navigation Activity (green bottom bar)
        return (
          <div className="w-24 h-32 rounded-xl bg-white shadow-md relative overflow-hidden flex flex-col justify-between p-1 border border-slate-200">
            <div className="h-4 bg-[#22C55E] rounded-t-lg flex items-center px-1.5">
              <span className="w-1 h-1 bg-white/80 rounded-full" />
            </div>
            {/* Bottom Nav Bar */}
            <div className="h-4 bg-[#22C55E] rounded-b-lg flex items-center justify-around px-1">
              <span className="w-3 h-1.5 bg-[#84CC16] rounded-full" />
              <span className="w-1 h-1 bg-white/70 rounded-full" />
              <span className="w-1 h-1 bg-white/70 rounded-full" />
            </div>
          </div>
        );

      case 'native_java': // Navigation Drawer
        return (
          <div className="w-24 h-32 rounded-xl bg-white shadow-md relative overflow-hidden flex p-1 border border-slate-200">
            {/* Drawer */}
            <div className="w-14 h-full bg-[#22C55E] rounded-l-lg p-1 flex flex-col gap-1 text-white">
              <div className="w-4 h-4 rounded-full bg-white/30 mb-1 flex items-center justify-center text-[7px]">
                👤
              </div>
              <div className="w-8 h-1 bg-white/70 rounded" />
              <div className="w-6 h-1 bg-white/50 rounded" />
              <div className="w-7 h-1 bg-white/50 rounded" />
            </div>
          </div>
        );

      case 'flutter': // Flutter Counter App
        return (
          <div className="w-24 h-32 rounded-xl bg-white shadow-md relative overflow-hidden flex flex-col justify-between p-1 border border-slate-200">
            <div className="h-4 bg-[#6750A4] rounded-t-lg flex items-center px-1.5 text-[8px] text-white font-bold">
              Flutter
            </div>
            <div className="my-auto flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-[#6750A4]">0</span>
              <span className="text-[7px] text-slate-400">counter</span>
            </div>
            <div className="flex justify-end p-0.5">
              <div className="w-4 h-4 rounded-full bg-[#6750A4] text-white flex items-center justify-center font-bold text-[9px]">
                +
              </div>
            </div>
          </div>
        );

      case 'react': // Game Activity
      default:
        return (
          <div className="w-24 h-32 rounded-xl bg-white shadow-md relative overflow-hidden flex flex-col items-center justify-center p-1 border border-slate-200">
            <div className="w-10 h-7 rounded-lg bg-[#22C55E] flex items-center justify-center text-white shadow">
              🎮
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 select-none">
      <div className="bg-[#18191F] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
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

        {/* Step 1: Template Grid with Visual Phone Cards (matching screenshots) */}
        {step === 'template' && (
          <div className="p-4 overflow-y-auto no-scrollbar grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between cursor-pointer transition-all active:scale-98 group ${
                  selectedTemplate.id === tmpl.id
                    ? 'bg-sky-500/10 border-sky-400 shadow-lg'
                    : 'bg-[#14151A] border-white/5 hover:border-white/20 hover:bg-[#1A1C22]'
                }`}
              >
                <div className="mb-2.5 transform group-hover:scale-105 transition-transform">
                  {renderTemplateIllustration(tmpl.id)}
                </div>

                <div className="w-full">
                  <h4 className="text-xs font-bold text-white truncate mb-0.5">{tmpl.title}</h4>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <span>{tmpl.language}</span>
                    <span>·</span>
                    <span>API {tmpl.defaultMinSdk}+</span>
                  </div>
                </div>
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
