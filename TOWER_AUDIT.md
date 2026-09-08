# 一つの塔：配置・接点・閉合の精査

確認日：2026-09-06。対象はホームページの研究構造と、主要な接点を所有するリポジトリの定義文書。本記録は全論文の証明・全実験の再実行ではない。配置の台帳は `tower-data.js`、現行の世界配置は `tower-ontology-audit.json`、未閉合条件は `tower-closure-audit.json` に分離した。旧 `world-ontology-audit.json` / `puzzle-closure-audit.json` 等は `archive.html` 時代の監査スナップショットとして保持する。

## 1. 「外と内」を一つの物差しにしない

この塔の五層は **読む順番** である。上階ほど偉い、抽象的、正しい、観察不能という主張はしていない。全リポに一つの入口を与えるが、その仕事を一層に閉じ込めない。TMOPも階ではなく証拠の種類である。

宣言したモデル世界を Ω、観測の契約を V と置くと、観測写像 O_V: Ω → Y_V と、必要な状態への写像 q_C: Ω → S_C は別の操作になる。理想化した決定論的観測では、記録 y と両立する世界は O_V の逆像、その世界を q_C に写した集合が必要状態について残る候補である。雑音のある場合は尤度・許容差など、別途宣言した証拠契約を用いる。

したがって、**状態を同一視する分割と、観測が同一視する分割は比較不能な場合がある**。どちらが必ず外側、内側とは言えない。記録・状態・報告を単純な同心円の部分集合として描くと、この違いを失う。さらに Ω は宣言した候補世界であり、自然そのものを網羅した保証もない。

