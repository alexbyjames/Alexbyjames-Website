"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { LightingStill } from "@/lib/lightingwork/projects";

const IMAGE_CLASS =
  "block h-[42vw] max-h-[420px] w-auto max-w-none select-none md:h-[320px]";

const PLACEHOLDER_CLASS =
  "block h-[42vw] max-h-[420px] w-[63vw] max-w-[672px] shrink-0 md:h-[320px] md:w-[480px]";

interface LazyStillImageProps {
  still: LightingStill;
  clipEdges: boolean;
  priority: boolean;
  scrollRoot: HTMLElement | null;
}

export default function LazyStillImage({
  still,
  clipEdges,
  priority,
  scrollRoot,
}: LazyStillImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);

  useEffect(() => {
    if (shouldLoad || !scrollRoot) return;

    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          setShouldLoad(true);
        }
      },
      {
        root: scrollRoot,
        rootMargin: "0px 180px 0px 180px",
        threshold: 0.01,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldLoad, scrollRoot]);

  const wrapperClass = `shrink-0 ${clipEdges ? "overflow-hidden" : ""}`;

  if (!shouldLoad) {
    return (
      <div ref={ref} className={wrapperClass}>
        <div className={PLACEHOLDER_CLASS} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div ref={ref} className={wrapperClass}>
      <Image
        src={still.src}
        alt={still.alt}
        width={1600}
        height={1000}
        sizes="(max-width: 768px) 42vw, 480px"
        unoptimized
        priority={priority}
        draggable={false}
        className={`${IMAGE_CLASS} ${clipEdges ? "origin-center scale-[1.06]" : ""}`}
      />
    </div>
  );
}
