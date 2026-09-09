import {
  lightingCreditLabels,
  type LightingProject,
} from "@/lib/lightingwork/projects";
import HorizontalStillGallery from "./HorizontalStillGallery";

interface LightingWorkProjectProps {
  project: LightingProject;
}

export default function LightingWorkProject({ project }: LightingWorkProjectProps) {
  const creditLabel = lightingCreditLabels[project.credit];

  return (
    <section className="space-y-4 md:space-y-5">
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

      <HorizontalStillGallery
        stills={project.stills}
        clipEdges={project.id === "scrooples"}
      />
    </section>
  );
}
