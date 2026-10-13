@.claude/local.md

@AGENTS.md

# Month Ctrl — Project Context

## Product

Monthly personal finance app. Users register income and expenses and view summaries by month. Monetized via AdMob banners. Target market: Brazil.

## Overview

- **Android package:** `com.developmentsnil.monthctrl`
- **iOS bundle ID:** `com.developmentsnil.monthctrl`
- **EAS Project ID:** `141877fd-e8b7-4b3a-aebe-278ce2f6a49a`
- **Supabase Project ID:** `wesfbmpjpnfkwtjquukq`

## Main Stack

- **Framework:** Expo SDK 57 / React Native 0.86.3 / React 19
- **Routing:** Expo Router (files in `src/app/`)
- **Authentication:** Supabase Auth (email/password + Google Sign-In)
- **Local database:** expo-sqlite with SQLCipher (encrypted)
- **State/cache:** TanStack React Query
- **Forms:** React Hook Form + Zod
- **Ads:** react-native-google-mobile-ads (AdMob)
- **Internationalization:** expo-localization + react-intl

## Critical Configuration

### Google Sign-In

Library: `@react-native-google-signin/google-signin` v16

The `webClientId` used is from Supabase's Web credential in Google Cloud Console:
```
149485421185-vvpr6u1dueraao18ouca3lckmegucmpm.apps.googleusercontent.com
```

**IMPORTANT — SHA-1 fingerprints registered in Google Cloud Console:**

| Environment | SHA-1 | Purpose |
|-------------|-------|---------|
| EAS keystore (dev/build) | `EF:4A:86:46:F6:36:B2:98:5F:B3:42:9B:89:6C:FA:44:85:9D:27:72` | Local builds and development |
| Google Play signing (production) | `33:96:46:22:19:F9:64:91:66:F8:C9:F9:F5:A7:44:2F:C0:7F:1C:60` | App installed via Play Store |

Both are registered as separate Android credentials in the same Google Cloud Console project (`monthctrl`). Without both, `DEVELOPER_ERROR` occurs on Google Sign-In in production.

**Why two SHA-1s?** Google Play re-signs the `.aab` with their own key on upload — the EAS key is used only during the build, but the Play Store uses a different key for the app the user installs.

### Firebase / google-services.json

Firebase was added **exclusively** to register the SHA-1 and satisfy the `@react-native-google-signin/google-signin` production dependency. The app does not use any Firebase services directly.

- Firebase project: `monthctrl-26e94`
- `google-services.json` is at the project root
- The EAS keystore SHA-1 is registered in Firebase (required for the file to be generated correctly)

### AdMob

Real IDs already set in `src/constants/ads.ts`:
```ts
export const AD_UNIT_IDS = {
  bannerList: "ca-app-pub-4958988852010027/1728271711",
  bannerDetails: "ca-app-pub-4958988852010027/1536700021",
};
```

AdMob App ID: `ca-app-pub-4958988852010027~2821861536` (set in `app.json`)

**Note:** AdMob banners do not appear in the Play Store internal testing environment — this is expected behavior.

### iOS (pending)

The `iosUrlScheme` in `app.json` still has a placeholder:
```json
"iosUrlScheme": "com.googleusercontent.apps.SEU_IOS_CLIENT_ID"
```
Replace with the real iOS Client ID when setting up for iOS.

## Play Store

- **App:** Month Ctrl
- **Current status:** Internal testing active (version 3)
- **Testers:** "Initial Testers" list

### Path to production

1. ✅ Internal testing — validate basic functionality
2. ⬜ Complete app setup (512x512 icon, screenshots, description, privacy policy, content rating)
3. ⬜ Closed testing — minimum 12 testers accepted + 14 consecutive days
4. ⬜ Request production access

### Build versioning

The `versionCode` is managed by EAS and auto-incremented on each production build. Never reuse a version code already submitted to Play Console — if you need to reactivate an existing bundle, use "Include from library" instead of re-uploading.

## Useful Commands

```bash
# Start dev server (from project root)
npx expo start --dev-client --clear

# Production Android build via EAS (from project root)
npx eas-cli@latest build --profile production --platform android

# Generate Supabase types (from project root)
npm run supabase-gen-types
```

## Known Issues & Resolutions

### DEVELOPER_ERROR on Google Sign-In in production

**Root cause:** Google Play re-signs the app with their own key. The SHA-1 that Google Sign-In validates in production is the Google Play one, not the EAS keystore.

**Fix:** Create a second Android credential in Google Cloud Console with the Google Play SHA-1 (`33:96:46:22:19:F9:64:91:66:F8:C9:F9:F5:A7:44:2F:C0:7F:1C:60`). Both credentials must coexist — do not replace the EAS one.

**How to extract Google Play SHA-1:** Download the universal signed APK from Play Console (App bundle explorer → Download → Universal signed APK) and run the Python script below:

```python
import hashlib, struct

apk_path = '/path/to/file.apk'
with open(apk_path, 'rb') as f:
    data = f.read()

eocd_offset = data.rfind(b'PK\x05\x06')
cd_offset = struct.unpack_from('<I', data, eocd_offset + 16)[0]
block_size = struct.unpack_from('<Q', data, cd_offset - 24)[0]
block_start = cd_offset - block_size - 8
block_data = data[block_start:cd_offset - 24]

i = 0
found = 0
while i < len(block_data) - 4 and found < 3:
    if block_data[i] == 0x30 and block_data[i+1] == 0x82:
        cert_len = struct.unpack_from('>H', block_data, i+2)[0] + 4
        if 200 < cert_len < 5000:
            cert = block_data[i:i+cert_len]
            sha1 = hashlib.sha1(cert).hexdigest().upper()
            print(f'Offset {i}, len {cert_len}')
            print('SHA-1:', ':'.join(sha1[j:j+2] for j in range(0, len(sha1), 2)))
            found += 1
    i += 1
```

The first result (largest `cert_len`) is the correct SHA-1.

### Version code already used in Play Console

If activating a version shows "Version code X has already been used", the bundle is already registered. Use "Include from library" on the test track edit screen to select the existing bundle without re-uploading.

## Open Decisions

- **iOS:** decide whether to launch alongside Android or later (iosUrlScheme still has placeholder)
- **AdMob:** evaluate whether banner ads are the right model vs rewarded/interstitial
- **Closed testing:** gather 12 testers to start the 14-day countdown before production
- **Play Store setup:** complete 512x512 icon, screenshots, description, privacy policy, and content rating
