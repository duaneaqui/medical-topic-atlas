import { create } from "zustand";

let scanTimer;

export const useHudStore = create((set, get) => ({
  viewMode: "systems",
  activeSystem: "CV",
  activeTopic: null,
  activeCard: null,
  hoveredSystem: null,
  hoveredTopic: null,
  navigationDepth: 1,
  scanProgress: 100,
  isScanning: false,

  setHoveredSystem: (systemId) => set({ hoveredSystem: systemId }),
  clearHoveredSystem: () => set({ hoveredSystem: null }),
  setHoveredTopic: (topicId) => set({ hoveredTopic: topicId }),
  clearHoveredTopic: () => set({ hoveredTopic: null }),
  setNavigationDepth: (depth) => set({ navigationDepth: depth }),

  goToSystems: () => {
    clearInterval(scanTimer);
    set({
      viewMode: "systems",
      activeTopic: null,
      activeCard: null,
      hoveredSystem: null,
      hoveredTopic: null,
      navigationDepth: 1,
      scanProgress: 100,
      isScanning: false
    });
  },

  goToTopics: () => {
    clearInterval(scanTimer);
    set({
      viewMode: "topics",
      activeTopic: null,
      activeCard: null,
      hoveredTopic: null,
      navigationDepth: 2,
      scanProgress: 100,
      isScanning: false
    });
  },

  selectSystem: (systemId) => {
    clearInterval(scanTimer);
    set({
      viewMode: "topics",
      activeSystem: systemId,
      activeTopic: null,
      activeCard: null,
      hoveredSystem: null,
      hoveredTopic: null,
      navigationDepth: 2,
      scanProgress: 0,
      isScanning: true
    });

    scanTimer = setInterval(() => {
      const next = Math.min(get().scanProgress + 8 + Math.round(Math.random() * 14), 100);
      set({
        scanProgress: next,
        isScanning: next < 100
      });

      if (next >= 100) clearInterval(scanTimer);
    }, 46);
  },

  selectTopic: (topicId, firstCardId = null) => {
    clearInterval(scanTimer);
    set({
      viewMode: firstCardId ? "cards" : "topics",
      activeTopic: topicId,
      activeCard: firstCardId,
      hoveredTopic: null,
      navigationDepth: firstCardId ? 3 : 2,
      scanProgress: 0,
      isScanning: true
    });

    scanTimer = setInterval(() => {
      const next = Math.min(get().scanProgress + 10 + Math.round(Math.random() * 18), 100);
      set({
        scanProgress: next,
        isScanning: next < 100
      });

      if (next >= 100) clearInterval(scanTimer);
    }, 42);
  },

  selectCard: (cardId) => set({ activeCard: cardId })
}));
