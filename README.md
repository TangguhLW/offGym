# offGym

Aplikasi latihan dan pencatatan gym offline, edisi offGym by Thangguh.

Snapshot sumber terbaru yang tersedia pada 27 Oktober 2026. Versi: **1.4.2+offgym.3**.

## Download APK

[**Download offGym-1.4.2-offline-v3.apk**](https://github.com/TangguhLW/offGym/releases/latest/download/offGym-1.4.2-offline-v3.apk)

[Lihat halaman rilis dan checksum](https://github.com/TangguhLW/offGym/releases/latest). Unduh APK, lalu izinkan pemasangan dari sumber tersebut saat diminta Android. Gunakan paket ini untuk versi terakhir yang dipublikasikan di repo ini.

SHA-256: `fc22b77d45ccc7607e3b97b549421a704cbe02586525631988de7a1803414b31`

## Dokumentasi proyek

# offGym by Thangguh

This is a modified edition of openGym, modified on 26 October 2026.
Original copyrights and third-party terms remain in LICENSE, NOTICE.md and
catalogue/media/NOTICE.md. They are also available offline under Settings > About >
Legal information in the app. Thangguh maintains this modified edition.

The Android app starts in local mode without a connection or permission setup
screen. Its interface offers Bahasa Indonesia and English. Indonesian is the
initial language, with a red accent. Exercise names and instructions retain
their English catalogue text. Language choices, training history and backups
are stored locally. Internet and package-install permissions are removed.
Server pairing, remote AI coaching, server status and upstream updates are
disabled in the offline edition.

The existing Android application ID and private data format are retained so
the locally signed app can update the previously installed build without
erasing training data. The visible name and icon are offGym. Keep using the
same private signing key for updates; never distribute that key.

The second offGym build uses Thangguh's supplied PNG as the launcher icon. Android's
launch window is blank, and the existing HTML dumbbell animation is the only intro.
Fast launches leave that animation visible until 1.5 seconds after navigation starts;
slower launches do not add a further wait. The source icon is resources/icon.png
inside frontend/.

The third build replaces the warm red-orange accent with pure red (#eb0000,
#c90000 in the light theme) and applies the red preset once to existing installs
without changing their language or training data.

## Build

Requires Node 20+, Java 21, Android SDK 36 and Gradle 8.14.3.

```text
cd frontend
npm ci
npm run build:offline
cd android
gradlew assembleSideloadRelease
```

The APK at app/build/outputs/apk/sideload/release must be aligned and signed
with your own key using the Android SDK zipalign and apksigner tools.
The corresponding source archive supplied with the APK includes this file,
the modified source and the original license notices. Signing secrets,
dependencies and local app data are excluded.


Dokumentasi proyek asal: [openGym](README.upstream.md).
