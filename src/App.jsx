import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createTimeline, stagger } from "animejs";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import * as THREE from "three";
import { bodySystems } from "./data/bodySystems.js";
import { patientUnits } from "./data/patientUnits.js";

const MAP_WIDTH = 2400;
const MAP_HEIGHT = 1350;
const BODY_PLOT_STORAGE_KEY = "body-system-node-plot-v9";
const PATIENT_PLOT_STORAGE_KEY = "patient-unit-node-plot-v1";
const PATIENT_MAP_IMAGE = "/assets/patient-units-asclepius-clinical-light.png";
const PATIENT_STATIC_BACKGROUND = "/assets/patient-units-anatomy-caduceus.png";

/** Shared atlas motion language — keep CSS vars in sync with these. */
const MOTION = {
  ease: [0.16, 1, 0.3, 1],
  micro: 0.32,
  panel: 0.52,
  layer: 0.78,
  zoom: 1.1,
  zoomMs: 1100,
  cardStagger: 0.04,
  imageCrossfade: 0.48
};

const systemThemes = {
  CV: { color: "#ff5f6d", rgb: "255, 95, 109" },
  RS: { color: "#48b8ff", rgb: "72, 184, 255" },
  GI: { color: "#77f0a3", rgb: "119, 240, 163" },
  NPH: { color: "#3eeeff", rgb: "62, 238, 255" },
  HM: { color: "#b56cff", rgb: "181, 108, 255" },
  IF: { color: "#ffd34f", rgb: "255, 211, 79" },
  NE: { color: "#c16dff", rgb: "193, 109, 255" },
  EN: { color: "#ff9a45", rgb: "255, 154, 69" },
  MK: { color: "#42e6ff", rgb: "66, 230, 255" },
  SK: { color: "#ff5faf", rgb: "255, 95, 175" },
  CA: { color: "#ff6f9e", rgb: "255, 111, 158" },
  GN: { color: "#ff58c8", rgb: "255, 88, 200" }
};

const systemNodes = [
  { id: "CV", index: "01", x: 1584, y: 478, anchorX: 1214, anchorY: 617, lineX: 1399, lineY: 548, zoom: 3, focusX: 0.5, focusY: 0.5, region: "Chest / Heart / Vessels" },
  { id: "RS", index: "02", x: 810, y: 600, anchorX: 1148, anchorY: 596, lineX: 979, lineY: 598, zoom: 2.85, focusX: 0.5, focusY: 0.48, region: "Chest / Lungs / Airways" },
  { id: "GI", index: "03", x: 1588, y: 722, anchorX: 1246, anchorY: 778, lineX: 1417, lineY: 750, zoom: 2.75, focusX: 0.5, focusY: 0.53, region: "Abdomen / Digestive Tract" },
  { id: "NPH", index: "04", x: 1562, y: 850, anchorX: 1230, anchorY: 878, lineX: 1396, lineY: 864, zoom: 3, focusX: 0.51, focusY: 0.53, region: "Flanks / Kidneys / Urinary" },
  { id: "HM", index: "05", x: 808, y: 722, anchorX: 1047, anchorY: 646, lineX: 928, lineY: 684, zoom: 2.55, focusX: 0.46, focusY: 0.5, region: "Blood / Marrow / Circulation" },
  { id: "IF", index: "06", x: 1592, y: 600, anchorX: 1282, anchorY: 618, lineX: 1437, lineY: 609, zoom: 2.45, focusX: 0.54, focusY: 0.5, region: "Immune System / Infection Sites" },
  { id: "NE", index: "07", x: 902, y: 354, anchorX: 1182, anchorY: 353, lineX: 1042, lineY: 354, zoom: 3, focusX: 0.5, focusY: 0.43, region: "Head / Brain / CNS" },
  { id: "EN", index: "08", x: 836, y: 478, anchorX: 1183, anchorY: 485, lineX: 1010, lineY: 482, zoom: 2.82, focusX: 0.49, focusY: 0.5, region: "Endocrine Glands" },
  { id: "MK", index: "09", x: 852, y: 982, anchorX: 1118, anchorY: 911, lineX: 1009, lineY: 943, zoom: 2.35, focusX: 0.5, focusY: 0.61, region: "Bones / Spine / Muscles" },
  { id: "SK", index: "10", x: 828, y: 850, anchorX: 1001, anchorY: 760, lineX: 915, lineY: 805, zoom: 2.22, focusX: 0.43, focusY: 0.51, region: "Skin / Surface Layer" },
  { id: "CA", index: "11", x: 1500, y: 354, anchorX: 1219, anchorY: 353, lineX: 1360, lineY: 354, zoom: 2.55, focusX: 0.55, focusY: 0.53, region: "Cancer Patterns / Organ Targets" },
  { id: "GN", index: "12", x: 1541, y: 979, anchorX: 1201, anchorY: 911, lineX: 1351, lineY: 943, zoom: 3, focusX: 0.5, focusY: 0.64, region: "Pelvis / Gynecology" }
].map((node) => ({
  ...node,
  theme: systemThemes[node.id],
  atlasTotal: "12",
  layerLabel: "Layer 03",
  detailLayerLabel: "Layer 04",
  system: bodySystems.find((system) => system.id === node.id)
}));

const patientUnitThemes = {
  MB: { color: "#8b6ad4", rgb: "139, 106, 212" },
  PD: { color: "#3a9fc8", rgb: "58, 159, 200" },
  MS: { color: "#2fa8a0", rgb: "47, 168, 160" },
  CC: { color: "#d98a4a", rgb: "217, 138, 74" },
  ER: { color: "#d8656c", rgb: "216, 101, 108" },
  MH: { color: "#4fb574", rgb: "79, 181, 116" },
  NS: { color: "#526477", rgb: "82, 100, 119" }
};

const patientUnitNodes = [
  { id: "MB", x: 868, y: 224, anchorX: 703, anchorY: 519, lineX: 751, lineY: 322, zoom: 2.38, focusX: 0.48, focusY: 0.42, region: "Maternal / Neonatal Continuum" },
  { id: "PD", x: 703, y: 522, anchorX: 759, anchorY: 835, lineX: 682, lineY: 708, zoom: 2.28, focusX: 0.46, focusY: 0.48, region: "Growth / Development / Child Health" },
  { id: "MS", x: 760, y: 835, anchorX: 1027, anchorY: 1067, lineX: 896, lineY: 1037, zoom: 2.24, focusX: 0.48, focusY: 0.54, region: "Ward Skills / Medical-Surgical Care" },
  { id: "CC", x: 1474, y: 183, anchorX: 1682, anchorY: 453, lineX: 1634, lineY: 296, zoom: 2.5, focusX: 0.54, focusY: 0.42, region: "ICU / Hemodynamics / Perioperative" },
  { id: "ER", x: 1681, y: 453, anchorX: 1692, anchorY: 713, lineX: 1715, lineY: 612, zoom: 2.34, focusX: 0.55, focusY: 0.48, region: "Emergency / Triage / Resuscitation" },
  { id: "MH", x: 1690, y: 715, anchorX: 1478, anchorY: 1022, lineX: 1588, lineY: 954, zoom: 2.26, focusX: 0.54, focusY: 0.54, region: "Psych Ward / Therapeutic Care" },
  { id: "NS", x: 1478, y: 1015, anchorX: 1029, anchorY: 1071, lineX: 1263, lineY: 1153, zoom: 2.18, focusX: 0.5, focusY: 0.58, region: "Nurse Station / Priorities / Leadership" }
].map((node) => ({
  ...node,
  index: patientUnits.find((unit) => unit.id === node.id)?.index,
  theme: patientUnitThemes[node.id],
  atlasTotal: "19",
  layerLabel: "Layer 02",
  detailLayerLabel: "Layer 03",
  readoutLabel: "Unit Atlas",
  system: patientUnits.find((unit) => unit.id === node.id)
}));

const bodyIntroNode = {
  id: "INTRO",
  isIntro: true,
  index: "00",
  region: "Full Body Systems Overview",
  zoom: 1,
  focusX: 0.5,
  focusY: 0.5,
  system: {
    id: "INTRO",
    title: "Body Systems",
    image: "/assets/anatomy-scroll-background.png",
    topics: systemNodes.map((node) => ({ id: node.id, title: `${node.index} ${node.system.title}` }))
  }
};

const patientIntroNode = {
  id: "PUINTRO",
  isIntro: true,
  index: "00",
  region: "Patient Unit Clinical Atlas",
  zoom: 1,
  focusX: 0.5,
  focusY: 0.5,
  theme: { color: "#dce7ff", rgb: "220, 231, 255" },
  system: {
    id: "PUINTRO",
    title: "Patient Units",
    image: PATIENT_MAP_IMAGE,
    topics: patientUnitNodes.map((node) => ({ id: node.id, title: `${node.index} ${node.system.title}` }))
  }
};

