import { motion } from "framer-motion";
import { useHudStore } from "../store/hudStore.js";

export function SystemCard({ id, index, title }) {
  const activeSystem = useHudStore((state) => state.activeSystem);
  const selectSystem = useHudStore((state) => state.selectSystem);
  const setHoveredSystem = useHudStore((state) => state.setHoveredSystem);
  const clearHoveredSystem = useHudStore((state) => state.clearHoveredSystem);
  const isActive = activeSystem === id;

  return (
    <motion.button
      type="button"
      role="listitem"
      className={`system-card ${isActive ? "is-active" : ""}`}
      onClick={() => selectSystem(id)}
      onHoverStart={() => setHoveredSystem(id)}
      onHoverEnd={clearHoveredSystem}
      onFocus={() => setHoveredSystem(id)}
      onBlur={clearHoveredSystem}
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 430, damping: 30 }}
      aria-pressed={isActive}
      aria-label={`${index} ${title}`}
    >
      <span className="system-card__index">{index}</span>
      <span className="system-card__abbr">{id}</span>
      <span className="system-card__title">{title}</span>
      <span className="system-card__trace" aria-hidden="true" />
    </motion.button>
  );
}