この読み方は [CREST](https://github.com/zuizui0223/crest/blob/main/README.md) の世界・契約・状態の区別と、[MROD](https://github.com/zuizui0223/mrod/blob/main/README.md) の許容集合に整合する配置判断である。ゲームの角度変更は新しい科学的観測ではない。既に台帳にある関係の見え方を変えるだけである。

## 2. 二つの理論軸は同じ塔の別側面

`CCOC · MLTR · MRM → CREST` は、未来・履歴・機構の違いのうち、どれを状態が忘れてはいけないかを問う。三つは構造的責任であり、直列の処理工程ではない。

`REC · V3 · TNOA → Boundary → MROD` は、支持域、残った側情報、意味の保存が作る観測上の区別を扱い、識別限界を明示し、次に取得すべき観測を問う。REC、V3、TNOAも兄弟の情報操作である。

**CEDは接点**。必要な区別と観測・証拠の契約を突き合わせ、何を報告できるかを扱う。MRM→MROD、CED↔MRODの接続には、同じ候補観測・応答分割・リスク・費用を用いる明示的な変換が必要である。似た情報量を扱うことだけで直結しない。

参照：[CREST](https://github.com/zuizui0223/crest/blob/main/README.md)、[MROD](https://github.com/zuizui0223/mrod/blob/main/README.md)、現行の [`tower-ontology-audit.json`](tower-ontology-audit.json) と [`tower-closure-audit.json`](tower-closure-audit.json)。旧 `world-ontology-audit.json` / `puzzle-closure-audit.json` は `archive.html` 時代のスナップショットとして保持する。

## 3. 形の系列とEG系列

SCHは共有座標上の葛藤、BALANCEは葛藤があっても分化費用を払わない条件、BITAは分化による回復、PAYOFFはそれを継承される構造の利得と集団動態へ運ぶ。機能を人格的なプレイヤーとみなす話ではない。[PAYOFF](https://github.com/zuizui0223/payoff/blob/main/README.md)

現時点の横断提案は **EGWEの関係状態 → PAYOFFの生態学的文脈**。逆向きの構造→関係状態→未来機能には、同一系・揃えた尺度での測定または介入が要る。共通の変数名だけでは閉じない。塔の未閉合の橋を回転によって実証済みに変えてはならない。[現行の接続条件](tower-closure-audit.json)

島と都市は、異なる出発点・分断履歴が同じ未来関連状態で説明できるかを比較する接点となる。ただし、状態を測り、独立な未来の応答を予測した後で、起源・履歴に残余情報があるかを問う。EGWEEは自然データの測定・表現・残余文脈・識別可能性を吟味する独立した系列であり、EGWEの遺伝的警告統計量を実証したものではない。[EGWEE](https://github.com/zuizui0223/egwee/blob/main/README.md)

## 4. SDM周辺：284bは重要な訂正

SDMRは環境座標とニッチ推定、ODSPは多次元状態、EOGは両立する世界と到達・予測を扱う。この読解上の回廊は、全リポ間に完成済みの共通APIがあるという意味ではない。EOGも局所的可能性・到達性・分布の実現可能性・歴史的真実を区別する。[EOG](https://github.com/zuizui0223/eog/blob/main/README.md)

**284bはもう「空のstaging」ではない。** 実装・結果・テストに加え、独立した問いが明記されている。

> 異なる推定対象の答えを、凍結した共通の関係空間へ写したとき、外部の生物学的関係を満たすか。

これはSDMRやEOGのさらに上位の万能推定器ではなく、**別々の答えを照合する横断的な接点**である。植物と送粉者に同一の推定器・移動可能域・生の適合度尺度を強制しない。例えば「植物個体群／場所 × 開花時期」という同じ機会へ両方の答えを写す。植物の繁殖が送粉者に依存する制約と、成体の植物が直ちに消えるという主張を混同しない。

出典：[284b relation-space alignment](https://github.com/zuizui0223/284b/blob/main/docs/product_b_eog_sdmr_relation_space_alignment.md)。確認したblobは `a5ca53b09aed0adaaebeff24602a58d833f7ac94`。この入口を加えることは、全段階の検証成功を認定することではない。従来33入口に開発中の284bを加え、塔は34入口、サイト自身を含む確認済みリポ総数は35となる。

## 5. ACSPは現実への出口。ただし保証ではない

ACSPを下流の現地接点に置く判断は妥当。ただし返すものは **candidate patches** であり、占有確率、正確な生育地点、検出保証ではない。確認された日本の候補抽出契約と、一般化に失敗・条件付き・供給停止が残る拡張を分ける。[ACSP](https://github.com/zuizui0223/acsp/blob/main/README.md)

「絶対に見つかる」を謎解きの報酬にしない。閉じるべき次の環は、予め選んだ候補地と比較地を、努力量と検出可能性を揃えて前向きに調査し、得られた一次情報をモデルへ戻すこと。見つからなかった結果も、適切な観測契約があれば戻り道の一部になる。

## 6. 塔への実装

| 層 | 入口の出会い方 | 回収する接点 |
|---|---|---|
| I 現地 | 花、アザミ、島 | ACSPから現地へ戻る条件 |
| II 記録 | 装置と保持・欠落・意味 | 観測写像からBoundary、MRODへ |
| III 可能性 | 両立世界、座標、調査候補 | 284bの関係照合とACSPの出口 |
| IV 区別 | 未来・履歴・機構の責任 | CRESTと証拠を突き合わせるCED |
| V 未来 | 構造の進化、関係状態 | PAYOFF×EG、島・都市の条件付き接続 |

建築は一度だけXYZ座標で作り、カメラだけを動かす。階段・柱・アーチは面の奥行きを持ち、裏面は視点で隠れる。二つの印は空間的に離れており、角度が合うと画面上で重なる。五つの発見は最後に地上への帰路を出す。

これは五つの接点を発見する最初のゲーム実装であって、言語推理・人物移動・多数のステージを備えた完成済みの長編ゲームではない。Chants of Sennaarの階層と言葉の発見、Monument Valleyの視点と見かけの接続を情報設計の参考にし、固有アートやキャラクターは使っていない。

## 7. 科学と探索の二つの台帳

現行の機械可読台帳は `tower-ontology-audit.json` と `tower-closure-audit.json`。284bについては「独立した研究問いを持つ入口になった」ことを確定事項としつつ、「異なる生物学的役割をまたぐ relation-space の前向き検証」は open のまま分離した。

`established` は確認した概念的関係、`bounded` は限定した接点、`proposed` は接続仮説、`open` は未閉合。実装済みAPIや自然系での検証を一律に意味しない。接点ごとに条件を読む必要がある。

探索状態はブラウザの発見IDだけ。科学データはdeep-freezeし、遊んでも昇格しない。全研究・出典・未閉合条件へは手帳からゲームを飛ばしてアクセスできる。動きの軽減、キーボード操作、画面読み上げ用の操作説明を残す。「文字を表に置かない」と「根拠を消す」を区別する。

## 8. 検証範囲

ローカルChromiumで43項目の操作・契約テストが通過。全五層で印合わせ、発見、現地への帰還、34リポ検索、科学データと世界座標の不変性、320/390/768/1440px幅での横溢れ、モバイルの実タッチイベントによる回転、手帳を閉じた後のフォーカス復帰を検査した。JavaScript実行時エラーは0件。

これはローカルブラウザの検証であり、全実機・全ブラウザ・ライブ配信環境の保証ではない。今回、各研究リポの数理・実験の結果は変更していない。ソースのblob一覧は `tower-data.js` の `sources`、再現テストは `tests/`。


## 2026-09-08 inventory and synthesis overlay

The current owner inventory is 37 repositories: 36 research rooms plus this site as meta-registry. `TTF` enters floor II (record/observation contract) and `adaptive-gain` enters floor III (possible-world measurement design). The earlier 34-room counts above are historical snapshots and are superseded for the current live tower by `tower-ontology-audit.json` and `portfolio-synthesis-2026-09-08.json`.

Three current typed interfaces are added: FCP -> TTF is bounded held-out-transfer/geometry qualification; TTF -> Boundary is a bounded applicability boundary; MROD/PAYOFF/BALANCE -> adaptive-gain is an established abstraction of finite decision routing, not claim inheritance.

The repeated resolution-fracture rune is a portfolio synthesis only. Its ledger sets `scientific_edge=false`: seeing the same design warning at EGWE, CHUN, ACSP, SDMR, TTF, CREST, Boundary and MROD does not assert a shared mechanism.
