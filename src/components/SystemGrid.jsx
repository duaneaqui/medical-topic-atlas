import { motion } from "framer-motion";
import { SystemCard } from "./SystemCard.jsx";

export function SystemGrid({ systems }) {
  return (
    <motion.div
      className="system-grid"
      role="list"
      aria-label="Body system selector"
      initial={{ opacity: 0, x: -22, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -22, filter: "blur(6px)" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {systems.map((system) => (
        <SystemCard
          key={system.id}
          id={system.id}
          index={system.index}
          title={system.title}
        />
      ))}
    </motion.div>
  );
}
