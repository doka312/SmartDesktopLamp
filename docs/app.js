import { ESPLoader, Transport } from "./vendor/esptool-js-0.7.0.js";
import qrcode from "./vendor/qrcode-generator-2.0.4.mjs";
import { T, LANGS } from "./i18n.js";

/* ═══════════════════════════════════════════════════════════════════
   ОБЩИЕ С ПРОШИВКОЙ НАСТРОЙКИ
   Если меняете их в прошивке (SmartDesktopLamp.ino / effects.h),
   поменяйте и здесь.
   ═══════════════════════════════════════════════════════════════════ */

// Цвета-«плитки» из палитры «Дома» (H в градусах, S в процентах) и их скриншоты
const TRIGGER_SLOTS = [
  { hue: 352, sat: 3, img: "img/tile-1.png" },
  { hue: 9,   sat: 5, img: "img/tile-2.png" },
  { hue: 17,  sat: 7, img: "img/tile-3.png" },
];
const DEFAULT_SLOT_FX = [1, 2, 3];

// Анимации превью эффектов. id совпадают с таблицей EFFECTS в effects.h.
// Названия и описания лежат в i18n.js (ключи fx.<id>.name / fx.<id>.desc).
// Если лампа сообщит эффект, которого здесь нет, сайт покажет его название из прошивки.
const EFFECTS_INFO = {
  0: { sim: "none",            ms: 100 },
  1: { sim: "colorfulTwinkle", ms: 30 },
  2: { sim: "aurora",          ms: 35 },
  3: { sim: "twinkle",         ms: 50 },
  4: { sim: "runningRainbow",  ms: 30 },
  5: { sim: "staticRainbow",   ms: 30 },
};

const MIN_LEDS = 3, MAX_LEDS = 64, DEFAULT_LEDS = 8;
const HAP_SETUP_ID = "LAMP";   // homeSpan.setQRID(...)
const HAP_CATEGORY = 5;        // Category::Lighting
const USB_FILTERS = [0x303a, 0x1a86, 0x10c4, 0x0403].map((v) => ({ usbVendorId: v }));

/* ═══════════════════════════════════════════════════════════════════ */

/* ─── Язык ───────────────────────────────────────────────────────── */
let lang = pickLang();
function pickLang() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(fromUrl)) return fromUrl;
  try { const saved = localStorage.getItem("lamp-lang"); if (LANGS.includes(saved)) return saved; } catch { /* нет доступа */ }
  const prefs = navigator.languages || [navigator.language || "en"];
  return prefs.some((l) => /^(ru|uk|be|kk)\b/i.test(l)) ? "ru" : "en";
}
function t(key, vars = {}) {
  const entry = T[key];
  let str = entry ? entry[LANGS.indexOf(lang)] ?? entry[0] : key;
  for (const [k, v] of Object.entries(vars)) str = str.split(`{${k}}`).join(v);
  return str;
}

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const state = {
  effects: true,
  leds: DEFAULT_LEDS,
  slots: [...DEFAULT_SLOT_FX],
  codeMode: "random",
  randomCode: "",
  ownCode: "",
  device: null,        // что сообщила лампа ($LAMP)
  deviceFx: [],        // [{id, name}] из прошивки
  manifest: undefined, // undefined — ещё грузим, null — файлов нет
  busy: false,
  installed: false,
  homeStatus: null,
  bgConn: null,        // соединение, которое слушает лампу после установки
};

async function stopBackground() {
  const c = state.bgConn;
  state.bgConn = null;
  if (c) await c.close();
}

/* ─── Журнал ─────────────────────────────────────────────────────── */
const logEl = $("#log");
const logLines = [];
function log(line) {
  logLines.push(line);
  if (logLines.length > 500) logLines.splice(0, logLines.length - 500);
  logEl.textContent = logLines.join("\n");
  logEl.scrollTop = logEl.scrollHeight;
}

/* ─── Цвета ──────────────────────────────────────────────────────── */
// HSV как в «Доме»: h 0..360, s 0..100, v 0..100 → [r,g,b]
function hsvToRgb(h, s, v) {
  s /= 100; v /= 100;
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255].map(Math.round);
}
// HSV как в FastLED: всё 0..255
const hsv8 = (h, s, v) => hsvToRgb(((h % 256) + 256) % 256 * 360 / 256, s / 2.55, v / 2.55);
const sin8 = (x) => 128 + 127 * Math.sin(((x % 256) / 256) * Math.PI * 2);
const rgbCss = ([r, g, b]) => `rgb(${r | 0},${g | 0},${b | 0})`;
function slotSwatch(slot) {
  // В «Доме» плитки почти белые, чуть подкрашиваем, чтобы оттенок было видно
  return rgbCss(hsvToRgb(slot.hue, Math.min(100, slot.sat * 4), 100));
}

