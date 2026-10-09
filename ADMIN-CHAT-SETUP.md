# Install the admin panel, chat and rotated collisions

## 1. Upload the game update to GitHub

Extract Rombies-GitHub-fixes.zip and upload **all its files** into the root of `sektanaymikon/rombies`, replacing matching files. Include all ten `customize-v6` JavaScript/CSS files. Keep the existing images and older files.

## 2. Deploy the Firestore rules

Open [Cloud Firestore → Rules](https://console.firebase.google.com/project/rombies-86aa3/firestore/rules). Replace the rules with the **complete** supplied `firestore.rules` and click Publish. Keep the existing Discover indexes. Chat uses ordinary single-field indexes and does not require a new composite index.

You do **not** need Realtime Database, Firebase Admin SDK, custom claims or manually registered administrators. Admin access uses the requested shared password **0219**. A correct password creates a one-hour session; closing the panel locks it. Anyone who knows that password can use the controls.

The existing Anonymous sign-in provider supplies player identity automatically. Email is optional. Ordinary chat uses each player's connected online username; the admin unlock connects an existing profile or claims a name automatically if needed.

## 3. Deploy the updated upload Worker

Cloudflare → Workers & Pages → `rombies-uploads` → Edit code. Replace its code with the supplied `rombies-uploads-worker.js` and Deploy. Keep **UPLOADS → rombies-sandbox** and **ENABLE_UPLOADS = true**. No new secret or variable is needed.

Deploy the rules before the Worker. The Worker now verifies each uploader's ban status and refuses uploads when that check is unavailable. The health page should include `moderationEnforced: true`.

## 4. Update CodeHS

Replace CodeHS `index.html` with the full contents of the new `CodeHS-small-index.html`, then Run. Upload the GitHub update first. The CodeHS page remains approximately 11 KB. The complete static game stays under 15,000,000 bytes.

## 5. Start using the panel

1. Open Sandbox → **Admin panel**.
2. Enter **0219** → **Unlock admin panel**.
3. Click **Enable chat and DMs** the first time. Chat starts disabled until an admin enables it.
4. Write an announcement, choose 5–3600 seconds and click **Send globally**. It appears above the game at the top center, including fullscreen. Clear announcement removes it.
5. Choose a registered username, or use exact username search. Send a private admin notice, open a DM, or confirm Ban player / Unban player. Self-banning is disabled.
6. The Chat button opens # global and People / DMs for ordinary players. Messages show usernames, persist online and update live. Each view loads the latest 50 messages. Usernames load in pages of 100; conversations show the first 30 threads.

DM contents are readable only by their two participants; even password-unlocked admins cannot read unrelated conversations. Private admin notices go only to their recipient and continue to display when ordinary chat is disabled. Global announcements need no creator login to display. All message text renders as text, never HTML.

Bans apply to the Firebase account: they block chat, publishing and uploads immediately. Local play and existing public fights remain available. A different anonymous account is a different identity. If every account with the password is banned, restore one account by setting its Firestore `bans/{uid}.active` to false in the console.

## Rotated obstacle collisions

Obstacle movement collision, cover, one-way platforms, damage/healing/bounce zones, melee proximity, swept projectile blocking and beams use the artwork's rotated rectangular boundary. Mirrors do not change a rectangle's outer shape. Transparent pixels inside artwork do not cut holes in the collision rectangle. Chapter One presentation/fullscreen and all existing customization controls are preserved.

## Verification

Tested locally against the official Firestore emulator, including shared-password unlock, live chat between two accounts, private conversations, announcements, ban/unban, chat toggle and unauthorized operations. The production repository, database rules and Worker have not been deployed by the assistant.

[Firebase's rules documentation](https://firebase.google.com/docs/rules/basics) describes server-side enforcement. [Firestore listeners](https://firebase.google.com/docs/firestore/query-data/listen) provide live updates.