const bodyAtlasNodes = [bodyIntroNode, ...systemNodes];
const patientAtlasNodes = [patientIntroNode, ...patientUnitNodes];

/** Core systems pulled forward on the Body Systems intro (Urinary = NPH). */
const BODY_CORE_DEPTH_IDS = new Set(["CV", "RS", "GI", "NPH", "HM", "IF", "NE"]);

function getBodyIntroDepthTier(nodeId, depthMode) {
  const isCore = BODY_CORE_DEPTH_IDS.has(nodeId);
  const coreIsFront = depthMode !== "support";
  return (coreIsFront ? isCore : !isCore) ? "front" : "back";
}

const atlasConfigs = {
  body: {
    label: "Body Systems",
    tone: "sun",
    title: "Body Systems",
    nodes: bodyAtlasNodes,
    backgroundImage: "/assets/anatomy-scroll-background.png",
    backgroundAlt: "Full human body systems anatomical overview"
  },
  patient: {
    label: "Patient Units",
    tone: "unit",
    title: "Patient Units",
    nodes: patientAtlasNodes,
    // Temporarily disabled during tab-switch fade (rod / hospital map was flashing through).
    // backgroundImage: PATIENT_MAP_IMAGE,
    backgroundImage: null,
    backgroundAlt: "Rod of Asclepius patient unit atlas overview"
  }
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function interpolate(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function getOverviewCamera(width, height) {
  const isMobile = width < 760;
  const scale = Math.min(width / MAP_WIDTH, height / MAP_HEIGHT) * (isMobile ? 0.95 : 1.08);

  return {
    x: width / 2 - (MAP_WIDTH / 2) * scale,
    y: height / 2 - (MAP_HEIGHT / 2) * scale,
    scale
  };
}

function loadPlotOverrides(storageKey) {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

function applyPlotOverrides(nodes, overrides) {
  return nodes.map((node) => {
    const override = overrides[node.id];
    return override ? { ...node, ...override } : node;
  });
}

function useScrollProgress() {
  const [state, setState] = useState({
    progress: 0,
    viewport: { width: window.innerWidth, height: window.innerHeight }
  });

  useEffect(() => {
    let frame = 0;
    let lastScrollY = -1;
    let lastWidth = -1;
    let lastHeight = -1;

    const measure = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scrollY = window.scrollY;

      if (scrollY !== lastScrollY || width !== lastWidth || height !== lastHeight) {
        lastScrollY = scrollY;
        lastWidth = width;
        lastHeight = height;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setState({
          progress: max > 0 ? clamp(window.scrollY / max, 0, 1) : 0,
          viewport: { width, height }
        });
      }

      frame = window.requestAnimationFrame(measure);
    };

    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return state;
}

function getNodeZoomTarget(node, zoomToMainNode) {
  // Body atlas zooms to the anatomical anchor (tail). Patient units invert:
  // zoom to the main circular unit node itself.
  if (zoomToMainNode && !node.isIntro) {
    return { x: node.x, y: node.y };
  }
  return { x: node.anchorX, y: node.anchorY };
}

function getCamera(progress, width, height, nodes, isPlotMode, plotZoom, zoomToMainNode = false) {
  if (isPlotMode) {
    const overview = getOverviewCamera(width, height);
    return {
      x: width / 2 - (MAP_WIDTH / 2) * overview.scale * plotZoom,
      y: height / 2 - (MAP_HEIGHT / 2) * overview.scale * plotZoom,
      scale: overview.scale * plotZoom
    };
  }

  const maxIndex = nodes.length - 1;
  const scaled = progress * maxIndex;
  const index = clamp(Math.floor(scaled), 0, maxIndex - 1);
  const local = smoothstep(scaled - index);
  const current = nodes[index];
  const next = nodes[index + 1] || current;
  const isMobile = width < 760;
  const overview = getOverviewCamera(width, height);

  if (current.isIntro) {
    const target = next;
    const intro = smoothstep(local);
    const targetScale = isMobile ? target.zoom * 0.72 : target.zoom;
    const zoomPoint = getNodeZoomTarget(target, zoomToMainNode);
    const targetCamera = {
      x: width * (isMobile ? 0.5 : target.focusX) - zoomPoint.x * targetScale,
      y: height * (isMobile ? 0.43 : target.focusY) - zoomPoint.y * targetScale,
      scale: targetScale
    };

    return {
      x: interpolate(overview.x, targetCamera.x, intro),
      y: interpolate(overview.y, targetCamera.y, intro),
      scale: interpolate(overview.scale, targetCamera.scale, intro)
    };
  }

  const currentPoint = getNodeZoomTarget(current, zoomToMainNode);
  const nextPoint = getNodeZoomTarget(next, zoomToMainNode);
  const x = interpolate(currentPoint.x, nextPoint.x, local);
  const y = interpolate(currentPoint.y, nextPoint.y, local);
  const scale = isMobile ? interpolate(current.zoom, next.zoom, local) * 0.72 : interpolate(current.zoom, next.zoom, local);
  const focusX = isMobile ? 0.5 : interpolate(current.focusX, next.focusX, local);
  const focusY = isMobile ? 0.43 : interpolate(current.focusY, next.focusY, local);

  return {
    x: width * focusX - x * scale,
    y: height * focusY - y * scale,
    scale
  };
}

function getActiveIndex(progress, nodes) {
  return clamp(Math.round(progress * (nodes.length - 1)), 0, nodes.length - 1);
}

function getLineControl(node) {
  return {
    x: node.lineX ?? Math.round((node.anchorX + node.x) / 2),
    y: node.lineY ?? Math.round((node.anchorY + node.y) / 2)
  };
}

function getThemeStyle(node) {
  const theme = node.theme || { color: "#78f4ff", rgb: "120, 244, 255" };
  return {
    "--theme": theme.color,
    "--theme-rgb": theme.rgb
  };
}

function getTitlePanelStyle(title = "", region = "") {
  const titleLen = Math.max(String(title).replace(/\s+/g, " ").trim().length, 4);
  const regionLen = Math.max(String(region).replace(/\s+/g, " ").trim().length, 6);
  const titleRem = clamp(48 / titleLen, 1.7, 3.6);
  const regionRem = clamp(26 / regionLen, 0.58, 0.74);
  const titleTracking = clamp(0.09 - titleLen * 0.0026, 0.015, 0.07);
  const regionTracking = clamp(0.1 - regionLen * 0.0014, 0.03, 0.09);

  return {
    "--title-size": `${titleRem.toFixed(3)}rem`,
    "--region-size": `${regionRem.toFixed(3)}rem`,
    "--title-tracking": `${titleTracking.toFixed(3)}em`,
    "--region-tracking": `${regionTracking.toFixed(3)}em`
  };
}

function fitSubjectTitlePanel(panel, title = "", region = "") {
  if (!panel) return;

  Object.entries(getTitlePanelStyle(title, region)).forEach(([key, value]) => {
    panel.style.setProperty(key, value);
  });

  const panelHeight = panel.clientHeight;
  const panelWidth = panel.clientWidth;
  if (panelHeight < 40 || panelWidth < 20) return;

  const titleLen = Math.max(String(title).replace(/\s+/g, " ").trim().length, 4);
  const regionLen = Math.max(String(region).replace(/\s+/g, " ").trim().length, 6);
  const isVerticalColumn = panelHeight > panelWidth * 1.35;
  const rootPx = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  if (isVerticalColumn) {
    const pad = 28;
    const gaps = 18;
    const indexBudget = 26;
    const usable = Math.max(120, panelHeight - pad - gaps - indexBudget);

    // Keep region readable first, then give remaining height to the title.
    let regionPx = clamp(usable * 0.28 / Math.max(regionLen * 0.58, 1), 9.5, 12);
    let regionSpan = regionLen * regionPx * 0.58;
    if (regionSpan > usable * 0.34) {
      regionPx = (usable * 0.34) / (regionLen * 0.58);
      regionPx = Math.max(regionPx, 9.5);
      regionSpan = regionLen * regionPx * 0.58;
    }

    const titleBudget = Math.max(96, usable - regionSpan - 10);
    let titlePx = titleBudget / (titleLen * 0.62);
    titlePx = Math.min(titlePx, panelWidth * 0.78);
    titlePx = clamp(titlePx, 18, 54);

    panel.style.setProperty("--title-size", `${(titlePx / rootPx).toFixed(3)}rem`);
    panel.style.setProperty("--region-size", `${(regionPx / rootPx).toFixed(3)}rem`);
    return;
  }

  let titlePx = (panelWidth * 0.92) / (titleLen * 0.5);
  titlePx = Math.min(titlePx, panelHeight * 0.46);
  titlePx = clamp(titlePx, 18, 40);

  let regionPx = (panelWidth * 0.94) / (regionLen * 0.46);
  regionPx = clamp(regionPx, 9.5, 12.5);

  panel.style.setProperty("--title-size", `${(titlePx / rootPx).toFixed(3)}rem`);
  panel.style.setProperty("--region-size", `${(regionPx / rootPx).toFixed(3)}rem`);
}

const patientUnitIconSources = {
  MB: "/assets/patient-icons/mb.png",
  PD: "/assets/patient-icons/pd.png",
  MS: "/assets/patient-icons/ms.png",
  CC: "/assets/patient-icons/cc.png",
  ER: "/assets/patient-icons/er.png",
  MH: "/assets/patient-icons/mh.png",
  NS: "/assets/patient-icons/ns.png"
};

function getPatientNodeSide(node) {
  if (Math.abs(node.x - MAP_WIDTH / 2) < 160 && node.y > MAP_HEIGHT * 0.72) return "bottom";
  return node.x < MAP_WIDTH / 2 ? "left" : "right";
}

function PatientUnitNodeIcon({ id }) {
  const src = patientUnitIconSources[id];
  if (!src) return null;
  return <img className="patient-node-icon-image" src={src} alt="" draggable="false" />;
}

function SignalText({ text, as: Element = "span", className = "", delay = 0, step = 22, mode = "type" }) {
  if (mode === "static") {
    return (
      <Element className={`signal-text is-static ${className}`.trim()}>
        {text}
      </Element>
    );
  }

  if (mode === "lite") {
    return (
      <Element
        className={`signal-text is-lite ${className}`.trim()}
        key={text}
        style={{ animationDelay: `${delay}ms` }}
      >
        {text}
      </Element>
    );
  }

  return (
    <Element className={`signal-text ${className}`.trim()} aria-label={text}>
      {text.split("").map((character, index) => (
        <span
          aria-hidden="true"
          key={`${character}-${index}`}
          style={{ "--char-delay": `${delay + index * step}ms` }}
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </Element>
  );
}

function NodePulseGrid() {
  return (
    <span className="node-dot-grid" aria-hidden="true">
      {Array.from({ length: 169 }, (_, index) => (
        <span className="node-dot" key={index} />
      ))}
    </span>
  );
}

function SubtopicParticleField({ themeRgb = "120, 244, 255" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    const colors = {
      theme: themeRgb,
      warm: "246, 189, 55",
      white: "248, 248, 255"
    };
    let width = 0;
    let height = 0;
    let particles = [];
    let tick = 0;
    let frame = 0;

    const buildParticles = () => {
      const count = Math.floor(Math.min(220, Math.max(96, width / 8)));
      particles = Array.from({ length: count }, (_, index) => {
        const warm = index % 5 === 0;
        const bright = index % 11 === 0;

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.8 + 0.35,
          a: Math.random() * 0.58 + 0.16,
          warm,
          bright
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    const draw = () => {
      tick += 0.008;
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.vx + Math.sin(tick + particle.y * 0.003) * 0.04;
        particle.y += particle.vy + Math.cos(tick + particle.x * 0.002) * 0.015;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        const color = particle.warm ? colors.warm : particle.bright ? colors.white : colors.theme;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${color}, ${particle.a})`;
        ctx.shadowColor = `rgba(${color}, 0.9)`;
        ctx.shadowBlur = particle.warm ? 10 : 8;
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 105 && (a.warm || b.warm || a.bright || b.bright)) {
            const linkColor = a.warm || b.warm ? colors.warm : colors.theme;
            ctx.strokeStyle = `rgba(${linkColor}, ${(0.1 * (1 - distance / 105)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [themeRgb]);

  return <canvas ref={canvasRef} className="subtopic-particle-field" aria-hidden="true" />;
}

function MainTopicDepthField({ themeRgb = "120, 244, 255" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let nodes = [];
    let frame = 0;
    let tick = 0;
    const warmRgb = "246, 189, 55";

    const buildNodes = () => {
      const columns = Math.max(8, Math.floor(width / 150));
      const rows = Math.max(5, Math.floor(height / 150));
      nodes = [];

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          const z = Math.random();
          nodes.push({
            baseX: ((x + 0.5) / columns) * width + (Math.random() - 0.5) * 42,
            baseY: ((y + 0.5) / rows) * height + (Math.random() - 0.5) * 42,
            x: 0,
            y: 0,
            z,
            phase: Math.random() * Math.PI * 2,
            speed: 0.55 + Math.random() * 0.75,
            warm: (x + y) % 5 === 0
          });
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };

    const drawTrace = (y, offset, color, alpha) => {
      ctx.strokeStyle = `rgba(${color}, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = -40; x <= width + 40; x += 18) {
        const pulse = Math.sin((x + offset) * 0.026) * 9 + Math.sin((x + offset) * 0.071) * 3;
        const spike = Math.abs(((x + offset * 2) % 180) - 90) < 7 ? 22 : 0;
        const nextY = y + pulse - spike;
        if (x === -40) ctx.moveTo(x, nextY);
        else ctx.lineTo(x, nextY);
      }
      ctx.stroke();
    };

    const draw = () => {
      tick += 0.012;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.52;

      const gridGradient = ctx.createLinearGradient(0, centerY - height * 0.28, width, centerY + height * 0.28);
      gridGradient.addColorStop(0, `rgba(${themeRgb}, 0)`);
      gridGradient.addColorStop(0.5, `rgba(${themeRgb}, 0.115)`);
      gridGradient.addColorStop(1, `rgba(${warmRgb}, 0)`);
      ctx.strokeStyle = gridGradient;
      ctx.lineWidth = 1;

      for (let i = -7; i <= 7; i += 1) {
        const y = centerY + i * 36;
        const perspective = 1 - Math.abs(i) * 0.035;
        ctx.beginPath();
        ctx.moveTo(centerX - width * 0.38 * perspective, y + Math.sin(tick + i) * 7);
        ctx.lineTo(centerX + width * 0.38 * perspective, y - Math.sin(tick + i) * 7);
        ctx.stroke();
      }

      for (let i = -8; i <= 8; i += 1) {
        const x = centerX + i * 48;
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(tick * 0.8 + i) * 16, centerY - height * 0.26);
        ctx.lineTo(centerX + i * 22, centerY + height * 0.24);
        ctx.stroke();
      }

      for (const node of nodes) {
        const depthScale = 0.72 + node.z * 0.62;
        const driftX = Math.sin(tick * node.speed + node.phase) * (16 + node.z * 26);
        const driftY = Math.cos(tick * node.speed * 0.8 + node.phase) * (9 + node.z * 18);
        node.x = centerX + (node.baseX - centerX) * depthScale + driftX;
        node.y = centerY + (node.baseY - centerY) * depthScale + driftY;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);

          if (distance < 142 && Math.abs(a.z - b.z) < 0.34) {
            const alpha = 0.11 * (1 - distance / 142) * (0.55 + Math.max(a.z, b.z));
            const color = a.warm || b.warm ? warmRgb : themeRgb;
            ctx.strokeStyle = `rgba(${color}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        const color = node.warm ? warmRgb : themeRgb;
        const size = 1.1 + node.z * 2.1;
        const alpha = 0.14 + node.z * 0.42;

        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.shadowColor = `rgba(${color}, 0.72)`;
        ctx.shadowBlur = 10 + node.z * 10;
        ctx.fillRect(-size, -size, size * 2, size * 2);
        ctx.restore();
      }

      drawTrace(centerY - height * 0.11, tick * 180, themeRgb, 0.18);
      drawTrace(centerY + height * 0.13, tick * -145, warmRgb, 0.12);

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [themeRgb]);

  return <canvas ref={canvasRef} className="main-topic-depth-field" aria-hidden="true" />;
}

function PatientUnitNetworkField({ themeRgb = "220, 231, 255", isActive }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return undefined;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let frame = 0;
    let tick = 0;
    let orbs = [];

    const buildOrbs = () => {
      const count = Math.floor(Math.min(46, Math.max(24, width / 42)));
      orbs = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        r: 5 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        speed: 0.28 + Math.random() * 0.68,
        warm: index % 7 === 0
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildOrbs();
    };

    const draw = () => {
      tick += 0.009;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      for (let ring = 0; ring < 5; ring += 1) {
        const radiusX = width * (0.16 + ring * 0.075);
        const radiusY = height * (0.08 + ring * 0.04);
        ctx.save();
        ctx.translate(centerX, centerY + Math.sin(tick + ring) * 14);
        ctx.rotate(-0.22 + Math.sin(tick * 0.35 + ring) * 0.08);
        ctx.strokeStyle = `rgba(${themeRgb}, ${0.045 + ring * 0.01})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([12 + ring * 4, 18]);
        ctx.lineDashOffset = -tick * (80 + ring * 22);
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      for (const orb of orbs) {
        const drift = (tick * orb.speed + orb.phase) % (Math.PI * 2);
        const zoom = 0.58 + ((Math.sin(drift) + 1) / 2) * 0.9 + orb.z * 0.52;
        const x = centerX + (orb.x - centerX) * zoom + Math.sin(drift * 1.7) * 18;
        const y = centerY + (orb.y - centerY) * zoom + Math.cos(drift * 1.2) * 14;
        const alpha = Math.max(0, 0.3 - Math.abs(zoom - 1.1) * 0.16);
        const rgb = orb.warm ? "246, 189, 55" : themeRgb;
        const radius = orb.r * zoom;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(248, 248, 255, ${alpha * 0.9})`);
        gradient.addColorStop(0.32, `rgba(${rgb}, ${alpha * 0.72})`);
        gradient.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (orb.z > 0.72) {
          ctx.strokeStyle = `rgba(${rgb}, ${alpha * 0.56})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, radius * 1.32, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [isActive, themeRgb]);

  if (!isActive) return null;

  return <canvas ref={canvasRef} className="patient-unit-field" aria-hidden="true" />;
}

function PatientUnitThreeIntro({ isActive, nodes, zoomIntensity }) {
  const mountRef = useRef(null);
  const zoomRef = useRef(zoomIntensity);

  useEffect(() => {
    zoomRef.current = zoomIntensity;
  }, [zoomIntensity]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !isActive) return undefined;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(MAP_WIDTH, MAP_HEIGHT, false);
    renderer.setClearColor(0xffffff, 0);
    renderer.domElement.className = "patient-3d-intro-canvas";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, MAP_WIDTH, MAP_HEIGHT, 0, -1200, 1200);
    camera.position.set(0, 0, 620);
    camera.lookAt(MAP_WIDTH / 2, MAP_HEIGHT / 2, 0);

    const atlasGroup = new THREE.Group();
    atlasGroup.position.set(MAP_WIDTH / 2, MAP_HEIGHT / 2, 0);
    scene.add(atlasGroup);

    const ambientLight = new THREE.AmbientLight(0xf4fbff, 1.8);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(-280, -420, 520);
    const rimLight = new THREE.PointLight(0x86c4d8, 1.7, 1300);
    rimLight.position.set(290, 20, 260);
    const violetLight = new THREE.PointLight(0x9a84d6, 0.9, 900);
    violetLight.position.set(-360, 220, 210);
    scene.add(ambientLight, keyLight, rimLight, violetLight);

    const pearlMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xeef7fb,
      metalness: 0.18,
      roughness: 0.18,
      transmission: 0.32,
      transparent: true,
      opacity: 0.56,
      emissive: 0x9ec7d7,
      emissiveIntensity: 0.1,
      clearcoat: 0.82,
      clearcoatRoughness: 0.22,
      depthWrite: false
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.06,
      roughness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const rodGroup = new THREE.Group();
    rodGroup.position.set(0, -8, 12);
    atlasGroup.add(rodGroup);

    const rodMaterial = pearlMaterial.clone();
    rodMaterial.opacity = 0.5;
    rodMaterial.emissiveIntensity = 0.16;

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 420, 32), rodMaterial);
    rod.position.set(0, 0, 0);
    rodGroup.add(rod);

    const capMaterial = pearlMaterial.clone();
    capMaterial.opacity = 0.44;
    [-226, 226].forEach((y) => {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(19, 32, 16), capMaterial);
      cap.position.set(0, y, 0);
      cap.scale.set(1, 0.72, 1);
      rodGroup.add(cap);
    });

    const snakePoints = [];
    for (let i = 0; i <= 96; i += 1) {
      const t = i / 96;
      const y = -192 + t * 384;
      const turn = t * Math.PI * 6.2;
      const radius = 68 - Math.abs(t - 0.5) * 34;
      snakePoints.push(new THREE.Vector3(Math.sin(turn) * radius, y, Math.cos(turn) * 38));
    }
    const snakeCurve = new THREE.CatmullRomCurve3(snakePoints);
    const snakeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xddeef4,
      metalness: 0.16,
      roughness: 0.2,
      transmission: 0.26,
      transparent: true,
      opacity: 0.48,
      emissive: 0x8cc5d2,
      emissiveIntensity: 0.18,
      clearcoat: 0.78,
      depthWrite: false
    });
    const snake = new THREE.Mesh(new THREE.TubeGeometry(snakeCurve, 128, 7.5, 16, false), snakeMaterial);
    rodGroup.add(snake);

    const head = new THREE.Mesh(new THREE.SphereGeometry(18, 32, 16), snakeMaterial);
    head.position.copy(snakePoints[snakePoints.length - 1]);
    head.scale.set(1.18, 0.78, 0.92);
    rodGroup.add(head);

    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0xd5e9f1,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const haloGroup = new THREE.Group();
    atlasGroup.add(haloGroup);
    [0, 1, 2].forEach((index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(230 + index * 78, 1.8, 8, 180), haloMaterial.clone());
      ring.material.opacity = 0.1 - index * 0.02;
      ring.scale.set(1.38, 0.58, 1);
      ring.rotation.set(THREE.MathUtils.degToRad(72), 0, THREE.MathUtils.degToRad(index * 18 - 8));
      ring.position.z = -70 - index * 16;
      haloGroup.add(ring);
    });

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);
    const orbGeometry = new THREE.SphereGeometry(43, 48, 24);
    const ringGeometry = new THREE.TorusGeometry(55, 1.45, 8, 96);
    const activeNodes = nodes.filter((node) => !node.isIntro);

    activeNodes.forEach((node, index) => {
      const color = new THREE.Color(node.theme?.color || "#7d93a8");
      const material = glassMaterial.clone();
      material.color = color.clone().lerp(new THREE.Color("#ffffff"), 0.58);
      material.emissive = color;
      material.emissiveIntensity = 0.08;

      const orb = new THREE.Mesh(orbGeometry, material);
      orb.position.set(node.x, node.y, 32 + (index % 3) * 8);
      orb.scale.set(1, 1, 0.34);
      orb.userData = {
        baseX: node.x,
        baseY: node.y,
        phase: index * 0.77,
        color
      };
      orbGroup.add(orb);

      const ringMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(orb.position);
      ring.rotation.x = THREE.MathUtils.degToRad(68);
      ring.userData = { parentOrb: orb, phase: index * 0.91 };
      orbGroup.add(ring);
    });

    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorA = new THREE.Color("#9bc0ce");
    const colorB = new THREE.Color("#9583c8");
    for (let i = 0; i < particleCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 190 + Math.random() * 520;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.54 + (Math.random() - 0.5) * 140;
      positions[i * 3 + 2] = -180 + Math.random() * 250;
      const color = colorA.clone().lerp(colorB, Math.random());
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 4.2,
      transparent: true,
      opacity: 0.32,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.position.set(MAP_WIDTH / 2, MAP_HEIGHT / 2, 0);
    scene.add(particles);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointerMove);

    let frame = 0;
    const startTime = window.performance.now();

    const animate = () => {
      const elapsed = (window.performance.now() - startTime) / 1000;
      const drift = reduceMotion ? 0 : elapsed;
      const fade = 1 - Math.min(1, zoomRef.current * 1.55);

      mount.style.opacity = `${Math.max(0, fade)}`;
      atlasGroup.rotation.y = Math.sin(drift * 0.24) * 0.09 + pointer.x * 0.06;
      atlasGroup.rotation.x = Math.cos(drift * 0.2) * 0.035 - pointer.y * 0.045;
      atlasGroup.rotation.z = Math.sin(drift * 0.16) * 0.025;
      rodGroup.rotation.y = Math.sin(drift * 0.38) * 0.16;
      haloGroup.rotation.z = drift * 0.035;
      haloGroup.rotation.x = Math.sin(drift * 0.18) * 0.04;
      particles.rotation.z = drift * -0.018;
      particles.rotation.x = Math.sin(drift * 0.13) * 0.05;

      orbGroup.children.forEach((child, index) => {
        const phase = child.userData.phase || 0;
        const lift = Math.sin(drift * 0.9 + phase) * 8;
        if (child.userData.parentOrb) {
          child.position.copy(child.userData.parentOrb.position);
          child.rotation.z = drift * (0.3 + index * 0.01) + phase;
          child.rotation.x = THREE.MathUtils.degToRad(68) + Math.sin(drift * 0.42 + phase) * 0.12;
          child.material.opacity = 0.13 + Math.sin(drift * 0.82 + phase) * 0.035;
        } else {
          child.position.x = child.userData.baseX + pointer.x * 18 + Math.sin(drift * 0.55 + phase) * 6;
          child.position.y = child.userData.baseY + pointer.y * 14 + lift;
          child.rotation.y = drift * 0.32 + phase;
          child.rotation.x = Math.sin(drift * 0.48 + phase) * 0.18;
          child.material.opacity = 0.12 + Math.sin(drift * 0.75 + phase) * 0.035;
        }
      });

      renderer.render(scene, camera);

      if (!reduceMotion) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      orbGeometry.dispose();
      ringGeometry.dispose();
      scene.traverse((object) => {
        if (object.geometry && object.geometry !== particleGeometry && object.geometry !== orbGeometry && object.geometry !== ringGeometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      mount.replaceChildren();
    };
  }, [isActive, nodes]);

  if (!isActive) return null;

  return <div ref={mountRef} className="patient-3d-intro-field" aria-hidden="true" />;
}

function PatientVideoBackdrop({ isActive }) {
  if (!isActive) return null;

  return (
    <div className="patient-video-backdrop" aria-hidden="true">
      <img className="patient-static-background" src={PATIENT_STATIC_BACKGROUND} alt="" />
    </div>
  );
}

function AnatomyMap({
  backgroundImage,
  backgroundAlt,
  atlasMode,
  isIntroActive,
  introDepthActive,
  nodeDepthMode,
  camera,
  activeIndex,
  zoomIntensity,
  nodes,
  isPlotMode,
  isCameraOpening,
  openingNodeId,
  highlightedNodeId,
  isolatedNodeId,
  onHoverNode,
  onActivateNode,
  onMoveNode
}) {
  const mapRef = useRef(null);
  const visibleNodes = nodes.filter((node) => !node.isIntro);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || atlasMode !== "patient" || isPlotMode) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;

    const animateNodes = (time) => {
      const nodeElements = map.querySelectorAll(".body-node");

      nodeElements.forEach((element) => {
        if (element.classList.contains("is-opening-node")) {
          element.style.setProperty("--node-float-y", "0px");
          return;
        }

        const index = Number(element.dataset.nodeIndex || 0);
        const amplitude = 8 + (index % 3) * 1.6;
        const speed = (0.00048 + (index % 4) * 0.000035) * 1.3;
        const phase = index * 0.86;
        const offset = Math.sin(time * speed + phase) * amplitude;
        element.style.setProperty("--node-float-y", `${offset.toFixed(2)}px`);
      });

      frame = window.requestAnimationFrame(animateNodes);
    };

    frame = window.requestAnimationFrame(animateNodes);

    return () => {
      window.cancelAnimationFrame(frame);
      map.querySelectorAll(".body-node").forEach((element) => {
        element.style.removeProperty("--node-float-y");
      });
    };
  }, [atlasMode, isPlotMode, nodes]);

  const startDrag = (event, node, target) => {
    if (!isPlotMode) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const moveNode = (moveEvent) => {
      const x = clamp((moveEvent.clientX - camera.x) / camera.scale, 0, MAP_WIDTH);
      const y = clamp((moveEvent.clientY - camera.y) / camera.scale, 0, MAP_HEIGHT);
      const nextPosition = {
        label: { x: Math.round(x), y: Math.round(y) },
        target: { anchorX: Math.round(x), anchorY: Math.round(y) },
        line: { lineX: Math.round(x), lineY: Math.round(y) }
      }[target];
      onMoveNode(node.id, nextPosition);
    };

    const stopDrag = () => {
      window.removeEventListener("pointermove", moveNode);
      window.removeEventListener("pointerup", stopDrag);
    };

    moveNode(event);
    window.addEventListener("pointermove", moveNode);
    window.addEventListener("pointerup", stopDrag);
  };

  return (
    <div
      ref={mapRef}
      className={[
        "anatomy-map",
        isCameraOpening ? "is-camera-opening" : "",
        introDepthActive ? "has-intro-depth" : ""
      ].join(" ")}
      data-node-depth={introDepthActive ? nodeDepthMode : undefined}
      style={{
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`
      }}
    >
      {/* Temporarily hide map background when null (Patient Units tab-switch flash). */}
      {backgroundImage ? (
        <img
          className="body-background"
          style={{
            "--base-blur": `${zoomIntensity * 4.5}px`,
            "--base-opacity": `${0.94 - zoomIntensity * 0.18}`
          }}
          src={backgroundImage}
          alt={backgroundAlt}
        />
      ) : null}
      {/* Temporarily disabled: transparent Asclepius rod overlay was visible during tab switches.
      {atlasMode === "patient" && (
        <PatientUnitThreeIntro isActive={isIntroActive} nodes={visibleNodes} zoomIntensity={zoomIntensity} />
      )}
      */}
      {atlasMode === "patient" && isPlotMode && (
        <svg className="patient-plot-guide" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} aria-hidden="true">
          <circle className="patient-plot-orbit" cx="1200" cy="600" r="500" />
          <circle className="patient-plot-inner" cx="1200" cy="600" r="200" />
          <circle className="patient-plot-center" cx="1200" cy="600" r="6" />
        </svg>
      )}
      <svg className="node-link-layer" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} aria-hidden="true">
        {visibleNodes.map((node) => {
          const index = nodes.findIndex((candidate) => candidate.id === node.id);
          const control = getLineControl(node);
          const pathData = `M ${node.anchorX} ${node.anchorY} Q ${control.x} ${control.y} ${node.x} ${node.y}`;
          const isFocused = highlightedNodeId === node.id || isolatedNodeId === node.id;
          const isMuted = highlightedNodeId && highlightedNodeId !== node.id;
          const isHidden = isolatedNodeId && isolatedNodeId !== node.id;
          const depthTier = introDepthActive ? getBodyIntroDepthTier(node.id, nodeDepthMode) : null;
          return (
            <g
              className={[
                "node-link-group",
                index === activeIndex ? "active" : index < activeIndex ? "visited" : "",
                isFocused ? "focused" : "",
                isMuted ? "muted" : "",
                isHidden ? "hidden" : "",
                depthTier ? `is-depth-${depthTier}` : ""
              ].join(" ")}
              key={node.id}
              style={{
                "--overview-opacity": 1 - zoomIntensity * 0.58,
                "--pulse-delay": `${index * -0.42}s`,
                ...getThemeStyle(node)
              }}
            >
              <path className="node-link node-link-glow" d={pathData} />
              <path className="node-link node-link-base" d={pathData} />
              <path className="node-link node-link-pulse" d={pathData} />
              <path className="node-link node-link-spark" d={pathData} />
            </g>
          );
        })}
      </svg>
      {visibleNodes.map((node) => {
        const index = nodes.findIndex((candidate) => candidate.id === node.id);
        const control = getLineControl(node);
        const isFocused = highlightedNodeId === node.id || isolatedNodeId === node.id;
        const depthTier = introDepthActive ? getBodyIntroDepthTier(node.id, nodeDepthMode) : null;
        return (
          <div key={node.id}>
            <button
              className={[
                index === activeIndex ? "target-dot active" : index < activeIndex ? "target-dot visited" : "target-dot",
                atlasMode === "patient" ? "is-patient-anchor" : "",
                isPlotMode ? "is-plotting" : "",
                isFocused ? "is-focused" : "",
                depthTier ? `is-depth-${depthTier}` : ""
              ].join(" ")}
              type="button"
              style={{ left: node.anchorX, top: node.anchorY, "--overview-opacity": 1 - zoomIntensity * 0.58, ...getThemeStyle(node) }}
              aria-label={`${node.system.title} ${atlasMode === "patient" ? "unit anchor" : "anatomical target"}`}
              onClick={() => {
                if (!isPlotMode) onActivateNode(node.id);
              }}
              onPointerEnter={() => onHoverNode(node.id)}
              onPointerLeave={() => onHoverNode(null)}
              onPointerDown={(event) => startDrag(event, node, "target")}
            />
            {isPlotMode && (
              <button
                className={[
                  index === activeIndex ? "line-control active" : index < activeIndex ? "line-control visited" : "line-control"
                ].join(" ")}
                type="button"
                style={{ left: control.x, top: control.y, ...getThemeStyle(node) }}
                aria-label={`${node.system.title} connector control`}
                onPointerDown={(event) => startDrag(event, node, "line")}
              />
            )}
            <button
              type="button"
              className={[
                index === activeIndex ? "body-node active" : index < activeIndex ? "body-node visited" : "body-node",
                atlasMode === "patient" ? `patient-unit-node is-${getPatientNodeSide(node)}` : "",
                isPlotMode ? "is-plotting" : "",
                isFocused ? "is-focused" : "",
                openingNodeId === node.id ? "is-opening-node" : "",
                depthTier ? `is-depth-${depthTier}` : ""
              ].join(" ")}
              data-node-index={index}
              style={{
                left: node.x,
                top: node.y,
                "--overview-opacity": 1 - zoomIntensity * 0.58,
                "--node-delay": `${index * -0.42}s`,
                ...getThemeStyle(node)
              }}
              aria-label={node.system.title}
              onClick={() => {
                if (isPlotMode) {
                  return;
                }
                onActivateNode(node.id);
              }}
              onPointerEnter={() => onHoverNode(node.id)}
              onPointerLeave={() => onHoverNode(null)}
              onPointerDown={(event) => startDrag(event, node, "label")}
            >
              {atlasMode === "patient" ? (
                <span className="patient-node-orb" aria-hidden="true">
                  <PatientUnitNodeIcon id={node.id} />
                </span>
              ) : (
                <>
                  <NodePulseGrid />
                  <span className="node-halo" aria-hidden="true" />
                  <span className="node-core">
                    <span className="node-id">{node.id}</span>
                  </span>
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function SystemReveal({ node, activeIndex, zoomIntensity, isOpening, isOpened, onLayerTransition }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const revealRef = useRef(null);
  const layerTweenRef = useRef(null);
  const titleText = node.system?.title || "";
  const regionText = node.system?.unit || node.region || "";

  useEffect(() => {
    setSelectedTopic(null);
    setHasOpenedOnce(false);
  }, [node.id]);

  useLayoutEffect(() => {
    if (!isOpened || node.isIntro || !revealRef.current) return undefined;

    const panel = revealRef.current.querySelector(".subject-title-panel");
    if (!panel) return undefined;

    const fit = () => fitSubjectTitlePanel(panel, titleText, regionText);
    fit();

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    observer?.observe(panel);
    window.addEventListener("resize", fit);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [isOpened, node.id, node.isIntro, regionText, titleText]);

  useEffect(() => {
    if (!selectedTopic) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedTopic(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedTopic]);

  useEffect(() => {
    if (!isOpened || node.isIntro || !revealRef.current) return undefined;

    const section = revealRef.current;
    section.classList.remove("is-revealed");

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(section.querySelectorAll(
        ".subject-title-panel, .subject-image-shell, .subject-image-readout, .main-topic-depth-field, .subject-topic-dock, .subject-topic-header, .subject-topic-card"
      ), { autoAlpha: 1, clearProps: "transform,filter" });
      section.classList.add("is-revealed");
      setHasOpenedOnce(true);
      return undefined;
    }

    const context = gsap.context(() => {
      const titlePanel = section.querySelector(".subject-title-panel");
      const imageShell = section.querySelector(".subject-image-shell");
      const imageReadout = section.querySelector(".subject-image-readout");
      const depthField = section.querySelector(".main-topic-depth-field");
      const topicDock = section.querySelector(".subject-topic-dock");
      const topicHeader = section.querySelector(".subject-topic-header");
      const topicCards = gsap.utils.toArray(".subject-topic-card", section);
      const targets = [titlePanel, imageShell, imageReadout, depthField, topicDock, topicHeader, ...topicCards].filter(Boolean);

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          section.classList.add("is-revealed");
          gsap.set(targets, { clearProps: "opacity,visibility,transform" });
          setHasOpenedOnce(true);
        }
      });

      timeline
        .fromTo(titlePanel, { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: MOTION.panel }, 0)
        .fromTo(imageShell, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: MOTION.layer }, 0.05)
        .fromTo(depthField, { autoAlpha: 0 }, { autoAlpha: 0.72, duration: MOTION.layer }, 0.12)
        .fromTo(imageReadout, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: MOTION.panel }, 0.22)
        .fromTo(topicDock, { autoAlpha: 0, x: 22 }, { autoAlpha: 1, x: 0, duration: MOTION.layer }, 0.14)
        .fromTo(topicHeader, { autoAlpha: 0, y: -4 }, { autoAlpha: 1, y: 0, duration: MOTION.micro }, 0.36)
        .fromTo(
          topicCards,
          { autoAlpha: 0, x: 14 },
          { autoAlpha: 1, x: 0, duration: MOTION.panel, stagger: MOTION.cardStagger },
          0.4
        );
    }, revealRef);

    return () => {
      context.revert();
      section.classList.remove("is-revealed");
    };
  }, [isOpened, node.id]);

  useEffect(() => {
    if (!isOpened || !revealRef.current || !hasOpenedOnce || !selectedTopic) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    onLayerTransition?.(true);
    layerTweenRef.current?.kill();

    const section = revealRef.current;
    const scan = section.querySelector(".layer04-stage-scan");
    const vignette = section.querySelector(".layer04-side-vignette");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => onLayerTransition?.(false)
    });
    layerTweenRef.current = tl;

    if (scan) tl.fromTo(scan, { autoAlpha: 0 }, { autoAlpha: 1, duration: MOTION.micro }, 0);
    if (vignette) tl.fromTo(vignette, { autoAlpha: 0 }, { autoAlpha: 0.92, duration: MOTION.panel }, 0.06);

    return () => {
      tl.kill();
      onLayerTransition?.(false);
    };
  }, [selectedTopic?.id, isOpened, hasOpenedOnce, onLayerTransition]);

  if (node.isIntro) {
    return null;
  }

  const topics = (node.system.topics || []).slice(0, 7);
  const selectedItems = selectedTopic?.cards || selectedTopic?.subtopics || [];
  const selectedIndex = selectedTopic ? topics.findIndex((topic) => topic.id === selectedTopic.id) : -1;
  const isLayer04Open = selectedIndex >= 0;
  const stageImage = selectedTopic?.visual || node.system.image;
  const readoutLabel = selectedTopic
    ? (node.detailLayerLabel || "Layer 04")
    : (node.readoutLabel || "System Atlas");
  const readoutTitle = selectedTopic?.title || node.id;
  const readoutMeta = selectedTopic
    ? `${selectedItems.length || 0} subtopic${selectedItems.length === 1 ? "" : "s"}`
    : `${topics.length} Topics Ready`;
  const readoutMode = isLayer04Open ? "lite" : "type";
  const headerMode = isLayer04Open ? "lite" : "type";
  const sectionClassName = [
    "system-reveal",
    isOpening ? "is-opening" : "",
    isOpened ? "is-subject-open is-motion-owned" : "",
    isLayer04Open ? "is-layer04-open" : "",
    hasOpenedOnce ? "is-revealed" : ""
  ].join(" ");

  const toggleTopic = (topic) => {
    setSelectedTopic((current) => (current?.id === topic.id ? null : topic));
  };

  const renderTopicCard = (topic, index) => {
    const isSelected = selectedTopic?.id === topic.id;
    return (
      <motion.button
        type="button"
        className={[
          "subject-topic-card",
          topic.cards || topic.subtopics ? "has-layer" : "",
          isSelected ? "is-selected" : ""
        ].join(" ")}
        key={topic.id}
        title={topic.title}
        aria-pressed={isSelected}
        style={{ "--topic-delay": `${260 + index * 120}ms` }}
        onClick={() => toggleTopic(topic)}
        initial={false}
        transition={{ duration: MOTION.micro, ease: MOTION.ease }}
        whileTap={{ scale: 0.985 }}
        animate={
          !hasOpenedOnce
            ? false
            : isLayer04Open
              ? isSelected
                ? { opacity: 1, scale: 1.02, filter: "brightness(1.08)" }
                : { opacity: 0.46, scale: 0.98, filter: "brightness(0.78) saturate(0.72)" }
              : { opacity: 1, scale: 1, filter: "brightness(1) saturate(1)" }
        }
      >
        <span>{String(index + 1).padStart(2, "0")}</span>
        <strong className="topic-title">{topic.title}</strong>
        {isSelected && <span className="topic-select-scan" aria-hidden="true" />}
      </motion.button>
    );
  };

  const renderSideRail = () => {
    if (!isLayer04Open) return null;

    const items = selectedItems.length
      ? selectedItems
      : [{ id: `${selectedTopic.id}-placeholder`, code: "—", title: "Card set not assigned yet", isPlaceholder: true }];

    return (
      <motion.aside
        className={[
          "layer04-side-rail",
          items.length === 1 ? "is-single" : "",
          items.length >= 5 ? "is-dense" : "",
          items.length >= 6 ? "is-scroll" : ""
        ].join(" ")}
        key={`${selectedTopic.id}-side-rail`}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: MOTION.panel, ease: MOTION.ease }}
        style={{ "--rail-count": items.length }}
        aria-label={`${selectedTopic.title} subtopics`}
      >
        <span className="layer04-side-vignette" aria-hidden="true" />
        <span className="layer04-side-rail-track" aria-hidden="true" />
        <div className="layer04-side-rail-list">
          {items.map((item, index) => (
            <motion.article
              className={[
                "inline-subtopic-card",
                "is-side",
                item.isPlaceholder ? "is-placeholder" : ""
              ].join(" ")}
              key={item.id || item.title}
              initial={{ opacity: 0, x: -18, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.98 }}
              transition={{
                delay: 0.16 + index * MOTION.cardStagger,
                duration: MOTION.panel,
                ease: MOTION.ease
              }}
              style={{ "--card-index": index }}
            >
              <span className="inline-subtopic-node" aria-hidden="true" />
              <span className="inline-subtopic-corners" aria-hidden="true" />
              <span>{item.isPlaceholder ? "Awaiting Layer 04" : (item.code || `${node.id}-${String(index + 1).padStart(2, "0")}`)}</span>
              <strong>{item.title}</strong>
            </motion.article>
          ))}
        </div>
      </motion.aside>
    );
  };

  return (
    <section
      ref={revealRef}
      className={sectionClassName}
      key={node.id}
      style={{ "--reveal": zoomIntensity, ...getThemeStyle(node) }}
    >
      {isOpened && (
        <header
          className="subject-title-panel"
          style={getTitlePanelStyle(titleText, regionText)}
        >
          <SignalText text={`${node.index} / ${node.atlasTotal || "12"}`} />
          <SignalText text={titleText} as="h2" delay={180} step={40} />
          <SignalText text={regionText} as="p" delay={Math.min(1300, 320 + titleText.length * 34)} step={20} />
        </header>
      )}
      {isOpened && <MainTopicDepthField themeRgb={node.theme?.rgb} />}
      <div className={["subject-image-stage", isLayer04Open ? "is-layer04-open" : ""].join(" ")}>
        <div className={["subject-stage-stack", isLayer04Open ? "is-layer04-open" : ""].join(" ")}>
          <AnimatePresence>
            {isLayer04Open && (
              <motion.div
                className="layer04-stage-scan"
                key="layer04-scan"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: MOTION.micro, ease: MOTION.ease }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="subject-image-shell"
            initial={false}
            animate={
              isLayer04Open
                ? { filter: "brightness(1.04) saturate(1.06)" }
                : { filter: "brightness(1) saturate(1)" }
            }
            transition={{ duration: MOTION.panel, ease: MOTION.ease }}
          >
            <div className="ghost-image-frame">
              <div className="ghost-image-stack">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={stageImage}
                    src={stageImage}
                    alt=""
                    initial={hasOpenedOnce ? { opacity: 0, scale: 1.02 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: MOTION.imageCrossfade, ease: MOTION.ease }}
                  />
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {isLayer04Open && (
                  <motion.span
                    className="layer04-frame-pulse"
                    key="frame-pulse"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: MOTION.micro }}
                  />
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="sync">
              {isLayer04Open && renderSideRail()}
            </AnimatePresence>
            {isOpened && (
              <div className="subject-image-readout">
                <SignalText text={readoutLabel} delay={280} step={22} mode={readoutMode} />
                <SignalText text={readoutTitle} as="strong" delay={360} step={28} mode={readoutMode} />
                <SignalText text={readoutMeta} as="em" delay={440} step={18} mode={readoutMode} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
      {isOpened ? (
        <div
          className={["subject-topic-dock", isLayer04Open ? "is-layer04-open" : ""].join(" ")}
          aria-label={`${node.system.title} topics`}
        >
          <div className={["subject-topic-header", isLayer04Open ? "is-layer04" : ""].join(" ")}>
            <SignalText
              text={isLayer04Open ? (node.detailLayerLabel || "Layer 04") : (node.layerLabel || "Layer 03")}
              delay={420}
              step={22}
              mode={headerMode}
            />
            <SignalText text="Topic Index" as="strong" delay={610} step={30} mode={headerMode} />
            <em className="topic-header-meta" key={isLayer04Open ? selectedTopic.id : "index"}>
              {isLayer04Open
                ? `${selectedTopic.title} / ${selectedItems.length || 0} linked`
                : node.system.title}
            </em>
          </div>
          <div className={["subject-topic-list", isLayer04Open ? "is-layer04-open" : ""].join(" ")}>
            {topics.map((topic, index) => renderTopicCard(topic, index))}
          </div>
        </div>
      ) : (
        <div className="topic-node-cloud" aria-label={`${node.system.title} topics`}>
          {topics.map((topic, index) => (
            <button
              type="button"
              className="topic-node"
              key={topic.id}
              style={{
                "--topic-delay": `${360 + index * 150}ms`,
                "--topic-x": `${index % 2 === 0 ? -1 : 1}`,
                "--topic-y": `${index - Math.floor(topics.length / 2)}`
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{topic.title}</strong>
            </button>
          ))}
        </div>
      )}
      <span className="reveal-code">{String(activeIndex + 1).padStart(2, "0")} // {node.id}</span>
    </section>
  );
}

function ScrollRail({ activeIndex, nodes, onNavigate, atlasMode }) {
  return (
    <nav
      className={["scroll-rail", atlasMode === "patient" ? "is-patient" : "is-body"].join(" ")}
      aria-label={atlasMode === "patient" ? "Patient unit sections" : "Body system sections"}
    >
      {nodes.map((node, index) => (
        <button
          type="button"
          key={`${atlasMode}-${node.id}`}
          className={[
            index === activeIndex ? "active" : "",
            node.isIntro ? "is-intro" : "is-unit"
          ].join(" ")}
          aria-label={node.system?.title || node.id}
          aria-current={index === activeIndex ? "true" : undefined}
          onClick={() => onNavigate(node.id)}
        >
          <span />
        </button>
      ))}
    </nav>
  );
}

function PlotToolbar({ isPlotMode, onToggle, nodes, onReset, plotZoom, onPlotZoomChange }) {
  const plotted = nodes
    .filter((node) => !node.isIntro)
    .map((node) => {
      const control = getLineControl(node);
      return `{ id: "${node.id}", x: ${Math.round(node.x)}, y: ${Math.round(node.y)}, anchorX: ${Math.round(node.anchorX)}, anchorY: ${Math.round(node.anchorY)}, lineX: ${Math.round(control.x)}, lineY: ${Math.round(control.y)} }`;
    })
    .join(",\n");

  const copyPlot = async () => {
    await navigator.clipboard.writeText(plotted);
  };

  return (
    <aside className={["plot-dock", isPlotMode ? "is-active" : ""].join(" ")}>
      <div className="plot-toggle" aria-label="Plot mode controls">
        <span className="plot-mark" aria-hidden="true" />
        <div className="plot-options">
          <button
            type="button"
            className={isPlotMode ? "active" : ""}
            aria-pressed={isPlotMode}
            onClick={onToggle}
          >
            {isPlotMode ? "Exit Plot" : "Plot"}
          </button>
          {isPlotMode && (
            <div className="plot-tools">
              <span>Drag circles, body dots, and line handles. Saved locally.</span>
              <label className="plot-zoom-control">
                <span>Zoom {plotZoom.toFixed(1)}x</span>
                <input
                  type="range"
                  min="1"
                  max="3.5"
                  step="0.1"
                  value={plotZoom}
                  onChange={(event) => onPlotZoomChange(Number(event.target.value))}
                />
              </label>
              <button type="button" onClick={() => onPlotZoomChange(1)}>1x</button>
              <button type="button" onClick={() => onPlotZoomChange(2)}>2x</button>
              <button type="button" onClick={() => onPlotZoomChange(3)}>3x</button>
              <button type="button" onClick={copyPlot}>Copy Coordinates</button>
              <button type="button" onClick={onReset}>Reset Plot</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function AtlasModeSwitch({ atlasMode, onChange }) {
  return (
    <nav className="atlas-mode-switch" aria-label="Atlas mode">
      <button
        type="button"
        className={atlasMode === "body" ? "active" : ""}
        onClick={() => onChange("body")}
      >
        <span>Atlas</span>
        <strong>Body Systems</strong>
      </button>
      <button
        type="button"
        className={atlasMode === "patient" ? "active" : ""}
        onClick={() => onChange("patient")}
      >
        <span>Atlas</span>
        <strong>Patient Units</strong>
      </button>
    </nav>
  );
}

function NodeDepthToggle({ isVisible, depthMode, onChange }) {
  return (
    <aside
      className={["node-depth-dock", isVisible ? "is-visible" : ""].join(" ")}
      aria-hidden={!isVisible}
    >
      <nav className="node-depth-toggle" aria-label="Body system node depth">
        <span className="node-depth-mark" aria-hidden="true" />
        <div className="node-depth-options">
          <button
            type="button"
            className={depthMode === "core" ? "active" : ""}
            aria-pressed={depthMode === "core"}
            tabIndex={isVisible ? 0 : -1}
            onClick={() => onChange("core")}
          >
            Core
          </button>
          <button
            type="button"
            className={depthMode === "support" ? "active" : ""}
            aria-pressed={depthMode === "support"}
            tabIndex={isVisible ? 0 : -1}
            onClick={() => onChange("support")}
          >
            Support
          </button>
        </div>
      </nav>
    </aside>
  );
}

function IntroCommandDeck({ isVisible, atlasMode, onAtlasModeChange }) {
  return (
    <div className={isVisible ? "intro-command-deck is-visible" : "intro-command-deck"}>
      <IntroBrandPlate atlasMode={atlasMode} />
      <AtlasModeSwitch atlasMode={atlasMode} onChange={onAtlasModeChange} />
    </div>
  );
}

function IntroBrandPlate({ atlasMode }) {
  const isPatient = atlasMode === "patient";
  return (
    <aside className="intro-brand-plate" aria-label="Core Zigma branding">
      <div className="intro-brand-emblem">
        <img src="/assets/corezigma-logo.png" alt="Core Zigma" />
      </div>
      <div className="intro-brand-copy">
        <span>Core Zigma System</span>
        <strong>{isPatient ? "Patient Unit Atlas" : "Medical Topic Atlas"}</strong>
        <em>{isPatient ? "Clinical Unit Network" : "Summation Review Method"}</em>
      </div>
    </aside>
  );
}

export default function App() {
  const { progress, viewport } = useScrollProgress();
  const [atlasMode, setAtlasMode] = useState("body");
  const [nodeDepthMode, setNodeDepthMode] = useState("core");
  const [bodyPlotOverrides, setBodyPlotOverrides] = useState(() => loadPlotOverrides(BODY_PLOT_STORAGE_KEY));
  const [patientPlotOverrides, setPatientPlotOverrides] = useState(() => loadPlotOverrides(PATIENT_PLOT_STORAGE_KEY));
  const [isPlotMode, setIsPlotMode] = useState(false);
  const [plotZoom, setPlotZoom] = useState(1);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isolatedNodeId, setIsolatedNodeId] = useState(null);
  const [openingNodeId, setOpeningNodeId] = useState(null);
  const [layerTransitionActive, setLayerTransitionActive] = useState(false);
  const atlasConfig = atlasConfigs[atlasMode];
  const isPatient = atlasMode === "patient";
  const plotOverrides = isPatient ? patientPlotOverrides : bodyPlotOverrides;
  const plotStorageKey = isPatient ? PATIENT_PLOT_STORAGE_KEY : BODY_PLOT_STORAGE_KEY;
  const plottedNodes = useMemo(() => applyPlotOverrides(atlasConfig.nodes, plotOverrides), [atlasConfig.nodes, plotOverrides]);
  const activeIndex = getActiveIndex(progress, plottedNodes);
  const activeNode = plottedNodes[activeIndex];
  const highlightedNodeId = isolatedNodeId || hoveredNodeId;
  const sectionProgress = clamp(progress * (plottedNodes.length - 1) - activeIndex + 0.5, 0, 1);
  const zoomIntensity = activeNode.isIntro || isPlotMode ? 0 : smoothstep(clamp(progress / 0.09, 0, 1)) * smoothstep(sectionProgress);
  const revealIntensity = isolatedNodeId === activeNode.id ? 1 : zoomIntensity;
  const introDepthActive = !isPatient && activeNode.isIntro && !isPlotMode;
  const camera = useMemo(
    () => getCamera(progress, viewport.width, viewport.height, plottedNodes, isPlotMode, plotZoom, isPatient),
    [isPatient, isPlotMode, plotZoom, plottedNodes, progress, viewport.width, viewport.height]
  );

  useEffect(() => {
    const grids = Array.from(document.querySelectorAll(".node-dot-grid"));
    const timelines = grids.map((grid, gridIndex) => {
      const options = {
        grid: [13, 13],
        from: "center"
      };
      const timeline = createTimeline({
        loop: true,
        alternate: true,
        delay: gridIndex * 120
      });

      timeline.add(
        grid.querySelectorAll(".node-dot"),
        {
          scale: stagger([1.1, 0.75], options),
          opacity: stagger([0.5, 0.12], options),
          ease: "inOutQuad",
          duration: 1400
        },
        stagger(14, options)
      );

      return timeline;
    });

    return () => {
      timelines.forEach((timeline) => timeline.cancel());
    };
  }, [atlasMode]);

  const moveNode = (nodeId, position) => {
    const setOverrides = isPatient ? setPatientPlotOverrides : setBodyPlotOverrides;
    setOverrides((current) => {
      const next = { ...current, [nodeId]: { ...current[nodeId], ...position } };
      window.localStorage.setItem(plotStorageKey, JSON.stringify(next));
      return next;
    });
  };

  const resetPlot = () => {
    window.localStorage.removeItem(plotStorageKey);
    if (isPatient) {
      setPatientPlotOverrides({});
    } else {
      setBodyPlotOverrides({});
    }
  };

  const jumpToNode = (nodeId) => {
    const index = plottedNodes.findIndex((node) => node.id === nodeId);
    if (index < 0) return;

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetY = plottedNodes.length <= 1 ? 0 : (index / (plottedNodes.length - 1)) * maxScroll;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: targetY, behavior: "auto" });
    window.history.replaceState(null, "", `#${nodeId}`);
    window.requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    });
  };

  const activateNode = (nodeId) => {
    const nextNode = plottedNodes.find((node) => node.id === nodeId);
    const isIntro = nextNode?.isIntro;
    setIsolatedNodeId(isIntro ? null : nodeId);
    setOpeningNodeId(isIntro ? null : nodeId);
    jumpToNode(nodeId);
  };

  const changeAtlasMode = (nextMode) => {
    if (nextMode === atlasMode) return;
    setAtlasMode(nextMode);
    setHoveredNodeId(null);
    setIsolatedNodeId(null);
    setOpeningNodeId(null);
    setIsPlotMode(false);
    window.history.replaceState(null, "", "#");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  useEffect(() => {
    if (activeNode.isIntro) {
      setIsolatedNodeId(null);
      setOpeningNodeId(null);
    }
  }, [activeNode.id, activeNode.isIntro]);

  useEffect(() => {
    if (!openingNodeId) return undefined;

    const timeout = window.setTimeout(() => {
      setOpeningNodeId(null);
    }, MOTION.zoomMs);

    return () => window.clearTimeout(timeout);
  }, [openingNodeId]);

  const isLayerTransitioning = Boolean(openingNodeId) || layerTransitionActive;

  return (
    <main
      className="scroll-anatomy-app"
      data-atlas-mode={atlasMode}
      data-atlas-tone={atlasConfig.tone}
      data-plotting={isPlotMode ? "true" : "false"}
      data-layer-transition={isLayerTransitioning ? "true" : "false"}
      style={{ "--atlas-pages": plottedNodes.length }}
    >
      <section className="visual-stage">
        <PatientVideoBackdrop isActive={isPatient} />
        <IntroCommandDeck
          isVisible={activeNode.isIntro && !isPlotMode}
          atlasMode={atlasMode}
          onAtlasModeChange={changeAtlasMode}
        />
        <NodeDepthToggle
          isVisible={introDepthActive}
          depthMode={nodeDepthMode}
          onChange={setNodeDepthMode}
        />
        <AnatomyMap
          backgroundImage={atlasConfig.backgroundImage}
          backgroundAlt={atlasConfig.backgroundAlt}
          atlasMode={atlasMode}
          isIntroActive={isPatient && activeNode.isIntro && !isPlotMode}
          introDepthActive={introDepthActive}
          nodeDepthMode={nodeDepthMode}
          camera={camera}
          activeIndex={activeIndex}
          zoomIntensity={revealIntensity}
          nodes={plottedNodes}
          isPlotMode={isPlotMode}
          isCameraOpening={Boolean(openingNodeId)}
          openingNodeId={openingNodeId}
          highlightedNodeId={highlightedNodeId}
          isolatedNodeId={isolatedNodeId}
          onHoverNode={setHoveredNodeId}
          onActivateNode={activateNode}
          onMoveNode={moveNode}
        />
        <SystemReveal
          node={activeNode}
          activeIndex={activeIndex}
          zoomIntensity={revealIntensity}
          isOpening={openingNodeId === activeNode.id}
          isOpened={!activeNode.isIntro}
          onLayerTransition={setLayerTransitionActive}
        />
        <ScrollRail
          activeIndex={activeIndex}
          nodes={plottedNodes}
          onNavigate={activateNode}
          atlasMode={atlasMode}
        />
        <PlotToolbar
          isPlotMode={isPlotMode}
          onToggle={() => setIsPlotMode((current) => !current)}
          nodes={plottedNodes}
          onReset={resetPlot}
          plotZoom={plotZoom}
          onPlotZoomChange={setPlotZoom}
        />
      </section>
      <div className="scroll-pages" aria-hidden="true">
        {plottedNodes.map((node) => (
          <section id={node.id} key={`${atlasMode}-${node.id}`} />
        ))}
      </div>
    </main>
  );
}
