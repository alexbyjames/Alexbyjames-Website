"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type SectionId } from "@/lib/featuredSections";

interface VideoBackgroundProps {
  activeSection: SectionId;
}

/** Network Information API shape (not in all browsers). Supports change listener for connection updates. */
interface NetworkInformationLike {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?(type: string, listener: () => void): void;
  removeEventListener?(type: string, listener: () => void): void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformationLike;
}

const CROSSFADE_MS = 1200;

const videoPaths: Record<SectionId, string> = {
  music: "/video/musicvideo_test.mov",
  art: "/video/hero.mov",
  commercial: "/video/microsoft_-_copilot%20(720p).mp4",
};

/** Art section has multiple background options; pick one at random when loading */
const artVideoPaths = [
  "/video/hero.mov",
  "/video/Current%20Sound%20Mix.mov",
  "/video/ireland%20boys%20regrade.mov",
];

/** Music section has multiple background options; pick one at random when loading */
const BETTER_WEBSITE_BACKGROUND = "/video/Better%20Website%20Background.mp4";

const musicVideoPaths = [
  "/video/musicvideo_test.mov",
  "/video/musicvideo1.mp4",
  "/video/musicvideo2.mp4",
  "/video/musicvideo3.mp4",
  BETTER_WEBSITE_BACKGROUND,
];

/** Higher weight = more likely to appear in the music rotation */
const musicVideoWeights: Record<string, number> = {
  [BETTER_WEBSITE_BACKGROUND]: 3,
};

function normalizeVideoPath(srcOrPath: string): string {
  try {
    return new URL(srcOrPath, "http://x").pathname;
  } catch {
    return srcOrPath;
  }
}

/** Where to begin playback — keeps openings visible instead of random mid-clip jumps */
const videoStartByPath: Record<string, { startMaxSec: number }> = {
  "/video/musicvideo_test.mov": { startMaxSec: 25 },
  "/video/musicvideo1.mp4": { startMaxSec: 10 },
  [BETTER_WEBSITE_BACKGROUND]: { startMaxSec: 25 },
};

function getVideoStartTime(path: string, duration: number): number {
  const cap = Math.max(0, duration - 0.5);
  const config = videoStartByPath[normalizeVideoPath(path)];
  if (config) {
    return Math.random() * Math.min(config.startMaxSec, cap);
  }
  return Math.random() * cap;
}

function pickMusicVideoPath(excludePath?: string): string {
  const exclude = excludePath ? normalizeVideoPath(excludePath) : undefined;
  const weighted: string[] = [];
  for (const path of musicVideoPaths) {
    if (exclude && normalizeVideoPath(path) === exclude) continue;
    const weight = musicVideoWeights[path] ?? 1;
    for (let i = 0; i < weight; i++) weighted.push(path);
  }
  if (weighted.length === 0) {
    return musicVideoPaths[0]!;
  }
  return weighted[Math.floor(Math.random() * weighted.length)]!;
}

function applyStartTime(video: HTMLVideoElement, srcPath: string) {
  if (video.duration && video.duration > 0) {
    video.currentTime = getVideoStartTime(srcPath, video.duration);
  }
}

function getVideoPath(section: SectionId): string {
  if (section === "art") {
    return artVideoPaths[Math.floor(Math.random() * artVideoPaths.length)]!;
  }
  if (section === "music") {
    return pickMusicVideoPath();
  }
  return videoPaths[section];
}

/** Pick a different video from the same section (so we don't replay the same one); for single-video sections returns same path */
function getDifferentVideoPath(section: SectionId, currentSrcOrPath: string): string {
  const currentPath = normalizeVideoPath(currentSrcOrPath);
  if (section === "art") {
    const others = artVideoPaths.filter((p) => p !== currentPath);
    return others.length > 0 ? others[Math.floor(Math.random() * others.length)]! : artVideoPaths[0]!;
  }
  if (section === "music") {
    return pickMusicVideoPath(currentPath);
  }
  return videoPaths[section];
}

function releaseVideoMedia(video: HTMLVideoElement | null) {
  if (!video || (!video.src && !video.currentSrc)) return;
  video.pause();
  video.removeAttribute("src");
  video.load();
}

