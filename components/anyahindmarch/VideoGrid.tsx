"use client";

import { useState } from "react";
import { anyaHindmarchVideos } from "@/lib/anyahindmarch/videos";
import VideoTile from "./VideoTile";

export default function VideoGrid() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-px md:grid-cols-3 md:gap-0.5">
      {anyaHindmarchVideos.map((video) => (
        <VideoTile
          key={video.id}
          video={video}
          isPlaying={playingId === video.id}
          playingId={playingId}
          onPlay={setPlayingId}
          onPause={() => setPlayingId(null)}
        />
      ))}
    </div>
  );
}
