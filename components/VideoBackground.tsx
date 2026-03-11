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

const videoPaths: Record<SectionId, string> = {
  music: "/video/musicvideo_test.mov",
  art: "/video/hero.mov",
  commercial: "/video/microsoft_-_copilot%20(720p).mp4",
};

/** Art section has multiple background options; pick one at random when loading */
const artVideoPaths = [
  "/video/hero.mov",
  "/video/bramloop.mov",
  "/video/ireland%20boys%20regrade.mov",
];

/** Music section has multiple background options; pick one at random when loading */
const musicVideoPaths = [
  "/video/musicvideo_test.mov",
  "/video/musicvideo1.mp4",
  "/video/musicvideo2.mp4",
  "/video/musicvideo3.mp4",
];

function getVideoPath(section: SectionId): string {
  if (section === "art") {
    return artVideoPaths[Math.floor(Math.random() * artVideoPaths.length)]!;
  }
  if (section === "music") {
    return musicVideoPaths[Math.floor(Math.random() * musicVideoPaths.length)]!;
  }
  return videoPaths[section];
}

/** Pick a different video from the same section (so we don't replay the same one); for single-video sections returns same path */
function getDifferentVideoPath(section: SectionId, currentSrcOrPath: string): string {
  const currentPath = (() => {
    try {
      const u = new URL(currentSrcOrPath, "http://x");
      return u.pathname;
    } catch {
      return currentSrcOrPath;
    }
  })();
  if (section === "art") {
    const others = artVideoPaths.filter((p) => p !== currentPath);
    return others.length > 0 ? others[Math.floor(Math.random() * others.length)]! : artVideoPaths[0]!;
  }
  if (section === "music") {
    const others = musicVideoPaths.filter((p) => p !== currentPath);
    return others.length > 0 ? others[Math.floor(Math.random() * others.length)]! : musicVideoPaths[0]!;
  }
  return videoPaths[section];
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
  const [prevSection, setPrevSection] = useState<SectionId>(activeSection);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const sectionForVideo1Ref = useRef<SectionId>(activeSection);
  const sectionForVideo2Ref = useRef<SectionId>(activeSection);
  const prefersLowData = usePrefersLowData();

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

  // Pause when tab is hidden to save bandwidth; resume when visible (control the active video only)
  useEffect(() => {
    if (!shouldLoadVideo) return;
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (isTabVisible) {
      const active = activeVideo === 1 ? v1 : v2;
      v1 && v1.pause();
      v2 && v2.pause();
      active?.play().catch(() => {});
    } else {
      v1?.pause();
      v2?.pause();
    }
  }, [isTabVisible, shouldLoadVideo, activeVideo]);

  // Handle section change and crossfade
  useEffect(() => {
    if (prevSection !== activeSection && !isReducedMotion && shouldLoadVideo && !prefersLowData) {
      const nextVideo = activeVideo === 1 ? 2 : 1;
      const nextVideoEl = nextVideo === 1 ? video1Ref : video2Ref;

      if (nextVideoEl.current) {
        const video = nextVideoEl.current;
        const section = activeSection;
        video.src = getVideoPath(section);
        if (nextVideo === 1) sectionForVideo1Ref.current = section;
        else sectionForVideo2Ref.current = section;
        video.preload = "metadata";
        video.load();

        const handleCanPlay = () => {
          if (video.duration && video.duration > 0) {
            const maxTime = Math.max(0, video.duration - 0.5);
            video.currentTime = Math.random() * maxTime;
          }
          if (isTabVisible) video.play().catch(() => {});
        };

        video.addEventListener("canplay", handleCanPlay, { once: true });
        if (video.readyState >= 3) handleCanPlay();

        setActiveVideo(nextVideo);
        setPrevSection(activeSection);
      }
    } else if (prevSection !== activeSection) {
      setPrevSection(activeSection);
    }
  }, [activeSection, prevSection, activeVideo, isReducedMotion, shouldLoadVideo, prefersLowData, isTabVisible]);

  // Initialize first video only when we're ready and not in low-data mode (runs once)
  const hasInitialLoad = useRef(false);
  useEffect(() => {
    const video = video1Ref.current;
    if (!video || isReducedMotion || !shouldLoadVideo || prefersLowData || hasInitialLoad.current) return;

    hasInitialLoad.current = true;
    video.src = getVideoPath(prevSection);
    sectionForVideo1Ref.current = prevSection;
    video.preload = "metadata";
    video.load();

    const handleCanPlay = () => {
      if (video.duration && video.duration > 0) {
        const maxTime = Math.max(0, video.duration - 0.5);
        video.currentTime = Math.random() * maxTime;
      }
      if (isTabVisible) video.play().catch(() => {});
    };

    video.addEventListener("canplay", handleCanPlay, { once: true });
    if (video.readyState >= 3) handleCanPlay();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [isReducedMotion, shouldLoadVideo, prefersLowData, prevSection, isTabVisible]);

  // When a video ends, load a different video from the same section instead of looping
  useEffect(() => {
    if (!shouldLoadVideo || isReducedMotion || prefersLowData) return;
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    const handleEnded = (video: HTMLVideoElement, sectionRef: React.MutableRefObject<SectionId>) => {
      const section = sectionRef.current;
      const currentPath = video.currentSrc || video.src;
      const newPath = getDifferentVideoPath(section, currentPath);
      video.src = newPath;
      video.load();
      const handleCanPlay = () => {
        if (video.duration && video.duration > 0) {
          const maxTime = Math.max(0, video.duration - 0.5);
          video.currentTime = Math.random() * maxTime;
        }
        if (document.visibilityState === "visible") video.play().catch(() => {});
      };
      video.addEventListener("canplay", handleCanPlay, { once: true });
      if (video.readyState >= 3) handleCanPlay();
    };

    const onEnded1 = () => handleEnded(v1, sectionForVideo1Ref);
    const onEnded2 = () => handleEnded(v2, sectionForVideo2Ref);
    v1.addEventListener("ended", onEnded1);
    v2.addEventListener("ended", onEnded2);
    return () => {
      v1.removeEventListener("ended", onEnded1);
      v2.removeEventListener("ended", onEnded2);
    };
  }, [shouldLoadVideo, isReducedMotion, prefersLowData]);

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
          preload="metadata"
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
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}
