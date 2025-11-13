"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type Project, type Category } from "@/lib/projects";
import { useState, useEffect } from "react";

interface TileProps {
  project: Project;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onClick: () => void;
  selectedCategory: Category | null;
  isMobile: boolean;
}

export default function Tile({
  project,
  isFocused,
  onFocus,
  onBlur,
  onClick,
  selectedCategory,
  isMobile,
}: TileProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const isFilteredOut = selectedCategory !== null && project.category !== selectedCategory;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      id={isMobile ? `tile-${project.id}` : undefined}
      className="relative aspect-square overflow-hidden cursor-pointer group"
      onMouseEnter={!isMobile ? onFocus : undefined}
      onMouseLeave={!isMobile ? onBlur : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${project.title}`}
      whileHover={!isMobile && !isReducedMotion ? { scale: 1.05 } : {}}
      animate={
        !isReducedMotion
          ? {
              scale: isMobile && isFocused ? 1.05 : (isFocused ? 1.05 : 1),
              opacity: isFilteredOut 
                ? 0.3 
                : isMobile 
                  ? (isFocused ? 1 : 0.35) 
                  : (isFocused ? 1 : 0.35),
            }
          : {
              opacity: isFilteredOut ? 0.3 : 1,
            }
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        pointerEvents: isFilteredOut ? "none" : "auto",
      }}
    >
      <Image
        src={project.imageSrc}
        alt={project.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        loading="lazy"
      />
      
      {/* Title Label (shown on hover/focus) */}
      {(isFocused || isMobile) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-0 left-0 right-0 p-4 bg-black/80"
        >
          <p className="text-white text-sm md:text-base font-medium">
            {project.title}
            {project.year && <span className="ml-2 text-white/70">({project.year})</span>}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

