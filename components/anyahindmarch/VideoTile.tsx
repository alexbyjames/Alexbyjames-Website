"use client";

import { useEffect, useRef } from "react";
import type { AnyaVideo } from "@/lib/anyahindmarch/videos";

interface VideoTileProps {
  video: AnyaVideo;
  isPlaying: boolean;
  playingId: string | null;
  onPlay: (id: string) => void;
  onPause: () => void;
}

export default function VideoTile({
  video,
  isPlaying,
  playingId,
  onPlay,
  onPause,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || isPlaying) return;

    el.pause();
    if (playingId !== null && el.readyState >= 1) {
      el.currentTime = 0;
    }
  }, [isPlaying, playingId]);

  return (
    <div
      className={`relative aspect-[9/16] w-full cursor-pointer overflow-hidden bg-black ${
        isPlaying ? "ring-1 ring-white" : ""
      }`}
      onClick={() => {
        const el = videoRef.current;
        if (!el) return;

        if (isPlaying) {
          el.pause();
          onPause();
          return;
        }

        onPlay(video.id);
        if (playingId !== null && el.readyState >= 1) {
          el.currentTime = 0;
        }
        el.play().catch(() => {});
      }}
    >
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        preload="none"
        playsInline
        muted={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain bg-black"
        aria-label={isPlaying ? `Pause ${video.title}` : `Play ${video.title}`}
      />
    </div>
  );
}
