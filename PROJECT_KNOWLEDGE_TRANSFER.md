# Core Zigma System Medical Topic Atlas - Project Knowledge Transfer

This document is a complete handoff for the project in:

`C:\Users\Acer Nitro Gaming\Desktop\topic project`

It is written for a new coding agent that needs to understand the project quickly, preserve the current visual direction, and continue changes without accidentally undoing important design decisions.

## 1. Project Summary

This is a React/Vite interactive medical atlas called the Core Zigma System Medical Topic Atlas.

The app has two atlas modes:

1. Body Systems
   - Dark HUD, sci-fi, holographic medical interface.
   - Uses the full body anatomical background.
   - Nodes represent body systems like cardiovascular, respiratory, gastrointestinal, neurology, etc.
   - This side is considered the darker, high-energy, "system atlas" side.

2. Patient Units
   - A connected companion atlas for clinical/patient unit groupings.
   - Uses a looping medical video background, plus a transparent Rod of Asclepius overlay.
   - Nodes represent patient/unit contexts like Mother-Baby, Pediatrics, Med Surg, Critical Care, Emergency Department, Mental Health, Nurse Station.
   - This side is intended to feel unique but related to Body Systems, not a literal sun/moon design.

The user is very visual-design focused. They often asks for exact animation and aesthetic adjustments. They prefer implementation over long planning, but they are sensitive to ugly or unclear visual changes and will ask to revert if the result is not good.

## 2. Tech Stack

Main framework:

- React
- Vite

Installed dependencies from `package.json`:

```json
{
  "@vitejs/plugin-react": "latest",
  "animejs": "^4.5.0",
  "framer-motion": "latest",
  "gsap": "latest",
  "react": "latest",
  "react-dom": "latest",
  "three": "^0.185.1",
  "vite": "latest",
  "zustand": "latest"
}
```

Scripts:

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

Important implementation reality:

- Most of the current app is implemented directly in `src/App.jsx` and `src/styles.css`.
- GSAP is actively used for main topic reveal timelines.
- Anime.js is used for dot/grid intro motion.
- Three.js is used for the Patient Units intro overlay.
- Framer Motion is installed and `AnimatePresence` / motion style transitions are used for modal-style transitions.
- Zustand exists but the main app currently does not rely heavily on the store.

## 3. How To Run

Working directory:

```powershell
cd "C:\Users\Acer Nitro Gaming\Desktop\topic project"
```

Build:

```powershell
npm.cmd run build
```

Expected build behavior:

- Build should pass.
- Vite may warn that chunks are larger than 500 kB because Three.js and large visuals are included. This warning is expected and is not a failure.

The project has a custom static preview server:

`tools\serve-dist.cjs`

It serves the built `dist` folder at:

`http://127.0.0.1:5173/`

Restart preview server on port 5173:

```powershell
$listener = netstat -ano | Select-String ':5173.*LISTENING' | Select-Object -First 1
if ($listener) {
  $pidText = ($listener.ToString().Trim() -split '\s+')[-1]
  if ($pidText -match '^\d+$') {
    Stop-Process -Id ([int]$pidText) -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
  }
}
$node = (Get-Command node.exe).Source
Start-Process -FilePath $node -ArgumentList 'tools\serve-dist.cjs' -WorkingDirectory 'C:\Users\Acer Nitro Gaming\Desktop\topic project' -WindowStyle Hidden
Start-Sleep -Seconds 2
try {
  $r = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:5173/' -TimeoutSec 5
  "Status=$($r.StatusCode)"
  [regex]::Matches($r.Content, 'assets/index-[^"'']+') | ForEach-Object { $_.Value }
} catch {
  "RequestFailed=$($_.Exception.Message)"
}
netstat -ano | Select-String ':5173.*LISTENING'
```

Stop preview server:

```powershell
$listener = netstat -ano | Select-String ':5173.*LISTENING' | Select-Object -First 1
if ($listener) {
  $pidText = ($listener.ToString().Trim() -split '\s+')[-1]
  if ($pidText -match '^\d+$') {
    Stop-Process -Id ([int]$pidText) -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
    "Stopped PID $pidText"
  }
} else {
  "No listener on 5173"
}
netstat -ano | Select-String ':5173.*LISTENING'
```

## 4. File Map

