# Verification — October 9, 2026

## Source review

- Reviewed the complete published presentation: 927 slides and its click-animation progression, recorded in 1,079 captures.
- Reviewed all 142 image files in the supplied Chapter Two sprite deck, including names and evolution sheets.
- The game includes story slides 1–900 and credit/evolution slides 901–924. Slides 925–927 contain source music links, third-party account/extension instructions and the future sequel link; they are not in-game scenes.
- Exported click groups from 119 animated source slides, including 200 fade effects and 103 size, position and rotation tracks. The canvas renderer adapts these effects and slide geometry. Fonts, group transforms and playback timing can differ from Google Slides.
- Kept original source decks and the previous game separate from this release.

## Automated checks passed

13 game check groups cover every scene and cue, all 31 encounter configurations, all shipped art references, schema limits, unsafe URL rejection, pause/QTE behavior, parries, damage/shields/healing/status effects, time stop, friendly fire, cover/projectile collisions, platform jumping, waves, team switching and ending conditions.

9 Worker check groups cover health/config, disabled uploads, missing or rejected login tokens, image type/size checks, content-addressed uploads, image reads, duplicate reuse, CORS and invalid paths. Google login verification and R2 were mocked; no live images were uploaded by these tests.

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
