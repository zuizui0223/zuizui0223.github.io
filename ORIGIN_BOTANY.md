# Botanical detail of the origin bellflower

Revision: 2026-09-07. Based on site commit `3378ee6ab25d24a5ba4734e41e041a9bbf17dcad`.

## Visible changes

The glass, pedestal, flower colour, existing corolla, camera linkage and `PhD in zuizui` title remain unchanged. Only the botanical detail is revised: a short connected calyx cup, five narrow pointed lobes following the bell, and five separate smaller appendages alternating between them and folding back towards the stalk. The existing closed bud also receives green calyx lobes.

Five simple leaves attach at distinct heights along the existing stem, through petioles. The lower blades have broader, cordate-ovate bases and longer petioles; the middle blades are pointed and ovate; the upper blade is narrower with a short petiole. Margins have irregular teeth. Raised midribs, curving secondary veins, faint branching veinlets, a slight blade fold, narrow petiole wings and sparse short hairs replace smooth, uniform leaf symbols.

## References and limits

- [TAKAO 599 MUSEUM: ホタルブクロ](https://www.takao599museum.jp/treasures/selected/1931/?lang=ja): describes recurved appendages between calyx lobes, pointed ovate stem leaves with uneven teeth, and cordate basal leaves. The account notes that basal leaves wither by flowering; retaining two low, green cordate leaves here is a compositional simplification, not a claim about a particular flowering specimen.
- [Forestry and Forest Products Research Institute, Tama Forest Science Garden](https://www.ffpri.go.jp/tmk/en/visit/garden-highlights/wildplants/chinese-rampion.html): describes the recurved triangular accessory structures between calyx lobes.
- [Nikko Botanical Garden: Campanula punctata](https://nikko-bg.jp/nikko-old/5_jokyo/species/Campanula_punctata.html): botanical-garden reference for the calyx and the contrast with the unappendaged variety.

References checked 2026-09-07. This is an original, stylized illustration of qualitative morphology, not a scan, anatomical reconstruction, measured individual, or new scientific result. No reference photograph is embedded or redistributed. Leaf and sepal dimensions, vein spacing, hair density and the single-flower composition are artistic choices, not fitted data. Calyx appendages are deliberately separate from the five long lobes; adding generic star-shaped green petals would not represent this distinction.

## Implementation and regression

`origin-botany.js` builds deeply frozen 3D surfaces and depth-sorted fine strokes. `origin.js` uses those in place of the earlier leaf and flat-sepal primitives. Detail rendering remains event-driven; unresolved hairs are omitted at small sizes. Changes do not touch `tower-data.js`, tower geometry, CSS, existing rooms, evidence statuses, source URLs, or discovery rules.

`tests/origin_botany_test.py` checks the generated geometry, five lobes and alternating reflexed appendages, separate leaf nodes and differing outlines, finite vertices, glass containment, immutable coordinates during rotation, idle rendering, room entry, identity retention and mobile layouts. CI uses the actual homepage over loopback HTTP; `--inline` supports sandbox execution. Existing origin, room and architecture suites remain intact. Screenshots show actual browser output but do not certify anatomical accuracy or aesthetic quality. Mobile checks are emulation, not physical-device testing.
