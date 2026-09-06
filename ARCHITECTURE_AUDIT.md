# An asymmetric tower, not five copies of one floor

Design revision: 2026-09-07. Base: `3e4379a9662d82833cd39ffd7f87eeb046ca4c83`.

## The design problem

The previous building repeated square slabs, corner columns and the same arch at every height. Its four sides were largely interchangeable. Interactivity and passing tests did not establish visual quality. This revision replaces that geometry rather than adding another icon layer.

## Five spatial languages

1. **Garden**: an irregular stepped shoreline, pale stone terraces, a water court and an off-centre grove.
2. **Archive**: a heavy terracotta wall, one monumental cut arch on its front, and a perforated screen on its back.
3. **Oculus**: an open crescent platform and a displaced circular aperture. Turning the camera exposes the aperture's thin edge and the stair behind it.
4. **Fork**: unequal cantilevered passages and tall separate fins, with no complete enclosing floor plate.
5. **Observatory**: an offset pavilion with two unequal roof pitches and a separate brass optical instrument.

Stairs, landings and a narrow displaced spine keep these as one building. The interior plans follow the same garden / thick wall / circular room / forked passage / open observatory vocabulary. They remain 34 repository rooms, not 34 newly designed independent puzzles.

## View, material and interface

`tower-architecture.js` builds immutable world-space surfaces and the 34 entrance coordinates. `tower.js` projects them, and now tests entrance occlusion against the depth of the covering face at the exact screen point. The camera changes visibility, never the world-space coordinates.

The display palette uses chalk, clay, jade and restrained brass against a deep blue-green ground. `architecture.css` handles composition, quieter controls and subtle procedural grain. It does not change the scientific floor palette stored in the evidence data. The old pasted-on arch icons are removed; large pointer targets remain around small markers. Interior doors are projected as planes rather than always facing the screen.

The two auxiliary clue layers are redrawn with tower frames instead of running perpetual independent animation loops. No external texture, font, renderer, CDN, analytics, or API key has been introduced.

## Preserved source contracts

The research data and statuses in `tower-data.js` are unchanged from the base commit (blob `5f6dfd87f5c16a346b0cf0bf5980d65554fcf783`). The five motif IDs and solution angles remain unchanged. The four TMOP evidence categories, 284b's unaudited membership, directed scientific contacts, optional map, source notebook and field-return ending remain intact. Architectural metaphors are not new scientific results. Legacy archives and scientific audit files are not removed or reclassified.

## Verification and scope

- `tests/tower_browser_test.py` retains the tower-core interaction, five discoveries, 34-entry access, source boundaries, four viewport sizes and touch checks. Its loader now includes the architecture module. This focused suite intentionally excludes the room interception layer.
- `tests/rooms_browser_test.py` continues to inline **every** actual homepage asset and tests all 34 rooms, door visibility, map, history, glyphs and immutable evidence.
- `tests/architecture_browser_test.py` loads the real homepage over loopback HTTP in CI; it checks all 34 exterior doorways across camera angles, the five perspective puzzles, material-independent geometry and five interior plans. It also records four exterior views, five floor views, five interiors and mobile views for visual inspection.

Where local browser policy disallows loopback navigation, `--inline` uses the same current assets without changing that policy. That local mode does not establish HTTP loading or live-hosting behavior. CI's default HTTP mode is a separate check. Mobile viewport/touch emulation is not physical iPhone testing.

The screenshots are evidence of what was rendered, not an automated certificate of beauty. The simplified painter's-algorithm renderer is still stylized; this revision is neither physically based rendering nor a guarantee of perfect visibility sorting in every overlap.