/* ─── Имитация эффектов для превью ──────────────────────────────── */
class EffectSim {
  constructor(n) { this.n = n; this.leds = Array.from({ length: n }, () => [0, 0, 0]); this.p1 = 0; this.p2 = 0; this.hue = 0; }
  step(kind, slot) {
    const L = this.leds;
    switch (kind) {
      case "colorfulTwinkle":
      case "twinkle": {
        for (const c of L) for (let k = 0; k < 3; k++) c[k] *= kind === "twinkle" ? 0.95 : 0.94;
        for (let i = 0; i < this.n; i++) {
          if (Math.random() < 0.035 && (L[i][0] + L[i][1] + L[i][2]) / 3 < 60) {
            const hue = kind === "twinkle" ? 20 + Math.random() * 20 : Math.random() * 255;
            const add = hsv8(hue, 180, 120 + Math.random() * 135);
            for (let k = 0; k < 3; k++) L[i][k] = Math.min(255, L[i][k] + add[k]);
          }
        }
        break;
      }
      case "aurora":
      case "runningRainbow": {
        for (let i = 0; i < this.n; i++) {
          const bright = (sin8(this.p1 + i * 20) + sin8(this.p2 + i * 35)) / 2;
          const hue = kind === "aurora"
            ? 90 + (sin8(this.p1 / 4 + i * 10) / 255) * 50
            : sin8(this.p1 / 4 + i * 30);
          this.leds[i] = hsv8(hue, kind === "aurora" ? 200 : 220, bright);
        }
        this.p1 += 3; this.p2 += 5;
        break;
      }
      case "staticRainbow": {
        const c = hsv8(this.hue, 240, 255);
        this.leds = this.leds.map(() => [...c]);
        this.hue = (this.hue + 1) % 256;
        break;
      }
      default: {
        const c = hsvToRgb(slot.hue, slot.sat, 100);
        this.leds = this.leds.map(() => [...c]);
      }
    }
  }
}

/* Превью рисуются в <canvas>: одна картинка на плитку вместо восьми меняющихся
   элементов. Так браузеру не нужно пересчитывать стили страницы на каждом кадре
   (особенно заметно в Safari). Невидимые превью не анимируются. */
const PREVIEW_LEDS = 8;
const previews = [];   // {canvas, ctx, sim, slotIndex, last, lastId, visible, dirty}
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const previewObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      for (const e of entries) {
        const p = previews.find((x) => x.canvas === e.target);
        if (p) { p.visible = e.isIntersecting; if (p.visible) wakePreviews(); }
      }
    })
  : null;