Entry files:

- `index.html`
  - Root HTML.
  - Title currently: `Body Systems Atlas`.
  - Loads `/src/main.jsx`.

- `src/main.jsx`
  - React entry.
  - Imports `App.jsx` and `styles.css`.
  - Renders app into `#root` inside `React.StrictMode`.

Main app:

- `src/App.jsx`
  - The main source of truth for the atlas experience.
  - Contains node coordinates, atlas configs, scroll camera logic, node plotting, modal/reveal UI, patient video backdrop, canvas particle fields, and Three.js patient intro.

- `src/styles.css`
  - The main visual system.
  - Contains all layouts, HUD styling, responsive styles, animation keyframes, node/orb styling, modal styling, Body Systems and Patient Units visual themes.

Data:

- `src/data/bodySystems.js`
  - Body Systems atlas data.
  - Contains the 12 body systems, their topics, images, subtopics/cards, labels, and metadata.

- `src/data/patientUnits.js`
  - Patient Units atlas data.
  - Generated from the Excel workbook's `Patient Units` tab.
  - Contains Patient Units, topics, cards, and face counts.

Older/modular components:

- `src/components/AtlasViewport.jsx`
- `src/components/CardBay.jsx`
- `src/components/SystemCard.jsx`
- `src/components/SystemGrid.jsx`
- `src/components/TerminalFooter.jsx`
- `src/components/TopicLayer.jsx`
- `src/store/hudStore.js`

These exist but the current active app is mostly centralized in `App.jsx` and `styles.css`.

Preview server:

- `tools/serve-dist.cjs`
  - Small Node static server.
  - Serves `dist`.
  - Uses `HOST` env var or `127.0.0.1`.
  - Uses `PORT` env var or `5173`.
  - Fallbacks unknown paths to `index.html`.
  - Uses `Cache-Control: no-store`.

## 5. Public Assets

Top-level assets in `public/assets`:

- `anatomy-scroll-background.png`
  - Main Body Systems intro/background image.

- `anatomy-scroll-background-v1.png`
  - Older/alternate anatomy background.

- `corezigma-logo.png`
  - User-provided Core Zigma logo.
  - Used in the intro brand plate.

- `hologram-body.png`
- `hologram-brain.png`
- `hologram-diagnostics.png`
  - Hologram assets, available for design use.

- `patient-units-asclepius-clinical-light.png`
  - Patient Units still/reference map image.
  - Also used as fallback visual for Patient Unit topics.

- `patient-units-asclepius-moon.png`
  - Old generated Patient Units background. Not the current main design.

- `patient-units-asclepius-network.png`
  - Old generated Patient Units background. Not the current main design.

- `patient-units-clinical-loop.mp4`
  - User-provided looping video copied into the project.
  - Used as Patient Units background video.
  - Video is played at `0.4x` speed in code.

- `patient-asclepius-transparent.png`
  - Generated transparent Rod of Asclepius image.
  - Overlays the Patient Units background video.

System images in `public/assets/systems`:

- `ca-oncology.png`
- `cv-cardiovascular.png`
- `en-endocrinology.png`
- `gi-gastrointestinal.png`
- `gn-gynecology.png`
- `hm-hematology.png`
- `if-infectious.png`
- `mk-musculoskeletal.png`
- `ne-neurology.png`
- `nph-nephrology.png`
- `rs-respiratory.png`
- `sk-skin.png`

Topic atlas images in `public/assets/topic-atlases`:

- One atlas image per system:
  - `ca-atlas.png`
  - `cv-atlas.png`
  - `en-atlas.png`
  - `gi-atlas.png`
  - `gn-atlas.png`
  - `hm-atlas.png`
  - `if-atlas.png`
  - `mk-atlas.png`
  - `ne-atlas.png`
  - `nph-atlas.png`
  - `rs-atlas.png`
  - `sk-atlas.png`

Topic visual images:

- `public/assets/topic-visuals`
  - Smaller topic visual set.

- `public/assets/topic-visuals-wide`
  - Wide topic visual set.
  - Used heavily in the detailed topic/modal visual areas.

Do not casually replace, crop, or reposition the existing medical images unless the user asks. The user has repeatedly emphasized that the inside containers are where intentionally chosen/generated images are placed.

## 6. External Source Assets

