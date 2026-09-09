import Link from "next/link";

/** Homepage link to /lightingwork — remove with the lightingwork section */
export default function HomeLightingWorkLink() {
  return (
    <div className="pointer-events-auto fixed bottom-6 left-1/2 z-30 -translate-x-1/2 md:bottom-6">
      <Link
        href="/lightingwork"
        className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white md:text-sm md:tracking-[0.3em]"
      >
        Lighting Work
      </Link>
    </div>
  );
}
