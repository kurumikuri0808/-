// =============================================
// GAS（Apps Script）で公開した API URL
// =============================================
const CSV_URL = "https://script.google.com/macros/s/AKfycbyiBb-AZoxzwmV-OuPrDdsHJrOw1sQzx4eyHn5KVHH7srxTGmfScLBumlV0OiMHYf2X/exec";

// =============================================
// JSON 取得
// =============================================
async function loadCSV() {
  const response = await fetch(CSV_URL);
  if (!response.ok) throw new Error("データを取得できませんでした");
  return await response.json();
}

// =============================================
// 空欄なら非表示
// =============================================
function setDataAttr(selector, value) {
  const el = document.querySelector(selector);
  if (!el) return;

  if (!value || value === "") {
    el.style.display = "none";
  } else {
    el.textContent = value;
  }
}

// =============================================
// 2段タイトルをセットする関数（一覧 & 詳細 共通）
// =============================================
function setTwoLineTitle(selector, top, bottom) {
  const el = document.querySelector(selector);
  if (!el) return;

  el.innerHTML = `
    <span class="title-top">${top || ""}</span>
    <span class="title-bottom">${bottom || ""}</span>
  `;
}

// =============================================
// メインビジュアル
// =============================================
function setMainVisual(data) {
  if (!data || data.length === 0) return;
  const mv = data[0];

  setDataAttr("[data-header-month]", mv["mv_month"]);
  setDataAttr("[data-header-free]", mv["mv_free"]);
  setDataAttr("[data-header-date]", mv["mv_date"]);
}

// =============================================
// 講座一覧カード（2段表示）
// =============================================
function setKouzaList(data) {
  data.forEach(row => {
    const id = row["id"];

    // ★ 2段タイトル
    setTwoLineTitle(
      `[data-list${id}_title]`,
      row["講座名＿上段"],
      row["講座名＿下段"]
    );

    // ★ 日付
    setDataAttr(`[data-school${id}_date]`, row["日付"]);

    // ★ カード本体取得
    const card = document.getElementById(`card${id}`);

    // ★ school_id が存在するなら色クラスを追加
    if (card && row["school_id"]) {
      card.classList.add(`school-${row["school_id"]}`);
    }
  });
}
// =============================================
// 講座詳細（2段表示）
// =============================================
function setDetails(data) {
  data.forEach(row => {
    const id = row["id"];

    // ★ school-detail に学校カラーのクラスを付ける
    const detailCard = document.getElementById(`school${id}`);
    if (detailCard && row["school_id"]) {
    detailCard.classList.add(`school${row["school_id"]}`);
    }

    setDataAttr(`[data-detail${id}_school]`, row["学校名"]);

    setTwoLineTitle(
      `[data-detail${id}_title]`,
      row["講座名＿上段"],
      row["講座名＿下段"]
    );

    setDataAttr(`[data-detail${id}_desc]`, row["概要"]);
    setDataAttr(`[data-detail${id}_items]`, row["持ち物"]);
    setDataAttr(`[data-detail${id}_date]`, row["日付"]);
    setDataAttr(`[data-detail${id}_time]`, row["時間"]);
    setDataAttr(`[data-detail${id}_capacity]`, row["定員"]);
    setDataAttr(`[data-detail${id}_condition]`, row["参加条件"]);
    setDataAttr(`[data-detail${id}_place]`, row["会場"]);
    setDataAttr(`[data-detail${id}_deadline]`, row["申し込み締切"]);
    setDataAttr(`[data-detail${id}_memo]`, row["補足説明"]);
  });
}

// =============================================
// 初期化
// =============================================
(async function () {
  const data = await loadCSV();
  setMainVisual(data);
  setKouzaList(data);
  setDetails(data);
})();

// -----------------------------
// スマホメニュー（active）
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const ham = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("spMenu");

  let overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  ham.addEventListener("click", () => {
    menu.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    menu.classList.remove("active");
    overlay.classList.remove("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {

  const ham = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("spMenu");
  const closeBtn = document.querySelector(".close-btn");

  let overlay = document.querySelector(".menu-overlay");

  // ✕ボタンで閉じる
  closeBtn.addEventListener("click", () => {
    menu.classList.remove("active");
    overlay.classList.remove("active");
  });
});

