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

  return (
    <div className="relative z-20 text-white p-10 md:p-16">
      {/* Contact Details - Top Right */}
      <div className="fixed top-10 md:top-16 right-10 md:right-16 text-right text-sm md:text-base text-white/70 space-y-1 font-bold">
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

      <div
        className={
          embeddedVideo ? "relative z-[60] pointer-events-none select-none" : ""
        }
      >
        <Link href="/" className="block">
          <h1 className="text-6xl md:text-8xl font-black leading-tight mb-2 hover:opacity-80 transition-opacity cursor-pointer">
            James Alexander Topham
          </h1>
        </Link>
        <p className="text-xl md:text-2xl mb-10 font-bold tracking-wide">
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
        <nav className="flex flex-wrap items-center gap-6 text-2xl md:text-4xl font-bold">
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

        {/* Dropdown List - Fixed position on left side */}
        <AnimatePresence mode="wait">
          {expandedSection && (
            <motion.ul
              key={expandedSection}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-10 md:left-16 top-[280px] md:top-[320px] text-2xl md:text-4xl font-bold space-y-4"
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

      {/* Copyright Footer */}
      <div className="fixed bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 text-xs text-white/50 text-center font-bold">
        © LaMax 2025 All Rights Reserved
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
