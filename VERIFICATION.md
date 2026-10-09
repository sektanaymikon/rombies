## Obstacle durability and invincibility

Arena & obstacles → Edit obstacle now has Obstacle durability (1–1,000,000) and an Invincible checkbox. All obstacle types support these settings. Destructible obstacles disappear and stop affecting the fight at zero durability. Invincible obstacles retain collision/effects and ignore damage. Existing non-cover obstacles remain invincible by default to preserve older fights. Settings autosave and survive public fight serialization. 21 durability/invincibility checks and 10 rotated-physics regression checks passed.

Upload all files from the new GitHub patch, including ten customize-v8 files, and replace the small CodeHS index. No backend update is required for these controls.

# Automatic saving and shared music — October 9

- Every editor change immediately saves a local draft, including music, sprites, attacks, obstacle transforms and arena settings.
- Existing online fights sync automatically after a short pause. Music and artwork are uploaded to R2 and shared fight configs contain public URLs. Repeated saves reuse uploaded files.
- Online updates preserve published/unpublished status. New fights need Publish once before they appear in Discover.
- If sync fails, the local draft remains saved. Retry online save sends it again. Automatically saved drafts retain their online fight link.
- Normal battle settings now include Music volume controls.

Install this update: upload all files from Rombies-GitHub-fixes.zip to the repository root, replacing matching filenames, including the ten customize-v8 files. Replace CodeHS index.html with CodeHS-small-index.html. No additional backend change is needed if the previous admin/chat backend is already deployed. For an older fight whose music was only local, open its latest local draft, select the music and press Update/Publish once to link that saved draft to the online fight.

63 focused automated checks passed in this update: 10 autosave, 10 cloud, 15 GIF/music media, 11 audio and 17 customization. These use local mocks and make no production writes. JavaScript syntax and archive/file-size checks are run during packaging.

# Shared-password admin panel, chat and rotated hitboxes — October 9

- Sandbox now has an Admin panel button. Password 0219 directly unlocks controls; no manually granted Firebase administrator or Admin SDK is required. An existing username is used or one is connected automatically. Sessions last one hour and closing the panel locks it.
- Global announcements appear above every game/chat layer at the top center. Set their duration or clear them. Admin notices go to a specific username. They still work with ordinary chat disabled.
- Live # global chat, private two-person DMs, persistent message history, exact username lookup, paged username directory, ban/unban and chat toggle are available. Messages are plain text and posting has a two-second server-enforced cooldown.
- Rotated obstacles now use oriented geometry for movement, cover, platforms, damage/heal/bounce areas, melee, projectiles and beams. The visible rectangular shape and physics share their rotation.
- Preserves Chapter One normal battle presentation/fullscreen, creator-only Playtest layout, separate arena sizing, drag/resize/rotate/mirror controls, GIFs and custom music.

Install: upload every file from Rombies-GitHub-fixes.zip, including ten customize-v8 files. Publish the complete updated firestore.rules and deploy the updated upload Worker from Rombies-Sandbox-Backend.zip. Then replace CodeHS index.html with CodeHS-small-index.html. Keep existing images, variables and R2 binding. No Realtime Database, new secret or manual admin registration is needed. ADMIN-CHAT-SETUP.md gives every step.

173 automated checks passed: 24 engine/story/presentation, 17 customization, 10 selection handles, 14 GIF/music storage, 15 Worker, 9 cloud, 11 audio, 3 music schema, 8 obstacle/deletion, 10 rotated physics and 52 real Firestore emulator access checks. Browser checks used the real Firebase Web SDK against only the local demo emulator: shared-password unlock without a role, global announcements, private notices, live two-account DMs, ban/unban and chat disable/enable. No production publishing, moderation or deployment was performed.

# Current verification — October 9

110 automated checks passed: 24 engine/story/presentation, 17 customization, 10 selection handles, 14 GIF/music storage, 14 Worker, 9 cloud, 11 music lifecycle, 3 music schema and 8 obstacle/deletion checks. All cloud/Worker tests use mock services.

Browser checks confirmed a 60° color obstacle and its outline rotate in both Playtest and normal Chapter One style battles. My fights shows both publication states; only the unpublished card offers Delete fight. Its confirmation and Keep fight cancellation worked. No production deletion occurred. Battle console contained no errors.

