window.WORLDLINES = {
  series: {
    azami: { label: "アザミ", color: "#e98191", lane: "PHENOTYPE → EVOLUTIONARY HISTORY" },
    flower: { label: "花色多型", color: "#e6b85c", lane: "CURRENT SPACE → EVOLUTIONARY TIME → MULTISCALE STATE" },
    island: { label: "島", color: "#55c4ae", lane: "GLOBAL COMPARISON → IZU → EMPIRICAL ANCHOR" },
    observation: { label: "観測", color: "#63bfe0", lane: "FIELD DEVICE → OBSERVABILITY → DECISION" },
    method: { label: "方法論", color: "#7cb7d6", lane: "IDENTIFICATION → NEXT OBSERVATION → EXTERNAL TEST" },
    theory: { label: "理論", color: "#a48af4", lane: "WORLD → STATE → REPORTABILITY" }
  },

  nodes: [
    { id: "azami", series: "azami", x: .25, y: .10, status: "bounded", layers: ["chapter 1", "empirical", "phenotype", "spatial"], summary: "Chapter 1 — 市民科学画像から、種平均より下の大きな可視変異と形質別の環境構造を示す。アザミシリーズの現在地を置く章。", ceiling: "空間相関から可塑性、適応、選択、適応放散を同定しない。", next: "EAzami へ進み、現在の表現型配置を進化時間へ渡す。" },
    { id: "EAzami", series: "azami", x: .68, y: .10, status: "open", layers: ["chapter 2", "history", "phylogenomics", "model discrimination"], summary: "Chapter 2 — 東アジアのアザミについて、系統不一致、反復状態、花色史の競合モデルを判別する。", ceiling: "fitness evidenceなしに適応史や選択モザイクを確定しない。", next: "外部画像測定・系統ゲート・条件付きモデルを閉じた後、空間と進化史を一つの比較設計へ統合する。" },

    { id: "fcp", series: "flower", x: .15, y: .24, status: "bounded", layers: ["chapter 1", "space", "current states"], summary: "Chapter 1 — Where are the states now? 34種の花色 variation を個体群内共存と地理分化として現在の空間上に配置する。", ceiling: "気候との対応を一意な維持機構とせず、現在の配置から進化史を直接推定しない。", next: "chun で evolutionary time と state identity を問う。" },
    { id: "chun", series: "flower", x: .48, y: .24, status: "result", layers: ["chapter 2", "evolutionary time", "state identity"], summary: "Chapter 2 — Where have the states existed through evolutionary time, and what constitutes the same state? 同じ可視状態と同じ underlying state を分離する。", ceiling: "個別転換枝の原因や、可視色だけから欠測分子状態を補完しない。", next: "hotarubukuro で一つの多型系を phenotype・scale・ecological context 上に解像する。" },
    { id: "hotarubukuro", series: "flower", x: .80, y: .24, status: "bounded", layers: ["chapter 3", "polymorphic system", "multiscale state"], summary: "Chapter 3 — What becomes visible when one polymorphic state system is resolved across phenotype, spatial scale and ecological context? 花色 variation を単一原因ではなく座標依存の state structure として解像する。", ceiling: "色差を単一の環境要因・送粉者・歴史へ還元せず、旧 hotspot / DID 解析を現行推論へ戻さない。", next: "現在・進化史・多尺度をつないだ予測を独立 field data で試す次章へ。" },

    { id: "island", series: "island", x: .15, y: .38, status: "bounded", layers: ["chapter 1", "global comparison", "response states"], summary: "Chapter 1 — 世界の島嶼系を広く探索すると、response state は branching / same-direction / buffering / decoupling / falsification に分岐し、一つの island syndrome では閉じない。", ceiling: "地域差や記録欠如を単一の送粉者喪失機構へ還元せず、比較パターンを自然界の一意な因果史と読まない。", next: "izu-core で response diversity を simulation と伊豆 secondary analysis に落とす。" },
    { id: "izu-core", series: "island", x: .48, y: .38, status: "result", layers: ["chapter 2", "simulation", "Izu convergence", "secondary analysis"], summary: "Chapter 2 — one perturbation ≠ one response。starting state は平均 geometry を組織する一方、realized community が応答変異の 80.17% を担う。伊豆では raw matching は source state × community composition で説明され、補正後の extra partner sorting は不支持。", ceiling: "80.17% を自然界一般の普遍率とせず、extra sorting 不支持を相互作用差そのものの不在と読まない。", next: "shimahotarubukuro を deep empirical anchor として、同じ伊豆島列で自然データへ降りる。" },
    { id: "shimahotarubukuro", series: "island", x: .80, y: .38, status: "open", layers: ["chapter 3", "deep anchor", "within-lineage", "field bridge"], summary: "Chapter 3 — 比較宇宙から伊豆へ目線を固定した後の実証章。historical phenotype、島間形質差、network / functional context、今後の field experiment を同じ島列上で接続する。", ceiling: "標本形態だけで機能や選択を確定せず、Pst を Qst や適応証拠と呼ばない。", next: "訪花・繁殖・機能形質・歴史表現型を統合した field experiment を、次の独立 repository として立てる。" },

    { id: "pollipi", series: "observation", x: .18, y: .52, status: "bounded", layers: ["chapter 1", "field device", "ordinal evidence", "metadata"], summary: "Chapter 1 — 物理的な field observation を成立させる。0/0.5/1を移植可能な順序尺度として扱い、場面と記録日を固定する。", ceiling: "ordinal evidenceを確率、訪花真実、absence certificationと呼ばない。", next: "insepi で複数観測者の disagreement と失敗構造を明示する。" },
    { id: "insepi", series: "observation", x: .50, y: .52, status: "stop", layers: ["chapter 2", "observability", "failure architecture", "noise"], summary: "Chapter 2 — 相補的観測者の価値を検証したが、固定 disagreement ranking の優越性は凍結検証で反証された。失敗を観測設計の一部として保存する。", ceiling: "V5を再調整して救済せず、検出scoreを生態イベントに変えない。", next: "tnoa で target・nuisance・observability・absence evidence を明示的に分離する。" },
    { id: "tnoa", series: "observation", x: .82, y: .52, status: "result", layers: ["chapter 3", "target", "nuisance", "observability"], summary: "Chapter 3 — target・nuisance・observability・absence evidence・abstentionを分離し、観測から何を判断してよいかの契約を定める。", ceiling: "閉世界幾何を field accuracy や普遍分類器優越性としない。", next: "独立した現場校正で observation contract の field bridge を初めて開く。" },

    { id: "bita", series: "method", x: .08, y: .66, status: "result", layers: ["chapter 1", "mechanism", "identified set", "intervention"], summary: "Chapter 1 — 総相互作用効果から構成チャネルをどこまで識別できるか。誘引・防御などの配分が一点同定できないことを明示する。", ceiling: "総効果面の精密化を機構同定と呼ばない。", next: "microdonta で identified set を縮める次観測を選ぶ。" },
    { id: "microdonta", series: "method", x: .29, y: .66, status: "result", layers: ["chapter 2", "causal identifiability", "next observation", "RACH"], summary: "Chapter 2 — Wだけではチャネル非同定。正確な1チャネルまたは安定proxyが相対変化を解き、次観測順序を改善する。", ceiling: "合成凍結系の成功を自然系の効用に自動移送しない。", next: "eog で exact world identity と forecast summary を分離する。" },
    { id: "eog", series: "method", x: .50, y: .66, status: "bounded", layers: ["chapter 3", "world set", "forecast", "falsification"], summary: "Chapter 3 — exact world identity を更新・反証に残し、label-invariant summary を予測に使う。", ceiling: "真の歴史経路や一般的SDM優越性を主張しない。", next: "acsp で forecast を候補場所の供給問題へ接続する。" },
    { id: "acsp", series: "method", x: .71, y: .66, status: "stop", layers: ["chapter 4", "field design", "candidate patch", "heldout"], summary: "Chapter 4 — 日本10-km候補patchは独立比較で有効だったが、country拡張は再確認でも事前ゲートを満たさなかった。失敗した generalization を章として保存する。", ceiling: "候補patchを占有確率や正確な生息地点と呼ばず、失敗した拡張を救済しない。", next: "sdmr で candidate universe 自体の情報障壁を検証する。" },
    { id: "sdmr", series: "method", x: .91, y: .66, status: "open", layers: ["chapter 5", "candidate universe", "SDM", "information barrier"], summary: "Chapter 5 — known-truth系で候補宇宙学習を検証し、実データ Product A は封印された終端判定を待つ。", ceiling: "GBIF presenceを確率1、未記録地点をabsence、Product Bを完成結果としない。", next: "封印 endpoint の結果に応じて、外部一般化か STOP を所有する次 repository を立てる。" },

    { id: "crest", series: "theory", x: .05, y: .82, status: "result", layers: ["chapter 1", "world", "state", "reportability"], summary: "Chapter 1 — scientific contract に対する一意な最粗 adequate state を定め、何を安全に忘れてよいかを問う理論の入口。", ceiling: "有限定理を自然界での頻度や連続・確率系の一般定理としない。", next: "ccoc で future obligation が state をどう細分化するかを見る。" },
    { id: "ccoc", series: "theory", x: .18, y: .82, status: "result", layers: ["chapter 2", "future", "composition", "compression"], summary: "Chapter 2 — 将来操作の grammar が広がると、現在必要な状態表現が細分化される。", ceiling: "観測生態系の検証や経験的機構同定を所有しない。", next: "mltr で history を忘れたとき壊れる法則を扱う。" },
    { id: "mltr", series: "theory", x: .31, y: .82, status: "result", layers: ["chapter 3", "history", "semantics", "repair"], summary: "Chapter 3 — 置換や移送で壊れた macro-law を、履歴追加と最粗 exact repair で修復する。", ceiling: "field dataから置換史やrepair relationを推定しない。", next: "mrm で候補機構間に共通して報告できる法則を問う。" },
    { id: "mrm", series: "theory", x: .44, y: .82, status: "result", layers: ["chapter 4", "mechanism", "robust law", "discrimination"], summary: "Chapter 4 — 候補機構が異なるとき、一つの決定論的法則を安全に報告できる条件を与える。", ceiling: "データから候補集合や機構そのものを推定する理論ではない。", next: "ced で evidence がどの state quotient を license するかへ進む。" },
    { id: "ced", series: "theory", x: .57, y: .82, status: "result", layers: ["chapter 5", "evidence", "licensing", "observation design"], summary: "Chapter 5 — 曖昧な full state の下でも、証拠と target に対して安全に報告できる最粗 quotient を定める。", ceiling: "必要な refinement が既に観測から得られたとは主張しない。", next: "eco-genetic-criticality で complete state と自然系 dynamics の限定 bridge を作る。" },
    { id: "eco-genetic-criticality", label: "eco-genetic", series: "theory", x: .70, y: .82, status: "result", layers: ["chapter 6", "dynamics", "fragmentation", "complete state"], summary: "Chapter 6 — 宣言 simulator 内の完全状態と、同じ周辺量でも cross-layer alignment が次遷移を変える反例を示す。", ceiling: "普遍的 connectivity benefit や自然系の最小十分状態を主張しない。", next: "warning-extensions で partial observation から early warning が可能かを試す。" },
    { id: "eco-genetic-warning-extensions", label: "warning-ext", series: "theory", x: .83, y: .82, status: "stop", layers: ["chapter 7", "warning", "natural partial state", "validation"], summary: "Chapter 7 — event内の相対順序は残るが、二値 early-warning としては specificity 0・AUC 0.5。反証を理論宇宙の境界として保存する。", ceiling: "event-conditional orderingを予測的early warningへ昇格しない。", next: "theouni で分散した成果・境界・未解決 bridge を一つの宇宙として索引する。" },
    { id: "theouni", series: "theory", x: .95, y: .82, status: "bounded", layers: ["chapter 8", "meta theory", "provenance", "navigation"], summary: "Chapter 8 — 分散した所有権を保ったまま、全リポを一つの型付き研究宇宙として索引する synthesis chapter。", ceiling: "証拠・定理・データを中央所有せず、Graphify中心性を科学的証明としない。", next: "各シリーズの NEXT CHAPTER が生まれたとき、一次所有権を保ったまま新しい repository として接続する。" }
  ],

  edges: [
    { from: "azami", to: "EAzami", type: "solid", label: "phenotype space → evolutionary history" },
    { from: "fcp", to: "chun", type: "solid", label: "current space → evolutionary time" },
    { from: "chun", to: "hotarubukuro", type: "solid", label: "state identity → focal polymorphism" },
    { from: "island", to: "izu-core", type: "solid", label: "global responses → simulation / Izu" },
    { from: "izu-core", to: "shimahotarubukuro", type: "solid", label: "Izu convergence → empirical anchor" },
    { from: "pollipi", to: "insepi", type: "solid", label: "device → observer disagreement" },
    { from: "insepi", to: "tnoa", type: "solid", label: "failure → observation contract" },
    { from: "bita", to: "microdonta", type: "solid", label: "identified set → next observation" },
    { from: "microdonta", to: "eog", type: "solid", label: "next observation → world set" },
    { from: "eog", to: "acsp", type: "solid", label: "forecast → candidate support" },
    { from: "acsp", to: "sdmr", type: "solid", label: "failed extension → candidate universe" },
    { from: "crest", to: "ccoc", type: "solid", label: "state → future obligation" },
    { from: "ccoc", to: "mltr", type: "solid", label: "future → history" },
    { from: "mltr", to: "mrm", type: "solid", label: "history → mechanism robustness" },
    { from: "mrm", to: "ced", type: "solid", label: "mechanism → evidence licensing" },
    { from: "ced", to: "eco-genetic-criticality", type: "bridge", label: "reportable state → dynamics" },
    { from: "eco-genetic-criticality", to: "eco-genetic-warning-extensions", type: "solid", label: "complete state → warning test" },
    { from: "eco-genetic-warning-extensions", to: "theouni", type: "bridge", label: "boundary → synthesis" },

    { from: "azami", to: "fcp", type: "bridge", label: "phenotype variation ↔ state placement" },
    { from: "hotarubukuro", to: "shimahotarubukuro", type: "analogy", label: "same genus, different series ownership" },
    { from: "tnoa", to: "microdonta", type: "bridge", label: "observation entitlement → next observation" },
    { from: "theouni", to: "azami", type: "bridge", label: "navigation only" },
    { from: "theouni", to: "fcp", type: "bridge", label: "navigation only" },
    { from: "theouni", to: "island", type: "bridge", label: "navigation only" },
    { from: "theouni", to: "pollipi", type: "bridge", label: "navigation only" },
    { from: "theouni", to: "bita", type: "bridge", label: "navigation only" }
  ],

  stories: {
    azami: { label: "アザミ", nodes: ["azami", "EAzami"], text: "Chapter 1 azami で現在の phenotype space を測り、Chapter 2 EAzami で evolutionary history と競合モデルへ進む。次章は空間と進化史を閉じた比較設計へ。" },
    flower: { label: "花色多型", nodes: ["fcp", "chun", "hotarubukuro"], text: "Chapter 1 fcp = where now、Chapter 2 chun = where through evolutionary time / what is the same state、Chapter 3 hotarubukuro = one polymorphic system resolved across phenotype, scale and ecology。" },
    island: { label: "島", nodes: ["island", "izu-core", "shimahotarubukuro"], text: "Chapter 1 世界比較、Chapter 2 simulation + Izu secondary analysis、Chapter 3 シマホタルブクロ deep anchor。五つの概念段階を三つの repository chapter に圧縮して、島だけを長くしすぎない。" },
    observation: { label: "観測", nodes: ["pollipi", "insepi", "tnoa"], text: "Chapter 1 field device、Chapter 2 observer disagreement / falsification、Chapter 3 observation contract。測る→失敗を知る→何を判断してよいか、の三章。" },
    method: { label: "方法論", nodes: ["bita", "microdonta", "eog", "acsp", "sdmr"], text: "非同定を認め、次観測を選び、world set を保持し、candidate support を試し、candidate universe の情報障壁まで進む。STOP も独立した一章として保存する。" },
    theory: { label: "理論", nodes: ["crest", "ccoc", "mltr", "mrm", "ced", "eco-genetic-criticality", "eco-genetic-warning-extensions", "theouni"], text: "state → future → history → mechanism → evidence → dynamics → failed warning → synthesis。各理論 repository が一つの問いと一つの chapter を所有する。" }
  },

  axes: [
    { pair: "座標", name: "空間", color: "#55c4ae", question: "どこで違うか。個体、集団、島、patch、worldの配置に沿う変化。", repos: ["azami", "island", "fcp", "hotarubukuro", "acsp", "sdmr"] },
    { pair: "座標", name: "時間", color: "#e98191", question: "どう変わった／変わりうるか。系統、遷移、履歴、逐次更新。", repos: ["EAzami", "chun", "eog", "mltr", "eco-genetic-criticality"] },
    { pair: "証拠", name: "観測", color: "#63bfe0", question: "何が直接記録されたか。画像、標本、RNA-seq、GBIF、センサー。", repos: ["pollipi", "insepi", "tnoa", "azami", "chun", "fcp", "hotarubukuro", "shimahotarubukuro"] },
    { pair: "証拠", name: "現実", color: "#f0d578", question: "観測の外で何が耐えるか。独立データ、機能、将来予測、介入。", repos: ["eog", "acsp", "island", "izu-core", "shimahotarubukuro", "eco-genetic-warning-extensions"] },
    { pair: "推論", name: "パターン", color: "#e6b85c", question: "何が繰り返し、整列して見えるか。符号、勾配、クラス、反復。", repos: ["azami", "island", "chun", "fcp", "hotarubukuro"] },
    { pair: "推論", name: "メカニズム", color: "#e98191", question: "何が結果を生んだか。総効果をどの因果チャネルへ帰属できるか。", repos: ["bita", "microdonta", "izu-core", "EAzami", "mrm"] },
    { pair: "形式", name: "方法", color: "#63bfe0", question: "どう測り、比べ、反証するか。情報障壁、holdout、STOP、介入。", repos: ["tnoa", "pollipi", "microdonta", "eog", "acsp", "sdmr"] },
    { pair: "形式", name: "理論", color: "#a48af4", question: "何が可能・不可能・十分か。状態、安全性、識別、修復の条件。", repos: ["crest", "ccoc", "mltr", "mrm", "ced", "theouni"] }
  ],

  books: {
    seven: [
      { n: "A1", title: "azami — 現在の表現型空間", chapters: 1, series: "azami", repos: ["azami"], note: "画像から連続表現型と空間構造を測る。", status: "1 repo = 1 chapter" },
      { n: "A2", title: "EAzami — 進化史と競合モデル", chapters: 1, series: "azami", repos: ["EAzami"], note: "空間発見を進化時間へ渡す。", status: "1 repo = 1 chapter" },
      { n: "F1", title: "fcp — Where are the states now?", chapters: 1, series: "flower", repos: ["fcp"], note: "current spatial states。", status: "1 repo = 1 chapter" },
      { n: "F2", title: "chun — State identity through evolutionary time", chapters: 1, series: "flower", repos: ["chun"], note: "同じ可視状態と underlying state を分ける。", status: "1 repo = 1 chapter" },
      { n: "F3", title: "hotarubukuro — One resolved polymorphic system", chapters: 1, series: "flower", repos: ["hotarubukuro"], note: "phenotype × scale × ecology。", status: "1 repo = 1 chapter" },
      { n: "I1", title: "island — Global response states", chapters: 1, series: "island", repos: ["island"], note: "世界比較。", status: "1 repo = 1 chapter" },
      { n: "I2", title: "izu-core — Simulation and Izu convergence", chapters: 1, series: "island", repos: ["izu-core"], note: "one perturbation ≠ one response。", status: "1 repo = 1 chapter" },
      { n: "I3", title: "shimahotarubukuro — Deep empirical anchor", chapters: 1, series: "island", repos: ["shimahotarubukuro"], note: "伊豆へ固定した後の実証。", status: "1 repo = 1 chapter" },
      { n: "O1", title: "pollipi — Field device", chapters: 1, series: "observation", repos: ["pollipi"], note: "観測を物理的に成立させる。", status: "1 repo = 1 chapter" },
      { n: "O2", title: "insepi — Failure architecture", chapters: 1, series: "observation", repos: ["insepi"], note: "disagreement と反証。", status: "1 repo = 1 chapter" },
      { n: "O3", title: "tnoa — Observation contract", chapters: 1, series: "observation", repos: ["tnoa"], note: "何を判断してよいか。", status: "1 repo = 1 chapter" },
      { n: "M1", title: "bita — Partial identification", chapters: 1, series: "method", repos: ["bita"], note: "何が同定できないか。", status: "1 repo = 1 chapter" },
      { n: "M2", title: "microdonta — Next observation", chapters: 1, series: "method", repos: ["microdonta"], note: "何を次に測るか。", status: "1 repo = 1 chapter" },
      { n: "M3", title: "eog — World set and forecast", chapters: 1, series: "method", repos: ["eog"], note: "更新用 state と予測用 summary を分ける。", status: "1 repo = 1 chapter" },
      { n: "M4", title: "acsp — Failed generalization as evidence", chapters: 1, series: "method", repos: ["acsp"], note: "STOP を救済しない。", status: "1 repo = 1 chapter" },
      { n: "M5", title: "sdmr — Candidate universe", chapters: 1, series: "method", repos: ["sdmr"], note: "情報障壁と sealed endpoint。", status: "1 repo = 1 chapter" },
      { n: "T1", title: "crest — Adequate state", chapters: 1, series: "theory", repos: ["crest"], note: "何を忘れてよいか。", status: "1 repo = 1 chapter" },
      { n: "T2", title: "ccoc — Future obligation", chapters: 1, series: "theory", repos: ["ccoc"], note: "未来が現在の state を細分化する。", status: "1 repo = 1 chapter" },
      { n: "T3", title: "mltr — History repair", chapters: 1, series: "theory", repos: ["mltr"], note: "履歴を戻して law を修復する。", status: "1 repo = 1 chapter" },
      { n: "T4", title: "mrm — Mechanism robustness", chapters: 1, series: "theory", repos: ["mrm"], note: "機構差を越えて何を報告できるか。", status: "1 repo = 1 chapter" },
      { n: "T5", title: "ced — Evidence licensing", chapters: 1, series: "theory", repos: ["ced"], note: "証拠が許す quotient。", status: "1 repo = 1 chapter" },
      { n: "T6", title: "eco-genetic — Complete state dynamics", chapters: 1, series: "theory", repos: ["eco-genetic-criticality"], note: "alignment を含む complete state。", status: "1 repo = 1 chapter" },
      { n: "T7", title: "warning-ext — Failed early warning", chapters: 1, series: "theory", repos: ["eco-genetic-warning-extensions"], note: "反証を境界として保存。", status: "1 repo = 1 chapter" },
      { n: "T8", title: "theouni — Synthesis universe", chapters: 1, series: "theory", repos: ["theouni"], note: "分散所有権を保つ synthesis。", status: "1 repo = 1 chapter" }
    ],
    eight: [
      { n: "1", title: "Where are states now? — fcp", chapters: 1, series: "flower", repos: ["fcp"], note: "空間。", status: "question route" },
      { n: "2", title: "How did visible variation arise? — azami", chapters: 1, series: "azami", repos: ["azami"], note: "現在の phenotype space。", status: "question route" },
      { n: "3", title: "What is the same state through time? — chun", chapters: 1, series: "flower", repos: ["chun"], note: "進化時間。", status: "question route" },
      { n: "4", title: "What history generated it? — EAzami", chapters: 1, series: "azami", repos: ["EAzami"], note: "競合する進化史。", status: "question route" },
      { n: "5", title: "What appears under finer resolution? — hotarubukuro", chapters: 1, series: "flower", repos: ["hotarubukuro"], note: "多尺度。", status: "question route" },
      { n: "6", title: "Do islands share one response? — island", chapters: 1, series: "island", repos: ["island"], note: "global response diversity。", status: "question route" },
      { n: "7", title: "Why does one perturbation branch? — izu-core", chapters: 1, series: "island", repos: ["izu-core"], note: "starting state × realized community。", status: "question route" },
      { n: "8", title: "Can that be anchored in one archipelago? — shimahotarubukuro", chapters: 1, series: "island", repos: ["shimahotarubukuro"], note: "伊豆 deep anchor。", status: "question route" },
      { n: "9", title: "What can the device record? — pollipi", chapters: 1, series: "observation", repos: ["pollipi"], note: "physical observation。", status: "question route" },
      { n: "10", title: "Where does observation fail? — insepi", chapters: 1, series: "observation", repos: ["insepi"], note: "failure architecture。", status: "question route" },
      { n: "11", title: "What judgment is licensed? — tnoa", chapters: 1, series: "observation", repos: ["tnoa"], note: "observation contract。", status: "question route" },
      { n: "12", title: "What is not identifiable? — bita", chapters: 1, series: "method", repos: ["bita"], note: "identified set。", status: "question route" },
      { n: "13", title: "What should be measured next? — microdonta", chapters: 1, series: "method", repos: ["microdonta"], note: "next observation。", status: "question route" },
      { n: "14", title: "What state must remain exact? — eog", chapters: 1, series: "method", repos: ["eog"], note: "world set。", status: "question route" },
      { n: "15", title: "Does the design generalize? — acsp", chapters: 1, series: "method", repos: ["acsp"], note: "failed extension。", status: "question route" },
      { n: "16", title: "Is the candidate universe learnable? — sdmr", chapters: 1, series: "method", repos: ["sdmr"], note: "information barrier。", status: "question route" },
      { n: "17", title: "What is an adequate state? — crest", chapters: 1, series: "theory", repos: ["crest"], note: "state。", status: "question route" },
      { n: "18", title: "How does the future refine the present? — ccoc", chapters: 1, series: "theory", repos: ["ccoc"], note: "future obligation。", status: "question route" },
      { n: "19", title: "When must history be restored? — mltr", chapters: 1, series: "theory", repos: ["mltr"], note: "history repair。", status: "question route" },
      { n: "20", title: "What law survives mechanism uncertainty? — mrm", chapters: 1, series: "theory", repos: ["mrm"], note: "robust law。", status: "question route" },
      { n: "21", title: "What does evidence license? — ced", chapters: 1, series: "theory", repos: ["ced"], note: "reportable quotient。", status: "question route" },
      { n: "22", title: "What changes when the full state is known? — eco-genetic", chapters: 1, series: "theory", repos: ["eco-genetic-criticality"], note: "complete-state dynamics。", status: "question route" },
      { n: "23", title: "Can partial state warn early? — warning-ext", chapters: 1, series: "theory", repos: ["eco-genetic-warning-extensions"], note: "falsified warning।", status: "question route" },
      { n: "24", title: "How are all boundaries kept together? — theouni", chapters: 1, series: "theory", repos: ["theouni"], note: "synthesis and provenance。", status: "question route" }
    ]
  }
};
