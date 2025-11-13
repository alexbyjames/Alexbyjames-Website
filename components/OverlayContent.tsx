"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { featuredSections, sectionMap, type SectionId } from "@/lib/featuredSections";

type OverlayItem = {
  label: string;
  href?: string;
  openInNewTab?: boolean;
};

type OverlaySection = {
  id: string;
  title: string;
  items: OverlayItem[];
};

const overlaySections: OverlaySection[] = [
  {
    id: "music",
    title: "Music Videos",
    items: [
      { label: "Music Video Showreel", href: "#" },
      ...sectionMap.music.projects.map((project) => ({
        label: project.title,
        href: project.href,
        openInNewTab: Boolean(project.href && !project.embed),
      })),
    ],
  },
  {
    id: "work16",
    title: "16mm Work",
    items: [{ label: "16mm Showreel", href: "#" }],
  },
  {
    id: "commercial",
    title: "Commercial",
    items: [
      { label: "Commercial Showreel", href: "/video/commercial_test.mp4", openInNewTab: true },
      ...sectionMap.commercial.projects.map((project) => ({
        label: project.title,
        href: project.href,
        openInNewTab: Boolean(project.href && !project.embed),
      })),
    ],
  },
];

export default function OverlayContent() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSectionHover = (sectionId: string) => {
    if (!isMobile) {
      setExpandedSection(sectionId);
    }
  };

  const handleSectionLeave = () => {
    if (!isMobile) {
      setExpandedSection(null);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    if (isMobile) {
      // Toggle on mobile
      setExpandedSection(expandedSection === sectionId ? null : sectionId);
    }
  };

  const getTitleBottom = () => {
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect();
      return rect.bottom;
    }
    return 200; // fallback
  };

  const currentSection = overlaySections.find((s) => s.id === expandedSection);

  return (
    <div className="relative z-20 text-white p-10 md:p-12">
      <div ref={titleRef}>
        <h1 className="text-6xl md:text-8xl font-semibold leading-tight mb-2">
          James Alexander Topham
        </h1>
        <p className="text-lg md:text-xl mb-6 text-white/90">
          Cinematographer & Director
        </p>
      </div>

      {/* Slash Navigation */}
      <nav className="flex gap-3 text-[min(4vw,20px)] font-medium mb-8">
        {overlaySections.map((section, index) => (
          <div key={section.id} className="flex items-center gap-3">
            <button
              data-section={section.id}
              onClick={() => handleSectionClick(section.id)}
              onMouseEnter={() => handleSectionHover(section.id)}
              onMouseLeave={handleSectionLeave}
              onFocus={() => !isMobile && handleSectionHover(section.id)}
              onBlur={() => !isMobile && handleSectionLeave()}
              className="hover:opacity-80 transition-opacity text-white py-2 px-1"
              aria-expanded={expandedSection === section.id}
              aria-controls={`section-${section.id}`}
            >
              {section.title}
            </button>
            {index < overlaySections.length - 1 && (
              <span className="text-white/60">/</span>
            )}
          </div>
        ))}
      </nav>

      {/* Left-edge list when hovering */}
      <AnimatePresence>
        {currentSection && (
          <motion.ul
            id={`section-${currentSection.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-10 z-20 space-y-2"
            style={{
              top: `${getTitleBottom() + 12}px`,
            }}
            role="menu"
          >
            <li>
              <a
                href="#"
                className="block text-base md:text-lg text-white/90 hover:text-white transition-colors py-1"
                role="menuitem"
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentSection.title}
              </a>
            </li>
            {currentSection.items.map((item, index) => (
              <li key={`${currentSection.id}-${index}`}>
                <a
                  href={item.href ?? "#"}
                  className="block text-base md:text-lg text-white/90 hover:text-white transition-colors py-1"
                  role="menuitem"
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!item.href || !item.openInNewTab) {
                      e.preventDefault();
                    }
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
