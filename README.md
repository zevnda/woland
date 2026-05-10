# WoLAnd (Wake on LAN Android)

An easy to use Android app, built with Tauri, for sending WoL packets to wake up your other devices remotely

## Prerequisites

- **Node.js** (v18+) - [nodejs.org](https://nodejs.org)
- **Rust** - [rustup.rs](https://rustup.rs)
- **MSVC C++ build tools.** - [visualstudio.microsoft.com](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- **Android SDK** - [Android Studio](https://developer.android.com/studio) or [Android SDK command-line tools](https://developer.android.com/studio/command-line)

## Setup

### 1. Clone The Repo
```bash
git clone https://github.com/zevnda/woland.git
cd woland
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Build APK

```bash
pnpm tauri android build --apk --target aarch64
```

You APK needs to be self-signed in order to install it on your device, follow the links below for more information:
- [Developing a mobile application - Tauri](https://v2.tauri.app/develop/#developing-your-mobile-application)
- [Building an APK bundle - Tauri](https://v2.tauri.app/distribute/google-play/#build-apks)
- [APK code signing - Tauri](https://v2.tauri.app/distribute/sign/android/)

## Homescreen Widget

Under development