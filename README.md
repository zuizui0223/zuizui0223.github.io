# Research Worldlines

`zuizui0223` の **33 active scientific repositories** を、各リポジトリの証拠所有権を保ったまま一つの ecological research system として辿る静的ウェブサイトです。GitHub 上の現在の inventory は **35 total = 33 scientific + 1 meta registry + 1 staging (`284b`)** です。

表示は章内の一本道だけではなく、シリーズ／編のあいだの `handoff`、`epistemic`、`abstraction`、`provenance`、`complement`、`information_flow`、`shared_substrate` を型付きで区別します。Interaction の章列は **`SCH → BALANCE → BITA`** のまま、`PAYOFF` は三章の payoff objects を population-game level へ持ち上げる **cross-chapter abstraction** として表示します。Observation では `V3` を PolliPi から独立した reference-guided information-refinement method として追加します。

## Evidence composition view

ホームページの `∩` view は、33 scientific repositories を次の4つの重なる evidence / inference modes で表示します。

- **数理・シミュレーション (T)** — theorem / exact construction / controlled synthetic or finite simulation が load-bearing。
- **方法 (M)** — reusable measurement / inference / forecasting / observation / survey design が primary scientific object。
- **公開データ / メタ・統合 (P)** — public archive、published source-adjudicated evidence、public biodiversity/sensor data、literature-derived comparative data が current empirical claim を支える。
- **自分・新規データ実証 (O)** — own/new field, specimen, genomic, laboratory, intervention, physical-sensor data が current/prospective empirical closure に必要。

この4集合は排他的ではありません。`T∩M∩P` のような hybrid をそのまま残します。図の楕円 geometry は variance-partitioning 風の視覚化であり、**正確な membership は intersection cards と `evidence-partition-audit.json` が source of truth** です。集合面積・点の位置・重なり面積は研究の重要度や explained variance を表しません。

「実データなしの理論／方法」は `T` のうち `P` と `O` に重ならない部分（現在の `T only` と `T∩M`）として読めます。

## 公開方法

GitHub user site として `main / root` から GitHub Pages 公開します。ビルド工程や外部依存はありません。

## 情報上の境界

- このサイトはナビゲーション／監査レイヤーです。科学的証拠は各所有元リポジトリにあります。
- **connection != ownership**。線があることは、データ・結論・検証の所有権移転を意味しません。
- **shared substrate != shared conclusion**。同じ生物・データセット・地域を使っても、凍結された質問と endpoint が違えば別の科学的契約です。
- **shared evidence mode != scientific dependency**。同じT/M/P/O集合に入ることは、同じ主張・方法・データを共有することを意味しません。
- ノード位置、接続数、集合面積、交差面積は証拠の強さ・真実性・重要性の尺度ではありません。
- STOP、反証、mixed、未識別、条件付き bridge を消さずに表示します。
- repository movement は scientific claim revision と同義ではありません。

## 監査入口

- `repo-audit.json` — 33 active / staging inventory と current identity
- `repository-classification-audit.json` — scientific fragment の分類
- `evidence-partition-audit.json` — T/M/P/O membership と exact intersections
- `portfolio-graph-audit.json` — canonical typed relationship graph
- `ecosystem-system-audit.json` — 33ノードを一つの ecological research system に置いた機能配置
- `interaction-audit.json` — `SCH → BALANCE → BITA` + `PAYOFF` game abstraction
- `niche-program-audit.json` — `SDMR ⇢ ODSP ⇢ EOG ⇢ ACSP`
