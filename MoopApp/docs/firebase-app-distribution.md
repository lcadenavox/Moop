# Firebase App Distribution Integration (Expo + Android)

This guide shows how to integrate Firebase services (Analytics, etc.) and distribute Android builds to testers using Firebase App Distribution in an Expo project.

## 1. Pre-reqs
- Firebase project created (you already have: `moop-be288`).
- Downloaded `google-services.json` (place at project root for now; will move after prebuild).
- Expo CLI and EAS CLI installed.

## 2. Generate Native Android Folder (Managed -> Prebuild)
Expo managed workflow hides Gradle; to insert Firebase Gradle plugins you must generate native code:

```powershell
# In project root
npx expo prebuild --platform android
```

This creates `android/` with Kotlin DSL (`build.gradle.kts`). After this, move `google-services.json` into `android/app/`.

## 3. Gradle Changes
Root project file: `android/build.gradle.kts` (or top-level `build.gradle.kts`). Add Google Services plugin apply-false:
```kotlin
plugins {
  // existing plugins...
  id("com.google.gms.google-services") version "4.4.4" apply false
}
```

Module app file: `android/app/build.gradle.kts`. Add plugin and Firebase BoM + desired SDKs:
```kotlin
plugins {
  id("com.android.application")
  id("com.google.gms.google-services")
}

dependencies {
  // Firebase BoM keeps versions aligned
  implementation(platform("com.google.firebase:firebase-bom:34.5.0"))

  // Analytics example
  implementation("com.google.firebase:firebase-analytics")
  // Add others as needed (auth, firestore, messaging, etc.)
  // implementation("com.google.firebase:firebase-auth")
  // implementation("com.google.firebase:firebase-firestore")
}
```

## 4. Expo Config Enhancements
If using `expo-firebase-analytics` (JS layer), install:
```powershell
npm install expo-firebase-analytics
```
No native config plugin needed if you prebuild and adjust Gradle manually.

## 5. EAS Build Setup
Install EAS if not yet:
```powershell
npm install -g eas-cli
```
Initialize:
```powershell
eas login
npx eas build:configure
```
This creates `eas.json`. Example snippet enabling release channel:
```jsonc
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": { "distribution": "store" }
  }
}
```

## 6. Firebase App Distribution via CI or Local Script
After EAS build completes, use Firebase CLI to distribute the generated APK/AAB.

Install Firebase CLI:
```powershell
npm install -g firebase-tools
firebase login
```

Command (replace app_id and tester emails):
```powershell
firebase appdistribution:distribute dist\your-build.aab `
  --app YOUR_FIREBASE_ANDROID_APP_ID `
  --release-notes "Teste build Moop" `
  --groups "testers"
```
App ID is found in Firebase console (Android app settings). Groups must be pre-created or use `--testers` for individual emails.

### Automate with Post-Build Script
Use an EAS hook (in `eas.json`):
```jsonc
{
  "cli": { "version": ">= 3.0.0" },
  "build": {
    "preview": {
      "distribution": "internal",
      "env": {"FIREBASE_APP_ID_ANDROID": "YOUR_APP_ID"},
      "hooks": {
        "postBuild": "node scripts/distribute-firebase.js"
      }
    }
  }
}
```

Create `scripts/distribute-firebase.js`:
```js
const { execSync } = require('child_process');
const path = require('path');

function run(cmd) {
  console.log('> ' + cmd);
  execSync(cmd, { stdio: 'inherit' });
}

// Locate .aab artifact (EAS stores in project root or artifacts dir depending context)
// Adjust path once you know actual output location
const artifact = process.env.EAS_BUILD_ARTIFACT_PATH || 'app-release.aab';
const appId = process.env.FIREBASE_APP_ID_ANDROID;
if (!appId) throw new Error('Missing FIREBASE_APP_ID_ANDROID');
run(`firebase appdistribution:distribute ${artifact} --app ${appId} --release-notes "Preview build"`);
```

## 7. iOS (Optional)
For iOS testers use TestFlight. Firebase App Distribution does not distribute iOS native compiled builds directly (it supports iOS but via upload of IPA). You can mirror similar postBuild script referencing IPA path.

## 8. Environment Variables & Security
Do not hardcode secrets. For JS Firebase config, you have keys in `app.json > extra`. They are safe (public) except avoid storing private service account JSON in repo; for CLI distribution use `FIREBASE_TOKEN` (after `firebase login:ci`). In EAS, store it as a secret: `eas secret:create --name FIREBASE_TOKEN --value <token>` then reference it in build profile.

## 9. Verification Checklist
- [ ] android/ generated
- [ ] google-services.json in android/app/
- [ ] Root Gradle plugin declaration added
- [ ] App Gradle plugin applied and BoM + SDKs added
- [ ] Build succeeds: `eas build -p android --profile preview`
- [ ] Artifact distributed with Firebase CLI
- [ ] Testers receive email invitation

## 10. Troubleshooting
| Symptom | Cause | Fix |
|---------|-------|-----|
| Plugin not found | Gradle sync after prebuild not run | Re-run build or invalidate caches |
| Distribution fails (permission) | Missing firebase login or token | Run `firebase login` / set `FIREBASE_TOKEN` secret |
| Analytics not logging | Missing initialization in JS | Import and call `logEvent` after `Firebase.initializeApp` |
| google-services.json warning | Wrong folder | Move file into `android/app/` root |

## 11. Removal / Re-run
If you need to regenerate native code, delete `android/` and run `expo prebuild` again (will wipe manual edits—reapply plugin lines).

---
**Next Step:** Run `npx expo prebuild --platform android` and apply listed Gradle changes.