Original Excel workbook:

`C:\Users\Acer Nitro Gaming\Downloads\Grand Tally All Card Groupings for Video 0602 (1).xlsx`

Relevant workbook tabs:

- `Body Systems`
- `Patient Units`

Original user-provided video:

`C:\Users\Acer Nitro Gaming\Downloads\kling_20260705_VIDEO_a_very_blu_6035_0.mp4`

Copied to:

`public/assets/patient-units-clinical-loop.mp4`

Generated transparent Rod of Asclepius:

- Generated with the image generation tool using a chroma-key workflow.
- Final transparent asset:
  - `public/assets/patient-asclepius-transparent.png`
- Validation result at generation time:
  - RGBA
  - 1024 x 1536
  - transparent corners
  - alpha min/max: 0/255

## 7. Main App Constants

In `src/App.jsx`:

```js
const MAP_WIDTH = 2400;
const MAP_HEIGHT = 1350;
const PLOT_STORAGE_KEY = "body-system-node-plot-v7";
const PATIENT_MAP_IMAGE = "/assets/patient-units-asclepius-clinical-light.png";
const PATIENT_VIDEO_BACKGROUND = "/assets/patient-units-clinical-loop.mp4";
const PATIENT_ASCLEPIUS_OVERLAY = "/assets/patient-asclepius-transparent.png";
```

The map uses a fixed coordinate system of 2400 x 1350. Node coordinates, anchor points, curve control points, and camera behavior are all based on this coordinate plane.

## 8. Body Systems Node Coordinates

Current Body Systems nodes:

```js
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
```

Current Body Systems color themes:

```js
CV: "#ff5f6d"
RS: "#48b8ff"
GI: "#77f0a3"
NPH: "#3eeeff"
HM: "#b56cff"
IF: "#ffd34f"
NE: "#c16dff"
EN: "#ff9a45"
MK: "#42e6ff"
SK: "#ff5faf"
CA: "#ff6f9e"
GN: "#ff58c8"
```

Important: Body Systems main nodes should not float up and down. The user explicitly requested that the float behavior be Patient Units only.

## 9. Patient Units Node Coordinates

Current Patient Units nodes:

```js
{ id: "MB", x: 1552, y: 322, anchorX: 1204, anchorY: 476, lineX: 1378, lineY: 399, zoom: 2.38, focusX: 0.52, focusY: 0.45, region: "Maternal / Neonatal Continuum" },
{ id: "PD", x: 824, y: 372, anchorX: 1160, anchorY: 492, lineX: 992, lineY: 432, zoom: 2.28, focusX: 0.48, focusY: 0.45, region: "Growth / Development / Child Health" },
{ id: "MS", x: 724, y: 686, anchorX: 1098, anchorY: 682, lineX: 912, lineY: 684, zoom: 2.24, focusX: 0.48, focusY: 0.5, region: "Ward Skills / Medical-Surgical Care" },
{ id: "CC", x: 1684, y: 655, anchorX: 1260, anchorY: 650, lineX: 1470, lineY: 653, zoom: 2.5, focusX: 0.52, focusY: 0.5, region: "ICU / Hemodynamics / Perioperative" },
{ id: "ER", x: 1548, y: 956, anchorX: 1208, anchorY: 808, lineX: 1378, lineY: 882, zoom: 2.34, focusX: 0.52, focusY: 0.56, region: "Emergency / Triage / Resuscitation" },
{ id: "MH", x: 890, y: 980, anchorX: 1126, anchorY: 815, lineX: 1008, lineY: 898, zoom: 2.26, focusX: 0.48, focusY: 0.56, region: "Psych Ward / Therapeutic Care" },
{ id: "NS", x: 1200, y: 1130, anchorX: 1200, anchorY: 856, lineX: 1200, lineY: 995, zoom: 2.18, focusX: 0.5, focusY: 0.58, region: "Nurse Station / Priorities / Leadership" }
```

Current Patient Unit color themes:

```js
MB: "#6f7fb8"
PD: "#2e9bb2"
MS: "#7d75b5"
CC: "#bf6a93"
ER: "#c95f68"
MH: "#8c6ac6"
NS: "#526477"
```

Patient Units main nodes have a slow up/down float effect. The float is implemented in JavaScript inside `AnatomyMap`, not only CSS.

