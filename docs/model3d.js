/* ═══════════════════════════════════════════════════════════════════
   3D‑МОДЕЛЬ КОРПУСА (раздел «Сборка»)
   three.js загружается только когда раздел открывают.
   Файлы: docs/models/*.stl и lamp-mini-v2.3mf
   ═══════════════════════════════════════════════════════════════════ */

const MODEL_DIR = "models/";
const PROJECT_3MF = "lamp-mini-v2.3mf";
const MAKERWORLD = "https://makerworld.com/{lang}/models/1985869-desktop-lamp#profileId-2136771";

// Детали. dz — подъём в собранной лампе (мм, по оси Z из STL),
// explode — насколько деталь отъезжает вверх в режиме «Разобрать».
// Основание и рассеиватель в STL уже стоят на своей высоте; крышка и кольцо
// напечатаны «лёжа», поэтому их поднимаем: крышка садится выступом в рассеиватель,
// кольцо вкладывается в паз на крышке.
export const PARTS = [
  { id: "base",     file: "base.stl",     dims: [70, 70, 15],  color: 0x2b2a2c, rough: 0.55, dz: 0,     explode: 0 },
  { id: "diffuser", file: "diffuser.stl", dims: [70, 70, 112], color: 0xf4f1ec, rough: 0.75, dz: 0,     explode: 22 },
  { id: "cup",      file: "cup.stl",      dims: [70, 70, 4.5], color: 0xf7f5f1, rough: 0.6,  dz: 117.5, explode: 52 },
  { id: "deco",     file: "deco.stl",     dims: [30, 30, 1],   color: 0xe8771e, rough: 0.45, dz: 123.5, explode: 66 },
];

export function createModelViewer({ t, $, $$, escapeHtml, getLang }) {
  const box = $("#model-box");
  let viewer = null;         // загружается при первом открытии
  let loading = null;
  let state = { part: "all", exploded: false, light: false };

  function fmtNum(n) { return n.toLocaleString(getLang() === "ru" ? "ru-RU" : "en-US"); }

  function renderSide() {
    const lang = getLang();
    $("#model-parts").innerHTML = [
      `<li><button type="button" class="part-item${state.part === "all" ? " is-active" : ""}" data-part="all" aria-pressed="${state.part === "all"}">
        <span class="part-swatch part-swatch-all" aria-hidden="true"></span>
        <span class="part-name"><b>${t("m.all")}</b><small>${t("m.allSub")}</small></span></button></li>`,
      ...PARTS.map((p) => `<li class="part-row">
        <button type="button" class="part-item${state.part === p.id ? " is-active" : ""}" data-part="${p.id}" aria-pressed="${state.part === p.id}">
          <span class="part-swatch" style="background:#${p.color.toString(16).padStart(6, "0")}" aria-hidden="true"></span>
          <span class="part-name"><b>${t("m.part." + p.id)}</b><small>${t("m.dims", { x: fmtNum(p.dims[0]), y: fmtNum(p.dims[1]), z: fmtNum(p.dims[2]) })}</small></span>
        </button>
        <a class="part-dl" href="${MODEL_DIR}${p.file}" download="${p.file}" aria-label="${escapeHtml(t("m.downloadPart", { name: t("m.part." + p.id) }))}">STL ↓</a>
      </li>`),
    ].join("");
    $$("#model-parts .part-item").forEach((b) => b.addEventListener("click", () => selectPart(b.dataset.part)));

    $("#model-3mf").href = MODEL_DIR + PROJECT_3MF;
    $("#model-mw").href = MAKERWORLD.replace("{lang}", lang === "ru" ? "ru" : "en");
    updateToolbar();
  }

  function updateToolbar() {
    const ex = $("#m-explode"), li = $("#m-light");
    ex.textContent = t(state.exploded ? "m.assemble" : "m.explode");
    ex.setAttribute("aria-pressed", String(state.exploded));
    ex.disabled = state.part !== "all";
    li.textContent = t(state.light ? "m.lightOff" : "m.lightOn");
    li.setAttribute("aria-pressed", String(state.light));
    $(".model-viewer").classList.toggle("is-lit", state.light);
  }

  function selectPart(id) {
    state.part = id;
    if (id !== "all") state.exploded = false;
    renderSide();
    viewer?.showPart(id);
  }

  async function ensureViewer() {
    if (viewer || loading) return loading;
    $("#model-loading").hidden = false;
    $("#model-loading").textContent = t("m.loading");
    loading = (async () => {
      try {
        const THREE = await import("./vendor/three-viewer-0.186.1.min.js");
        viewer = await buildViewer(THREE, $("#model-canvas"));
        $("#model-loading").hidden = true;
        viewer.showPart(state.part, true);
        viewer.setExploded(state.exploded, true);
        viewer.setLight(state.light, true);
      } catch (e) {
        console.error(e);
        $("#model-loading").textContent = t("m.error");
        $("#model-loading").classList.add("is-error");
      }
    })();
    return loading;
  }

  box.addEventListener("toggle", () => { if (box.open) ensureViewer(); });
  $("#m-explode").addEventListener("click", () => {
    state.exploded = !state.exploded; updateToolbar(); viewer?.setExploded(state.exploded);
  });
  $("#m-light").addEventListener("click", () => {
    state.light = !state.light; updateToolbar(); viewer?.setLight(state.light);
  });
  $("#m-reset").addEventListener("click", () => viewer?.resetView());

  return { render: renderSide };
}

