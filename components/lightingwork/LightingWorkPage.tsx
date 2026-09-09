import Link from "next/link";
import { lightingProjects } from "@/lib/lightingwork/projects";
import LightingWorkProject from "./LightingWorkProject";

export default function LightingWorkPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <header className="px-4 pt-6 md:px-16 md:pt-10">
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white md:text-sm md:tracking-[0.3em]"
        >
          HOME
        </Link>
      </header>

      <main className="space-y-14 px-4 py-10 md:space-y-20 md:px-16 md:py-16">
        {lightingProjects.map((project, projectIndex) => (
          <LightingWorkProject
            key={project.id}
            project={project}
            projectIndex={projectIndex}
          />
        ))}
      </main>

      <footer className="px-4 pb-10 pt-4 md:px-16 md:pb-16">
        <p className="text-xs font-bold text-white/60 md:text-sm">
          BY JAMES TOPHAM · © All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
