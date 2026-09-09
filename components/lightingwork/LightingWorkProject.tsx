"use client";

import { useEffect, useRef, useState } from "react";
import {
  lightingCreditLabels,
  type LightingProject,
} from "@/lib/lightingwork/projects";
import HorizontalStillGallery from "./HorizontalStillGallery";

interface LightingWorkProjectProps {
  project: LightingProject;
  projectIndex: number;
}

const GALLERY_PLACEHOLDER_CLASS = "h-[42vw] max-h-[420px] md:h-[320px]";

export default function LightingWorkProject({
  project,
  projectIndex,
}: LightingWorkProjectProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [galleryVisible, setGalleryVisible] = useState(projectIndex === 0);
  const creditLabel = lightingCreditLabels[project.credit];

  useEffect(() => {
    if (galleryVisible) return;

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setGalleryVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px 0px", threshold: 0 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [galleryVisible]);

  return (
    <section ref={sectionRef} className="space-y-4 md:space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="min-w-0 text-xl font-bold text-white md:text-2xl lg:text-3xl">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/90 transition-colors hover:text-white"
            >
              {project.title}
            </a>
          ) : (
            <span className="text-white/90">{project.title}</span>
          )}
        </h2>
        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-white/60 md:text-sm md:tracking-[0.25em]">
          {creditLabel}
        </span>
      </div>

      {galleryVisible ? (
        <HorizontalStillGallery
          stills={project.stills}
          clipEdges={project.id === "scrooples"}
          priorityFirstStill={projectIndex === 0}
        />
      ) : (
        <div className={GALLERY_PLACEHOLDER_CLASS} aria-hidden="true" />
      )}
    </section>
  );
}