function assignVideoSource(video: HTMLVideoElement, srcPath: string): boolean {
  const normalized = normalizeVideoPath(srcPath);
  const current = normalizeVideoPath(video.currentSrc || video.src || "");
  if (current === normalized) return false;
  video.preload = "metadata";
  video.src = srcPath;
  return true;
}

type LoadSignal = { cancelled: boolean };

function loadVideoWithStart(
  video: HTMLVideoElement,
  srcPath: string,
  onReady: () => void,
  signal?: LoadSignal,
): () => void {
  const needsLoad = assignVideoSource(video, srcPath);

  const handleCanPlay = () => {
    if (signal?.cancelled) return;
    applyStartTime(video, srcPath);
    onReady();
  };

  video.addEventListener("canplay", handleCanPlay, { once: true });

  if (needsLoad) {
    video.load();
  } else if (video.readyState >= 3) {
    handleCanPlay();
  }

  return () => {
    if (signal) signal.cancelled = true;
    video.removeEventListener("canplay", handleCanPlay);
  };
}

/** Detect slow connection or data-saver so we can avoid heavy video load */
function usePrefersLowData(): boolean {
  const [prefersLowData, setPrefersLowData] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const conn = (navigator as NavigatorWithConnection).connection;
    const saveData = conn?.saveData === true;
    const slowType = conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g";

    setPrefersLowData(Boolean(saveData || slowType));

    if (!conn) return;
    const onChange = () => {
      setPrefersLowData(Boolean(conn.saveData || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g"));
    };
    conn.addEventListener?.("change", onChange);
    return () => conn.removeEventListener?.("change", onChange);
  }, []);

  return prefersLowData;
}

