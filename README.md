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

### 3. Configure Your Device
Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your device's MAC address and broadcast address:

```
DEVICE_MAC=AA:BB:CC:DD:EE:FF
BROADCAST_ADDR=255.255.255.255:9
```

## Build & Run

### Dev Server

```bash
pnpm tauri android dev
```

### Build APK

```bash
pnpm tauri android build
```

- [Developing a mobile application - Tauri](https://v2.tauri.app/develop/#developing-your-mobile-application)
- [Building an APK bundle - Tauri](https://v2.tauri.app/distribute/google-play/#build-apks)
- [APK code signing - Tauri](https://v2.tauri.app/distribute/sign/android/)

## Homescreen Widget

WoLAnd comes with a 1x1 homescreen widget that allows you to easily power on your devices without needing to open the app