Relevant behavior:

- Only runs when `atlasMode === "patient"`.
- Does not run in plot mode.
- Respects `prefers-reduced-motion`.
- Writes CSS var `--node-float-y`.
- Current speed is 30 percent faster than the earlier version:

```js
const speed = (0.00048 + (index % 4) * 0.000035) * 1.3;
```

## 10. Atlas Modes

`atlasConfigs` in `App.jsx` defines both modes.

Body mode:

- id: `body`
- label/title: Body Systems
- tone: `sun`
- nodes: intro + 12 body systems
- background: anatomy image

Patient mode:

- id: `patient`
- label/title: Patient Units
- tone: `unit`
- nodes: intro + 7 patient units
- background: patient map image

The mode switch is intentionally shown only on the intro node. The user disliked the previous placement because it overlapped containers. Do not put the switch back over opened topic screens unless they ask.

## 11. Intro Branding

The intro has a brand plate with the Core Zigma logo.

Current branding text:

- `Core Zigma System`
- Main title:
  - Body mode: `Medical Topic Atlas`
  - Patient mode: `Patient Unit Atlas`
- Subtitle:
  - Body mode: `Summation Review Method`
  - Patient mode: `Clinical Unit Network`

The user specifically asked to change "Core Zigma" to "Core Zigma System". Keep that.

## 12. Patient Units Background Video

Component:

`PatientVideoBackdrop`

Current behavior:

- Only active when atlas mode is Patient Units.
- Uses:
  - `PATIENT_VIDEO_BACKGROUND = "/assets/patient-units-clinical-loop.mp4"`
  - `PATIENT_ASCLEPIUS_OVERLAY = "/assets/patient-asclepius-transparent.png"`
- The video is muted, looped, autoplayed, playsInline.
- Playback rate is set in JS to `0.4`.
- User asked for the video to be 0.4x slower.

Important:

- The user asked to remove the blurred-out film/veil on top of the video.
- The video itself can still be blurred via CSS. The removed thing was the overlaying film layer that made the video look covered.
- Current `patient-video-veil` should not create an obvious opaque film.

The Rod of Asclepius should sit over the video as a transparent PNG overlay.

## 13. Three.js Usage

Component:

`PatientUnitThreeIntro`

Purpose:

- Adds a 3D animated Patient Units intro overlay.
- Creates a stylized Rod of Asclepius form and node/orb structures in Three.js.
- Uses transparent WebGL canvas layered into the patient intro.

Important user feedback:

- The user previously disliked an unclear Three.js implementation on Body Systems and asked to revert it.
- Be careful adding abstract 3D visuals that do not communicate what they are.
- Any Three.js addition should be visually readable, medical, and supportive of the interface.

Current Three.js implementation includes:

- `THREE.WebGLRenderer({ alpha: true, antialias: true })`
- Orthographic camera over the same 2400 x 1350 map plane.
- Ambient, directional, point lights.
- Physical/transparent materials.
- A central rod, snake tube curve, halo rings, orb nodes, particle points.
- Pointer movement subtly affects the group.
- Fades as zoom increases.
- Cleans up renderer, geometry, materials, and listeners on unmount.

If performance is an issue, this is one of the places to optimize.

## 14. Canvas Animation Systems

There are several custom canvas animation components in `App.jsx`.

### SubtopicParticleField

Used in layer 04/topic-detail modal backgrounds.

Behavior:

- Fixed modal/background particle field.
- Theme-aware colors.
- Has warm particles and theme particles.
- Draws glowing dots and connecting lines.
- Similar to the sample particle field the user provided earlier, but adapted to project themes.

The user specifically wanted subtopic modal backgrounds to change color depending on the active body system theme.

### MainTopicDepthField

Used behind the main topic screen when a node is opened.

Behavior:

- Canvas depth field.
- Draws ECG/signal-like traces, perspective grid, particles, and links.
- Replaced an earlier spinning oblong animation the user disliked.

Important:

- The user explicitly disliked the spinning oblong behind the main topic modal.
- Do not reintroduce oblong/large rotating ellipse visuals.

### PatientUnitNetworkField

Available as a patient-unit style canvas field.

Behavior:

- Draws orbs and medical-network style motion.
- Can be used if future patient-unit screens need another animated background.

