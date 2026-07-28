const systems = [
  {
    number: "01",
    code: "CV",
    name: "Cardiovascular",
    accent: "#f8f8ff",
    image: "assets/systems/cv-cardiovascular.png",
    topics: ["Hypertension", "CAD", "Heart-related Issues", "Peripheral Vascular 1", "Peripheral Vascular 2", "ECG", "Other Topics"]
  },
  {
    number: "02",
    code: "RS",
    name: "Respiratory",
    accent: "#eeeeee",
    image: "assets/systems/rs-respiratory.png",
    topics: ["Obstructive Diseases", "Fluid-Related", "Pulmo-Embolism", "Acid-Base", "Other Topics"]
  },
  {
    number: "03",
    code: "GI",
    name: "Gastrointestinal",
    accent: "#fffaf0",
    image: "assets/systems/gi-gastrointestinal.png",
    topics: ["Upper GI issues", "Abdominal", "Liver Issues", "Intestinal Issues", "Other Topics"]
  },
  {
    number: "04",
    code: "NPH",
    name: "Nephrology",
    accent: "#f5f5f5",
    image: "assets/systems/nph-nephrology.png",
    topics: ["Kidney Diseases", "Stones and Cysts", "Adjuncts", "Acid-Base", "Ions (Electrolytes)", "Other Topics"]
  },
  {
    number: "05",
    code: "HM",
    name: "Hematology",
    accent: "#e8e8e8",
    image: "assets/systems/hm-hematology.png",
    topics: ["Anemia", "Bleeding", "Blood disorders 1", "Blood disorders 2", "Other Topics"]
  },
  {
    number: "06",
    code: "IF",
    name: "Infectious Diseases",
    accent: "#fffdf5",
    image: "assets/systems/if-infectious.png",
    topics: ["Overview", "Immunization", "Head", "Respiratory", "Heart", "Other Infections"]
  },
  {
    number: "07",
    code: "NE",
    name: "Neurology",
    accent: "#f0f0ea",
    image: "assets/systems/ne-neurology.png",
    topics: ["Stroke", "Brain Issues 1", "Brain Issues 2", "CNS and PNS issues", "ENT issues", "Other Topics"]
  },
  {
    number: "08",
    code: "EN",
    name: "Endocrinology",
    accent: "#faf9f2",
    image: "assets/systems/en-endocrinology.png",
    topics: ["Pituitary Issues", "Thyroid Issues", "Adrenal Issues", "Diabetes Mellitus", "Other Topics"]
  },
  {
    number: "09",
    code: "MK",
    name: "Musculoskeletal",
    accent: "#f7f7f7",
    image: "assets/systems/mk-musculoskeletal.png",
    topics: ["Arthritis and SLE", "Bone issues", "Spine and Muscle", "Other Topics"]
  },
  {
    number: "10",
    code: "SK",
    name: "Skin",
    accent: "#fffafa",
    image: "assets/systems/sk-skin.png",
    topics: ["Dermatitis and Psoriasis", "Urticaria and Acne", "Skin Infections", "Other Topics"]
  },
  {
    number: "11",
    code: "CA",
    name: "Oncology",
    accent: "#f4f1ea",
    image: "assets/systems/ca-oncology.png",
    topics: ["Terminologies", "Brain and Bone", "GI Cancers", "Other Cancers", "Other Topics"]
  },
  {
    number: "12",
    code: "GN",
    name: "Gynecology",
    accent: "#f8f8ff",
    image: "assets/systems/gn-gynecology.png",
    topics: ["GYN Cancers", "Menopause and Contraceptives", "Other Topics"]
  }
];

const state = {
  system: null,
  topic: null
};

const screenTitle = document.querySelector("#screenTitle");
const systemsList = document.querySelector("#systemsList");
const topicsGrid = document.querySelector("#topicsGrid");
const systemLayer = document.querySelector("#systemLayer");
const topicLayer = document.querySelector("#topicLayer");
const cardLayer = document.querySelector("#cardLayer");
const homeCrumb = document.querySelector("#homeCrumb");
const systemCrumb = document.querySelector("#systemCrumb");
const topicCrumb = document.querySelector("#topicCrumb");
const topicIntro = document.querySelector("#topicIntro");
const cardIntro = document.querySelector("#cardIntro");
const telemetryMode = document.querySelector("#telemetryMode");
const telemetryFocus = document.querySelector("#telemetryFocus");
const cardBay = document.querySelector("#cardBay");
const previewImage = document.querySelector("#previewImage");
const previewCaption = document.querySelector("#previewCaption");

const cardGroups = {
  "CV|Heart-related Issues": [
    { code: "CV 03", short: "CHF", title: "Congestive Heart Failure", faces: 2 },
    { code: "CV 04", short: "Valve", title: "Valvular Diseases", faces: 3 },
    { code: "CV 05", short: "CMPY", title: "Cardiomyopathy", faces: 2 },
    { code: "CV 06", short: "Peri", title: "Pericardial Diseases", faces: 2 }
  ]
};

function renderSystems() {
  systemsList.innerHTML = systems.map((system) => `
    <button class="system-row" style="--accent: ${system.accent}" type="button" data-system="${system.number}" data-image="${system.image}" title="${system.name}" aria-label="${system.number} ${system.name}">
      <span class="system-number">${system.number}</span>
      <span class="system-code">${system.code}</span>
      <span class="system-name">${system.name}</span>
      <span class="system-wave" aria-hidden="true"></span>
    </button>
  `).join("");
}

