import { Project, SdkConfig } from '../types';
import { getTemplateFiles } from './templateDirectories';

export const DEFAULT_SDK_CONFIG: SdkConfig = {
  gradleDistributionUrl: 'https://services.gradle.org/distributions/gradle-8.13-bin.zip',
  aapt2Override: '/data/data/com.termux/files/usr/opt/android-sdk/build-tools/36.1.0/aapt2',
  sdkDir: '/data/data/com.termux/files/usr/opt/android-sdk',
  ndkDir: '/data/data/com.termux/files/usr/opt/android-sdk/ndk/29.0.14206865',
  cmakeDir: '/data/data/com.termux/files/usr/opt/android-sdk/cmake/4.1.2',
  jdkVersion: '17',
  buildToolsVersion: '36.1.0',
  targetSdkVersion: 35,
};

const kotlinBasic = getTemplateFiles('native_kotlin', 'no_ytgg', 'com.noytgg', false);
const composeProj = getTemplateFiles('native_compose', 'ComposeDashboard', 'com.example.compose', true);
const flutterProj = getTemplateFiles('flutter', 'flutter_counter_app', 'com.example.flutter', false);
const bottomNavProj = getTemplateFiles('bottom_nav', 'BottomNavHub', 'com.example.bottomnav', false);

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'project-basic-kotlin',
    name: 'no_ytgg',
    packageName: 'com.noytgg',
    type: 'native_kotlin',
    language: 'Kotlin',
    minSdk: 24,
    targetSdk: 35,
    compileSdk: 35,
    useKotlinDsl: false,
    activeFileId: kotlinBasic.activeFileId,
    openFileIds: kotlinBasic.openFileIds,
    files: kotlinBasic.files,
  },
  {
    id: 'project-compose',
    name: 'ComposeDashboard',
    packageName: 'com.example.compose',
    type: 'native_compose',
    language: 'Kotlin',
    minSdk: 26,
    targetSdk: 35,
    compileSdk: 35,
    useKotlinDsl: true,
    activeFileId: composeProj.activeFileId,
    openFileIds: composeProj.openFileIds,
    files: composeProj.files,
  },
  {
    id: 'project-bottom-nav',
    name: 'BottomNavHub',
    packageName: 'com.example.bottomnav',
    type: 'bottom_nav',
    language: 'Kotlin',
    minSdk: 24,
    targetSdk: 35,
    compileSdk: 35,
    useKotlinDsl: false,
    activeFileId: bottomNavProj.activeFileId,
    openFileIds: bottomNavProj.openFileIds,
    files: bottomNavProj.files,
  },
  {
    id: 'project-flutter',
    name: 'flutter_counter_app',
    packageName: 'com.example.flutter',
    type: 'flutter',
    language: 'Dart',
    minSdk: 21,
    targetSdk: 35,
    compileSdk: 35,
    useKotlinDsl: false,
    activeFileId: flutterProj.activeFileId,
    openFileIds: flutterProj.openFileIds,
    files: flutterProj.files,
  },
];