## 15. Main Interaction Flow

The app is scroll-driven and click-driven.

Important functions:

- `useScrollProgress`
  - Measures viewport and scroll progress.

- `getOverviewCamera`
  - Calculates overview camera scale/position.

- `getCamera`
  - Interpolates camera from intro to nodes based on scroll progress.
  - Handles intro-to-node zoom.
  - Applies mobile scaling.

- `getActiveIndex`
  - Determines which node is active from scroll progress.

- `jumpToNode`
  - Scrolls to the node's hidden page section.

- `activateNode`
  - Called when a node is clicked.
  - Isolates/open selected node.
  - Applies opening state.
  - Scrolls to node.

- `changeAtlasMode`
  - Switches Body Systems/Patient Units.
  - Resets hover, isolated node, opening node, and plot mode.
  - Scrolls to top.

## 16. Main Components In `App.jsx`

Major components/functions:

- `SignalText`
  - Small animated text helper.

- `NodePulseGrid`
  - Dot pulse grid visual.

- `SubtopicParticleField`
  - Particle background for subtopic modals.

- `MainTopicDepthField`
  - Main topic animated depth background.

- `PatientUnitNetworkField`
  - Patient unit orb/network background field.

- `PatientUnitThreeIntro`
  - Three.js patient intro.

- `PatientVideoBackdrop`
  - Patient background video and Rod overlay.

- `AnatomyMap`
  - Main map renderer.
  - Renders background image, nodes, SVG connectors, plot handles, Three intro layer, and node interactions.

- `SystemReveal`
  - Opened main topic panel/screen.
  - Renders title panel, image shell, topic list/cards, and Layer 04 modal.
  - Uses GSAP for reveal animation.

- `ScrollRail`
  - Scroll/page node navigation rail.

- `PlotToolbar`
  - Node coordinate edit mode.
  - Can copy plot coordinates.
  - Can reset local plot overrides.

- `AtlasModeSwitch`
  - Body Systems/Patient Units switch.
  - Currently placed in intro command deck.

- `IntroCommandDeck`
  - Holds intro brand and atlas switch.

- `IntroBrandPlate`
  - Logo and brand text block.

- `App`
  - Root state and composition.

## 17. Layer 04 / Topic Detail Modal

Layer 04 is the modal that opens after selecting a topic inside a main topic screen.

Recent design requirement:

- Background should be translucent enough that the user can still see they are under the selected body system.
- Container should be smaller so the background remains visible.
- The title of the parent/topic should be moved into the top container area instead of being placed below the generated topic visual.

Current implementation:

- `.subtopic-backdrop`
  - Semi-transparent dark overlay.
  - Low blur.

- `.subtopic-modal-shell`
  - Adds outer spacing so the modal is smaller than full screen.

- `.subtopic-modal`
  - Main Layer 04 panel.
  - Uses grid rows:
    - header
    - context strip
    - content/showcase

- `.subtopic-context-strip`
  - Contains:
    - generated/system visual label
    - selected topic title
    - parent system / linked subtopic count
  - This was added so the bottom overlay on the image was no longer needed.

- `.subtopic-visual-readout`
  - Was removed from inside the image panel for the new design.

When modifying Layer 04, preserve:

- Translucent background
- Smaller modal footprint
- Top context/title strip
- The actual visual/image containers

## 18. Plot Mode

Plot mode lets the user reposition node coordinates visually.

It stores overrides in localStorage:

```js
const PLOT_STORAGE_KEY = "body-system-node-plot-v7";
```

Plot toolbar features:

- Toggle plot mode.
- Drag node label, anchor, and line control points.
- Adjust plot zoom.
- Copy plot coordinates.
- Reset overrides.

Important:

- If coordinates look wrong, first check localStorage overrides in the browser. Stored overrides can make the app appear different than source constants.
- The user has provided exact coordinates several times. Do not casually auto-layout nodes.

## 19. Body Systems Data

Source:

`src/data/bodySystems.js`

Body Systems include:

- CV - Cardiovascular
- RS - Respiratory
- GI - Gastrointestinal
- NPH - Nephrology
- HM - Hematology
- IF - Infectious Diseases
- NE - Neurology
- EN - Endocrinology
- MK - Musculoskeletal
- SK - Skin
- CA - Oncology/Cancer
- GN - Gynecology

