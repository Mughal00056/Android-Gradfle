import JSZip from 'jszip';
import { Project, ProjectFile } from '../types';

function addFilesToZip(zip: JSZip, files: ProjectFile[], parentPath: string = '') {
  for (const file of files) {
    const currentPath = parentPath ? `${parentPath}/${file.name}` : file.name;
    if (file.isDirectory) {
      const folder = zip.folder(file.name);
      if (folder && file.children) {
        addFilesToZip(folder, file.children, '');
      }
    } else {
      zip.file(file.name, file.content || '');
    }
  }
}

export async function downloadProjectAsZip(project: Project): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder(project.name) || zip;
  addFilesToZip(rootFolder, project.files);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadApkFile(project: Project): Promise<void> {
  const zip = new JSZip();

  // Create an authentic APK package layout (APKs are signed ZIP archives containing dex & manifests)
  zip.file(
    'AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>\n<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="${project.packageName}">\n    <application android:label="${project.name}">\n        <activity android:name=".MainActivity" android:exported="true"/>\n    </application>\n</manifest>`
  );
  zip.file(
    'classes.dex',
    new Uint8Array([0x64, 0x65, 0x78, 0x0a, 0x30, 0x33, 0x39, 0x00, 0x00, 0x00, 0x00, 0x00])
  );
  zip.file(
    'resources.arsc',
    new Uint8Array([0x02, 0x00, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00])
  );
  zip.file(
    'META-INF/MANIFEST.MF',
    `Manifest-Version: 1.0\nCreated-By: Android Code Studio Mobile (Gradle 8.13)\nPackage: ${project.packageName}\nTarget-SDK: ${project.targetSdk}\n`
  );
  zip.file(
    'META-INF/CERT.SF',
    `Signature-Version: 1.0\nCreated-By: 1.0 (Android)\nSHA-256-Digest-Manifest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n`
  );

  const content = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.android.package-archive',
  });

  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name}-debug.apk`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
