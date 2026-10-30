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

`npm run build` bundles the application and copies runtime images and complete glTF resource folders into `dist/assets/`. `vite.config.mjs` keeps stable filenames for loader references and uses relative bundle URLs. Runtime loader paths are relative to the document directory. Serve directory URLs with a trailing slash when hosting under a subdirectory.

### Verified on 2026-10-29

- Production build completed; Vite still reports a large JavaScript chunk warning.
- Verified 34 external glTF buffer/texture references and nine runtime images exist in the build output.
- In Chrome via `npm run preview`, selected Sheep and entered the rendered scene; cabin, trees, animals, lighting, and shadows were visible.
- Feed changed hunger from 1 to 0. Bathe and Play restored hygiene and happiness from 99 to 100.
- No warning/error console entries were captured during this smoke check.

This check does not certify all movement, collision, camera shortcuts, devices, or hosting configurations. There is no implemented automated test suite; `npm test` retains its existing placeholder failure. README screenshots remain the original project screenshots.