Each system includes topics and visual assets. Examples:

- CV topics include Hypertension, CAD, Heart-related Issues, Peripheral Vascular, ECG, Other Topics.
- IF topics include Overview, Immunization, Head, Respiratory, Heart, Other Infections.
- RS topics include Acid-Base, Fluid Related, Obstructive Diseases, Pulmo Embolism, Other Topics.

Use the data file as the source of truth for full topic/card structure.

## 20. Patient Units Data

Source:

`src/data/patientUnits.js`

Patient Units include:

- MB - Mother-Baby
- PD - Pediatrics
- MS - Med Surg
- CC - Critical Care
- ER - Emergency Department
- MH - Mental Health
- NS - Nurse Station

The first Patient Unit, Mother-Baby, has the example structure the user mentioned:

- Layer 1: Mother-Baby
- Layer 2: Obstetrical Issues
- Layer 3/cards:
  - Gestational Issues
  - Fetal Malpositions
  - C-Section

Current patient unit visuals mostly use:

`/assets/patient-units-asclepius-clinical-light.png`

as a fallback visual because specific per-topic patient-unit images have not been generated in the same way as Body Systems topic visuals.

## 21. Visual Design Principles To Preserve

General:

- Keep the interface cinematic, HUD-like, and medical.
- Do not make it look like a generic landing page.
- The user wants an actual interactive experience, not a marketing hero.
- Use visual assets heavily.
- Avoid overly abstract animations that do not communicate their purpose.

Body Systems:

- Dark, high-contrast medical HUD.
- Anatomy background is central.
- Nodes connect to the body with precise line geometry.
- Topic screens should feel like diagnostic panels.
- Do not use the rejected spinning oblong animation.
- Main Body Systems nodes should not float.

Patient Units:

- Should feel unique but connected to Body Systems.
- Current design uses a clinical video backdrop plus Rod of Asclepius.
- Patient Unit nodes float up/down slowly.
- Patient Units should not look like a literal sun/moon theme.
- It can use softer, clinical, glassy, layered motion while staying readable.

Node design:

- User asked for nodes to be more round/orb-like.
- Nodes have theme-based colors.
- Hover white nodes have pulsating growing/fading effect.

Modal design:

- Preserve image containers and medical visuals.
- Keep transitions polished but avoid heavy gimmicks.
- If trying new motion, do it on one system or one area first if possible.

## 22. Prior User Feedback And Reverts

Important history:

- The user first asked what stack could achieve a reference sci-fi UI, then asked to generate a sample.
- They later cancelled/restarted pieces and wanted removed files restored.
- They had connection issues when the server was not running. Always verify `127.0.0.1:5173`.
- They provided a sample particle-field canvas and wanted similar theme-aware particles in subtopic modals.
- They requested a tablet-expansion opening animation for main topic panels.
- They disliked the first tablet-expansion/topic-index animation and asked to remove it because it looked ugly.
- They provided new plot coordinates for Body Systems nodes. These are now in source.
- They disliked a spinning oblong animation behind main topic screens and wanted something else.
- A later Three.js experiment on Body Systems was unclear to them. They asked, "what am I looking at?" and then asked to revert all of it.
- They then asked for a more general motion system pass instead of unclear 3D.
- They asked to add Core Zigma branding into the intro, then later specifically changed it to "Core Zigma System".
- They asked Body Systems/Patient Units switch to be less hidden/less overlapping, ideally on intros and hidden while navigating through nodes. This is the current behavior.
- They wanted Patient Units main nodes to float up/down slowly, 30 percent faster, but only Patient Units, not Body Systems.
- They wanted a Patient Units video background slowed to 0.4x, with Rod of Asclepius transparent image overlay.
- They asked to remove the blurred film on top of the video.
- They wanted Layer 04 topic detail modal to be smaller and translucent so the parent body system context remains visible.

When continuing the project, preserve these decisions unless the user explicitly changes direction.

## 23. CSS Areas To Know

Everything visual is in `src/styles.css`, which is large.

Important class families:

- App shell and root:
  - `.app-shell`
  - `.atlas-mode-body`
  - `.atlas-mode-patient`

