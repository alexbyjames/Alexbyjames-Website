"use client";

import { useState } from "react";
import VideoBackground from "@/components/VideoBackground";
import LandingContent from "@/components/LandingContent";
import { type SectionId } from "@/lib/featuredSections";

const DEFAULT_SECTION: SectionId = "art";

export default function HomeShell() {
  const [activeSection, setActiveSection] = useState<SectionId>(DEFAULT_SECTION);
  const [currentProjectSlug, setCurrentProjectSlug] = useState<string | null>(null);

  const handleSectionChange = (section: SectionId) => {
    if (section === activeSection && currentProjectSlug === null) {
      return;
    }
    setActiveSection(section);
    setCurrentProjectSlug(null);
  };

  const handleProjectChange = (payload: { slug: string; section: SectionId } | null) => {
    if (payload) {
      if (currentProjectSlug === payload.slug && activeSection === payload.section) {
        return;
      }
      setActiveSection(payload.section);
      setCurrentProjectSlug(payload.slug);
    } else {
      if (!currentProjectSlug) {
        return;
      }
      setCurrentProjectSlug(null);
    }
  };

  return (
    <>
      {/* Background Video with Crossfade */}
      <VideoBackground activeSection={activeSection} />

      {/* Overlay Content - White text over video */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <LandingContent
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            initialProjectSlug={currentProjectSlug ?? undefined}
            onProjectChange={handleProjectChange}
          />
        </div>
      </div>
    </>
  );
}

