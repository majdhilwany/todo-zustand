import { motion } from "framer-motion";
import { useTodoStore } from "../store/useTodoStore";

const FILTERS = ["all", "active", "completed"];

export default function TodoFilters() {
  const filter = useTodoStore((s) => s.filter);
  const setFilter = useTodoStore((s) => s.setFilter);

  return (
    <div className="filters">
      {FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          className={`filter ${filter === f ? "active" : ""}`}
          onClick={() => setFilter(f)}
        >
          {/* the pill slides between buttons thanks to layoutId */}
          {filter === f && (
            <motion.span
              layoutId="filter-pill"
              className="filter-pill"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="filter-label">{f}</span>
        </button>
      ))}
    </div>
  );
}
