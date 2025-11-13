"use client";

import { type Category, categories } from "@/lib/projects";
import { motion } from "framer-motion";

interface FiltersProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
  isMobile: boolean;
}

export default function Filters({
  selectedCategory,
  onCategorySelect,
  isMobile,
}: FiltersProps) {
  if (isMobile) return null;

  return (
    <div className="flex gap-2 md:gap-4" role="group" aria-label="Filter projects by category">
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-3 py-1.5 text-sm md:text-base transition-colors ${
          selectedCategory === null
            ? "text-white border-b-2 border-white"
            : "text-white/60 hover:text-white/80"
        }`}
        aria-pressed={selectedCategory === null}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          className={`px-3 py-1.5 text-sm md:text-base transition-colors ${
            selectedCategory === category
              ? "text-white border-b-2 border-white"
              : "text-white/60 hover:text-white/80"
          }`}
          aria-pressed={selectedCategory === category}
        >
          {category}
          {category === "Narrative" && (
            <span className="ml-1 text-xs text-white/50">(coming soon)</span>
          )}
        </button>
      ))}
    </div>
  );
}

