import React, { useState } from 'react';
import { 
  INITIAL_PROJECTS, DEFAULT_SDK_CONFIG 
} from './constants/defaultProjects';
import { Project, ProjectFile, SdkConfig, ViewMode } from './types';
import { 
  findFileById, findFileByPath, updateFileContent, 
  addFileToDirectory, deleteFileById, renameFileById, getFileLanguage 
} from './utils/fileUtils';
import { downloadProjectAsZip } from './utils/zipUtils';
import { TopBar } from './components/TopBar';
import { ProjectExplorer } from './components/ProjectExplorer';
import { CodeEditor } from './components/CodeEditor';
import { LivePreviewEngine } from './components/LivePreview/LivePreviewEngine';
import { TerminalView } from './components/Terminal/TerminalView';
import { AppPropertiesModal } from './components/Modals/AppPropertiesModal';
import { BuildModal } from './components/Modals/BuildModal';
import { ApkInstallerModal } from './components/Modals/ApkInstallerModal';
import { NewProjectModal } from './components/Modals/NewProjectModal';
import { WelcomeScreen } from './components/Modals/WelcomeScreen';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [currentProjectId, setCurrentProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showExplorer, setShowExplorer] = useState(true);
  const [sdkConfig, setSdkConfig] = useState<SdkConfig>(DEFAULT_SDK_CONFIG);

  // Setup / Welcome launcher starts OPEN first (as requested: "pahla se project open na ho ok pahla create kara ok")
  const [hasCompletedInitialSetup, setHasCompletedInitialSetup] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  // Modals state
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showInstallerModal, setShowInstallerModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  const activeFile = findFileById(currentProject.files, currentProject.activeFileId);

  const openFiles = currentProject.openFileIds
    .map((id) => findFileById(currentProject.files, id))
    .filter((f): f is ProjectFile => f !== null && !f.isDirectory);

  // Find XML layout for live preview
  const xmlLayoutFile = findFileByPath(currentProject.files, 'app/src/main/res/layout/activity_main.xml') ||
    findFileById(currentProject.files, 'file-activity-main-xml');

  // Handle active file selection
  const handleSelectFile = (id: string) => {
    const file = findFileById(currentProject.files, id);
    if (!file || file.isDirectory) return;

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        const newOpenIds = proj.openFileIds.includes(id)
          ? proj.openFileIds
          : [...proj.openFileIds, id];
        return {
          ...proj,
          activeFileId: id,
          openFileIds: newOpenIds,
        };
      })
    );
  };

  // Close tab
  const handleCloseFile = (id: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        const newOpen = proj.openFileIds.filter((fId) => fId !== id);
        const newActive =
          proj.activeFileId === id
            ? newOpen[newOpen.length - 1] || ''
            : proj.activeFileId;
        return {
          ...proj,
          openFileIds: newOpen,
          activeFileId: newActive,
        };
      })
    );
  };

  // Content change
  const handleContentChange = (id: string, newContent: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        return {
          ...proj,
          files: updateFileContent(proj.files, id, newContent),
        };
      })
    );
  };

  // Add new file or folder
  const handleAddFile = (targetDirId: string | null, name: string, isDirectory: boolean) => {
    const newId = `file-${Date.now()}`;
    const newFile: ProjectFile = {
      id: newId,
      name,
      path: name,
      isDirectory,
      language: isDirectory ? undefined : getFileLanguage(name),
      content: isDirectory
        ? undefined
        : name.endsWith('.kt')
        ? `package ${currentProject.packageName}\n\n// New Kotlin file\n`
        : name.endsWith('.xml')
        ? `<?xml version="1.0" encoding="utf-8"?>\n<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:orientation="vertical">\n</LinearLayout>`
        : '',
      children: isDirectory ? [] : undefined,
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        return {
          ...proj,
          files: addFileToDirectory(proj.files, targetDirId, newFile),
          activeFileId: !isDirectory ? newId : proj.activeFileId,
          openFileIds: !isDirectory ? [...proj.openFileIds, newId] : proj.openFileIds,
        };
      })
    );
  };

  // Delete file
  const handleDeleteFile = (id: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        return {
          ...proj,
          files: deleteFileById(proj.files, id),
          openFileIds: proj.openFileIds.filter((fId) => fId !== id),
          activeFileId: proj.activeFileId === id ? proj.openFileIds[0] || '' : proj.activeFileId,
        };
      })
    );
  };

  // Rename file
  const handleRenameFile = (id: string, newName: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        return {
          ...proj,
          files: renameFileById(proj.files, id, newName),
        };
      })
    );
  };

  // Delete project
  const handleDeleteProject = (projectIdToDelete: string) => {
    if (projects.length <= 1) {
      alert('Cannot delete the only project in workspace.');
      return;
    }
    const remaining = projects.filter((p) => p.id !== projectIdToDelete);
    setProjects(remaining);
    if (currentProjectId === projectIdToDelete) {
      setCurrentProjectId(remaining[0].id);
    }
  };

  // Download project as ZIP
  const handleDownloadProject = async (proj: Project) => {
    try {
      await downloadProjectAsZip(proj);
    } catch (err) {
      console.error('Failed to download project zip', err);
    }
  };

  // Save SDK Config & update files
  const handleSaveSdkConfig = (updated: SdkConfig) => {
    setSdkConfig(updated);

    // Update gradle.properties and local.properties in project files
    setProjects((prev) =>
      prev.map((proj) => {
        let updatedFiles = proj.files;

        // update gradle.properties
        const gradlePropsContent = `# Project-wide Gradle settings.
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true

# Termux Android SDK build tools AAPT2 override
android.aapt2FromMavenOverride=${updated.aapt2Override}`;

        // update local.properties
        const localPropsContent = `## This file is automatically generated by Android Code Studio.
# Do not modify this file -- YOUR CHANGES WILL BE ERASED!
sdk.dir=${updated.sdkDir}
ndk.dir=${updated.ndkDir}
cmake.dir=${updated.cmakeDir}`;

        const gProp = findFileByPath(updatedFiles, 'gradle.properties');
        if (gProp) {
          updatedFiles = updateFileContent(updatedFiles, gProp.id, gradlePropsContent);
        }

        const lProp = findFileByPath(updatedFiles, 'local.properties');
        if (lProp) {
          updatedFiles = updateFileContent(updatedFiles, lProp.id, localPropsContent);
        }

        return {
          ...proj,
          files: updatedFiles,
        };
      })
    );
  };

  // Create new project from template
  const handleCreateProject = (data: Partial<Project>) => {
    const newProjId = `project-${Date.now()}`;
    const newProj: Project = {
      id: newProjId,
      name: data.name || 'NewProject',
      packageName: data.packageName || 'com.example.app',
      type: data.type || 'native_kotlin',
      language: data.language || 'Kotlin',
      minSdk: data.minSdk || 24,
      targetSdk: 35,
      compileSdk: 35,
      useKotlinDsl: !!data.useKotlinDsl,
      activeFileId: 'file-activity-main-xml',
      openFileIds: ['file-activity-main-xml', 'file-main-activity-kt'],
      files: INITIAL_PROJECTS[0].files, // clone base structure
    };

    setProjects([...projects, newProj]);
    setCurrentProjectId(newProjId);
    setShowWelcomeScreen(false);
    setViewMode('split');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#121316] text-[#e3e3e3] overflow-hidden select-none">
      {/* Android Studio Style Top Bar */}
      <TopBar
        currentProject={currentProject}
        projects={projects}
        viewMode={viewMode}
        onSelectProject={setCurrentProjectId}
        onChangeViewMode={setViewMode}
        onRunBuild={() => setShowBuildModal(true)}
        onRunLivePreview={() => setViewMode('preview')}
        onOpenProperties={() => setShowPropertiesModal(true)}
        onToggleExplorer={() => setShowExplorer(!showExplorer)}
        onOpenHome={() => setShowWelcomeScreen(true)}
        onNewProject={() => setShowNewProjectModal(true)}
        onDownloadProject={() => handleDownloadProject(currentProject)}
        onDeleteCurrentProject={() => handleDeleteProject(currentProject.id)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Project Explorer Sidebar */}
        {showExplorer && (
          <div className="w-64 sm:w-72 shrink-0 h-full border-r border-white/10 z-20 transition-all duration-200">
            <ProjectExplorer
              files={currentProject.files}
              activeFileId={currentProject.activeFileId}
              projectName={currentProject.name}
              onSelectFile={handleSelectFile}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
              onOpenProperties={() => setShowPropertiesModal(true)}
            />
          </div>
        )}

        {/* Dynamic Center Work Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Mode: Editor Only */}
          {viewMode === 'editor' && (
            <div className="flex-1 h-full overflow-hidden">
              <CodeEditor
                activeFile={activeFile}
                openFiles={openFiles}
                onSelectFile={handleSelectFile}
                onCloseFile={handleCloseFile}
                onContentChange={handleContentChange}
                onRunPreview={() => setViewMode('preview')}
              />
            </div>
          )}

          {/* Mode: Split View (Editor on Left, Live Preview on Right) */}
          {viewMode === 'split' && (
            <div className="flex-1 h-full flex flex-col lg:flex-row overflow-hidden">
              <div className="flex-1 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
                <CodeEditor
                  activeFile={activeFile}
                  openFiles={openFiles}
                  onSelectFile={handleSelectFile}
                  onCloseFile={handleCloseFile}
                  onContentChange={handleContentChange}
                  onRunPreview={() => setViewMode('preview')}
                />
              </div>
              <div className="flex-1 h-1/2 lg:h-full overflow-hidden">
                <LivePreviewEngine
                  xmlContent={xmlLayoutFile?.content || ''}
                  projectName={currentProject.name}
                  defaultEngine={
                    currentProject.type === 'flutter'
                      ? 'flutter'
                      : currentProject.type === 'native_compose'
                      ? 'compose'
                      : currentProject.type === 'react'
                      ? 'react'
                      : 'xml'
                  }
                  onBuildRequest={() => setShowBuildModal(true)}
                />
              </div>
            </div>
          )}

          {/* Mode: Live Preview Only */}
          {viewMode === 'preview' && (
            <div className="flex-1 h-full overflow-hidden">
              <LivePreviewEngine
                xmlContent={xmlLayoutFile?.content || ''}
                projectName={currentProject.name}
                defaultEngine={
                  currentProject.type === 'flutter'
                    ? 'flutter'
                    : currentProject.type === 'native_compose'
                    ? 'compose'
                    : currentProject.type === 'react'
                    ? 'react'
                    : 'xml'
                }
                onBuildRequest={() => setShowBuildModal(true)}
              />
            </div>
          )}

          {/* Mode: Terminal Shell */}
          {viewMode === 'terminal' && (
            <div className="flex-1 h-full overflow-hidden">
              <TerminalView onRunBuild={() => setShowBuildModal(true)} />
            </div>
          )}
        </div>
      </div>

      {/* App Properties Modal */}
      <AppPropertiesModal
        isOpen={showPropertiesModal}
        onClose={() => setShowPropertiesModal(false)}
        config={sdkConfig}
        onSaveConfig={handleSaveSdkConfig}
      />

      {/* Gradle Build & APK Generation Modal */}
      <BuildModal
        isOpen={showBuildModal}
        onClose={() => setShowBuildModal(false)}
        project={currentProject}
        config={sdkConfig}
        onInstallApk={() => {
          setShowBuildModal(false);
          setShowInstallerModal(true);
        }}
        onOpenLivePreview={() => setViewMode('preview')}
      />

      {/* Simulated Android Package Installer Modal */}
      <ApkInstallerModal
        isOpen={showInstallerModal}
        onClose={() => setShowInstallerModal(false)}
        appName={currentProject.name}
        packageName={currentProject.packageName}
        onOpenApp={() => setViewMode('preview')}
      />

      {/* New Project Wizard Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Android Code Studio Setup Onboarding & Hub Modal */}
      <WelcomeScreen
        isOpen={showWelcomeScreen}
        onClose={() => setShowWelcomeScreen(false)}
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={setCurrentProjectId}
        onNewProject={() => setShowNewProjectModal(true)}
        onDeleteProject={handleDeleteProject}
        onDownloadProject={handleDownloadProject}
        onOpenProperties={() => setShowPropertiesModal(true)}
        onOpenTerminal={() => setViewMode('terminal')}
        onOpenLivePreview={() => setViewMode('preview')}
        isInitialSetup={!hasCompletedInitialSetup}
        onFinishInitialSetup={() => setHasCompletedInitialSetup(true)}
      />
    </div>
  );
}