function drawPreview(p) {
  const { ctx, canvas } = p;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const step = w / PREVIEW_LEDS, cy = h / 2, r = Math.min(step, h) * 0.2;
  p.sim.leds.forEach((c, i) => {
    const cx = step * (i + 0.5);
    const [R, G, B] = c.map((v) => Math.max(0, Math.min(255, v | 0)));
    const lum = (R + G + B) / 765;
    if (lum > 0.03) {                           // мягкое свечение вокруг огонька
      const g = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 2.6);
      g.addColorStop(0, `rgba(${R},${G},${B},${0.55 * Math.min(1, lum * 2)})`);
      g.addColorStop(1, `rgba(${R},${G},${B},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(cx - r * 2.6, cy - r * 2.6, r * 5.2, r * 5.2);
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = lum > 0.01 ? `rgb(${R},${G},${B})` : "#000";
    ctx.fill();
  });
}

let previewLoop = 0;
function wakePreviews() {
  if (!previewLoop && !document.hidden) previewLoop = requestAnimationFrame(animatePreviews);
}
function animatePreviews(time) {
  previewLoop = 0;
  let keepGoing = false;
  for (const p of previews) {
    const id = state.effects ? state.slots[p.slotIndex] : 0;
    const info = EFFECTS_INFO[id] || { sim: "runningRainbow", ms: 30 };
    if (p.lastId !== id) { p.sim = new EffectSim(PREVIEW_LEDS); p.lastId = id; p.dirty = true; p.last = 0; }
    const animated = info.sim !== "none" && !reduceMotion;
    if (!p.visible && !p.dirty) continue;
    if (animated && p.visible) keepGoing = true;
    if (!p.dirty && (!animated || time - p.last < info.ms)) continue;
    p.last = time;
    p.sim.step(info.sim, TRIGGER_SLOTS[p.slotIndex]);
    drawPreview(p);
    p.dirty = false;
  }
  if (keepGoing) previewLoop = requestAnimationFrame(animatePreviews);
}
document.addEventListener("visibilitychange", wakePreviews);

function markPreviewsDirty() { previews.forEach((p) => (p.dirty = true)); wakePreviews(); }

/* ─── Скриншоты: показываем заглушку, если файла ещё нет ───────── */
function watchShot(img) {
  const fig = img.closest(".shot, .hero-photo");
  const mark = () => fig.classList.toggle("empty", !(img.complete && img.naturalWidth > 0));
  img.addEventListener("error", () => fig.classList.add("empty"));
  img.addEventListener("load", mark);
  if (img.complete) mark();
}

/* ─── Шаг 1: режим и светодиоды ─────────────────────────────────── */
function setEffects(on) {
  state.effects = on;
  $$('input[name="mode"]').forEach((r) => (r.checked = r.value === (on ? "1" : "0")));
  const section = $("#step-effects");
  section.classList.toggle("disabled", !on);
  section.classList.toggle("is-basic", !on);
  $("#effects-off").hidden = on;
  $("#btn-fx-toggle").hidden = on;
  // С эффектами раздел всегда открыт; для базовой лампы — свёрнут
  setEffectsOpen(on);
  document.body.classList.toggle("fx-on", on);
  renderTilesSummary();
  markPreviewsDirty();
}

function setEffectsOpen(open) {
  const body = $("#effects-body");
  body.classList.toggle("closed", !open);
  body.inert = !open;
  const btn = $("#btn-fx-toggle");
  btn.setAttribute("aria-expanded", String(open));
  $("span", btn).textContent = t(open ? "fx.collapse" : "fx.expand");
  $("#step-effects").classList.toggle("is-collapsed", !open);
  if (open) markPreviewsDirty();
}

function setLeds(n) {
  n = Math.round(Number(n));
  if (!Number.isFinite(n)) return;
  n = Math.min(MAX_LEDS, Math.max(MIN_LEDS, n));
  state.leds = n;
  if (document.activeElement !== $("#leds-num")) $("#leds-num").value = n;
}

/* ─── Шаг 2: плитки эффектов ────────────────────────────────────── */
function effectList() {
  const ids = new Set(Object.keys(EFFECTS_INFO).map(Number));
  for (const fx of state.deviceFx) ids.add(fx.id);
  return [...ids].sort((a, b) => (a === 0 ? 1 : b === 0 ? -1 : a - b));
}
function effectName(id) {
  if (T[`fx.${id}.name`]) return t(`fx.${id}.name`);
  return state.deviceFx.find((f) => f.id === id)?.name || t("fx.generic", { id });
}
function effectDesc(id) {
  return T[`fx.${id}.desc`] ? t(`fx.${id}.desc`) : t("fx.unknownDesc");
}

function renderSlots() {
  const wrap = $("#slots");
  previews.forEach((p) => previewObserver?.unobserve(p.canvas));
  previews.length = 0;
  wrap.innerHTML = "";
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  TRIGGER_SLOTS.forEach((slot, i) => {
    const el = document.createElement("div");
    el.className = "slot";
    el.innerHTML = `
      <div class="slot-head">
        <span class="swatch" style="background:${slotSwatch(slot)}"></span>
        <div>
          <div class="slot-title">${t("slot.title", { n: i + 1 })}</div>
          <div class="slot-meta">${t("slot.meta", { h: slot.hue, s: slot.sat })}</div>
        </div>
      </div>
      <figure class="shot">
        <img src="${slot.img}" alt="${escapeHtml(t("slot.alt", { n: i + 1 }))}" loading="lazy" decoding="async">
        <figcaption class="shot-placeholder">
          <span class="ph-icon" aria-hidden="true">📱</span>
          <span>${t("slot.ph", { n: i + 1 })}</span>
          <code>docs/${slot.img}</code>
        </figcaption>
      </figure>
      <canvas class="preview" aria-hidden="true"></canvas>
      <div class="fx-select">
        <select id="slot-fx-${i}" aria-label="${escapeHtml(t("slot.aria", { n: i + 1 }))}">
          ${effectList().map((id) => `<option value="${id}" ${state.slots[i] === id ? "selected" : ""}>${escapeHtml(effectName(id))}</option>`).join("")}
        </select>
      </div>
      <p class="fx-desc">${escapeHtml(effectDesc(state.slots[i]))}</p>`;
    wrap.appendChild(el);
    watchShot($("img", el));

    const select = $("select", el);
    select.addEventListener("change", () => {
      state.slots[i] = Number(select.value);
      $(".fx-desc", el).textContent = effectDesc(state.slots[i]);
      renderTilesSummary();
      markPreviewsDirty();
    });

    const canvas = $("canvas", el);
    canvas.width = 240 * dpr;
    canvas.height = 36 * dpr;
    const p = { canvas, ctx: canvas.getContext("2d"), slotIndex: i, last: 0, lastId: null, sim: null, visible: !previewObserver, dirty: true };
    previews.push(p);
    previewObserver?.observe(canvas);
  });
  wakePreviews();
}

function renderTilesSummary() {
  const ul = $("#tiles-summary");
  ul.innerHTML = TRIGGER_SLOTS.map((slot, i) => {
    const id = state.effects ? state.slots[i] : 0;
    return `<li><span class="swatch" style="background:${slotSwatch(slot)}"></span>
      <span>${t("tiles.item", { n: i + 1, fx: escapeHtml(effectName(id)) })}</span></li>`;
  }).join("");
  $("#tiles-reminder").hidden = !state.effects;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ─── Шаг 4: код сопряжения ─────────────────────────────────────── */
function codeAllowed(code) {
  if (!/^\d{8}$/.test(code)) return false;
  if (/^(\d)\1{7}$/.test(code)) return false;
  return code !== "12345678" && code !== "87654321";
}
function generateCode() {
  const buf = new Uint32Array(1);
  let code;
  do {
    crypto.getRandomValues(buf);
    code = String(buf[0] % 100000000).padStart(8, "0");
  } while (!codeAllowed(code));
  return code;
}
const fmtCode = (c) => (c && c.length === 8 ? `${c.slice(0, 3)}-${c.slice(3, 5)}-${c.slice(5)}` : "— — —");

function currentCode() {
  if (state.codeMode === "random") return state.randomCode;
  if (state.codeMode === "own") return codeAllowed(state.ownCode) ? state.ownCode : "";
  return state.device?.code || "";
}

function setCodeMode(mode) {
  state.codeMode = mode;
  $$('input[name="codemode"]').forEach((r) => (r.checked = r.value === mode));
  $("#code-random").hidden = mode !== "random";
  $("#code-own").hidden = mode !== "own";
  $("#code-keep").hidden = mode !== "keep";
  renderFinalCode();
}

function validateOwnCode() {
  const input = $("#code-input");
  const digits = input.value.replace(/\D/g, "").slice(0, 8);
  state.ownCode = digits;
  const msg = $("#code-msg");
  msg.classList.remove("ok");
  input.classList.remove("invalid");
  if (!digits) { msg.textContent = ""; }
  else if (digits.length < 8) { msg.textContent = t("code.need8", { n: digits.length }); }
  else if (!codeAllowed(digits)) { msg.textContent = t("code.tooSimple"); input.classList.add("invalid"); }
  else { msg.textContent = t("code.ok", { c: fmtCode(digits) }); msg.classList.add("ok"); }
  renderFinalCode();
}

function hapPayload(code) {
  let n = (BigInt(HAP_CATEGORY) << 31n) | (2n << 27n) | BigInt(parseInt(code, 10) & 0x07ffffff);
  let s = "";
  for (let i = 0; i < 9; i++) {
    const d = Number(n % 36n);
    s = (d < 10 ? String(d) : String.fromCharCode(55 + d)) + s;
    n /= 36n;
  }
  return `X-HM://${s}${HAP_SETUP_ID}`;
}

function renderFinalCode() {
  const code = currentCode();
  $("#code-display").textContent = fmtCode(state.randomCode);
  $("#final-code").textContent = fmtCode(code);
  const qrEl = $("#qr");
  if (code) {
    const qr = qrcode(0, "M");
    qr.addData(hapPayload(code));
    qr.make();
    qrEl.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  } else {
    qrEl.innerHTML = `<span class="muted">${t("qr.none")}</span>`;
  }
}

/* ─── Связь с лампой по USB ─────────────────────────────────────── */
class LampConnection {
  constructor(port) {
    this.port = port;
    this.listeners = new Set();
    this.buf = "";
    this.closed = false;
    this.lost = false;
    this.onLost = null;
  }

  async open() {
    await this.port.open({ baudRate: 115200 });
    // DTR и RTS выключены — лампа работает в обычном режиме (не в режиме прошивки)
    try { await this.port.setSignals({ dataTerminalReady: false, requestToSend: false }); } catch { /* не у всех портов */ }
    this.writer = this.port.writable.getWriter();
    this.loop = this._readLoop();
  }

  async _readLoop() {
    const dec = new TextDecoder();
    this.reader = this.port.readable.getReader();
    try {
      for (;;) {
        const { value, done } = await this.reader.read();
        if (done) break;
        this._onData(dec.decode(value, { stream: true }));
      }
    } catch (e) {
      if (!this.closed) { this.lost = true; log(`[connection lost: ${e.message}]`); }
    } finally {
      try { this.reader.releaseLock(); } catch { /* уже освобождён */ }
    }
    if (this.lost && this.onLost) this.onLost();
  }

  _onData(text) {
    this.buf += text;
    let i;
    while ((i = this.buf.indexOf("\n")) >= 0) {
      const line = this.buf.slice(0, i).replace(/\r$/, "");
      this.buf = this.buf.slice(i + 1);
      if (line.trim()) log(line);
      for (const fn of [...this.listeners]) fn(line);
    }
  }

  async send(line) {
    log("> " + line.replace(/^(\$SET pass ).*/, "$1••••••"));
    await this.writer.write(new TextEncoder().encode(line + "\n"));
  }

  waitLine(pred, timeout) {
    return new Promise((resolve, reject) => {
      const fn = (line) => {
        if (pred(line)) { clearTimeout(t); this.listeners.delete(fn); resolve(line); }
      };
      const t = setTimeout(() => { this.listeners.delete(fn); reject(new Error("timeout")); }, timeout);
      this.listeners.add(fn);
    });
  }

  // Спрашиваем лампу о её настройках, пока не ответит
  hello(timeout = 12000) {
    return new Promise((resolve, reject) => {
      let info = null, fx = [];
      const fn = (line) => {
        line = line.trim();
        if (line.startsWith("$LAMP ")) { info = parseKV(line.slice(6)); fx = []; }
        else if (info && line.startsWith("$FX ")) {
          const [, id, name] = line.match(/^\$FX (\d+) (.*)$/) || [];
          if (id) fx.push({ id: Number(id), name: safeDecode(name) });
        } else if (info && line === "$END") { done(); resolve({ info, fx }); }
      };
      const done = () => { clearInterval(iv); clearTimeout(t); this.listeners.delete(fn); };
      const t = setTimeout(() => { done(); reject(new Error("no-hello")); }, timeout);
      this.listeners.add(fn);
      const ping = () => this.send("$HELLO").catch(() => {});
      ping();
      const iv = setInterval(ping, 1500);
    });
  }

  async close() {
    this.closed = true;
    try { await this.reader?.cancel(); } catch { /* ok */ }
    try { await this.loop; } catch { /* ok */ }
    try { this.writer?.releaseLock(); } catch { /* ok */ }
    try { await this.port.close(); } catch { /* ok */ }
  }
}

function safeDecode(s) { try { return decodeURIComponent(s); } catch { return s; } }
function parseKV(s) {
  const o = {};
  for (const part of s.trim().split(/\s+/)) {
    const eq = part.indexOf("=");
    if (eq > 0) o[part.slice(0, eq)] = safeDecode(part.slice(eq + 1));
  }
  return o;
}

async function requestPort() {
  return navigator.serial.requestPort({ filters: USB_FILTERS });
}

// После перезагрузки лампа может «переподключиться» к USB — ищем её снова
async function reopenLamp(oldPort, timeout = 15000) {
  const info = oldPort.getInfo();
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const ports = [oldPort, ...(await navigator.serial.getPorts()).filter((p) => p !== oldPort)];
    for (const p of ports) {
      const pi = p.getInfo();
      if (pi.usbVendorId !== info.usbVendorId || pi.usbProductId !== info.usbProductId) continue;
      const conn = new LampConnection(p);
      try { await conn.open(); return conn; } catch { try { await p.close(); } catch { /* ok */ } }
    }
    await sleep(700);
  }
  return null;
}

/* ─── Загрузка настроек с лампы ─────────────────────────────────── */
function applyDeviceInfo({ info, fx }) {
  state.device = info;
  state.deviceFx = fx;
  if (info.effects !== undefined) setEffects(info.effects === "1");
  if (info.leds) setLeds(info.leds);
  TRIGGER_SLOTS.forEach((_, i) => { if (info[`s${i + 1}`] !== undefined) state.slots[i] = Number(info[`s${i + 1}`]); });
  renderSlots();
  renderTilesSummary();

  if (info.ssid) {
    $("#wifi-current").textContent = info.ssid;
    $("#wifi-keep-hint").hidden = false;
    $("#ssid").placeholder = info.ssid;
  }
  if (info.code && codeAllowed(info.code)) {
    $("#codemode-keep-wrap").hidden = false;
    $("#code-keep-display").textContent = fmtCode(info.code);
    setCodeMode("keep");
  }
  const upToDate = state.manifest && info.fw === state.manifest.version;
  setAction(upToDate || !state.manifest ? "settings" : "flash");
  return upToDate;
}

function setAction(a) {
  $$('input[name="action"]').forEach((r) => (r.checked = r.value === a));
  updateInstallLabel();
}
const currentAction = () => $('input[name="action"]:checked')?.value || "flash";

async function readFromLamp() {
  if (state.busy) return;
  const status = $("#read-status");
  status.className = "read-status";
  let port;
  try { port = await requestPort(); } catch { return; }   // пользователь закрыл окно выбора
  await stopBackground();
  state.busy = true;
  $("#btn-read").disabled = true;
  status.textContent = t("read.asking");
  const conn = new LampConnection(port);
  try {
    await conn.open();
    const res = await conn.hello(8000);
    const upToDate = applyDeviceInfo(res);
    status.classList.add("ok");
    status.textContent = t("read.ok", { fw: res.info.fw }) +
      (state.manifest && !upToDate ? t("read.newer", { v: state.manifest.version }) : ".");
  } catch (e) {
    status.classList.add("err");
    status.textContent = friendlyError(e, "read");
  } finally {
    await conn.close();
    state.busy = false;
    $("#btn-read").disabled = false;
  }
}

/* ─── Прошивка ──────────────────────────────────────────────────── */
async function loadManifest() {
  const info = $("#fw-info");
  try {
    const res = await fetch("firmware/manifest.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    state.manifest = await res.json();
    renderFwInfo();
  } catch {
    state.manifest = null;
    renderFwInfo();
    const flashRadio = $('input[name="action"][value="flash"]');
    flashRadio.disabled = true;
    flashRadio.closest(".choice").style.opacity = ".5";
    setAction("settings");
  }
}

function renderFwInfo() {
  const m = state.manifest;
  if (m === undefined) { $("#fw-info").textContent = t("fw.checking"); return; }
  if (!m) { $("#fw-info").textContent = t("fw.missing"); $("#footer-fw").textContent = ""; return; }
  const date = m.date ? t("fw.date", { d: new Date(m.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-GB") }) : "";
  $("#fw-info").textContent = t("fw.will", { v: m.version, date });
  $("#footer-fw").textContent = t("footer.fw", { v: m.version }) + (m.build ? t("footer.build", { b: m.build }) : "");
}

async function fetchFirmwareParts() {
  const parts = [];
  for (const p of state.manifest.parts) {
    const res = await fetch(`firmware/${p.path}`, { cache: "no-cache" });
    if (!res.ok) throw friendly(t("err.download", { file: p.path }));
    parts.push({ address: p.offset, data: new Uint8Array(await res.arrayBuffer()) });
  }
  return parts;
}

/* ─── Проверка формы ────────────────────────────────────────────── */
function utf8Len(s) { return new TextEncoder().encode(s).length; }

function validate() {
  const errs = [];
  const ssid = $("#ssid").value;
  const pass = $("#pass").value;
  const hasDeviceWifi = !!state.device?.ssid;
  if (!ssid && !hasDeviceWifi) errs.push(t("val.ssidReq"));
  if (!ssid && pass) errs.push(t("val.passNoSsid"));
  if (ssid && utf8Len(ssid) > 32) errs.push(t("val.ssidLong"));
  if (ssid && pass && pass.length < 8) errs.push(t("val.passShort"));
  if (pass && utf8Len(pass) > 64) errs.push(t("val.passLong"));
  if (!currentCode()) errs.push(t("val.code"));
  if (currentAction() === "flash" && !state.manifest) errs.push(t("val.noFw"));
  const box = $("#form-errors");
  box.hidden = !errs.length;
  box.innerHTML = errs.length ? `<ul>${errs.map((e) => `<li>${e}</li>`).join("")}</ul>` : "";
  return errs.length === 0;
}

function buildCommands() {
  const cmds = [
    ["effects", state.effects ? "1" : "0"],
    ["leds", String(state.leds)],
    ...TRIGGER_SLOTS.map((_, i) => [`s${i + 1}`, String(state.slots[i])]),
  ];
  const ssid = $("#ssid").value;
  if (ssid) {
    cmds.push(["ssid", ssid]);
    cmds.push(["pass", $("#pass").value]);
  }
  const code = currentCode();
  if (code && code !== state.device?.code) cmds.push(["code", code]);
  return cmds;
}

/* ─── Прогресс ──────────────────────────────────────────────────── */
let stageKeys = [];
function setupStages(keys) {
  stageKeys = keys;
  $("#stages").innerHTML = keys.map((k) => `<li data-stage="${k}">${t("stage." + k)}</li>`).join("");
  $("#progress").hidden = false;
  setBar(0);
}
function setStage(key, text) {
  const idx = stageKeys.indexOf(key);
  $$("#stages li").forEach((li, i) => {
    li.classList.toggle("done", i < idx || (key === "done" && i === idx));
    li.classList.toggle("active", i === idx && key !== "done");
    li.classList.remove("failed");
  });
  if (text !== undefined) $("#progress-text").textContent = text;
  if (key === "done") setBar(100);
}
function failStage() {
  const li = $("#stages li.active");
  if (li) { li.classList.remove("active"); li.classList.add("failed"); }
}
function setBar(pct) { $("#bar-fill").style.width = `${Math.max(0, Math.min(100, pct))}%`; }

const friendly = (text) => Object.assign(new Error(text), { friendly: true });

function friendlyError(e, where) {
  const msg = String(e?.message || e);
  log(`[error] ${msg}`);
  if (e?.friendly) return msg;
  if (e?.name === "NotFoundError") return t("err.noPort");
  if (/Failed to open|already open|Access denied|NetworkError.*open/i.test(msg)) return t("err.portBusy");
  if (msg === "no-hello") return where === "read" || where === "settings" ? t("err.noHelloSettings") : t("err.noHelloFlash");
  if (/Failed to connect|Timeout|timed out|sync/i.test(msg)) return t("err.connect");
  return t("err.generic", { msg });
}

/* ─── Главная кнопка ────────────────────────────────────────────── */
function updateInstallLabel() {
  $("#btn-install-label").textContent = t(currentAction() === "flash" ? "btn.flash" : "btn.settings");
}

let repickResolver = null;
$("#btn-repick").addEventListener("click", async () => {
  try {
    const p = await requestPort();
    $("#btn-repick").hidden = true;
    repickResolver?.(p);
  } catch { /* закрыли окно */ }
});
function waitRepick(text) {
  $("#progress-text").textContent = text;
  $("#btn-repick").hidden = false;
  return new Promise((r) => (repickResolver = r));
}

async function install() {
  if (state.busy) return;
  if (!validate()) { $("#form-errors").scrollIntoView({ behavior: "smooth", block: "center" }); return; }

  const action = currentAction();
  const erase = $("#erase-all").checked;
  let port;
  try { port = await requestPort(); } catch { return; }   // окно выбора закрыто
  await stopBackground();

  state.busy = true;
  $("#btn-install").disabled = true;
  $("#btn-read").disabled = true;
  $("#install-error").hidden = true;
  $("#btn-repick").hidden = true;
  setupStages(action === "flash" ? ["connect", "flash", "restart", "settings", "done"] : ["connect", "settings", "done"]);

  let conn = null;
  let stage = "connect";
  try {
    if (action === "flash") {
      setStage("connect", t("p.prepare"));
      const partsPromise = fetchFirmwareParts();
      const transport = new Transport(port, true);
      const loader = new ESPLoader({
        transport,
        baudrate: 921600,
        romBaudrate: 115200,
        terminal: { clean() {}, writeLine: (d) => log(d), write: (d) => log(d) },
      });
      const chip = await loader.main();
      log(`Chip: ${chip}`);
      if (!/ESP32-C3/i.test(chip)) {
        await transport.disconnect();
        throw friendly(t("err.notC3", { chip }));
      }
      const parts = await partsPromise;

      stage = "flash";
      setStage("flash", erase ? t("p.erase") : t("p.flashing", { p: 0 }));
      const sizes = parts.map((p) => p.data.length);
      const totalBytes = sizes.reduce((a, b) => a + b, 0);
      await loader.writeFlash({
        fileArray: parts,
        flashMode: "keep",
        flashFreq: "keep",
        flashSize: "keep",
        eraseAll: erase,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          const before = sizes.slice(0, fileIndex).reduce((a, b) => a + b, 0);
          const pct = ((before + (written / total) * sizes[fileIndex]) / totalBytes) * 100;
          setBar(pct * 0.8);
          $("#progress-text").textContent = t("p.flashing", { p: Math.floor(pct) });
        },
      });

      stage = "restart";
      setStage("restart", t("p.restart"));
      setBar(82);
      await loader.after("hard_reset");
      await transport.disconnect();
      await sleep(1500);
      conn = await reopenLamp(port, 12000);
      if (!conn) {
        port = await waitRepick(t("p.repick"));
        conn = new LampConnection(port);
        await conn.open();
      }
    } else {
      setStage("connect", t("p.connect"));
      conn = new LampConnection(port);
      await conn.open();
    }

    stage = "settings";
    setStage("settings", t("p.wake"));
    setBar(action === "flash" ? 85 : 20);
    const hello = await conn.hello(action === "flash" ? 25000 : 10000);
    state.deviceFx = hello.fx;

    const cmds = buildCommands();
    for (let i = 0; i < cmds.length; i++) {
      const [key, value] = cmds[i];
      $("#progress-text").textContent = t("p.sending");
      const reply = conn.waitLine((l) => l.startsWith(`$OK ${key}`) || l.startsWith(`$ERR ${key}`), 5000);
      await conn.send(`$SET ${key} ${encodeURIComponent(value)}`);
      const line = await reply;
      if (line.startsWith("$ERR")) {
        const reason = line.split(" ")[2] || "";
        throw friendly(key === "code" && reason === "not-allowed"
          ? t("err.codeRejected")
          : t("err.setRejected", { key, reason: reason || "error" }));
      }
      setBar((action === "flash" ? 85 : 20) + ((i + 1) / cmds.length) * (action === "flash" ? 8 : 50));
    }
    $("#progress-text").textContent = t(cmds.some(([k]) => k === "code") ? "p.savingCode" : "p.saving");
    const saved = conn.waitLine((l) => l.startsWith("$SAVED"), 30000);
    await conn.send("$SAVE");
    await saved;

    // Запоминаем, что теперь на лампе
    state.device = {
      ...(state.device || {}),
      fw: hello.info.fw,
      code: currentCode(),
      ssid: $("#ssid").value || state.device?.ssid || hello.info.ssid,
    };
    if (codeAllowed(state.device.code)) {
      $("#codemode-keep-wrap").hidden = false;
      $("#code-keep-display").textContent = fmtCode(state.device.code);
    }
    setStage("done", t("p.done"));
    onInstalled(conn, port);
    conn = null;   // дальше соединением владеет onInstalled
  } catch (e) {
    failStage();
    const err = $("#install-error");
    err.hidden = false;
    err.innerHTML = `<p>${escapeHtml(friendlyError(e, stage))}</p>`;
    $("#progress-text").textContent = "";
  } finally {
    if (conn) await conn.close();
    state.busy = false;
    $("#btn-install").disabled = false;
    $("#btn-read").disabled = false;
    $("#btn-repick").hidden = true;
  }
}

// Строка состояния на шаге 6 (запоминаем ключ, чтобы перевести при смене языка)
function setHomeStatus(key, vars = {}, ok = false) {
  state.homeStatus = { key, vars, ok };
  const el = $("#wifi-status");
  el.hidden = false;
  el.className = "status-line" + (ok ? " ok" : "");
  el.innerHTML = t(key, vars);
}

// После сохранения: ждём, пока лампа перезагрузится и подключится к Wi‑Fi
async function onInstalled(conn, port) {
  state.installed = true;
  $("#home-hint").textContent = t("s6.ready");
  setHomeStatus("wifi.waiting");
  renderFinalCode();
  renderTilesSummary();
  setTimeout(() => $("#step-home").scrollIntoView({ behavior: "smooth", block: "start" }), 600);

  const deadline = Date.now() + 45000;
  let wifiOk = false;
  const watch = (c) => {
    state.bgConn = c;
    c.listeners.add((line) => {
      const m = line.match(/^\$WIFI ok ip=(\S+)/);
      if (m) { wifiOk = true; setHomeStatus("wifi.ok", { ip: escapeHtml(m[1]) }, true); }
      if (/^\$PAIRED 1/.test(line)) setHomeStatus("wifi.paired", {}, true);
    });
  };
  watch(conn);
  // Лампа перезагрузится. Если USB‑порт переподключится, найдём его снова.
  while (Date.now() < deadline && !wifiOk && state.bgConn === conn) {
    await sleep(500);
    if (conn.lost && state.bgConn === conn) {
      await conn.close();
      state.bgConn = null;
      conn = await reopenLamp(port, Math.max(1000, deadline - Date.now()));
      if (!conn) return setHomeStatus("wifi.unknown");
      if (state.busy) { await conn.close(); return; }   // пользователь уже начал что-то новое
      watch(conn);
    }
  }
  if (state.bgConn !== conn) return;                       // соединение забрала новая операция
  if (!wifiOk) setHomeStatus("wifi.unknown");
  // Ещё пару минут слушаем лампу, чтобы поймать успешное добавление в «Дом»
  if (wifiOk) await sleep(120000);
  if (state.bgConn === conn) await stopBackground();
}

/* ─── Перевод страницы ──────────────────────────────────────────── */
function applyLang(next) {
  lang = next;
  try { localStorage.setItem("lamp-lang", lang); } catch { /* нет доступа */ }
  document.documentElement.lang = lang;
  document.title = t("meta.title");
  $('meta[name="description"]').setAttribute("content", t("meta.desc"));
  $$("[data-i18n]").forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
  $$("[data-i18n-attr]").forEach((el) => {
    for (const pair of el.dataset.i18nAttr.split(";")) {
      const [attr, key] = pair.split(":");
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    }
  });
  $$(".lang-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));

  // Динамические части
  const passShown = $("#pass").type === "text";
  $("#btn-showpass").textContent = t(passShown ? "wifi.hide" : "wifi.show");
  if (state.device?.ssid) $("#ssid").placeholder = state.device.ssid;
  $("#home-hint").textContent = t(state.installed ? "s6.ready" : "s6.hint");
  if (state.homeStatus) setHomeStatus(state.homeStatus.key, state.homeStatus.vars, state.homeStatus.ok);
  $$("#stages li").forEach((li) => { li.textContent = t("stage." + li.dataset.stage); });
  if (state.ownCode) validateOwnCode();
  $("#btn-fx-toggle span").textContent = t($("#effects-body").classList.contains("closed") ? "fx.expand" : "fx.collapse");
  renderFwInfo();
  renderSlots();
  renderTilesSummary();
  renderFinalCode();
  updateInstallLabel();
  if (!$("#form-errors").hidden) validate();
}

/* ─── Запуск ────────────────────────────────────────────────────── */
function init() {
  if (!("serial" in navigator)) {
    $("#browser-warning").hidden = false;
    $("#btn-install").disabled = true;
    $("#btn-read").disabled = true;
  }

  $$(".lang-switch button").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  $$('input[name="mode"]').forEach((r) => r.addEventListener("change", () => setEffects(r.value === "1")));
  $("#btn-enable-fx").addEventListener("click", () => setEffects(true));
  $("#btn-fx-toggle").addEventListener("click", () => setEffectsOpen($("#effects-body").classList.contains("closed")));
  $("#leds-num").addEventListener("input", (e) => { if (e.target.value !== "") setLeds(e.target.value); });
  $("#leds-num").addEventListener("blur", (e) => { e.target.value = state.leds; });

  $("#btn-showpass").addEventListener("click", (e) => {
    const p = $("#pass");
    const show = p.type === "password";
    p.type = show ? "text" : "password";
    e.currentTarget.textContent = t(show ? "wifi.hide" : "wifi.show");
    e.currentTarget.setAttribute("aria-pressed", String(show));
  });

  state.randomCode = generateCode();
  $$('input[name="codemode"]').forEach((r) => r.addEventListener("change", () => setCodeMode(r.value)));
  $("#btn-regen").addEventListener("click", () => { state.randomCode = generateCode(); renderFinalCode(); });
  $("#code-input").addEventListener("input", validateOwnCode);

  $$('input[name="action"]').forEach((r) => r.addEventListener("change", updateInstallLabel));
  $("#btn-install").addEventListener("click", install);
  $("#btn-read").addEventListener("click", readFromLamp);

  window.addEventListener("beforeunload", (e) => { if (state.busy) { e.preventDefault(); e.returnValue = ""; } });

  // Декоративные анимации работают только когда их видно
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.classList.toggle("offscreen", !e.isIntersecting);
    });
    $$(".hero-photo, #btn-install").forEach((el) => io.observe(el));
  }

  $$(".shot img").forEach(watchShot);
  watchShot($(".hero-photo img"));
  setLeds(DEFAULT_LEDS);
  setEffects(true);
  setCodeMode("random");
  applyLang(lang);
  loadManifest();
  wakePreviews();
}

init();
