import { AnimatePresence, motion } from "framer-motion";

export function AtlasViewport({ system, isPreviewing }) {
  return (
    <section className="atlas-viewport" aria-label="System atlas viewport">
      <div className="atlas-viewport__header">
        <span>{isPreviewing ? "Hover Preview" : "Active System"}</span>
        <strong>{system.title}</strong>
      </div>

      <div className="atlas-viewport__frame">
        <AnimatePresence mode="wait">
          <motion.img
            key={system.id}
            src={system.image}
            alt=""
            initial={{ opacity: 0, scale: 1.045, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.985, filter: "blur(4px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          />
        </AnimatePresence>
        <div className="atlas-reticle" aria-hidden="true" />
      </div>
    </section>
  );
}
