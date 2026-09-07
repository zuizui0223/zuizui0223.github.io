# One flower as the origin

Design revision: 2026-09-07. Base commit: `9e32231bb6da751e1cc02238bf88706a09f409e4`.

The owner's requested origin symbol is a single Campanula-like bellflower under a glass cloche, with the quiet, protected quality of the rose under glass in Beauty and the Beast. This implementation uses original procedural geometry, not film artwork or an imported image.

## Presentation

The old nameplate is replaced by a glass botanical emblem: an arched stem, one downward-facing pale mauve flower, a small closed bud, five corolla lobes, leaves, a muted green pedestal and thin reflective edges. The plant is modeled with fixed three-dimensional surfaces; its view follows the tower's rotation. The transparent glass is an illustrative composite, not physically accurate refraction. This is a symbolic illustration, not an anatomical model or experimental result.

Only **PhD in zuizui** remains as the visible identity. The large `zuizui`, personal-name label, standalone header wordmark and `脳洞` heading are removed from the current interface. The browser title and social title use the same retained phrase. The notebook and atlas no longer repeat the name. Source links, repository IDs, JavaScript namespaces and historical archives are intentionally preserved. The old social-image declaration is removed rather than continuing to advertise a stale labelled screenshot.

## The origin is a usable entrance

The flower's real button uses `data-room="hotarubukuro"`, delegating to the existing room navigator. It opens the existing origin research room without adding a new scientific connection, bypassing no evidence gate. Keyboard focus returns to the flower on leaving. The retained title still opens the notebook.

The emblem recedes when climbing so the architecture stays primary, and reappears at the overview. It does not render continuously at rest or when hidden. The source classification data, contact directions/statuses, tower geometry, 34 room entries and existing puzzle completion rules are unchanged.

## Checks

`tests/origin_browser_test.py` checks the real current page over loopback HTTP in CI: identity removal, title, accessible origin entry, keyboard return, mobile tap, camera-following geometry, idle rendering, notebook/map labels, room inventory, scientific-data preservation and four additional viewport sizes. `--inline` uses the current local assets where browser policy prohibits loopback navigation; that mode does not verify HTTP delivery. The existing architecture, room and tower regression workflows remain in place.

Screenshots record the actual browser output. They are not an automated judgment of beauty. Viewport/touch emulation is not a physical-device test.
