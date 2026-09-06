# Rooms, glyphs and a folded atlas

Version: 2026-09-06-rooms-1. This is a presentation/interaction change, not a new scientific finding.

## Navigation and evidence remain separate

Every entry in `ZUIZUI_TOWER.repos` has an enterable 3D room. The camera rotates a fixed room; it never rewrites scientific contacts. The interior doors come from `ZUIZUI_TOWER.contacts`. Reverse travel is labelled as reverse traversal and does not reverse the source arrow. Proposed/open contacts keep a barred threshold. Peeking visits a room but cannot promote a contact. Same-programme galleries are explicitly navigation, not invented scientific dependencies.

The foldout atlas uses the same room IDs, positions-by-floor and typed contact data. It is an in-document dialog; no normal gameplay link redirects to the archived website. The archive remains intact as a historical source, not the main exploration route.

## TMOP is a four-symbol evidence language

T = Theory; M = Method; O = Open data; P = Primary data. Membership for 33 repos is copied from the audited snapshot below. 284b is `?`, because this audit has no TMOP entry for it. A live membership audit should update the snapshot; room art must not infer new membership. Four original geometric glyphs, repeated in entrances, interiors and the map, can be decoded by comparing example rooms. Multiple glyphs may coexist. This is not a hierarchy of evidence strength, and O does not mean observability.

## Visual metaphors

Each room has a short riddle and a research-specific central object from a reusable 3D vocabulary: missing floor tile, optical recorder, separate reference prism, stacked niche planes, different objects to a common relation bar, architecture game, islands, flowers, etc. These are illustrations of the declared question, not experimental animations, new models or proofs. The first room release supports camera exploration and linked thresholds; it is not yet a character-walking adventure or a fully developed distinct puzzle for every repository.

## Source snapshots

- [TMOP audit](https://github.com/zuizui0223/zuizui0223.github.io/blob/9d2f9b82a892896092fd1147f675a6ef11ad2606/tmop-audit.json), blob `ab421d97acb5f54ff40cb9189be3d0e2fc0e8704`.
- [Current tower contact data](https://github.com/zuizui0223/zuizui0223.github.io/blob/9d2f9b82a892896092fd1147f675a6ef11ad2606/tower-data.js).
- [Tower source/closure audit](https://github.com/zuizui0223/zuizui0223.github.io/blob/9d2f9b82a892896092fd1147f675a6ef11ad2606/TOWER_AUDIT.md).
- [284b relation-space definition](https://github.com/zuizui0223/284b/blob/main/docs/product_b_eog_sdmr_relation_space_alignment.md).
- Design reference: [Rundisc, Chants of Sennaar](https://www.rundisc.io/chants-of-sennaar/). Only observation/translation design principles are used; no game art, glyphs, characters or UI assets are copied.

## Verification

`python tests/rooms_browser_test.py` inlines every local CSS/script actually referenced by the homepage, in order, and uses Chromium without network or browser-policy changes. Tests cover all 34 rooms, all door angles, real clicks, reverse direction, unresolved thresholds, source conditions, all four screen sizes, touch rotation, browser Back, the flat atlas, glyph decoding and immutable scientific data. `--chromium /usr/bin/chromium` selects a local executable. This is not physical-iPhone testing or scientific result validation.

