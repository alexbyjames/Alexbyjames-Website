import type { LightingStill } from "@/lib/lightingwork/projects";

interface HorizontalStillGalleryProps {
  stills: LightingStill[];
  /** Slightly zoom and clip frame edges — used for Scrooples to hide residual white corners */
  clipEdges?: boolean;
}

export default function HorizontalStillGallery({
  stills,
  clipEdges = false,
}: HorizontalStillGalleryProps) {
  return (
    <div
      className="overflow-x-auto overflow-y-hidden overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Project stills gallery"
    >
      <div className="flex w-max items-end gap-3 pb-1 md:gap-4">
        {stills.map((still) => (
          <div
            key={still.src}
            className={`shrink-0 ${clipEdges ? "overflow-hidden" : ""}`}
          >
            <img
              src={still.src}
              alt={still.alt}
              loading="lazy"
              draggable={false}
              className={`block h-[42vw] max-h-[420px] w-auto max-w-none select-none md:h-[320px] ${
                clipEdges ? "origin-center scale-[1.06]" : ""
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
