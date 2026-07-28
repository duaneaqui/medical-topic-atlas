import { AnimatePresence, motion } from "framer-motion";
import { useHudStore } from "../store/hudStore.js";

export function TopicLayer({ system }) {
  const activeTopic = useHudStore((state) => state.activeTopic);
  const hoveredTopic = useHudStore((state) => state.hoveredTopic);
  const goToSystems = useHudStore((state) => state.goToSystems);
  const selectTopic = useHudStore((state) => state.selectTopic);
  const setHoveredTopic = useHudStore((state) => state.setHoveredTopic);
  const clearHoveredTopic = useHudStore((state) => state.clearHoveredTopic);

  return (
    <motion.div
      className="topic-layer"
      initial={{ opacity: 0, x: 28, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -24, filter: "blur(6px)" }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="layer-toolbar">
        <button type="button" onClick={goToSystems}>Back</button>
        <span>{system.id} Topic Matrix</span>
      </div>

      <div className="topic-list" role="list" aria-label={`${system.title} topics`}>
        <AnimatePresence>
          {system.topics.map((topic, index) => {
            const cardCount = topic.cards?.length || 0;
            const isActive = activeTopic === topic.id;
            const isPreviewed = hoveredTopic === topic.id;

            return (
              <motion.button
                type="button"
                role="listitem"
                key={topic.id}
                className={`topic-row ${isActive ? "is-active" : ""} ${isPreviewed ? "is-previewed" : ""}`}
                onClick={() => selectTopic(topic.id, topic.cards?.[0]?.id || null)}
                onHoverStart={() => setHoveredTopic(topic.id)}
                onHoverEnd={clearHoveredTopic}
                onFocus={() => setHoveredTopic(topic.id)}
                onBlur={clearHoveredTopic}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ delay: index * 0.025, duration: 0.2, ease: "easeOut" }}
                whileHover={{ x: 5, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                aria-label={`${topic.title}${cardCount ? `, ${cardCount} card groups` : ""}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{topic.title}</strong>
                <em>{cardCount ? `${cardCount} Cards` : "Pending"}</em>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
