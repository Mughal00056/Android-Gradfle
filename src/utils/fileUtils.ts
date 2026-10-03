import { ProjectFile } from '../types';

export function findFileById(files: ProjectFile[], id: string): ProjectFile | null {
  for (const file of files) {
    if (file.id === id) return file;
    if (file.isDirectory && file.children) {
      const found = findFileById(file.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function findFileByPath(files: ProjectFile[], path: string): ProjectFile | null {
  for (const file of files) {
    if (file.path === path) return file;
    if (file.isDirectory && file.children) {
      const found = findFileByPath(file.children, path);
      if (found) return found;
    }
  }
  return null;
}

export function updateFileContent(files: ProjectFile[], id: string, newContent: string): ProjectFile[] {
  return files.map((file) => {
    if (file.id === id) {
      return { ...file, content: newContent };
    }
    if (file.isDirectory && file.children) {
      return {
        ...file,
        children: updateFileContent(file.children, id, newContent),
      };
    }
    return file;
  });
}

export function addFileToDirectory(
  files: ProjectFile[],
  targetDirId: string | null,
  newFile: ProjectFile
): ProjectFile[] {
  if (!targetDirId) {
    return [...files, newFile];
  }

  return files.map((item) => {
    if (item.id === targetDirId && item.isDirectory) {
      return {
        ...item,
        children: [...(item.children || []), newFile],
      };
    }
    if (item.isDirectory && item.children) {
      return {
        ...item,
        children: addFileToDirectory(item.children, targetDirId, newFile),
      };
    }
    return item;
  });
}

export function deleteFileById(files: ProjectFile[], id: string): ProjectFile[] {
  return files
    .filter((file) => file.id !== id)
    .map((file) => {
      if (file.isDirectory && file.children) {
        return {
          ...file,
          children: deleteFileById(file.children, id),
        };
      }
      return file;
    });
}

export function renameFileById(files: ProjectFile[], id: string, newName: string): ProjectFile[] {
  return files.map((file) => {
    if (file.id === id) {
      const parts = file.path.split('/');
      parts[parts.length - 1] = newName;
      const newPath = parts.join('/');
      return { ...file, name: newName, path: newPath };
    }
    if (file.isDirectory && file.children) {
      return {
        ...file,
        children: renameFileById(file.children, id, newName),
      };
    }
    return file;
  });
}

export function getFileLanguage(fileName: string): ProjectFile['language'] {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'kt':
    case 'kts':
      return 'kotlin';
    case 'java':
      return 'java';
    case 'xml':
      return 'xml';
    case 'gradle':
      return 'gradle';
    case 'properties':
      return 'properties';
    case 'json':
      return 'json';
    case 'dart':
      return 'dart';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'md':
      return 'markdown';
    default:
      return 'plaintext';
  }
}