# Rotation, attack menus and music verification

101 automated checks pass: 24 engine/story/presentation, 17 customization, 10 selection/rotation handles, 14 GIF/music storage, 14 Worker, 8 cloud, 11 audio lifecycle and 3 music schema checks. Worker/cloud checks mock external services and perform no production writes.

Real browser checks: attack art rotation +15°; separate attack animation rotation field 45°; green-handle drag to approximately 99.64°; persisted exported rotation after reload; every default regular attack and ultimate lists both artwork and animation entries even before uploading a pose. An authored four-second WAV uploaded and decoded with readyState 4, played and looped, stopped at time zero, exported with identical bytes, imported, and played again. A music-equipped Playtest opened, paused and returned without console errors. Prior sprite movement/resizing, arena proportions and Chapter One presentation regression checks pass.

R2 playback byte ranges, size limits, audio-only type validation and authentication are tested with mocked R2/Google/Firebase. Live hosting, publishing and cross-device music retrieval need the user's final deployment and hosted check.

# Latest customization verification — October 9

Sprite dragging correction: nine new selection checks pass for direct character selection, switching to another sprite, corner resizing, rotation, floor/background priority and hidden attack previews. Browser pointer drags selected and moved Shane while the floor was selected, then resized Shane from 130 × 155 to 220 × 215 without using the object dropdown. Updated downloads use fresh customize-v3 filenames.

70 automated regression groups pass: 24 engine/story/presentation, 17 sandbox customization, 11 GIF, 11 mocked Worker and 7 mocked cloud checks. All attack kinds and ultimates retain independent attack-art and attack-pose transforms through public schema normalization.

Real browser pointer drags resized uploaded attack art from 150 × 8 to 290 × 108; a separate character pose from 280 × 350 to 400 × 450; and an enemy ultimate from 180 × 180 to 290 × 260. Its horizontal mirror toggled successfully. A separate world handle enlarged the arena from 2000 × 1100 to 2364 × 1300. A UI-exported JSON confirmed the character stayed 280 × 350 at X 234, resized attack/pose dimensions stayed unchanged, and the obstacle stayed 133 × 168 at X 906. Background filled the new arena with preserved proportions. No production publishing was performed.

# Verification — October 9, 2026

## Source review

- Reviewed the complete published presentation: 927 slides and its click-animation progression, recorded in 1,079 captures.
- Reviewed all 142 image files in the supplied Chapter Two sprite deck, including names and evolution sheets.
- The game includes story slides 1–900 and credit/evolution slides 901–924. Slides 925–927 contain source music links, third-party account/extension instructions and the future sequel link; they are not in-game scenes.
- Exported click groups from 119 animated source slides, including 200 fade effects and 103 size, position and rotation tracks. The canvas renderer adapts these effects and slide geometry. Fonts, group transforms and playback timing can differ from Google Slides.
- Kept original source decks and the previous game separate from this release.

## Automated checks passed

13 game check groups cover every scene and cue, all 31 encounter configurations, all shipped art references, schema limits, unsafe URL rejection, pause/QTE behavior, parries, damage/shields/healing/status effects, time stop, friendly fire, cover/projectile collisions, platform jumping, waves, team switching and ending conditions.

11 Worker check groups cover health/config, disabled uploads, missing or rejected login tokens, image type/size checks, content-addressed uploads, image reads, duplicate reuse, GIF byte/type/dimension checks, CORS and invalid paths. Google login verification and R2 were mocked; no live images were uploaded by these tests.

7 Firebase-client check groups cover atomic username claims, duplicate handles, fight create/update ownership fields, bounded Discover/owner queries, bookmark idempotency, upload validation and fight lookup/deletion. The Firebase SDK was mocked; these are client-contract checks, not a Firestore security-rules emulator run.

All release JavaScript passes syntax checking. ZIP integrity, the flat package's asset paths, image decoding and the package size limit are checked during packaging.

## Browser checks passed

