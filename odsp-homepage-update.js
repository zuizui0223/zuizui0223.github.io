(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const odsp = data.nodes.find((node) => node.id === "odsp");
  if (!odsp) return;

  Object.assign(odsp, {
    status: "open",
    pulse: "地図は、niche を薄くする。",
    thoughtMove: "S(x,y) を S(x,y,z,t,...) として開き、厚み・編成・時間分割・独立観測への移送を別々に測る。時間軸では H(T|B) と I(C;T|B) を分け、C は species / individual / guild のような事前宣言した identity とする。",
    thoughtKeeps: "H(Z|X,Y)、H(T|B)、H(Z,T|X,Y)、I(C;T|B)、effective states、held-out transferability、source precision、effort/detectability semantics。",
    thoughtRefuses: "厚みがあることを transferable organization と呼ぶこと、I(C;T|B) を competition や causal displacement と呼ぶこと、camera detection time を無条件に activity-time niche とみなすこと。",
    summary: "Chapter 2 — HOW THICK is it? 平面地図の外にある高さ・深さ・時間・構造を added axes として扱う。Bat lane では垂直厚み約4.02 effective states を回収した一方、x-y に条件づいた垂直配置は sealed 個体へ一般化しなかった。現在は独立 Snapshot Serengeti lane を事前凍結し、時間厚み H(T|Site)、種間時間分割 I(Species;T|Site)、3 held-out site folds への移送を一度だけ検証している。",
    ceiling: "完成済み bat/Tawaki endpoint を再調整して救済しない。Serengeti の結果を見る前に固定した time bins・species gates・effort rule を変更しない。時間分割の記述的関連を competition・相互排除・活動時間の真値へ昇格しない。",
    next: "Snapshot Serengeti temporal-partition lane の frozen terminal outcome を受け取り、generalizing / mixed / non-generalizing / not-detected / unavailable のいずれでもそのまま閉じる。",
    layers: ["chapter 2", "multidimensional geometry", "vertical", "temporal", "identity partition", "projection loss", "heldout transfer"]
  });

  window.ZUIZUI_THOUGHTS = window.ZUIZUI_THOUGHTS || {};
  window.ZUIZUI_THOUGHTS.odsp = {
    line: odsp.pulse,
    move: odsp.thoughtMove,
    keeps: odsp.thoughtKeeps,
    refuses: odsp.thoughtRefuses
  };

  const bookRoutes = Object.values(data.books || {});
  bookRoutes.forEach((books) => {
    (books || []).forEach((book) => {
      if (book.repos?.[0] === "odsp") {
        book.note = "高さ・時間の厚み ≠ その配置・時間分割の一般化";
      }
    });
  });
})();