export default function VideoBackground({ activeSection }: VideoBackgroundProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const activeVideoRef = useRef<1 | 2>(1);
  const prevSectionRef = useRef<SectionId>(activeSection);
  const sectionForVideo1Ref = useRef<SectionId>(activeSection);
  const sectionForVideo2Ref = useRef<SectionId>(activeSection);
  const sectionLoadCleanupRef = useRef<(() => void) | null>(null);
  const endedLoadCleanupRef = useRef<{ 1?: () => void; 2?: () => void }>({});
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersLowData = usePrefersLowData();

  useEffect(() => {
    activeVideoRef.current = activeVideo;
  }, [activeVideo]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Only start loading video after page is idle (or short delay) to save bandwidth on slow connections
  useEffect(() => {
    if (isReducedMotion || prefersLowData) return;

    const useIdle = typeof window.requestIdleCallback === "function";
    const id = useIdle
      ? requestIdleCallback(() => setShouldLoadVideo(true), { timeout: 1500 })
      : window.setTimeout(() => setShouldLoadVideo(true), 800);

    return () => {
      if (useIdle && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(id as number);
      } else {
        clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
      }
    };
  }, [isReducedMotion, prefersLowData]);

  // Pause when tab is hidden to save bandwidth; resume when visible
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Pause when tab is hidden; resume only the active video when visible
  useEffect(() => {
    if (!shouldLoadVideo) return;
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    const inactive = activeVideoRef.current === 1 ? v2 : v1;
    const active = activeVideoRef.current === 1 ? v1 : v2;

    inactive?.pause();

    if (isTabVisible) {
      if (active && (active.src || active.currentSrc)) {
        active.play().catch(() => {});
      }
    } else {
      v1?.pause();
      v2?.pause();
    }
  }, [isTabVisible, shouldLoadVideo, activeVideo]);

  // Handle section change and crossfade
  useEffect(() => {
    if (prevSectionRef.current === activeSection) return;

    if (isReducedMotion || !shouldLoadVideo || prefersLowData) {
      prevSectionRef.current = activeSection;
      return;
    }

    const previousActive = activeVideoRef.current;
    const nextVideoNum: 1 | 2 = previousActive === 1 ? 2 : 1;
    const nextVideoEl = nextVideoNum === 1 ? video1Ref.current : video2Ref.current;
    const previousVideoEl = previousActive === 1 ? video1Ref.current : video2Ref.current;

    if (!nextVideoEl) {
      prevSectionRef.current = activeSection;
      return;
    }

    sectionLoadCleanupRef.current?.();
    sectionLoadCleanupRef.current = null;

    if (releaseTimerRef.current) {
      clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }

    const signal: LoadSignal = { cancelled: false };
    const srcPath = getVideoPath(activeSection);

    if (nextVideoNum === 1) {
      sectionForVideo1Ref.current = activeSection;
    } else {
      sectionForVideo2Ref.current = activeSection;
    }

    sectionLoadCleanupRef.current = loadVideoWithStart(
      nextVideoEl,
      srcPath,
      () => {
        if (signal.cancelled) return;
        if (isTabVisible) nextVideoEl.play().catch(() => {});
      },
      signal,
    );

    setActiveVideo(nextVideoNum);
    prevSectionRef.current = activeSection;

    releaseTimerRef.current = setTimeout(() => {
      if (previousVideoEl && previousVideoEl !== nextVideoEl) {
        releaseVideoMedia(previousVideoEl);
      }
      releaseTimerRef.current = null;
    }, CROSSFADE_MS);

    return () => {
      signal.cancelled = true;
      sectionLoadCleanupRef.current?.();
      sectionLoadCleanupRef.current = null;
    };
  }, [activeSection, isReducedMotion, shouldLoadVideo, prefersLowData, isTabVisible]);

  // Initialize first video only when we're ready and not in low-data mode (runs once)
  const hasInitialLoad = useRef(false);
  useEffect(() => {
    const video = video1Ref.current;
    if (!video || isReducedMotion || !shouldLoadVideo || prefersLowData || hasInitialLoad.current) return;

    hasInitialLoad.current = true;
    const srcPath = getVideoPath(activeSection);
    sectionForVideo1Ref.current = activeSection;
    prevSectionRef.current = activeSection;

    const signal: LoadSignal = { cancelled: false };
    const cleanup = loadVideoWithStart(
      video,
      srcPath,
      () => {
        if (signal.cancelled) return;
        if (isTabVisible) video.play().catch(() => {});
      },
      signal,
    );

    return () => {
      cleanup();
    };
  }, [activeSection, isReducedMotion, shouldLoadVideo, prefersLowData, isTabVisible]);

  // When a video ends, load a different video from the same section instead of looping
  useEffect(() => {
    if (!shouldLoadVideo || isReducedMotion || prefersLowData) return;
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    const handleEnded = (
      videoNum: 1 | 2,
      video: HTMLVideoElement,
      sectionRef: React.MutableRefObject<SectionId>,
    ) => {
      if (activeVideoRef.current !== videoNum) return;

      endedLoadCleanupRef.current[videoNum]?.();
      endedLoadCleanupRef.current[videoNum] = undefined;

      const section = sectionRef.current;
      const currentPath = video.currentSrc || video.src;
      const newPath = getDifferentVideoPath(section, currentPath);

      video.pause();

      const signal: LoadSignal = { cancelled: false };
      endedLoadCleanupRef.current[videoNum] = loadVideoWithStart(
        video,
        newPath,
        () => {
          if (signal.cancelled) return;
          if (document.visibilityState === "visible") video.play().catch(() => {});
        },
        signal,
      );
    };

    const onEnded1 = () => handleEnded(1, v1, sectionForVideo1Ref);
    const onEnded2 = () => handleEnded(2, v2, sectionForVideo2Ref);
    v1.addEventListener("ended", onEnded1);
    v2.addEventListener("ended", onEnded2);
    return () => {
      v1.removeEventListener("ended", onEnded1);
      v2.removeEventListener("ended", onEnded2);
      endedLoadCleanupRef.current[1]?.();
      endedLoadCleanupRef.current[2]?.();
      endedLoadCleanupRef.current = {};
    };
  }, [shouldLoadVideo, isReducedMotion, prefersLowData]);

  useEffect(() => {
    return () => {
      sectionLoadCleanupRef.current?.();
      if (releaseTimerRef.current) {
        clearTimeout(releaseTimerRef.current);
      }
      releaseVideoMedia(video1Ref.current);
      releaseVideoMedia(video2Ref.current);
    };
  }, []);

  if (isReducedMotion || prefersLowData) {
    return (
      <div className="fixed inset-0 w-full h-full object-cover -z-10 bg-black" aria-hidden="true" />
    );
  }

  return (
    <div className="fixed inset-0 w-full h-[100svh] -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ opacity: activeVideo === 1 ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <video
          ref={video1Ref}
          autoPlay
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ opacity: activeVideo === 2 ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <video
          ref={video2Ref}
          autoPlay
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}
