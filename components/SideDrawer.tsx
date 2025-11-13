"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type Project, type Category, categories } from "@/lib/projects";
import { useState } from "react";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (category: Category | null) => void;
  selectedCategory: Category | null;
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function SideDrawer({
  isOpen,
  onClose,
  onCategorySelect,
  selectedCategory,
  projects,
  onProjectClick,
}: SideDrawerProps) {
  const [expandedCategory, setExpandedCategory] = useState<Category | null>(null);

  const handleCategoryClick = (category: Category | null) => {
    onCategorySelect(category);
    onClose();
    // Scroll to grid section
    setTimeout(() => {
      const gridSection = document.querySelector("section[class*='pt-']");
      if (gridSection) {
        gridSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleProjectClick = (project: Project) => {
    onProjectClick(project);
    onClose();
  };

  const projectsByCategory = categories.reduce((acc, category) => {
    acc[category] = projects.filter((p) => p.category === category);
    return acc;
  }, {} as Record<Category, Project[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-40"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 md:w-96 bg-black border-l border-white/10 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="p-8 space-y-6">
              {/* Navigation Sections */}
              <nav aria-label="Main navigation">
                <ul className="space-y-4">
                  <li>
                    <button
                      onClick={() => handleCategoryClick(null)}
                      className={`text-left w-full py-2 text-lg font-semibold ${
                        selectedCategory === null
                          ? "text-white border-l-4 border-white pl-4"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      All
                    </button>
                  </li>

                  {categories.map((category) => {
                    const categoryProjects = projectsByCategory[category] || [];
                    const isExpanded = expandedCategory === category;

                    return (
                      <li key={category}>
                        <button
                          onClick={() =>
                            setExpandedCategory(isExpanded ? null : category)
                          }
                          className="text-left w-full py-2 text-lg font-semibold text-white/80 hover:text-white flex items-center justify-between"
                        >
                          <span>
                            {category}
                            {category === "Narrative" && (
                              <span className="ml-2 text-sm text-white/50 font-normal">
                                (coming soon)
                              </span>
                            )}
                          </span>
                          {categoryProjects.length > 0 && (
                            <motion.span
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              className="text-white/60"
                            >
                              →
                            </motion.span>
                          )}
                        </button>

                        {/* Project List */}
                        <AnimatePresence>
                          {isExpanded && categoryProjects.length > 0 && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-6 mt-2 space-y-2"
                            >
                              {categoryProjects.map((project) => (
                                <li key={project.id}>
                                  <button
                                    onClick={() => handleProjectClick(project)}
                                    className="text-left w-full py-1.5 text-base text-white/70 hover:text-white transition-colors"
                                  >
                                    {project.title}
                                    {project.year && (
                                      <span className="ml-2 text-sm text-white/50">
                                        ({project.year})
                                      </span>
                                    )}
                                  </button>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>

                        {/* Direct category filter button */}
                        {categoryProjects.length > 0 && (
                          <button
                            onClick={() => handleCategoryClick(category)}
                            className="text-left w-full py-1 text-sm text-white/50 hover:text-white/70 transition-colors"
                          >
                            View all {category}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* About / Contact (Desktop only) */}
              <div className="hidden md:block pt-8 border-t border-white/10">
                <div className="space-y-2 text-sm">
                  <p>@alexbyjames</p>
                  <p>
                    <a
                      href="mailto:alexbyjames@icloud.com"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      alexbyjames@icloud.com
                    </a>
                  </p>
                  <p>
                    <a
                      href="tel:+447970039098"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      +44 7970 039098
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

