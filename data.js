window.WORLDLINES = {
  series: {
    azami: { label: "アザミ", color: "#e98191", lane: "PHENOTYPE → HISTORY" },
    island: { label: "島", color: "#55c4ae", lane: "GLOBAL ISLANDS → IZU → FIELD ANCHOR" },
    pattern: { label: "花色多型", color: "#e6b85c", lane: "STATE STRUCTURE: SPACE → TIME → SCALE" },
    method: { label: "方法論", color: "#63bfe0", lane: "OBSERVATION → IDENTIFICATION" },
    theory: { label: "理論", color: "#a48af4", lane: "WORLD → REPORTABLE STATE" }
  },

  nodes: [
    { id: "azami", series: "azami", x: .18, y: .12, status: "bounded", layers: ["empirical", "phenotype", "spatial"], summary: "市民科学画像から、種平均より下の大きな可視変異と形質別の環境構造を示す。", ceiling: "空間相関から可塑性、適応、選択、適応放散を同定しない。", next: "外部参照測定を通して EAzami の進化時間へ渡す。" },
    { id: "EAzami", series: "azami", x: .43, y: .12, status: "open", layers: ["history", "phylogenomics", "model discrimination"], summary: "東アジアのアザミについて、系統不一致、反復状態、花色史の競合モデルを判別する進化プログラム。", ceiling: "fitness evidenceなしに適応史や選択モザイクを確定しない。", next: "外部画像測定と条件付きモデルの検証を閉じる。" },

    { id: "island", series: "island", x: .12, y: .31, status: "bounded", layers: ["global comparison", "biogeography", "response states"], summary: "世界の島嶼系を広く探索すると、response state は branching / same-direction / buffering / decoupling / falsification に分岐し、一つの island syndrome では閉じない。", ceiling: "地域差や記録欠如を単一の送粉者喪失機構へ還元せず、比較パターンを自然界の一意な因果史と読まない。", next: "多様な response state を simulation で一般化し、応答方向を組織する starting state と realized community を分解する。" },
    { id: "izu-core", series: "island", x: .48, y: .31, status: "result", layers: ["simulation", "Izu convergence", "secondary analysis"], summary: "simulation では one perturbation ≠ one response。starting state は平均 geometry を組織する一方、realized community が応答変異の 80.17% を担う。伊豆 secondary analysis では raw matching は source state × community composition で説明され、community 補正後の extra partner sorting は不支持。", ceiling: "80.17% を自然界一般の普遍率とせず、extra sorting 不支持を相互作用差そのものの不在と読まない。", next: "network・functional traits・historical phenotype・field experiment を同じ島列で接続できる伊豆を deep anchor として実証へ進む。" },
    { id: "shimahotarubukuro", series: "island", x: .82, y: .31, status: "open", layers: ["deep anchor", "within-lineage", "field bridge"], summary: "世界比較と simulation から伊豆へ目線を固定した後の deep empirical anchor。シマホタルブクロで historical phenotype、島間形質差、network / functional context、今後の field experiment を同じ島列上で接続する。", ceiling: "標本形態だけで機能や選択を確定せず、Pst を Qst や適応証拠と呼ばない。", next: "訪花・繁殖・機能形質と歴史表現型を同じ伊豆系列で測り、比較宇宙の予測を実証可能な問いへ落とす。" },

    { id: "fcp", series: "pattern", x: .16, y: .49, status: "bounded", layers: ["chapter 1", "space", "current states"], summary: "Chapter 1 — Where are the states now? 34種の花色 variation を、個体群内共存と地理分化として現在の空間上に配置し、state がどこに現れているかを問う。", ceiling: "気候との対応を一意な維持機構とせず、現在の配置から進化史を直接推定しない。", next: "現在見えている state を evolutionary time へ持ち込み、何が同じ state と呼べるかを問う。" },
    { id: "chun", series: "pattern", x: .46, y: .49, status: "result", layers: ["chapter 2", "evolutionary time", "state identity"], summary: "Chapter 2 — Where have the states existed through evolutionary time, and what constitutes the same state? 反復花色転換を追うと、同じ可視状態でも一つの不変な色素状態一式ではなく、転換クラス依存のモジュール再利用として現れる。", ceiling: "個別転換枝の原因や、可視色だけから欠測分子状態を補完しない。", next: "空間と進化時間で定義した state を、一つの多型系の phenotype・scale・ecological context 上で同時に解像する。" },
    { id: "hotarubukuro", series: "pattern", x: .76, y: .49, status: "bounded", layers: ["chapter 3", "polymorphic system", "multiscale state"], summary: "Chapter 3 — What becomes visible when one polymorphic state system is resolved across phenotype, spatial scale and ecological context? ホタルブクロ一系を使い、花色 variation を単一原因ではなく、座標系を変えたときに現れる state structure として解像する。", ceiling: "色差を単一の環境要因・送粉者・歴史へ還元せず、旧 hotspot / DID 解析を現行推論へ戻さない。", next: "FCP の current spatial states と chun の evolutionary state identity を、一つの実証系で重ねて検証する。" },

    { id: "bita", series: "method", x: .055, y: .68, status: "result", layers: ["mechanism", "identified set", "intervention"], summary: "総相互作用効果だけでは、誘引・防御などの構成チャネル配分を一点同定できない。", ceiling: "総効果面の精密化を機構同定と呼ばない。", next: "選択的介入と独立joint-cost測定でidentified setを縮める。" },
    { id: "pollipi", series: "method", x: .18, y: .68, status: "bounded", layers: ["field device", "ordinal evidence", "metadata"], summary: "0/0.5/1を移植可能な順序尺度として扱い、物理場面と記録日を固定する。", ceiling: "ordinal evidenceを確率、訪花真実、absence certificationと呼ばない。", next: "独立した現場校正をTNOAの契約へ渡す。" },
    { id: "insepi", series: "method", x: .30, y: .68, status: "stop", layers: ["observability", "failure architecture", "noise"], summary: "相補的観測者の価値を残しつつ、固定disagreement rankingの優越性は凍結検証で反証された。", ceiling: "V5を再調整して救済せず、検出scoreを生態イベントに変えない。", next: "別世代の開発と固定検証としてのみ後継を設計する。" },
    { id: "tnoa", series: "method", x: .42, y: .68, status: "result", layers: ["target", "nuisance", "observability"], summary: "target・nuisance・observability・absence evidence・abstentionを分離する観測判断の正本。", ceiling: "閉世界幾何をfield accuracyや普遍分類器優越性としない。", next: "pre-dataのfield bridgeを、独立データで初めて開く。" },
    { id: "microdonta", series: "method", x: .56, y: .68, status: "result", layers: ["causal identifiability", "next observation", "RACH"], summary: "Wだけではチャネル非同定。正確な1チャネルまたは安定proxyが相対変化を解き、次観測順序を改善する。", ceiling: "合成凍結系の成功を自然系の効用に自動移送しない。", next: "各実証プログラムの非遮断adapterとして使う。" },
    { id: "eog", series: "method", x: .68, y: .68, status: "bounded", layers: ["world set", "forecast", "falsification"], summary: "exact world identityを更新・反証に残し、label-invariant summaryを予測に使う。", ceiling: "真の歴史経路や一般的SDM優越性を主張しない。", next: "新しい未開封endpointで予測的補完性を検証する。" },
    { id: "acsp", series: "method", x: .80, y: .68, status: "stop", layers: ["field design", "candidate patch", "heldout"], summary: "日本10-km候補patchは独立比較で有効。country拡張は再確認でも事前ゲートを満たさなかった。", ceiling: "候補patchを占有確率や正確な生息地点と呼ばず、失敗した拡張を救済しない。", next: "供給可能性と生物学的効果のゲートを分離した次世代へ。" },
    { id: "sdmr", series: "method", x: .92, y: .68, status: "open", layers: ["candidate universe", "SDM", "information barrier"], summary: "known-truth系で候補宇宙学習を検証し、実データProduct Aは封印された終端判定を待つ。", ceiling: "GBIF presenceを確率1、未記録地点をabsence、Product Bを完成結果としない。", next: "封印された実証artifactの終端判定だけを開く。" },

    { id: "crest", series: "theory", x: .055, y: .86, status: "result", layers: ["world", "state", "reportability"], summary: "scientific contractに対する一意な最粗adequate stateと、わずかな将来拡張が監視負債を任意増大させる有限構成。", ceiling: "有限定理を自然界での頻度や連続・確率系の一般定理としない。", next: "各実証系から明示的なobservation mapを受け取る。" },
    { id: "ccoc", series: "theory", x: .18, y: .86, status: "result", layers: ["future", "composition", "compression"], summary: "将来操作のgrammarが広がると、現在必要な状態表現が細分化される。", ceiling: "観測生態系の検証や経験的機構同定を所有しない。", next: "future obligationをCRESTのcontractへ型付きで接続する。" },
    { id: "mltr", series: "theory", x: .30, y: .86, status: "result", layers: ["history", "semantics", "repair"], summary: "置換や移送で壊れたmacro-lawを、履歴追加と最粗exact repairで修復する。", ceiling: "field dataから置換史やrepair relationを推定しない。", next: "履歴を必要とする実証例へ、所有権を移さず適用する。" },
    { id: "mrm", series: "theory", x: .42, y: .86, status: "result", layers: ["mechanism", "robust law", "discrimination"], summary: "候補機構が異なるとき、一つの決定論的法則を安全に報告できる条件を与える。", ceiling: "データから候補集合や機構そのものを推定する理論ではない。", next: "identified setを持つBITA/RACH型問題へ接続する。" },
    { id: "ced", series: "theory", x: .54, y: .86, status: "result", layers: ["evidence", "licensing", "observation design"], summary: "曖昧なfull stateの下でも、証拠とtargetに対して安全に報告できる最粗quotientを定める。", ceiling: "必要なrefinementが既に観測から得られたとは主張しない。", next: "field failureを含むcreditとrisk制約へ接続する。" },
    { id: "eco-genetic-criticality", label: "eco-genetic", series: "theory", x: .67, y: .86, status: "result", layers: ["dynamics", "fragmentation", "complete state"], summary: "宣言simulator内の完全状態と、同じ周辺量でもcross-layer alignmentが次遷移を変える反例を示す。", ceiling: "普遍的connectivity benefitや自然系の最小十分状態を主張しない。", next: "自然系partial stateと有限理論の間に限定bridgeを置く。" },
    { id: "eco-genetic-warning-extensions", label: "warning-ext", series: "theory", x: .81, y: .86, status: "stop", layers: ["warning", "natural partial state", "validation"], summary: "event内の相対順序は残るが、二値early-warningとしてはspecificity 0・AUC 0.5の反証を保存する。", ceiling: "event-conditional orderingを予測的early warningへ昇格しない。", next: "事前登録された自然系予測だけを新しい世代として評価する。" },
    { id: "theouni", series: "theory", x: .94, y: .86, status: "bounded", layers: ["meta theory", "provenance", "navigation"], summary: "分散した所有権を保ったまま、全リポを一つの型付き研究宇宙として索引する。", ceiling: "証拠・定理・データを中央所有せず、Graphify中心性を科学的証明としない。", next: "このサイトとregistryを同期し、未解決bridgeを明示する。" }
  ],

  edges: [
    { from: "azami", to: "EAzami", type: "solid", label: "space → evolutionary time" },
    { from: "island", to: "izu-core", type: "solid", label: "global responses → simulation / Izu" },
    { from: "izu-core", to: "shimahotarubukuro", type: "solid", label: "Izu convergence → empirical anchor" },
    { from: "fcp", to: "chun", type: "bridge", label: "current space → evolutionary time" },
    { from: "chun", to: "hotarubukuro", type: "bridge", label: "state identity → focal polymorphism" },
    { from: "fcp", to: "hotarubukuro", type: "bridge", label: "spatial states → multiscale resolution" },
    { from: "azami", to: "chun", type: "analogy", label: "visible pattern ≠ mechanism" },
    { from: "pollipi", to: "tnoa", type: "solid", label: "ordinal interface" },
    { from: "insepi", to: "tnoa", type: "solid", label: "failure geometry" },
    { from: "bita", to: "microdonta", type: "solid", label: "identified set → next observation" },
    { from: "tnoa", to: "microdonta", type: "bridge", label: "observation entitlement" },
    { from: "eog", to: "acsp", type: "bridge", label: "forecast → candidate support" },
    { from: "acsp", to: "sdmr", type: "bridge", label: "patch → predictor universe" },
    { from: "crest", to: "ccoc", type: "solid", label: "future obligation" },
    { from: "crest", to: "mltr", type: "solid", label: "history repair" },
    { from: "crest", to: "mrm", type: "solid", label: "mechanism robustness" },
    { from: "crest", to: "ced", type: "solid", label: "evidence licensing" },
    { from: "eco-genetic-criticality", to: "eco-genetic-warning-extensions", type: "solid", label: "parent → empirical bridge" },
    { from: "eco-genetic-criticality", to: "crest", type: "bridge", label: "bounded two-world bridge" },
    { from: "theouni", to: "crest", type: "bridge", label: "provenance index" },
    { from: "theouni", to: "azami", type: "bridge", label: "navigation only" },
    { from: "theouni", to: "island", type: "bridge", label: "navigation only" },
    { from: "theouni", to: "chun", type: "bridge", label: "navigation only" },
    { from: "theouni", to: "tnoa", type: "bridge", label: "navigation only" }
  ],

  stories: {
    flower: { label: "花色多型の state structure", nodes: ["fcp", "chun", "hotarubukuro"], text: "『花色多型の原因は何か』ではなく、見る座標系を変えると variation がどの state structure として現れるかを追う。FCP は現在の空間、chun は evolutionary time と state identity、hotarubukuro は一つの多型系を phenotype・spatial scale・ecological context で解像する。" },
    island: { label: "世界の島から伊豆へ", nodes: ["island", "izu-core", "shimahotarubukuro"], text: "世界の島嶼系で response state の多様性を探索し、simulation で one perturbation ≠ one response を一般化する。比較宇宙から伊豆へ収束し、secondary analysis を経て、シマホタルブクロを deep empirical anchor として field experiment へ接続する。" },
    evidence: { label: "観測から機構へ", nodes: ["pollipi", "insepi", "tnoa", "bita", "microdonta", "eog", "acsp", "sdmr"], text: "何を記録できるかを固定し、identified setを書き、次観測を選び、未開封の外部検証で初めて予測を評価する。" },
    state: { label: "世界から状態へ", nodes: ["crest", "ccoc", "mltr", "mrm", "ced", "eco-genetic-criticality", "eco-genetic-warning-extensions", "theouni"], text: "未来・履歴・機構・証拠の義務ごとに、世界から何を忘れてよいかを分ける。theouniは接続を所有するが、一次成果を所有しない。" }
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
      { n: "I", title: "アザミの花序はどう多様化したか", chapters: 8, series: "azami", repos: ["azami", "EAzami"], note: "観測された空間変異から、系統史と判別計画へ。", status: "核1–7章。外部測定と進化モデルの終端は残る。" },
      { n: "II", title: "世界の島から伊豆の実証へ", chapters: 8, series: "island", repos: ["island", "izu-core", "shimahotarubukuro"], note: "global response states → simulation → Izu convergence → secondary analysis → deep empirical anchor。", status: "比較とsimulationの結論を、伊豆field bridgeと混同せず接続する。" },
      { n: "III", title: "センサはいつ生物学的判断をしてよいか", chapters: 8, series: "method", repos: ["tnoa", "pollipi", "insepi"], note: "target・nuisance・observability・absenceを分離する。", status: "閉世界方法論の核は回収。field transferはpre-data。" },
      { n: "IV", title: "観測から機構へ", chapters: 8, series: "method", repos: ["bita", "microdonta", "eog", "acsp", "sdmr"], note: "識別、世界集合、候補patch、封印検証を一つの梯子にする。", status: "多くは回収済み。SDMR empirical terminalを後差し替え。" },
      { n: "V", title: "不完全情報の生態状態理論", chapters: 8, series: "theory", repos: ["crest", "ccoc", "mltr", "mrm", "ced"], note: "世界から何を忘れてよいかを、未来・履歴・機構・証拠で分ける。", status: "有限定理のspineが最も安定。" },
      { n: "VI", title: "Eco-genetic state と早期警戒の限界", chapters: 7, series: "theory", repos: ["eco-genetic-criticality", "eco-genetic-warning-extensions", "theouni"], note: "完全状態、alignment反例、予測的warningの反証。", status: "反証とpartial statesを分離して執筆可能。" },
      { n: "VII", title: "花色 variation はどの state structure として現れるか", chapters: 7, series: "pattern", repos: ["fcp", "chun", "hotarubukuro"], note: "現在の空間 → evolutionary time / state identity → 一つの多型系の multiscale resolution。", status: "博士論文の花色多型 spine として三章を一列に配置する。" }
    ],
    eight: [
      { n: "1", title: "アザミを測る", chapters: 8, series: "azami", repos: ["azami"], note: "画像から連続表現型と空間構造を測る。", status: "主論文核あり。外部測定gateが残る。" },
      { n: "2", title: "アザミの進化史", chapters: 9, series: "azami", repos: ["EAzami"], note: "系統不一致、花色史、競合モデルを扱う。", status: "判別設計として書ける。結果終端は未完。" },
      { n: "3", title: "世界の島から伊豆へ", chapters: 8, series: "island", repos: ["island", "izu-core", "shimahotarubukuro"], note: "response state の世界比較から simulation を経て、伊豆の deep anchor へ収束する。", status: "global pattern と Izu empirical bridge の claim level を分離する。" },
      { n: "4", title: "島で変わる相互作用", chapters: 8, series: "island", repos: ["izu-core"], note: "starting state、realized community、raw matching、community-corrected sortingを分ける。", status: "simulation と secondary analysis の境界を明示する。" },
      { n: "5", title: "花色 variation の state structure", chapters: 8, series: "pattern", repos: ["fcp", "chun", "hotarubukuro"], note: "Where now? → where through evolutionary time / what is the same state? → what becomes visible in one resolved polymorphic system?", status: "花色多型を原因探索ではなく、座標依存の state structure として統合する。" },
      { n: "6", title: "観測を独立させる", chapters: 8, series: "method", repos: ["pollipi", "insepi", "tnoa"], note: "センサー、観測者、物理実行、欠測を分離する。", status: "方法論核あり。field bridgeは別ゲート。" },
      { n: "7", title: "仮説を安全に壊す", chapters: 9, series: "method", repos: ["bita", "microdonta", "eog", "acsp", "sdmr"], note: "凍結、no-peek、部分識別、STOPを保存する。", status: "否定結果を救済せず中核に置く。" },
      { n: "8", title: "識別可能な生態学", chapters: 10, series: "theory", repos: ["crest", "ccoc", "mltr", "mrm", "ced", "eco-genetic-criticality", "theouni"], note: "状態、証拠、機構、次観測を一つの形式語彙へ。", status: "有限理論と自然系partial stateを混同しない。" }
    ]
  }
};
