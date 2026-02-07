"use client";

import { motion } from "framer-motion";

interface FilterBarProps {
  filter: string;
  setFilter: (filter: string) => void;
}

const filters = [
  { id: "all", label: "TODOS", icon: "✨" },
  { id: "sneaker", label: "TÊNIS", icon: "👟" },
  { id: "apparel", label: "ROUPAS", icon: "👕" },
  { id: "limited", label: "EDIÇÃO LIMITADA", icon: "🔥" },
];

export function FilterBar({ filter, setFilter }: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        padding: "40px",
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      {filters.map((f) => (
        <button
          type="button"
          key={f.id}
          onClick={() => setFilter(f.id)}
          style={{
            padding: "12px 24px",
            background:
              filter === f.id
                ? "rgba(201, 169, 97, 0.2)"
                : "rgba(255, 255, 255, 0.05)",
            border:
              filter === f.id
                ? "1px solid #c9a961"
                : "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "50px",
            color: filter === f.id ? "#c9a961" : "rgba(255, 255, 255, 0.7)",
            fontFamily: "Georgia, serif",
            fontSize: "0.75rem",
            letterSpacing: "2px",
            cursor: "pointer",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (filter !== f.id) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (filter !== f.id) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }
          }}
        >
          <span>{f.icon}</span>
          <span>{f.label}</span>
        </button>
      ))}
    </motion.div>
  );
}