- Patient background:
  - `.patient-video-backdrop`
  - `.patient-video-backdrop video`
  - `.patient-video-veil`
  - `.patient-asclepius-mark`

- Intro:
  - `.intro-command-deck`
  - `.intro-brand-plate`
  - `.intro-brand-logo`
  - `.atlas-mode-switch`

- Map:
  - `.anatomy-stage`
  - `.anatomy-map`
  - `.map-image`
  - `.body-node`
  - `.node-shell`
  - `.node-anchor`
  - `.node-dot`
  - `.node-label`

- Node motion:
  - `--node-float-y`
  - patient-only JS sets this var.
  - CSS transforms consume it.

- Main topic reveal:
  - `.system-reveal`
  - `.subject-title-panel`
  - `.subject-image-shell`
  - `.subject-topic-dock`
  - `.subject-topic-card`
  - `.main-topic-depth-field`

- Layer 04:
  - `.subtopic-backdrop`
  - `.subtopic-modal-shell`
  - `.subtopic-modal`
  - `.subtopic-context-strip`
  - `.subtopic-showcase`
  - `.subtopic-visual-panel`
  - `.subtopic-card-panel`
  - `.subtopic-particle-field`
  - `.subtopic-grid-sheen`

- Plot mode:
  - `.plot-toolbar`
  - `.plot-handle`
  - `.plot-line-control`

## 24. Animation Libraries And Current Use

GSAP:

- Used in `SystemReveal`.
- Creates reveal timelines for main topic screens.
- Animates:
  - title panel
  - image shell
  - image readout
  - depth field
  - topic dock/header/cards

Anime.js:

- Used for dot/grid intro-like animated effects.
- Look for `createTimeline` and `.node-dot-grid`.

Framer Motion:

- Installed.
- Modal transitions use Framer-style components such as `AnimatePresence`.

Three.js:

- Used in `PatientUnitThreeIntro`.
- Keep Three.js effects transparent, readable, and supportive.

Canvas:

- Used for high-performance custom HUD particles and signal fields.
- Do not replace all canvas effects with DOM elements.

CSS:

- Many visual effects are CSS-only:
  - glow
  - scanlines
  - grid overlays
  - node pulse rings
  - transforms
  - responsive rules

## 25. Performance Notes

The project is visual-heavy:

- Many PNGs are large.
- The patient video is nearly 7 MB.
- Three.js is bundled.
- Canvas animations run continuously while visible.

Potential future improvements:

- Lazy-load Three.js only in Patient Units mode.
- Split large data/images if needed.
- Use `prefers-reduced-motion` more broadly.
- Ensure canvas animation loops are stopped when not visible.
- Optimize image sizes only if visual quality is preserved.

Do not optimize by downscaling medical images without checking the visual result.

## 26. Responsive Behavior

The app has mobile-specific behavior:

- `getOverviewCamera` changes scale for mobile.
- `getCamera` scales zoom down on mobile.
- CSS has mobile overrides for the main reveal and subtopic modal.

Be careful with:

- Large rotated side labels.
- Modal height.
- Header/context strip wrapping.
- Topic cards fitting inside panels.

The user tests visually in browser screenshots, so run and inspect whenever making layout changes.

## 27. Development Guidelines For The Next Agent

Use `rg` first for search.

Use `apply_patch` for manual edits.

Do not use destructive git commands.

There may not be a usable git repo. Earlier checks indicated this may not be a git repository. Do not assume revert is available.

Do not revert user changes unless explicitly requested.

For visual edits:

1. Make a narrow change.
2. Run `npm.cmd run build`.
3. Restart the custom preview server.
4. Verify `http://127.0.0.1:5173/`.
5. Summarize what changed and what to inspect.

For server issues:

- If the browser says "site cannot be reached", the preview server is probably stopped.
- Build first if `dist` is stale.
- Then restart `tools\serve-dist.cjs`.

For images:

- Keep assets in `public/assets`.
- Reference with absolute public paths like `/assets/file.png`.
- Do not reference local disk paths from React.

For new generated images:

- Save final usable image in `public/assets`.
- If transparent background is needed, create or post-process to PNG with alpha.
- Verify dimensions/transparency.

For spreadsheet updates:

- Use the workbook path above if available.
- Regenerate data files carefully.
- Preserve IDs, titles, and app structure.

