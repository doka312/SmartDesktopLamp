/* ═══════════════════════════════════════════════════════════════════
   СТРАНИЦА СБОРКИ
   Этапы и фото. Тексты лежат в i18n.js: заголовки b.sN.title,
   подписи к фото — по имени файла (b.IMG_xxxx).
   Фото: docs/img/build/<имя>.jpg (крупно) и <имя>-sm.jpg (превью).
   ═══════════════════════════════════════════════════════════════════ */

export const BUILD_STAGES = [
  { id: 1, intro: "b.s1.text", photos: ["IMG_5996"], parts: true },
  { id: 2, photos: ["IMG_5998", "IMG_5999", "IMG_6001", "IMG_6002", "IMG_6003"] },
  { id: 3, photos: ["IMG_6005", "IMG_6006", "IMG_6007", "IMG_6008"] },
  { id: 4, intro: "b.s4.text", photos: ["IMG_6009", "IMG_6010", "IMG_6011", "IMG_6012"] },
  { id: 5, intro: "b.s5.text", scheme: true, photos: ["IMG_6013", "IMG_6014", "IMG_6015", "IMG_6016"] },
  { id: 6, intro: "b.s6.text", cta: true },
  { id: 7, photos: ["IMG_6017", "IMG_6018", "IMG_6020"], done: true },
];

// Подключение по схеме (контакты из прошивки: LED_PIN 9, BUTTON_PIN 4)
const PINS = [
  { part: "b.pins.led",    pin: "5V",            board: "5V",     color: "#E5533D" },
  { part: "b.pins.led",    pin: "GND",           board: "GND",    color: "#2B3A8C" },
  { part: "b.pins.led",    pin: "DIN",           board: "GPIO 9", color: "#E8913A" },
  { part: "b.pins.button", pin: "VCC",           board: "3.3V",   color: "#3CC6E0" },
  { part: "b.pins.button", pin: "GND",           board: "GND",    color: "#2B3A8C" },
  { part: "b.pins.button", pin: "I/O (OUT, SIG)", board: "GPIO 4", color: "#E8C93A" },
];

// Список деталей для этапа 1 (ключи в i18n.js: b.part.N)
const PARTS = ["b.part.1", "b.part.2", "b.part.3", "b.part.4", "b.part.5", "b.part.6"];

const photoSrc = (name, small) => `img/build/${name}${small ? "-sm" : ""}.jpg`;

