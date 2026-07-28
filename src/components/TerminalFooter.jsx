import { useHudStore } from "../store/hudStore.js";

export function TerminalFooter({ previewSystem, focusLabel }) {
  const navigationDepth = useHudStore((state) => state.navigationDepth);
  const scanProgress = useHudStore((state) => state.scanProgress);
  const isScanning = useHudStore((state) => state.isScanning);
  const hoveredSystem = useHudStore((state) => state.hoveredSystem);

  return (
    <footer className="terminal-footer" aria-label="HUD telemetry">
      <div>
        <span>Navigation Depth</span>
        <strong>Layer {String(navigationDepth).padStart(2, "0")}</strong>
      </div>
      <div>
        <span>{hoveredSystem ? "Preview Readout" : "Current Focus"}</span>
        <strong>{focusLabel || previewSystem.title}</strong>
      </div>
      <div>
        <span>{isScanning ? "Scanning" : "Scan Progress"}</span>
        <strong>{scanProgress}%</strong>
        <i style={{ "--progress": `${scanProgress}%` }} />
      </div>
    </footer>
  );
}
