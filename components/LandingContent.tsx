"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  featuredSections,
  sectionMap,
  projectMapBySlug,
  type SectionId,
  type ProjectRole,
} from "@/lib/featuredSections";
import { getEmbedSrc } from "@/lib/embed";

interface LandingContentProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  initialProjectSlug?: string;
  onProjectChange?: (payload: { slug: string; section: SectionId } | null) => void;
}

export default function LandingContent({
  activeSection,
  onSectionChange,
  initialProjectSlug,
  onProjectChange,
}: LandingContentProps) {
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(null);
  const [embeddedVideo, setEmbeddedVideo] = useState<{
    src: string;
    title: string;
    slug: string;
    role?: ProjectRole;
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listNeedsScrolling, setListNeedsScrolling] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const closeModal = () => {
    setEmbeddedVideo(null);
    setShowContact(false);
    requestAnimationFrame(() => {
      lastFocusedRef.current?.focus();
    });
    onProjectChange?.(null);
  };

  useEffect(() => {
    if (!embeddedVideo) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const focusTimer = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(focusTimer);
    };
  }, [embeddedVideo]);

  const handleSectionClick = (sectionId: SectionId) => {
    // Change video background
    onSectionChange(sectionId);

    // Toggle dropdown
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  useEffect(() => {
    if (!initialProjectSlug) {
      return;
    }

    const project = projectMapBySlug[initialProjectSlug];
    if (!project || !project.embed || !project.href) {
      return;
    }

    if (embeddedVideo?.slug === project.slug) {
      return;
    }

    if (expandedSection !== project.section) {
      setExpandedSection(project.section);
    }

    const embedSrc = getEmbedSrc(project.href);
    if (embedSrc) {
      setEmbeddedVideo({
        src: embedSrc,
        title: project.title,
        slug: project.slug,
        role: project.role,
      });
      onProjectChange?.({ slug: project.slug, section: project.section });
    }
  }, [initialProjectSlug, embeddedVideo?.slug, expandedSection, onProjectChange]);

  // Check if list needs scrolling
  useEffect(() => {
    // Reset immediately when section changes
    setListNeedsScrolling(false);
    
    if (!expandedSection) {
      return;
    }

    const checkScrolling = () => {
      const container = listContainerRef.current;
      if (!container) {
        setListNeedsScrolling(false);
        return;
      }
      
      // Check if content height exceeds container height
      const needsScrolling = container.scrollHeight > container.clientHeight;
      setListNeedsScrolling(needsScrolling);
    };

    // Check after a delay to ensure DOM is fully updated with new section content
    const timeoutId = setTimeout(checkScrolling, 200);
    
    // Also check on window resize
    window.addEventListener('resize', checkScrolling);
    
    // Use MutationObserver to detect when list content changes
    const observer = new MutationObserver(checkScrolling);
    if (listContainerRef.current) {
      observer.observe(listContainerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkScrolling);
      observer.disconnect();
    };
  }, [expandedSection]);

  const handleProjectClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    project: { href?: string; embed?: string; role?: ProjectRole; title: string; slug: string },
    section: SectionId
  ) => {
    const { href, embed, role, title, slug } = project;
    if (!href) {
      e.preventDefault();
      return;
    }

    const allowEmbed = Boolean(embed) && Boolean(href);
    const embedSrc = allowEmbed && href ? getEmbedSrc(href) : null;

    if (embedSrc) {
      if (e.metaKey || e.ctrlKey || e.button !== 0) {
        return;
      }

      e.preventDefault();
      lastFocusedRef.current = e.currentTarget;
      setEmbeddedVideo({
        src: embedSrc,
        title,
        slug,
        role,
      });
      onProjectChange?.({ slug, section });
    }
  };

  return (
    <div className="relative z-20 text-white">
      {/* Mobile Layout (below md) */}
      <div className="block md:hidden px-4 pt-6 pb-8">
        {/* Top Row: Name (left), Roles (right) */}
        <div
          className={`flex items-start justify-between gap-4 ${
            embeddedVideo ? "relative z-[60] pointer-events-none select-none" : ""
          }`}
        >
          <div>
            <Link href="/" className="block">
              <h1 className="text-xs font-black leading-tight hover:opacity-80 transition-opacity cursor-pointer">
                Alexander
              </h1>
            </Link>
          </div>
          <div className="text-right text-xs font-semibold tracking-[0.2em] uppercase">
            <span
              className={
                embeddedVideo?.role === "cinematographer" ||
                embeddedVideo?.role === "both"
                  ? "text-white"
                  : embeddedVideo
                  ? "text-white/30 blur-[1px] transition-all"
                  : "text-white/80"
              }
            >
              Cinematographer
            </span>{" "}
            <span
              className={
                embeddedVideo
                  ? "text-white/30 blur-[1px] transition-all"
                  : "text-white/60"
              }
            >
              &
            </span>{" "}
            <span
              className={
                embeddedVideo?.role === "director" ||
                embeddedVideo?.role === "both"
                  ? "text-white"
                  : embeddedVideo
                  ? "text-white/30 blur-[1px] transition-all"
                  : "text-white/80"
              }
            >
              Director
            </span>
          </div>
        </div>

        {/* Contact - Mobile: fixed bottom right, toggled by button */}
        <div className="fixed bottom-6 right-4 text-right text-xs z-30 md:hidden">
          <button
            type="button"
            onClick={() => setShowContact((prev) => !prev)}
            className="font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
          >
            Contact
          </button>
          {showContact && (
            <div className="mt-2 text-white/70 space-y-1 font-bold">
              <a
                href="mailto:alexbyjames@icloud.com"
                className="block hover:text-white transition-colors"
              >
                alexbyjames@icloud.com
              </a>
              <a
                href="https://instagram.com/alexbyjames"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors"
              >
                @alexbyjames
              </a>
            </div>
          )}
        </div>

        {/* Section List - Mobile: vertical menu */}
        <div className={`${embeddedVideo ? "blur-sm pointer-events-none" : ""} mt-10`}>
          <nav className="flex flex-col items-center gap-1 mb-4">
            {featuredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  // Toggle: if already expanded, close it; otherwise open it
                  setExpandedSection(expandedSection === section.id ? null : section.id);
                }}
                className={`py-1 px-2 text-4xl font-bold tracking-wide transition-all ${
                  activeSection === section.id ? "text-white" : "text-white/50 hover:text-white"
                }`}
                aria-current={activeSection === section.id ? "page" : undefined}
              >
                {section.label}
              </button>
            ))}
          </nav>

          {/* Projects List - Mobile: show for expanded section */}
          {expandedSection && (
            <div
              ref={listContainerRef}
              className={`overflow-y-auto overflow-x-hidden ${
                listNeedsScrolling
                  ? "max-h-[calc(100vh-444px)]"
                  : "max-h-[calc(100vh-420px)]"
              }`}
            >
              <ul className="space-y-1 text-center">
                {sectionMap[expandedSection].projects.map((project, idx) => {
                  const { href, embed, role, title, slug } = project;
                  const linkHref = href ?? "#";
                  const allowEmbed = Boolean(embed) && Boolean(href);
                  const embedSrc = allowEmbed && href ? getEmbedSrc(href) : null;
                  const shouldOpenNewTab = !!href && !embedSrc;

                  return (
                    <li key={slug ?? idx}>
                      <a
                        href={linkHref}
                        className="inline-block text-3xl font-bold text-white/90 hover:text-white transition-colors py-1"
                        target={shouldOpenNewTab ? "_blank" : undefined}
                        rel={shouldOpenNewTab ? "noopener noreferrer" : undefined}
                        onClick={(e) => handleProjectClick(e, project, expandedSection)}
                      >
                        {title}
                      </a>
                    </li>
                  );
                })}
              </ul>
              {/* Copyright Footer - Mobile: inside scrollable list only if scrolling needed */}
            </div>
          )}
        </div>

      </div>

      {/* Copyright Footer - Mobile: fixed bottom left, hidden if list needs scrolling */}
      {!listNeedsScrolling && (
        <div className="fixed bottom-6 left-4 text-sm text-white/60 font-bold md:hidden">
          BY JAMES TOPHAM · © All Rights Reserved
        </div>
      )}

      {/* Desktop Layout (md and up) */}
      <div className="hidden md:block p-16">
        <div
          className={
            embeddedVideo ? "relative z-[60] pointer-events-none select-none" : ""
          }
        >
          <div className="flex items-start justify-between gap-8">
            <div>
              <Link href="/" className="block">
                <h1 className="text-base font-black leading-tight mb-2 hover:opacity-80 transition-opacity cursor-pointer">
                  Alexander
                </h1>
              </Link>
            </div>
            <div className="text-right text-base font-bold tracking-[0.3em] uppercase">
              <span
                className={
                  embeddedVideo?.role === "cinematographer" ||
                  embeddedVideo?.role === "both"
                    ? "text-white"
                    : embeddedVideo
                    ? "text-white/30 blur-[1px] transition-all"
                    : "text-white/80"
                }
              >
                Cinematographer
              </span>{" "}
              <span
                className={
                  embeddedVideo
                    ? "text-white/30 blur-[1px] transition-all"
                    : "text-white/60"
                }
              >
                &
              </span>{" "}
              <span
                className={
                  embeddedVideo?.role === "director" ||
                  embeddedVideo?.role === "both"
                    ? "text-white"
                    : embeddedVideo
                    ? "text-white/30 blur-[1px] transition-all"
                    : "text-white/80"
                }
              >
                Director
              </span>
            </div>
          </div>
        </div>

        {/* Contact - Desktop: fixed bottom right, toggled by button */}
        <div className="fixed bottom-6 right-16 text-right text-sm">
          <button
            type="button"
            onClick={() => setShowContact((prev) => !prev)}
            className="font-bold tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors"
          >
            Contact
          </button>
          {showContact && (
            <div className="mt-2 text-white/70 space-y-1 font-bold">
              <a
                href="mailto:alexbyjames@icloud.com"
                className="block hover:text-white transition-colors"
              >
                alexbyjames@icloud.com
              </a>
              <a
                href="https://instagram.com/alexbyjames"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors"
              >
                @alexbyjames
              </a>
            </div>
          )}
        </div>

        <div className={embeddedVideo ? "blur-sm pointer-events-none" : ""}>
          {/* Section Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {featuredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`min-h-[44px] px-1 py-1 text-4xl font-bold tracking-wide transition-all ${
                  activeSection === section.id ? "text-white" : "text-white/50 hover:text-white"
                }`}
                aria-current={activeSection === section.id ? "page" : undefined}
                aria-expanded={expandedSection === section.id}
              >
                {section.label}
              </button>
            ))}
          </nav>

          {/* Dropdown List - Desktop: centered under navigation */}
          <AnimatePresence mode="wait">
            {expandedSection && (
              <motion.ul
                key={expandedSection}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="mt-10 text-center text-4xl font-bold space-y-4"
              >
                {sectionMap[expandedSection].projects.map((project, idx) => {
                  const { href, embed, role, title, slug } = project;
                  const allowEmbed = Boolean(embed) && Boolean(href);
                  const embedSrc = allowEmbed && href ? getEmbedSrc(href) : null;

                  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!href) {
                      e.preventDefault();
                      return;
                    }

                    if (embedSrc) {
                      if (e.metaKey || e.ctrlKey || e.button !== 0) {
                        return;
                      }

                      e.preventDefault();
                      lastFocusedRef.current = e.currentTarget;
                      setEmbeddedVideo({
                        src: embedSrc,
                        title,
                        slug,
                        role,
                      });
                      onProjectChange?.({ slug, section: expandedSection });
                    }
                  };

                  const linkHref = href ?? "#";
                  const shouldOpenNewTab = !!href && !embedSrc;

                  return (
                    <li key={slug ?? idx}>
                      <a
                        href={linkHref}
                        className="block text-white/90 hover:text-white transition-colors py-1"
                        target={shouldOpenNewTab ? "_blank" : undefined}
                        rel={shouldOpenNewTab ? "noopener noreferrer" : undefined}
                        onClick={handleClick}
                      >
                        {title}
                      </a>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Copyright Footer - Desktop: fixed bottom left */}
        <div className="fixed bottom-6 left-16 text-sm text-white/60 font-bold">
          BY JAMES TOPHAM · © All Rights Reserved
        </div>
      </div>

      {embeddedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
          role="dialog"
          aria-label={embeddedVideo.title}
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Tab") {
                event.preventDefault();
                closeButtonRef.current?.focus();
              }
            }}
            tabIndex={-1}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close video"
              className="absolute top-3 right-3 z-10 text-white/80 hover:text-white transition-colors text-2xl leading-none"
              onClick={closeModal}
            >
              &times;
            </button>
            <iframe
              src={
                embeddedVideo.src.includes("?")
                  ? `${embeddedVideo.src}&autoplay=1`
                  : `${embeddedVideo.src}?autoplay=1`
              }
              title={embeddedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
