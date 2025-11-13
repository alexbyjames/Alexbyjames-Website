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

  const closeModal = () => {
    setEmbeddedVideo(null);
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
      {/* Contact Details - Mobile: top right, Desktop: top right */}
      <div className="fixed top-4 right-4 md:top-16 md:right-16 text-right text-xs md:text-base text-white/70 space-y-1 font-bold z-30">
        <div>
          <a href="mailto:alexbyjames@icloud.com" className="hover:text-white transition-colors">
            alexbyjames@icloud.com
          </a>
        </div>
        <div>
          <a href="tel:+447970039098" className="hover:text-white transition-colors">
            +44 7970 039098
          </a>
        </div>
        <div>
          <a
            href="https://instagram.com/alexbyjames"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            @alexbyjames
          </a>
        </div>
      </div>

      {/* Mobile Layout (below md) */}
      <div className="block md:hidden px-4 pt-6 pb-4">
        {/* Top Block: Name, Subtitle */}
        <div
          className={
            embeddedVideo ? "relative z-[60] pointer-events-none select-none" : ""
          }
        >
          <Link href="/" className="block">
            <h1 className="text-5xl font-black leading-tight mb-2 hover:opacity-80 transition-opacity cursor-pointer max-w-[85%]">
              James Alexander Topham
            </h1>
          </Link>
          <p className="text-base font-bold tracking-wide mb-4">
            <span
              className={
                embeddedVideo?.role === "cinematographer" ||
                embeddedVideo?.role === "both"
                  ? "text-white"
                  : embeddedVideo
                  ? "text-white/30 blur-[1px] transition-all"
                  : "text-white/90"
              }
            >
              Cinematographer
            </span>{" "}
            <span
              className={
                embeddedVideo
                  ? "text-white/30 blur-[1px] transition-all"
                  : "text-white/70"
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
                  : "text-white/90"
              }
            >
              Director
            </span>
          </p>
        </div>

        {/* Section List - Mobile: vertical menu */}
        <div className={embeddedVideo ? "blur-sm pointer-events-none" : ""}>
          <nav className="flex flex-col gap-1 mb-4">
            {featuredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  // Toggle: if already expanded, close it; otherwise open it
                  setExpandedSection(expandedSection === section.id ? null : section.id);
                }}
                className={`text-left py-2 px-2 text-4xl font-bold transition-opacity ${
                  activeSection === section.id
                    ? "text-white underline decoration-white/80 underline-offset-4"
                    : "text-white/90"
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
                  ? 'max-h-[calc(100vh-444px)]' 
                  : 'max-h-[calc(100vh-420px)]'
              }`}
            >
              <ul className="space-y-1">
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
                        className="block text-3xl font-bold text-white/90 hover:text-white transition-colors py-1"
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
              {listNeedsScrolling && (
                <div className="pt-8 pb-6 text-xs text-white/50 text-center font-bold">
                  © LaMax 2025 All Rights Reserved
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Copyright Footer - Mobile: fixed at bottom, hidden if list needs scrolling */}
      {!listNeedsScrolling && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/50 text-center font-bold md:hidden">
          © LaMax 2025 All Rights Reserved
        </div>
      )}

      {/* Desktop Layout (md and up) - Keep exactly as before */}
      <div className="hidden md:block p-16">
        <div
          className={
            embeddedVideo ? "relative z-[60] pointer-events-none select-none" : ""
          }
        >
          <Link href="/" className="block">
            <h1 className="text-8xl font-black leading-tight mb-2 hover:opacity-80 transition-opacity cursor-pointer">
              James Alexander Topham
            </h1>
          </Link>
          <p className="text-2xl mb-10 font-bold tracking-wide">
            <span
              className={
                embeddedVideo?.role === "cinematographer" ||
                embeddedVideo?.role === "both"
                  ? "text-white"
                  : embeddedVideo
                  ? "text-white/30 blur-[1px] transition-all"
                  : "text-white/90"
              }
            >
              Cinematographer
            </span>{" "}
            <span
              className={
                embeddedVideo
                  ? "text-white/30 blur-[1px] transition-all"
                  : "text-white/70"
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
                  : "text-white/90"
              }
            >
              Director
            </span>
          </p>
        </div>

        <div className={embeddedVideo ? "blur-sm pointer-events-none" : ""}>
          {/* Section Navigation */}
          <nav className="flex flex-wrap items-center gap-6 text-4xl font-bold">
            {featuredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`min-h-[44px] min-w-[44px] px-3 py-2 transition-opacity hover:opacity-80 text-left ${
                  activeSection === section.id
                    ? "text-white underline decoration-white/80 underline-offset-4"
                    : "text-white/90"
                }`}
                aria-current={activeSection === section.id ? "page" : undefined}
                aria-expanded={expandedSection === section.id}
              >
                {section.label}
              </button>
            ))}
          </nav>

          {/* Dropdown List - Desktop: absolute positioned */}
          <AnimatePresence mode="wait">
            {expandedSection && (
              <motion.ul
                key={expandedSection}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute left-16 top-[320px] text-4xl font-bold space-y-4"
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

        {/* Copyright Footer - Desktop */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/50 text-center font-bold">
          © LaMax 2025 All Rights Reserved
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
