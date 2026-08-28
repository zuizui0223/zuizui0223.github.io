(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const thoughts = {
    azami: {
      line: "平均は、種を代表するほど、種の内側を消す。",
      move: "平均化の前に、個体・観測レベルの差を回収する。",
      keeps: "分類群内の連続変異と、形質ごとに異なる空間構造。",
      refuses: "種平均を、その種の表現型そのものとして扱うこと。"
    },
    EAzami: {
      line: "反復は数えられても、起点は一つに定まらない。",
      move: "反復回数と、転換位置の同定可能性を分ける。",
      keeps: "頑健な再発の下限と、曖昧な歴史配置。",
      refuses: "最小変化数を独立起源・収斂・適応へ直結すること。"
    },
    fcp: {
      line: "同じ変異が、ある場所では共存し、別の場所では地図になる。",
      move: "花色 variation を、局所共存と地理分化という別の空間編成として置く。",
      keeps: "変異の有無ではなく、変異が空間にどう組織されるか。",
      refuses: "現在の配置を、一つの維持機構や進化史へ還元すること。"
    },
    chun: {
      line: "同じ色は、同じ分子の道を丸ごと必要としない。",
      move: "可視状態、分子実装、歴史イベントの同一性を分ける。",
      keeps: "転換クラス依存のモジュール的反復と、イベント同定の限界。",
      refuses: "見た目の一致を、完全な分子状態や同じ進化経路の一致とみなすこと。"
    },
    hotarubukuro: {
      line: "一つの多型は、解像するほど一つではなくなる。",
      move: "同じ多型系を、表現型・縮尺・生態文脈ごとに解き直す。",
      keeps: "色素状態、強度、広域構造、局所境界、連続的隔離という複数層。",
      refuses: "異なる層を、一つの原因や一つの解析へ畳み込むこと。"
    },
    island: {
      line: "島という一語が、異なる過程を一つの症候群に畳む。",
      move: "観測過程を分離し、いつ・どこで応答ベクトルが変わるかを問う。",
      keeps: "地域文脈ごとの応答差と、未解決地域の未解決性。",
      refuses: "島距離を純粋な隔離処置、未記録を形質ゼロとみなすこと。"
    },
    "izu-core": {
      line: "同じ攪乱でも、出発点と出会いが未来の枝を選ぶ。",
      move: "一つの perturbation を、starting state と realized community に条件づける。",
      keeps: "平均境界を組織する初期位置と、個別応答を分岐させる群集実現。",
      refuses: "一つの島嶼攪乱から、一つの単調な応答を期待すること。"
    },
    shimahotarubukuro: {
      line: "花は島で一方向に変わらず、形質ごとにほどける。",
      move: "一つの花を、複数の独立しうる表現型軸へ分解する。",
      keeps: "絶対寸法、入口形態、生殖器官、蜜標被覆の異なる島間構造。",
      refuses: "全形質を一つの島症候群指数、Pst を選択証拠として読むこと。"
    },
    pollipi: {
      line: "観測は、判断より先に、戻れる記録でなければならない。",
      move: "一次記録と、機械による候補判断を物理的に分離する。",
      keeps: "固定努力の画像列、判断履歴、後から再検討できる provenance。",
      refuses: "候補判定や撮影数を、訪花真実や同じ観測努力とみなすこと。"
    },
    insepi: {
      line: "未決定は、答えの欠如ではなく、証拠の保存である。",
      move: "target、nuisance、observability、absence evidence を非補集合として保持する。",
      keeps: "重畳、帰属不能、no-support、不在未認証という異なる未決定理由。",
      refuses: "低い target 支持を、不在や nuisance の真実へ強制変換すること。"
    },
    tnoa: {
      line: "観測が与えるのは答えではなく、答えてよい範囲である。",
      move: "観測記録を、下流推論に渡せる判断資格へ変換する。",
      keeps: "B/T/N/U と、理由付き abstention が残す下流情報。",
      refuses: "生の閾値、二値化、未検出を普遍的判断規則として移送すること。"
    },
    bita: {
      line: "総効果は、原因を束ねるが、原因を割り当てない。",
      move: "相互作用効果を、唯一機構ではなく identified set として読む。",
      keeps: "複数チャネルの互換な配分と、それを縮めるための介入条件。",
      refuses: "精密な総効果から、構成機構を差し引きで命名すること。"
    },
    microdonta: {
      line: "よい観測は、答えを増やすのではなく、残る世界を減らす。",
      move: "一つの最良説明を選ばず、残存因果世界を最も分ける次観測を選ぶ。",
      keeps: "モデル制約に適合する複数世界、proxy 校正、観測順序。",
      refuses: "豊かな simulator や高精度 proxy を、機構同定そのものとみなすこと。"
    },
    eog: {
      line: "更新のために覚え、予測のために忘れる。",
      move: "exact world identity と、label-invariant predictive summary を別の表現層に置く。",
      keeps: "反証可能な世界履歴と、世界名に依存しない予測情報。",
      refuses: "監査に必要な同一性を捨てること、または同一性をそのまま予測力とみなすこと。"
    },
    acsp: {
      line: "正の結果でも、決めた門を通らなければ一般化ではない。",
      move: "平均的な好結果より、事前に宣言した全ゲートを優先する。",
      keeps: "日本で確認された candidate-patch claim と、外部拡張の失敗。",
      refuses: "正の lift や六つの通過を、七つ目の失敗より重く扱うこと。"
    },
    sdmr: {
      line: "答えを見る前に、何を答えと呼ぶかを凍らせる。",
      move: "候補宇宙・選択法・評価分母を sealed evidence の外で固定する。",
      keeps: "supported、unavailable、non-estimable、STOP を同格の終端として残す契約。",
      refuses: "開封後に分母・特徴量・成功条件を修理すること。"
    },
    crest: {
      line: "状態とは、世界そのものではなく、責任をもって忘れた世界である。",
      move: "state を、科学契約に対する最粗の安全な quotient として構成する。",
      keeps: "未来・履歴・機構・証拠・報告に必要な差だけ。",
      refuses: "瞬間 snapshot や一つの自然分類を、無条件の状態とみなすこと。"
    },
    ccoc: {
      line: "未来にできることが増えると、現在に残すべき差も増える。",
      move: "将来 grammar の拡張が、現在の表現責任を細分化することを示す。",
      keeps: "まだ実行されていないが、契約上可能になった未来応答差。",
      refuses: "現在同じに見えることを、開かれた未来でも同じとみなすこと。"
    },
    mltr: {
      line: "同じ現在でも、どこから来たかが意味を変える。",
      move: "置換後の現在へ、必要最小限の由来と履歴を戻して意味を修復する。",
      keeps: "運べる旧法則、運べない merge、最小 repair、必要な history mode。",
      refuses: "現在形が同じなら、継承された意味も同じだとみなすこと。"
    },
    mrm: {
      line: "姿が同じでも、未来への応答が違えば、同じ状態ではない。",
      move: "可視状態ではなく、契約に関係する response type で機構差を保持する。",
      keeps: "決定論的に共通な法則、typed law、set-valued report の境界。",
      refuses: "候補機構の違いを全部残すこと、または全部忘れること。"
    },
    ced: {
      line: "必要な差、見えた差、言ってよい差は一致しない。",
      move: "required state、identified state、reportable target を三つに分ける。",
      keeps: "証拠が実際に許す ambiguity、target-safe refinement、誤断定リスク。",
      refuses: "理論上必要な区別を、観測済み・報告可能と自動的にみなすこと。"
    },
    "eco-genetic-criticality": {
      line: "同じ周辺量でも、重なり方が次の遷移を変える。",
      move: "marginal summaries の一致と、cross-layer alignment の一致を分ける。",
      keeps: "完全明示 state が持つ配置情報と、次遷移の差を生む alignment。",
      refuses: "同じ census・interaction・allele marginals を、同じ動的状態とみなすこと。"
    },
    "eco-genetic-warning-extensions": {
      line: "先に起きることは、先を当てられることではない。",
      move: "event 内の時間順序と、全分母での予測識別力を分ける。",
      keeps: "再現した ordering、ゼロ specificity、state-dependent portability の条件。",
      refuses: "loss 前に動く指標を、それだけで warning と呼ぶこと。"
    },
    theouni: {
      line: "接続しても、証拠の住所は移さない。",
      move: "異なる研究を型付きで接続しながら、一次所有権と provenance を分散したまま保つ。",
      keeps: "Reality、ModelWorld、State、Evidence、Report の非同一性と source ownership。",
      refuses: "中心性・registry・synthesis が、元の証拠や定理を所有したことにすること。"
    }
  };

  data.nodes.forEach((node) => {
    const thought = thoughts[node.id];
    if (!thought) return;
    node.pulse = thought.line;
    node.thoughtMove = thought.move;
    node.thoughtKeeps = thought.keeps;
    node.thoughtRefuses = thought.refuses;
  });

  Object.values(data.books || {}).flat().forEach((book) => {
    const repo = book.repos && book.repos[0];
    const node = data.nodes.find((item) => item.id === repo);
    if (node) book.title = `${repo} — ${node.pulse}`;
  });

  window.ZUIZUI_THOUGHTS = thoughts;

  const detail = document.getElementById("detailPanel");
  if (detail) {
    const labelOf = (node) => node.label || node.id;
    const deepen = () => {
      const heading = detail.querySelector("h3");
      const pulse = detail.querySelector(".detail-pulse");
      if (!heading || !pulse) return;
      const node = data.nodes.find((item) => labelOf(item) === heading.textContent.trim());
      if (!node || !node.thoughtMove) return;
      const depth = `${node.thoughtMove}／残す: ${node.thoughtKeeps}／拒む: ${node.thoughtRefuses}`;
      pulse.title = depth;
      pulse.setAttribute("aria-label", `${node.pulse} ${depth}`);
    };
    new MutationObserver(deepen).observe(detail, { childList: true, subtree: true });
    deepen();
  }
})();