## 28. Known Current Design State

As of this handoff:

- Body Systems is the dark sci-fi medical atlas.
- Patient Units has the looping blurred/dimmed clinical video background, transparent Rod of Asclepius overlay, and patient node float motion.
- The Body/Patient atlas switch is placed in the intro command deck only.
- The intro brand says `Core Zigma System`.
- Layer 04 is smaller and translucent with a top context/title strip.
- Patient video playback speed is `0.4`.
- The video overlay film was removed.
- Body Systems node float is disabled.
- Body Systems coordinates match the latest user-provided coordinate set.

## 29. Common User Preferences

The user likes:

- Cinematic, high-effort interfaces.
- Medical HUD / diagnostic visual language.
- Meaningful animation tied to the theme.
- Holographic details.
- Theme-aware colors.
- Smooth transitions that feel intentional.
- Seeing work implemented and then deciding whether to keep it.

The user dislikes:

- Ugly or gimmicky modal opening animations.
- Abstract 3D that is hard to understand.
- Repeated background particle ideas when they asked for something different.
- The spinning oblong/ellipse behind main topic panels.
- Controls overlapping content.
- Server not running after changes.
- Visual changes that hide or damage the medical image containers.

## 30. Suggested Future Work

Good next improvements:

- Add per-topic Patient Units visuals instead of reusing one fallback image.
- Lazy-load Three.js for Patient Units only.
- Improve Patient Units topic screens so they feel as finished as Body Systems.
- Add more polished mode transition when switching Body Systems/Patient Units on the intro.
- Add subtle audio-reactive-style or vital-sign style motion only if it remains readable.
- Improve mobile layout for Layer 04.
- Add an explicit "Back to Intro" control if user wants easier mode switching after opening a node.

Risky changes:

- Reworking all CSS at once.
- Replacing the main map/camera model.
- Introducing large, abstract 3D forms over Body Systems.
- Moving or resizing image containers without user approval.
- Reintroducing tablet expansion, spinning ellipses, or generic particle-only concepts.

## 31. Quick Orientation For A New Agent

If you need to continue development:

1. Open `src/App.jsx`.
2. Search for the component or constant you need.
3. Open `src/styles.css` beside it.
4. Make the smallest focused change.
5. Build:

```powershell
npm.cmd run build
```

6. Restart preview server:

```powershell
$listener = netstat -ano | Select-String ':5173.*LISTENING' | Select-Object -First 1
if ($listener) {
  $pidText = ($listener.ToString().Trim() -split '\s+')[-1]
  if ($pidText -match '^\d+$') {
    Stop-Process -Id ([int]$pidText) -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
  }
}
$node = (Get-Command node.exe).Source
Start-Process -FilePath $node -ArgumentList 'tools\serve-dist.cjs' -WorkingDirectory 'C:\Users\Acer Nitro Gaming\Desktop\topic project' -WindowStyle Hidden
Start-Sleep -Seconds 2
Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:5173/' -TimeoutSec 5
```

7. Tell the user exactly what changed and where to look.

## 32. Absolute Paths

Project root:

`C:\Users\Acer Nitro Gaming\Desktop\topic project`

Main files:

`C:\Users\Acer Nitro Gaming\Desktop\topic project\src\App.jsx`

`C:\Users\Acer Nitro Gaming\Desktop\topic project\src\styles.css`

`C:\Users\Acer Nitro Gaming\Desktop\topic project\src\data\bodySystems.js`

`C:\Users\Acer Nitro Gaming\Desktop\topic project\src\data\patientUnits.js`

Assets:

`C:\Users\Acer Nitro Gaming\Desktop\topic project\public\assets`

Preview server:

`C:\Users\Acer Nitro Gaming\Desktop\topic project\tools\serve-dist.cjs`

Excel workbook source:

`C:\Users\Acer Nitro Gaming\Downloads\Grand Tally All Card Groupings for Video 0602 (1).xlsx`

Original video source:

`C:\Users\Acer Nitro Gaming\Downloads\kling_20260705_VIDEO_a_very_blu_6035_0.mp4`

## 33. Final Note

This project is best treated as a bespoke visual interface, not a normal data dashboard. Preserve the cinematic medical atlas identity, keep changes scoped, and verify visually after every meaningful animation/layout edit.
