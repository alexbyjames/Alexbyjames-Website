"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VideoBackground from "@/components/VideoBackground";
import LandingContent from "@/components/LandingContent";
import { sectionOrder, projectMapBySlug, type SectionId } from "@/lib/featuredSections";

const DEFAULT_SECTION: SectionId = "art";

function isSectionId(value: string | null): value is SectionId {
  return value !== null && sectionOrder.includes(value as SectionId);
}

export default function HomeShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchParamsString = searchParams.toString();

  const [activeSection, setActiveSection] = useState<SectionId>(() => {
    const sectionParam = searchParams.get("section");
    if (isSectionId(sectionParam)) {
      return sectionParam;
    }
    const projectParam = searchParams.get("project");
    if (projectParam && projectMapBySlug[projectParam]) {
      return projectMapBySlug[projectParam].section;
    }
    return DEFAULT_SECTION;
  });
  const [currentProjectSlug, setCurrentProjectSlug] = useState<string | null>(() => {
    return searchParams.get("project");
  });

  useEffect(() => {
    const sectionParam = searchParams.get("section");
    let nextSection: SectionId = activeSection;
    if (isSectionId(sectionParam)) {
      nextSection = sectionParam;
    } else {
      const projectParam = searchParams.get("project");
      if (projectParam && projectMapBySlug[projectParam]) {
        nextSection = projectMapBySlug[projectParam].section;
      }
    }

    if (nextSection !== activeSection) {
      setActiveSection(nextSection);
    }

    const projectParam = searchParams.get("project");
    if ((projectParam ?? null) !== currentProjectSlug) {
      setCurrentProjectSlug(projectParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString]);

  const updateQuery = (section: SectionId, projectSlug: string | null) => {
    const params = new URLSearchParams(searchParamsString);
    params.set("section", section);
    if (projectSlug) {
      params.set("project", projectSlug);
    } else {
      params.delete("project");
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  const handleSectionChange = (section: SectionId) => {
    if (section === activeSection && currentProjectSlug === null) {
      return;
    }
    setActiveSection(section);
    setCurrentProjectSlug(null);
    updateQuery(section, null);
  };

  const handleProjectChange = (payload: { slug: string; section: SectionId } | null) => {
    if (payload) {
      if (currentProjectSlug === payload.slug && activeSection === payload.section) {
        return;
      }
      setActiveSection(payload.section);
      setCurrentProjectSlug(payload.slug);
      updateQuery(payload.section, payload.slug);
    } else {
      if (!currentProjectSlug) {
        return;
      }
      setCurrentProjectSlug(null);
      updateQuery(activeSection, null);
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

