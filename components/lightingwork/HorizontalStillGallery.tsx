"use client";

import { useEffect, useRef, useState } from "react";
import type { LightingStill } from "@/lib/lightingwork/projects";
import LazyStillImage from "./LazyStillImage";

interface HorizontalStillGalleryProps {
  stills: LightingStill[];
  /** Slightly zoom and clip frame edges — used for Scrooples to hide residual white corners */
  clipEdges?: boolean;
  /** Eager-load the first still (first project on the page) */
  priorityFirstStill?: boolean;
}

export default function HorizontalStillGallery({
  stills,
  clipEdges = false,
  priorityFirstStill = false,
}: HorizontalStillGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setScrollRoot(scrollRef.current);
  }, []);

  return (
    <div
      ref={scrollRef}
      data-gallery-scroll
      className="overflow-x-auto overflow-y-hidden overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Project stills gallery"
    >
      <div className="flex w-max items-end gap-3 pb-1 md:gap-4">
        {stills.map((still, index) => (
          <LazyStillImage
            key={still.src}
            still={still}
            clipEdges={clipEdges}
            priority={priorityFirstStill && index === 0}
            scrollRoot={scrollRoot}
          />
        ))}
      </div>
    </div>
  );
}
