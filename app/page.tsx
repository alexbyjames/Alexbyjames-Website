import type { Metadata } from "next";
import HomeShell from "@/components/HomeShell";
import { projectMapBySlug } from "@/lib/featuredSections";

interface PageProps {
  searchParams?: {
    section?: string;
    project?: string;
  };
}

const baseTitle = "James Alexander Topham — Cinematographer & Director";
const baseDescription =
  "London-based cinematographer and director crafting music videos, commercials, and art projects.";

export function generateMetadata({ searchParams }: PageProps = {}): Metadata {
  const projectSlug = searchParams?.project ?? null;
  const project = projectSlug ? projectMapBySlug[projectSlug] : undefined;

  if (!project) {
    return {
      title: baseTitle,
      description: baseDescription,
      openGraph: {
        title: baseTitle,
        description: baseDescription,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: baseTitle,
        description: baseDescription,
      },
    } satisfies Metadata;
  }

  const projectTitle = `${project.title} — James Alexander Topham`;
  const projectDescription = `${project.title} (${project.role ?? "Project"}) from the portfolio of James Alexander Topham.`;

  return {
    title: projectTitle,
    description: projectDescription,
    openGraph: {
      title: projectTitle,
      description: projectDescription,
      type: "video.other",
      url: project.href,
    },
    twitter: {
      card: "summary_large_image",
      title: projectTitle,
      description: projectDescription,
    },
  } satisfies Metadata;
}

export default function Page() {
  return <HomeShell />;
}