- Chapter Two opening, encounter selection and battle start.
- Combat HUD, attacks, character switching, pause/restart/exit, and a completed survival fight with a result screen.
- First-entry local username, fight settings, local draft save and persistence after reload.
- Custom WebP background upload/compression, arena preview, obstacle editing, fight export with embedded art, import and saving the imported copy separately.
- Desktop layout and 390 × 844 phone layout with touch controls.
- Lead extraction QTE completed using the on-screen arrow and Space buttons; score increased by 600 and ultimate charge reached 100%.
- Actual Firebase Discover request reached the backend and reported its missing index.
- Returning to Chapter One, opening Battle Select, and starting Lab Breakout still works.

## Remaining verification limits

The full campaign has not been manually won encounter by encounter. Automated rendering checks verify scene/cue execution, not pixel-for-pixel slide fidelity. Live publishing, account recovery and R2 uploading await the online setup described in ONLINE-SETUP.md. The Firestore rules have not been run in the Firebase emulator. No production fights or usernames were created during testing. Browser gameplay checks used the source build over local HTTP; the in-app browser blocks file:// navigation, so the flattened package was verified through its complete path/image/syntax/archive checks instead.
# October 9 animated GIF update

The latest update adds preserved GIF uploads to all artwork pickers, portable
fight import/export, GIF rendering on the game canvas and GIF upload/download
routes in the supplied Worker. Eleven GIF regression groups passed, including
frame comparisons against Pillow for disposal modes 1/2/3, transparency,
interlacing, looping and GIF87a. Eleven mocked Worker groups and all 24 existing
engine/presentation groups passed. Browser checks confirmed actual Sandbox
GIF upload, four distinct animated canvas frames and a battle with GIF artwork.
No live account or R2 publishing writes were made. The Worker must be deployed
by the user to enable GIF publishing in their current online setup.

## October 9 Sandbox customization update

Fifteen additional regression groups passed for 0–10 regular attacks, keyboard
and touch slot 10, AI ultimate separation, sticky cardinal aim, horizontal
facing and manual mirrors, aim preservation through character switching,
optional wiggle, uploaded artwork for all nine attack behaviors, temporary
attack poses, every object's transforms, actual custom arena dimensions,
directional beams/cover, sprite stretching, independent collision sizes,
jump strength, optional labels and stable drag resizing from original geometry.
All 24 engine/presentation, 11 GIF, 11 Worker and 7 Firebase-client groups were
also rerun successfully (68 groups total).

Browser checks used the delivered replacement HTML with the existing pinned
GitHub CDN assets. An exported test fight containing uploaded transparent
attack artwork was imported through the actual file picker. Its ten attacks,
mirrors, disabled wiggle, rotation and optional pose survived import. Melee
artwork and the temporary Hammer-form pose were visibly rendered in combat;
both the attack-10 button and keyboard 0 triggered its cooldown. The actual
battle canvas used the configured 2000 × 1100 dimensions, and fullscreen fit
the complete arena. At 390 × 844, all twelve ability controls fit in three
columns within the viewport. A real arena-corner drag changed it to 1780 × 960
and scaled the floor from Y 917 to Y 800 without rounding drift. Rotation drag,
undo and redo were checked in the editor. The Chapter One movement-wiggle
checkbox retained its value when settings were reopened; the original value
was restored afterward. No browser console errors were reported.

Proof: Rombies-Sandbox-customization-check.png accompanies the release files.
No test fight was published, and no external deployment was made. Online
Firebase/R2 behavior remains subject to the verification limits above.

## Chapter One battle presentation update

Normal Chapter Two and Sandbox Play (including Discover and shared-link plays)
now use Chapter One's HUD bars, overlaid ability cards, stage framing, Settings
button, pause-menu actions and arena-fitting fullscreen. Only the builder's
Playtest passes playtest:true and shows the newer controls/settings layout.
The option is local UI state, not a creator-controlled field in a published fight.
The arena simulation, custom movesets, poses, GIFs and QTE mechanics are retained.
Browser checks covered ordinary Play, pause/Fullscreen/Resume/return, and the
builder Playtest layout. Existing 24 engine/presentation, 15 customization and
11 GIF groups passed again. The online files need the supplied GitHub update;
no production files were deployed by the assistant.

