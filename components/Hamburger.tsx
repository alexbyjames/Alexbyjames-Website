"use client";

import { motion } from "framer-motion";

interface HamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function Hamburger({ isOpen, onClick }: HamburgerProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 z-50 p-4 md:p-6 bg-black/80 backdrop-blur-sm border border-white/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-white"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <motion.span
          animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          className="block h-0.5 w-full bg-white origin-center transition-all"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="block h-0.5 w-full bg-white transition-all"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          className="block h-0.5 w-full bg-white origin-center transition-all"
        />
      </div>
    </button>
  );
}