function previewSystem(system, lock = false) {
  if (!system) return;
  previewCaption.textContent = lock ? `${system.name} Locked` : `${system.name} Preview`;
  if (previewImage.src.endsWith(system.image)) return;
  previewImage.classList.remove("image-swap");
  void previewImage.offsetWidth;
  previewImage.src = system.image;
  previewImage.classList.add("image-swap");
}

function resetPreview() {
  const focusSystem = state.system || null;
  if (focusSystem) {
    previewSystem(focusSystem, true);
    return;
  }
  previewImage.classList.remove("image-swap");
  void previewImage.offsetWidth;
  previewImage.src = "assets/hologram-body.png";
  previewCaption.textContent = "Full Systems Scan";
  previewImage.classList.add("image-swap");
}

function renderTopics(system) {
  topicsGrid.innerHTML = system.topics.map((topic, index) => `
    <button class="topic-tile" style="--accent: ${system.accent}" type="button" data-topic="${topic}" title="${topic}">
      <span class="topic-index">${system.code}-${String(index + 1).padStart(2, "0")}</span>
      <strong class="topic-name">${topic}</strong>
      <span class="topic-footer">
        <span>Visual bay</span>
        <span>Ready</span>
      </span>
    </button>
  `).join("");
}

function renderCardGallery(system, topic, topicCode) {
  const cards = cardGroups[`${system.code}|${topic}`] || [
    {
      code: topicCode.replace("-", " "),
      short: system.code,
      title: topic,
      faces: null
    }
  ];

  cardBay.classList.toggle("multi-card", cards.length > 1);
  cardBay.innerHTML = cards.map((card, index) => `
    <article class="study-card" style="--card-index: ${index}">
      <div class="study-card-top">
        <span>${card.code}</span>
        <strong>${card.short}</strong>
      </div>
      <div class="study-card-body">
        <p>${card.title}</p>
        <div class="study-card-slot">
          <span>Card image pending</span>
        </div>
      </div>
      <footer>
        <span>${card.faces ? `${card.faces} faces` : "Portrait card"}</span>
        <span>${system.name}</span>
      </footer>
    </article>
  `).join("");
}

function setActiveLayer(layerName) {
  const layers = [systemLayer, topicLayer, cardLayer];
  layers.forEach((layer) => {
    const isActive = layer.dataset.layer === layerName;
    layer.classList.toggle("layer-active", isActive);
    layer.setAttribute("aria-hidden", String(!isActive));
  });
}

function updateChrome(depth, focus) {
  telemetryMode.textContent = `Layer ${String(depth).padStart(2, "0")}`;
  telemetryFocus.textContent = focus;
  homeCrumb.classList.toggle("active", depth === 1);
  systemCrumb.classList.toggle("active", depth === 2);
  topicCrumb.classList.toggle("active", depth === 3);
}

function openHome() {
  state.system = null;
  state.topic = null;
  screenTitle.textContent = "Body Systems";
  systemCrumb.hidden = true;
  topicCrumb.hidden = true;
  setActiveLayer("systems");
  updateChrome(1, "Body Systems");
  resetPreview();
}

function openSystem(system) {
  state.system = system;
  state.topic = null;
  screenTitle.textContent = system.name;
  systemCrumb.textContent = system.name;
  systemCrumb.hidden = false;
  topicCrumb.hidden = true;
  topicIntro.textContent = `${system.number} ${system.name}: select a subtopic to open its visual card layer.`;
  renderTopics(system);
  previewSystem(system, true);
  setActiveLayer("topics");
  updateChrome(2, system.name);
}

function openTopic(topic) {
  state.topic = topic;
  const topicIndex = state.system.topics.indexOf(topic) + 1;
  const topicCode = `${state.system.code}-${String(topicIndex).padStart(2, "0")}`;
  screenTitle.textContent = topic;
  topicCrumb.textContent = topic;
  topicCrumb.hidden = false;
  cardIntro.textContent = `${state.system.name} / ${topic}: card gallery view.`;
  renderCardGallery(state.system, topic, topicCode);
  previewSystem(state.system, true);
  setActiveLayer("cards");
  updateChrome(3, topic);
}

renderSystems();

systemsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-system]");
  if (!button) return;
  const system = systems.find((item) => item.number === button.dataset.system);
  if (system) openSystem(system);
});

systemsList.addEventListener("mouseover", (event) => {
  const button = event.target.closest("[data-system]");
  if (!button) return;
  const system = systems.find((item) => item.number === button.dataset.system);
  previewSystem(system);
});

systemsList.addEventListener("focusin", (event) => {
  const button = event.target.closest("[data-system]");
  if (!button) return;
  const system = systems.find((item) => item.number === button.dataset.system);
  previewSystem(system);
});

systemsList.addEventListener("mouseleave", resetPreview);

topicsGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-topic]");
  if (!button || !state.system) return;
  openTopic(button.dataset.topic);
});

homeCrumb.addEventListener("click", openHome);
systemCrumb.addEventListener("click", () => {
  if (state.system) openSystem(state.system);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (state.topic && state.system) {
    openSystem(state.system);
    return;
  }
  if (state.system) openHome();
});
