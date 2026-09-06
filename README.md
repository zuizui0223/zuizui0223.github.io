# zuizui — one tower, five languages

The homepage is one persistent 3D building, not a set of interchangeable maps.
Scroll to ascend. Drag horizontally to rotate. Align two fragments and touch the
seal. Five discoveries reveal a return to the field, not a claim that every
scientific problem has been solved.

The visible surface contains the tower, small glyphs and minimal controls.
Repository names, explanations, sources and closure conditions live in an
optional notebook. All research remains accessible without playing.

## Current sources of truth

- `tower-data.js`: 34 research doorways, five motifs, 17 typed contacts, source
  blob identities, and claim boundaries. **Visitor discovery never changes
  scientific status.**
- `tower-ontology-audit.json`: current 34-programme world/floor ontology, including the corrected 284b relation-space role.
- `tower-closure-audit.json`: current scientific closure ledger; open/proposed contacts remain open even after a visitor finds them.
- `TOWER_AUDIT.md`: spatial semantics and the relationship re-audit.
- `tower.js`: dependency-free XYZ geometry, camera projection, input handling
  and discovery state. It does not replace the scientific repositories.
- `tower.css`: responsive layout and reduced-motion treatment.

The 2026-09-06 inventory is 35 repositories including this website. The tower
shows 33 previously classified scientific repositories plus **284b as an active
relation-space research/development programme**, not an empty staging door.
This inclusion is not a claim that all 34 research programmes are validated.

## Reading the architecture

| Floor | Reading encounter | Main entrances |
|---|---|---|
| I | Field | flowers, thistles, islands and primary observations |
| II | Record | PolliPi, InsePi, REC, V3, TNOA |
| III | Compatible possibilities | Boundary, MROD, SDMR, ODSP, EOG, 284b, ACSP |
| IV | Required distinctions | CCOC, MLTR, MRM, CREST, CED, THEOUNI |
| V | Future and architecture | SCH, BALANCE, BITA, PAYOFF, EGC, EGWE, EGWEE |

Floor height is an itinerary, not a ranking of truth, theory, evidence or causal
priority. One doorway may have roles and contacts across multiple floors.
Observation and adequate-state representations are generally maps/quotients,
not automatically nested physical universes.

`candidate patch ≠ occupancy ≠ guaranteed detection`.
`empirical projection ≠ warning validation`.
`discovery ≠ scientific closure`.

## Earlier map and audit snapshots

`archive.html` preserves the former homepage. `ARCHIVE_README.md` preserves its
former description. Their assets are retained, including `world-ontology-audit.json`
and `puzzle-closure-audit.json`.

Those files are historical snapshots, **not the current classification of 284b**. The current machine-readable classification is `tower-ontology-audit.json`; current non-closure conditions are in `tower-closure-audit.json`.
The earlier “from 2.8.4 / empty staging” description is superseded by the actual
relation-space design document cited in `TOWER_AUDIT.md`. Other legacy claim
firewalls remain useful; they do not prove a cross-repository adapter exists.

## Test and run

Serve the repository with any static web server, for example
`python -m http.server 8000`. No build step, CDN, API key, external font or WebGL
is required. The tower itself makes no remote data request.

Browser tests:

```sh
python -m pip install playwright==1.57.0
python -m playwright install chromium
python tests/tower_browser_test.py
# For an already installed browser:
python tests/tower_browser_test.py --chromium /usr/bin/chromium
```

The browser suite exercises all five puzzles through actual controls, immutable
world positions and claim metadata, mobile touch rotation, repository search,
focus restoration, viewport overflow and return to the field. It is UI
verification, not re-execution of scientific results. `tests/tower_contract.cjs`
checks graph coverage and metadata separately. The earlier map regression guards
are preserved under `scripts/legacy-site-qa.yml` and run against the archive.
