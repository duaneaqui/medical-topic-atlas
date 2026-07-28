import { motion } from "framer-motion";
import { useHudStore } from "../store/hudStore.js";

export function CardBay({ system, topic }) {
  const activeCard = useHudStore((state) => state.activeCard);
  const goToTopics = useHudStore((state) => state.goToTopics);
  const selectCard = useHudStore((state) => state.selectCard);
  const cards = topic?.cards || [];
  const selectedCard = cards.find((card) => card.id === activeCard) || cards[0];

  return (
    <motion.div
      className="card-bay"
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="layer-toolbar">
        <button type="button" onClick={goToTopics}>Back</button>
        <span>{system.id} Card Bay</span>
      </div>

      <div className="card-stage" aria-live="polite">
        <motion.div
          key={selectedCard?.id}
          className="learning-card-preview"
          initial={{ opacity: 0, rotateY: -16, scale: 0.94 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <span>{selectedCard?.code || "CARD"}</span>
          <strong>{selectedCard?.title || "Card Placeholder"}</strong>
          <em>{topic.title}</em>
          <p>{selectedCard?.faces || 0} visual card faces ready for future artwork placement.</p>
        </motion.div>
      </div>

      <div className="card-rail" role="list" aria-label={`${topic.title} card groups`}>
        {cards.map((card, index) => (
          <motion.button
            type="button"
            role="listitem"
            key={card.id}
            className={`card-chip ${card.id === selectedCard?.id ? "is-active" : ""}`}
            onClick={() => selectCard(card.id)}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035, duration: 0.2 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{card.code}</span>
            <strong>{card.title}</strong>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
