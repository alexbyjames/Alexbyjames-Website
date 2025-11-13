export function getEmbedSrc(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = parsed.pathname.slice(1);
      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === "youtube.com" || host.endsWith("youtube.com")) {
      const videoId =
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/").filter(Boolean)[1] ||
        "";
      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === "player.vimeo.com") {
      return url;
    }

    if (host === "vimeo.com") {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (!segments.length) return null;
      const videoId = segments[0];
      const hashFromPath = segments[1];
      const hash = parsed.searchParams.get("h") || hashFromPath;
      const params = new URLSearchParams();
      if (hash) {
        params.set("h", hash);
      }
      const paramString = params.toString();
      return `https://player.vimeo.com/video/${videoId}${paramString ? `?${paramString}` : ""}`;
    }

    return null;
  } catch (error) {
    console.warn("Failed to parse URL for embed:", url, error);
    return null;
  }
}