/* ─── Сцена three.js ───────────────────────────────────────────── */
async function buildViewer(THREE, canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 1, 5000);

  // Свет: мягкий общий + тёплый ключевой + холодный контровой
  scene.add(new THREE.HemisphereLight(0xfff6ea, 0x3a2a20, 1.4));
  const key = new THREE.DirectionalLight(0xfff0dc, 2.2);
  key.position.set(150, 260, 200);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xdfe8ff, 0.9);
  rim.position.set(-220, 120, -180);
  scene.add(rim);
  // «Лампочка» внутри рассеивателя (включается кнопкой)
  const bulb = new THREE.PointLight(0xffc27a, 0, 260, 1.6);
  bulb.position.set(0, 60, 0);
  scene.add(bulb);

  // STL в мм, ось Z вверх → поворачиваем группу, чтобы вверх смотрела ось Y three.js
  const lamp = new THREE.Group();
  lamp.rotation.x = -Math.PI / 2;
  scene.add(lamp);

  // Мягкая тень-пятно под лампой
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(60, 48),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.12, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.2;
  scene.add(shadow);

  const loader = new THREE.STLLoader();
  const meshes = {};
  await Promise.all(PARTS.map(async (p) => {
    let geo = await loader.loadAsync(MODEL_DIR + p.file);
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    // По X/Y ставим деталь в центр (на столе принтера они разложены в разных местах)
    geo.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, 0);
    geo = THREE.toCreasedNormals(geo, THREE.MathUtils.degToRad(30));   // гладкие цилиндры, острые кромки
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: p.rough, metalness: 0 });
    if (p.id === "diffuser") { mat.emissive = new THREE.Color(0xffb766); mat.emissiveIntensity = 0; }
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.z = p.dz;
    mesh.userData = { part: p, offset: 0 };
    meshes[p.id] = mesh;
    lamp.add(mesh);
  }));

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.minDistance = 60;
  controls.maxDistance = 900;
  controls.maxPolarAngle = Math.PI * 0.62;   // не заглядываем сильно снизу

  // Рисуем только когда что-то меняется
  let frame = 0;
  const render = () => { frame = 0; renderer.render(scene, camera); };
  const requestRender = () => { if (!frame) frame = requestAnimationFrame(render); };
  controls.addEventListener("change", requestRender);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    requestRender();
  }
  new ResizeObserver(resize).observe(canvas);

  // Плавные анимации
  function animate(duration, step) {
    return new Promise((done) => {
      const t0 = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / duration);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // easeInOutCubic
        step(e);
        renderer.render(scene, camera);
        if (k < 1) requestAnimationFrame(tick); else done();
      };
      requestAnimationFrame(tick);
    });
  }

  function frameObjects(instant) {
    scene.updateMatrixWorld(true);          // положение деталей после поворота и сдвигов
    const box3 = new THREE.Box3();
    Object.values(meshes).forEach((m) => { if (m.visible) box3.expandByObject(m); });
    const size = box3.getSize(new THREE.Vector3());
    const center = box3.getCenter(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z) * 0.74 + 8;
    // Тень по размеру того, что показано
    const footprint = Math.max(size.x, size.z) / 2;
    shadow.scale.setScalar(Math.max(0.3, (footprint * 1.45) / 60));
    const dist = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
    const dir = new THREE.Vector3(0.9, 0.55, 1.15).normalize();
    const fromPos = camera.position.clone(), fromTarget = controls.target.clone();
    const toPos = center.clone().add(dir.multiplyScalar(dist)), toTarget = center;
    if (instant || fromPos.lengthSq() === 0) {
      camera.position.copy(toPos); controls.target.copy(toTarget); controls.update(); requestRender();
      return Promise.resolve();
    }
    return animate(550, (e) => {
      camera.position.lerpVectors(fromPos, toPos, e);
      controls.target.lerpVectors(fromTarget, toTarget, e);
      controls.update();
    });
  }

  let current = "all";
  let exploded = false;
  function applyOffsets(e, from, to) {
    for (const m of Object.values(meshes)) {
      const p = m.userData.part;
      const a = from ? p.explode : 0, b = to ? p.explode : 0;
      m.position.z = p.dz + a + (b - a) * e;
    }
  }

  return {
    showPart(id, instant) {
      current = id;
      for (const [pid, m] of Object.entries(meshes)) m.visible = id === "all" || id === pid;
      if (id !== "all" && exploded) { exploded = false; applyOffsets(1, false, false); }
      shadow.visible = true;
      // Отдельную деталь ставим на «стол»
      lamp.position.y = 0;
      if (id !== "all") {
        lamp.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(meshes[id]);
        lamp.position.y = -bb.min.y;
      }
      bulb.position.y = 60 + lamp.position.y;
      frameObjects(instant);
    },
    setExploded(on, instant) {
      if (current !== "all" || on === exploded) return;
      const from = exploded;
      exploded = on;
      if (instant) { applyOffsets(1, from, on); frameObjects(true); return; }
      animate(650, (e) => applyOffsets(e, from, on)).then(() => frameObjects(false));
    },
    setLight(on, instant) {
      const m = meshes.diffuser.material;
      const from = m.emissiveIntensity, to = on ? 0.55 : 0;
      const bFrom = bulb.intensity, bTo = on ? 9000 : 0;
      if (instant) { m.emissiveIntensity = to; bulb.intensity = bTo; requestRender(); return; }
      animate(450, (e) => { m.emissiveIntensity = from + (to - from) * e; bulb.intensity = bFrom + (bTo - bFrom) * e; });
    },
    resetView() { frameObjects(false); },
  };
}
