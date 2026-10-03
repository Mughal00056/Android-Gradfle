import { Project, SdkConfig } from '../types';

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
    activeFileId: 'file-activity-main-xml',
    openFileIds: ['file-activity-main-xml', 'file-main-activity-kt', 'file-gradle-props', 'file-local-props'],
    files: [
      {
        id: 'folder-app',
        name: 'app',
        path: 'app',
        isDirectory: true,
        children: [
          {
            id: 'folder-src',
            name: 'src',
            path: 'app/src',
            isDirectory: true,
            children: [
              {
                id: 'folder-main',
                name: 'main',
                path: 'app/src/main',
                isDirectory: true,
                children: [
                  {
                    id: 'file-manifest',
                    name: 'AndroidManifest.xml',
                    path: 'app/src/main/AndroidManifest.xml',
                    isDirectory: false,
                    language: 'xml',
                    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.noytgg">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AndroidCodeStudio">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.AndroidCodeStudio">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
</manifest>`,
                  },
                  {
                    id: 'folder-kotlin',
                    name: 'kotlin',
                    path: 'app/src/main/kotlin',
                    isDirectory: true,
                    children: [
                      {
                        id: 'folder-package',
                        name: 'com/noytgg',
                        path: 'app/src/main/kotlin/com/noytgg',
                        isDirectory: true,
                        children: [
                          {
                            id: 'file-main-activity-kt',
                            name: 'MainActivity.kt',
                            path: 'app/src/main/kotlin/com/noytgg/MainActivity.kt',
                            isDirectory: false,
                            language: 'kotlin',
                            content: `package com.noytgg

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.floatingactionbutton.FloatingActionButton

class MainActivity : AppCompatActivity() {

    private var clickCount = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val titleText = findViewById<TextView>(R.id.tvTitle)
        val actionButton = findViewById<Button>(R.id.btnAction)
        val fab = findViewById<FloatingActionButton>(R.id.fabAdd)

        titleText.text = "Hello, Android Code Studio!"

        actionButton.setOnClickListener {
            clickCount++
            titleText.text = "Button clicked $clickCount times"
            Toast.makeText(this, "Action triggered: count=$clickCount", Toast.LENGTH_SHORT).show()
        }

        fab.setOnClickListener {
            Toast.makeText(this, "Floating Action Button pressed!", Toast.LENGTH_SHORT).show()
        }
    }
}`,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'folder-res',
                    name: 'res',
                    path: 'app/src/main/res',
                    isDirectory: true,
                    children: [
                      {
                        id: 'folder-layout',
                        name: 'layout',
                        path: 'app/src/main/res/layout',
                        isDirectory: true,
                        children: [
                          {
                            id: 'file-activity-main-xml',
                            name: 'activity_main.xml',
                            path: 'app/src/main/res/layout/activity_main.xml',
                            isDirectory: false,
                            language: 'xml',
                            content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#0F172A"
    android:padding="20dp">

    <!-- Top Header Bar -->
    <TextView
        android:id="@+id/tvHeader"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="My Mobile App"
        android:textColor="#38BDF8"
        android:textSize="24sp"
        android:textStyle="bold"
        android:layout_marginBottom="8dp" />

    <TextView
        android:id="@+id/tvSubtitle"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Built with Android Studio Mobile on Termux"
        android:textColor="#94A3B8"
        android:textSize="14sp"
        android:layout_marginBottom="24dp" />

    <!-- Feature Card -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:background="#1E293B"
        android:padding="16dp"
        android:layout_marginBottom="20dp">

        <TextView
            android:id="@+id/tvTitle"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Ready to build your Android APK"
            android:textColor="#F8FAFC"
            android:textSize="18sp"
            android:textStyle="bold"
            android:layout_marginBottom="8dp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Real-time interactive layout preview with live widgets, state counters, and Gradle 8.13 integration."
            android:textColor="#CBD5E1"
            android:textSize="14sp"
            android:layout_marginBottom="16dp" />

        <Button
            android:id="@+id/btnAction"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:text="Tap to Test Interaction"
            android:background="#38BDF8"
            android:textColor="#0F172A"
            android:textStyle="bold" />
    </LinearLayout>

    <!-- Quick Status Box -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:background="#1E293B"
        android:padding="12dp"
        android:gravity="center_vertical"
        android:layout_marginBottom="16dp">

        <TextView
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Enable Live Notifications"
            android:textColor="#F8FAFC"
            android:textSize="14sp" />

        <Switch
            android:id="@+id/swNotifications"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:checked="true" />
    </LinearLayout>

    <!-- Input Box -->
    <EditText
        android:id="@+id/etInput"
        android:layout_width="match_parent"
        android:layout_height="48dp"
        android:hint="Type user notes here..."
        android:textColor="#FFFFFF"
        android:textColorHint="#64748B"
        android:background="#1E293B"
        android:padding="12dp"
        android:layout_marginBottom="24dp" />

    <!-- Floating Action Button -->
    <Button
        android:id="@+id/fabAdd"
        android:layout_width="match_parent"
        android:layout_height="44dp"
        android:text="+ Quick Action Fab"
        android:background="#22C55E"
        android:textColor="#FFFFFF"
        android:textStyle="bold" />

</LinearLayout>`,
                          },
                        ],
                      },
                      {
                        id: 'folder-values',
                        name: 'values',
                        path: 'app/src/main/res/values',
                        isDirectory: true,
                        children: [
                          {
                            id: 'file-strings-xml',
                            name: 'strings.xml',
                            path: 'app/src/main/res/values/strings.xml',
                            isDirectory: false,
                            language: 'xml',
                            content: `<resources>
    <string name="app_name">no_ytgg</string>
    <string name="hello_world">Hello, Android Code Studio!</string>
    <string name="action_settings">Settings</string>
</resources>`,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'file-app-build-gradle',
            name: 'build.gradle',
            path: 'app/build.gradle',
            isDirectory: false,
            language: 'gradle',
            content: `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'com.noytgg'
    compileSdk 35

    defaultConfig {
        applicationId "com.noytgg"
        minSdk 24
        targetSdk 35
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            applicationIdSuffix ".debug"
            debuggable true
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = '17'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.13.1'
    implementation 'androidx.appcompat:appcompat:1.7.0'
    implementation 'com.google.android.material:material:1.12.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
}`,
          },
          {
            id: 'file-proguard',
            name: 'proguard-rules.pro',
            path: 'app/proguard-rules.pro',
            isDirectory: false,
            language: 'plaintext',
            content: `# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /data/data/com.termux/files/usr/opt/android-sdk/tools/proguard/proguard-android.txt
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.annotation.Keep *;
}`,
          },
        ],
      },
      {
        id: 'folder-gradle',
        name: 'gradle',
        path: 'gradle',
        isDirectory: true,
        children: [
          {
            id: 'folder-wrapper',
            name: 'wrapper',
            path: 'gradle/wrapper',
            isDirectory: true,
            children: [
              {
                id: 'file-gradle-wrapper-props',
                name: 'gradle-wrapper.properties',
                path: 'gradle/wrapper/gradle-wrapper.properties',
                isDirectory: false,
                language: 'properties',
                content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.13-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`,
              },
            ],
          },
        ],
      },
      {
        id: 'file-gradle-props',
        name: 'gradle.properties',
        path: 'gradle.properties',
        isDirectory: false,
        language: 'properties',
        content: `# Project-wide Gradle settings.
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true

# Termux Android SDK build tools AAPT2 override
android.aapt2FromMavenOverride=/data/data/com.termux/files/usr/opt/android-sdk/build-tools/36.1.0/aapt2`,
      },
      {
        id: 'file-local-props',
        name: 'local.properties',
        path: 'local.properties',
        isDirectory: false,
        language: 'properties',
        content: `## This file is automatically generated by Android Code Studio.
# Do not modify this file -- YOUR CHANGES WILL BE ERASED!
sdk.dir=/data/data/com.termux/files/usr/opt/android-sdk
ndk.dir=/data/data/com.termux/files/usr/opt/android-sdk/ndk/29.0.14206865
cmake.dir=/data/data/com.termux/files/usr/opt/android-sdk/cmake/4.1.2`,
      },
      {
        id: 'file-root-build-gradle',
        name: 'build.gradle',
        path: 'build.gradle',
        isDirectory: false,
        language: 'gradle',
        content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id 'com.android.application' version '8.4.1' apply false
    id 'com.android.library' version '8.4.1' apply false
    id 'org.jetbrains.kotlin.android' version '1.9.23' apply false
}`,
      },
      {
        id: 'file-settings-gradle',
        name: 'settings.gradle',
        path: 'settings.gradle',
        isDirectory: false,
        language: 'gradle',
        content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "no_ytgg"
include ':app'`,
      },
      {
        id: 'file-gradlew',
        name: 'gradlew',
        path: 'gradlew',
        isDirectory: false,
        language: 'plaintext',
        content: `#!/usr/bin/env sh
#
# Gradle startup script for UN*X
#
export GRADLE_USER_HOME="\${GRADLE_USER_HOME:-$HOME/.gradle}"
exec /data/data/com.termux/files/usr/opt/gradle/bin/gradle "$@"`,
      },
    ],
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
    activeFileId: 'file-compose-main-kt',
    openFileIds: ['file-compose-main-kt', 'file-compose-gradle-props'],
    files: [
      {
        id: 'folder-c-app',
        name: 'app',
        path: 'app',
        isDirectory: true,
        children: [
          {
            id: 'folder-c-src',
            name: 'src',
            path: 'app/src',
            isDirectory: true,
            children: [
              {
                id: 'folder-c-main',
                name: 'main',
                path: 'app/src/main',
                isDirectory: true,
                children: [
                  {
                    id: 'file-compose-main-kt',
                    name: 'MainActivity.kt',
                    path: 'app/src/main/kotlin/com/example/compose/MainActivity.kt',
                    isDirectory: false,
                    language: 'kotlin',
                    content: `package com.example.compose

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                ComposeAppScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ComposeAppScreen() {
    var counter by remember { mutableStateOf(0) }
    var noteText by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Jetpack Compose Studio") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { counter++ }) {
                Text("+")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp)
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Interactive State Preview", style = MaterialTheme.typography.titleMedium)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Counter Value: \$counter", style = MaterialTheme.typography.headlineMedium)
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(onClick = { counter += 5 }) {
                        Text("Add +5")
                    }
                }
            }
        }
    }
}`,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'file-compose-gradle-props',
        name: 'gradle.properties',
        path: 'gradle.properties',
        isDirectory: false,
        language: 'properties',
        content: `android.aapt2FromMavenOverride=/data/data/com.termux/files/usr/opt/android-sdk/build-tools/36.1.0/aapt2
android.useAndroidX=true`,
      },
    ],
  },
  {
    id: 'project-flutter',
    name: 'flutter_counter_app',
    packageName: 'com.example.flutter_counter',
    type: 'flutter',
    language: 'Dart',
    minSdk: 21,
    targetSdk: 35,
    compileSdk: 35,
    useKotlinDsl: false,
    activeFileId: 'file-flutter-main-dart',
    openFileIds: ['file-flutter-main-dart', 'file-pubspec-yaml'],
    files: [
      {
        id: 'folder-lib',
        name: 'lib',
        path: 'lib',
        isDirectory: true,
        children: [
          {
            id: 'file-flutter-main-dart',
            name: 'main.dart',
            path: 'lib/main.dart',
            isDirectory: false,
            language: 'dart',
            content: `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Mobile Studio',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple, brightness: Brightness.dark),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Live Preview'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text('You have pushed the button this many times:'),
            Text(
              '\$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}`,
          },
        ],
      },
      {
        id: 'file-pubspec-yaml',
        name: 'pubspec.yaml',
        path: 'pubspec.yaml',
        isDirectory: false,
        language: 'plaintext',
        content: `name: flutter_counter_app
description: "A new Flutter project created in Android Code Studio Mobile."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`,
      },
    ],
  },
];
