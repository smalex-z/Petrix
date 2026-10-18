# Verification notes

## Manual smoke check

1. Start `npm run dev` and select a pet.
2. Confirm the animal models, cabin, scenery, and needs icons load.
3. Move with W/A/S/D and exercise collision boundaries near other animals and the house.
4. Open the interaction menu and verify that feed, clean, and play change status values.
5. Toggle bounding boxes with the backtick key.
6. Exercise orbit/zoom controls and the 3/4/0 camera shortcuts.
7. Observe changing lighting and autonomous animal movement.

## Build and deployment scope

`npm run build` checks bundling, but does not verify all runtime assets or visual behavior. Several images and glTF resources are loaded using string paths such as `../assets/...`. Those references need a separate asset-packaging review before publishing `dist/` or deploying under a subdirectory. Test `npm run preview` with the browser network panel before deployment.

There is no implemented automated test suite; `npm test` retains its existing placeholder failure. Screenshots in the README are the project's existing screenshots, not evidence of a new runtime test.
