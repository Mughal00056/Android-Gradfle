export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  content?: string;
  children?: ProjectFile[];
  language?: 'kotlin' | 'java' | 'xml' | 'gradle' | 'properties' | 'json' | 'dart' | 'javascript' | 'typescript' | 'markdown' | 'plaintext';
}

export type ProjectType = 'native_kotlin' | 'native_compose' | 'native_java' | 'bottom_nav' | 'flutter' | 'react';

export interface Project {
  id: string;
  name: string;
  packageName: string;
  type: ProjectType;
  language: 'Kotlin' | 'Java' | 'Dart' | 'TypeScript';
  minSdk: number;
  targetSdk: number;
  compileSdk: number;
  useKotlinDsl: boolean;
  files: ProjectFile[];
  activeFileId: string;
  openFileIds: string[];
}

export type ViewMode = 'editor' | 'split' | 'preview' | 'terminal';

export type DeviceType = 'pixel8' | 'samsung_s24' | 'tablet10' | 'foldable';

export interface PreviewSettings {
  device: DeviceType;
  orientation: 'portrait' | 'landscape';
  theme: 'dark' | 'light';
  apiLevel: number;
  zoom: number;
  previewEngine: 'xml' | 'compose' | 'flutter' | 'react';
}

export interface BuildLog {
  id: string;
  timestamp: string;
  type: 'info' | 'task' | 'warning' | 'error' | 'success';
  message: string;
}

export interface BuildResult {
  status: 'idle' | 'building' | 'success' | 'failed';
  apkName?: string;
  apkSize?: string;
  buildDuration?: number;
  errorCount?: number;
  warningCount?: number;
  logs: BuildLog[];
}

export interface SdkConfig {
  gradleDistributionUrl: string;
  aapt2Override: string;
  sdkDir: string;
  ndkDir: string;
  cmakeDir: string;
  jdkVersion: string;
  buildToolsVersion: string;
  targetSdkVersion: number;
}
