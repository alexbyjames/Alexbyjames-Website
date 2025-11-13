"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type SectionId } from "@/lib/featuredSections";

interface VideoBackgroundProps {
  activeSection: SectionId;
}

const videoPaths: Record<SectionId, string> = {
  music: "/video/musicvideo_test.mp4",
  art: "/video/hero.mp4",
  commercial: "/video/commercial_test.mp4",
};

export default function VideoBackground({ activeSection }: VideoBackgroundProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [prevSection, setPrevSection] = useState<SectionId>(activeSection);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle section change and crossfade
  useEffect(() => {
    if (prevSection !== activeSection && !isReducedMotion) {
      const nextVideo = activeVideo === 1 ? 2 : 1;
      const nextVideoEl = nextVideo === 1 ? video1Ref : video2Ref;

      // Set source for next video
      if (nextVideoEl.current) {
        const video = nextVideoEl.current;
        video.src = videoPaths[activeSection];
        video.load();
        
        const handleLoadedData = () => {
          // Random start time for crossfaded videos
          if (video.duration && video.duration > 0) {
            const maxTime = Math.max(0, video.duration - 0.5);
            const randomTime = Math.random() * maxTime;
            video.currentTime = randomTime;
            video.play().catch(() => {});
          }
        };

        video.addEventListener("loadeddata", handleLoadedData, { once: true });
        
        // If already loaded, set random time immediately
        if (video.readyState >= 2) {
          handleLoadedData();
        }

        // Fade out current, fade in next
        setActiveVideo(nextVideo);
        setPrevSection(activeSection);
      }
    } else if (prevSection !== activeSection) {
      setPrevSection(activeSection);
    }
  }, [activeSection, prevSection, activeVideo, isReducedMotion]);

  // Initialize first video on mount with random start time
  useEffect(() => {
    const video = video1Ref.current;
    if (!video || isReducedMotion) return;

    // Set initial source (Art section)
    video.src = videoPaths["art"];
    video.load();

    const setRandomStartTime = () => {
      if (video.duration && video.duration > 0) {
        // Calculate random time, ensuring we don't go too close to the end
        const maxTime = Math.max(0, video.duration - 0.5);
        const randomTime = Math.random() * maxTime;
        video.currentTime = randomTime;
        video.play().catch(() => {});
      }
    };

    const handleLoadedMetadata = () => {
      setRandomStartTime();
    };

    const handleLoadedData = () => {
      // Also set random time when data is loaded
      setRandomStartTime();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("loadeddata", handleLoadedData);
    
    // Try to play if already loaded
    if (video.readyState >= 2) {
      setRandomStartTime();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return (
      <div className="fixed inset-0 w-full h-full object-cover -z-10 bg-black">
        {/* Static poster frame - you can add an image here */}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-[100svh] -z-10 overflow-hidden pointer-events-none">
      {/* Video 1 */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          opacity: activeVideo === 1 ? 1 : 0,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <video
          ref={video1Ref}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoPaths[prevSection]} type="video/mp4" />
        </video>
      </motion.div>

      {/* Video 2 */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          opacity: activeVideo === 2 ? 1 : 0,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <video
          ref={video2Ref}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoPaths[activeSection]} type="video/mp4" />
        </video>
      </motion.div>
    </div>
  );
}

