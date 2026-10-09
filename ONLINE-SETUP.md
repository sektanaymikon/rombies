# Latest update: shared-password admin panel and chat

Follow **ADMIN-CHAT-SETUP.md** in this folder for the latest installation. Deploy the updated rules before the updated Worker. Sandbox → Admin panel uses password **0219** directly; do not create admin-role records. Keep the existing Discover indexes and authentication providers.

# Finish Sandbox online setup

The client is already configured for Firebase project `rombies-86aa3` and the upload Worker `rombies-uploads.sektanaymikon.workers.dev`.

## 1. Create the two Firestore indexes

Live Discover connected to Firebase during the October 9 check. Firebase returned **failed-precondition: missing index**. This is the remaining confirmed database setup issue.

Open [your Firestore indexes](https://console.firebase.google.com/project/rombies-86aa3/firestore/indexes), choose **Create index**, and add these:

| Collection ID | First field | Second field | Query scope |
|---|---|---|---|
| `fights` | `public` — Ascending | `updatedAt` — Descending | Collection |
| `fights` | `ownerId` — Ascending | `updatedAt` — Descending | Collection |

Wait until both indexes show **Enabled**. The same definitions are in `firestore.indexes.json` in the separate backend setup folder. An optional single-field exemption for the large `config` field is included there.

[Firebase's index instructions](https://firebase.google.com/docs/firestore/query-data/indexing) explain the console steps and index build status.

## 2. Confirm authentication and rules

- Firebase Authentication: enable **Anonymous** and **Email/Password** sign-in, as set up earlier.
- Firestore must use the supplied `firestore.rules`. It allows public Discover reads and checks ownership on writes; it does not use test-mode public writes.
- If Firebase reports an unauthorized domain, add the actual hostname serving your game under Authentication → Settings → Authorized domains. Newer projects may need `localhost` added for local testing. See [Firebase's authentication troubleshooting](https://firebase.google.com/docs/auth/faq-and-troubleshooting).

The database client uses **Cloud Firestore**, matching the prepared rules and collections. It does not use Realtime Database.

## 3. Enable custom image uploads

In Cloudflare → Workers & Pages → `rombies-uploads` → Settings:

1. Keep the R2 binding **`UPLOADS` → `rombies-sandbox`**.
2. Under Runtime variables, add a text variable **`ENABLE_UPLOADS`** with the exact value **`true`**.
3. Save/deploy the change.
4. Open [the Worker health page](https://rombies-uploads.sektanaymikon.workers.dev/health). Confirm `ok`, `bucketConnected` and `uploadsEnabled` are all `true`.

The last user-provided health result showed the bucket connected and uploads disabled. The current health URL was blocked by this assistant browser's network policy, so its latest deployment state is unverified. The R2 bucket can stay private; the Worker serves the approved image URLs.

## 4. Try the complete online flow

Host this package, open Sandbox, and choose **Create online username**, or use **Account → Connect username** for a local profile. Add email/password through **Protect this account** if you want to sign in on other devices.

Create a fight with one custom image, save a local draft, then choose **Publish to Discover** and confirm the preview. Check Community, play it, and open its Share link in another browser. An owner can edit or unpublish their fight. PNG/JPEG/WebP images are compressed locally before upload, with a 2 MiB limit per image. Animated GIFs are preserved without conversion and must already fit within 2 MiB.

## Animated GIF Worker update

For existing deployments, open Workers & Pages > rombies-uploads > Edit code,
replace the code with this updated `rombies-uploads-worker.js`, and Deploy.
Keep the same bucket binding, variables and Firebase setup. The `/health`
response lists `image/gif` under `supportedTypes` when the GIF-capable version
is deployed. Local GIF playback works before this step; online GIF publishing
needs the updated Worker. No S3 keys or R2 public access are required.

Live publishing, account recovery, cross-browser ownership, and R2 uploads still need this final hosted check. Local drafts, image imports, portable exports and built-in fights are already tested and work without the online services.

## Custom fight music Worker update

For this update, replace the rombies-uploads Worker code with the supplied rombies-uploads-worker.js and Deploy. Keep the existing UPLOADS bucket binding and variables. Firebase rules and sign-in settings stay the same. Local music playback/export/import works without redeployment; publishing music needs this version.

The /health response now includes maxMusicBytes: 8388608 and audio/mpeg, audio/ogg, audio/wav. Images retain their 2 MiB limit; music has an 8 MiB limit. Authenticated uploads are content addressed, and the Worker supports byte-range reads for audio seeking. R2 can remain private.