export function createBuildPage({ t, $, $$, escapeHtml }) {
  // Плоский список фото для просмотра по порядку
  const allPhotos = [];
  for (const st of BUILD_STAGES) {
    for (const name of [...(st.photos || []), ...(st.after || [])]) allPhotos.push({ name, stage: st.id });
  }
  const stepLabel = (name) => {
    const st = BUILD_STAGES.find((s) => [...(s.photos || []), ...(s.after || [])].includes(name));
    const list = [...(st.photos || []), ...(st.after || [])];
    return list.length > 1 ? `${st.id}.${list.indexOf(name) + 1}` : String(st.id);
  };

  function stepHtml(name) {
    const label = stepLabel(name);
    return `<li class="build-step">
      <button type="button" class="photo-btn" data-photo="${name}" aria-label="${escapeHtml(t("lb.open"))}: ${escapeHtml(label)}">
        <img src="${photoSrc(name, true)}" alt="" loading="lazy" decoding="async">
        <span class="zoom-hint" aria-hidden="true">⤢</span>
      </button>
      <div class="build-text"><span class="sub-num">${label}</span><p>${t("b." + name)}</p></div>
    </li>`;
  }

  function schemeHtml() {
    const rows = PINS.map((r) => `<tr>
        <td>${escapeHtml(t(r.part))}</td>
        <td><span class="wire" style="--wire:${r.color}"></span>${escapeHtml(r.pin)}</td>
        <td><b>${escapeHtml(r.board)}</b></td></tr>`).join("");
    return `<div class="scheme-block">
      <figure class="scheme-fig">
        <button type="button" class="photo-btn scheme-btn" data-scheme="1" aria-label="${escapeHtml(t("lb.open"))}: ${escapeHtml(t("b.scheme"))}">
          <img src="img/build/scheme.png" alt="${escapeHtml(t("b.scheme"))}" loading="lazy" decoding="async">
        </button>
        <figcaption>${t("b.scheme")}</figcaption>
      </figure>
      <div class="pins">
        <h3>${t("b.pins.title")}</h3>
        <table class="pins-table">
          <thead><tr><th>${t("b.pins.part")}</th><th>${t("b.pins.pin")}</th><th>${t("b.pins.board")}</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="hint">${t("b.pins.note")}</p>
      </div>
    </div>`;
  }

  function render() {
    $("#stage-nav").innerHTML = BUILD_STAGES.map((st) =>
      `<button type="button" class="stage-chip" data-stage="${st.id}"><span>${st.id}</span>${escapeHtml(stripTags(t(`b.s${st.id}.title`)))}</button>`).join("");

    $("#build-stages").innerHTML = BUILD_STAGES.map((st) => `
      <section class="step card build-stage${st.parts ? " has-parts" : ""}" id="b-stage-${st.id}">
        <div class="step-head">
          <span class="step-num">${st.id}</span>
          <div>
            <h2>${t(`b.s${st.id}.title`)}</h2>
            ${st.intro ? `<p class="hint">${t(st.intro)}</p>` : ""}
          </div>
        </div>
        ${st.scheme ? schemeHtml() : ""}
        ${st.parts ? `<div class="parts-layout">
            <ol class="build-steps">${st.photos.map(stepHtml).join("")}</ol>
            <div class="parts-box"><h3>${t("b.parts.title")}</h3><ul class="parts-list">${PARTS.map((k) => `<li><span>${t(k)}</span></li>`).join("")}</ul></div>
          </div>`
          : st.photos ? `<ol class="build-steps">${st.photos.map(stepHtml).join("")}</ol>` : ""}
        ${st.cta ? `<a class="btn primary big" href="#install"><span class="btn-glow" aria-hidden="true"></span>${t("b.s6.btn")} →</a>` : ""}
        ${st.done ? `<p class="build-done">${t("b.done")}</p>` : ""}
      </section>`).join("");

    $$(".stage-chip").forEach((b) => b.addEventListener("click", () =>
      $(`#b-stage-${b.dataset.stage}`).scrollIntoView({ behavior: "smooth", block: "start" })));
    $$("#build-stages .photo-btn").forEach((b) => b.addEventListener("click", () =>
      b.dataset.scheme ? openLightbox(-1) : openLightbox(allPhotos.findIndex((p) => p.name === b.dataset.photo))));
  }

  /* ─── Просмотр фото ─── */
  const dlg = $("#lightbox");
  let current = 0;
  function showPhoto(i) {
    const img = $("#lb-img");
    if (i === -1) {                         // схема
      img.src = "img/build/scheme.png";
      img.alt = t("b.scheme");
      $("#lb-caption").innerHTML = t("b.scheme");
      $("#lb-counter").textContent = "";
      $("#lb-prev").hidden = $("#lb-next").hidden = true;
      dlg.classList.add("is-scheme");
      return;
    }
    dlg.classList.remove("is-scheme");
    current = (i + allPhotos.length) % allPhotos.length;
    const p = allPhotos[current];
    img.src = photoSrc(p.name, false);
    img.alt = stripTags(t("b." + p.name));
    $("#lb-caption").innerHTML = `<span class="sub-num">${stepLabel(p.name)}</span> ${t("b." + p.name)}`;
    $("#lb-counter").textContent = t("lb.counter", { step: p.stage, n: current + 1, total: allPhotos.length });
    $("#lb-prev").hidden = $("#lb-next").hidden = false;
    // Заранее подгружаем соседние фото
    for (const d of [-1, 1]) new Image().src = photoSrc(allPhotos[(current + d + allPhotos.length) % allPhotos.length].name, false);
  }
  function openLightbox(i) {
    showPhoto(i);
    if (!dlg.open) dlg.showModal();
  }
  $("#lb-close").addEventListener("click", () => dlg.close());
  $("#lb-prev").addEventListener("click", () => showPhoto(current - 1));
  $("#lb-next").addEventListener("click", () => showPhoto(current + 1));
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });   // клик по фону
  dlg.addEventListener("keydown", (e) => {
    if (dlg.classList.contains("is-scheme")) return;
    if (e.key === "ArrowLeft") showPhoto(current - 1);
    if (e.key === "ArrowRight") showPhoto(current + 1);
  });
  // Свайп на телефоне
  let touchX = null;
  dlg.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", (e) => {
    if (touchX === null || dlg.classList.contains("is-scheme")) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showPhoto(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  return { render };
}

function stripTags(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent;
}
