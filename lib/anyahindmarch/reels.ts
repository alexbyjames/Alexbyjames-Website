export interface AnyaReel {
  id: string;
  url: string;
}

function reelShortcode(url: string): string {
  const match = url.match(/\/reel\/([^/?]+)/);
  return match?.[1] ?? url;
}

export function getReelPermalink(url: string): string {
  return `https://www.instagram.com/reel/${reelShortcode(url)}/`;
}

export function getReelEmbedSrc(url: string): string {
  return `https://www.instagram.com/reel/${reelShortcode(url)}/embed`;
}

/** Add more Instagram Reel URLs here. */
export const anyaHindmarchReels: AnyaReel[] = [
  {
    id: "DcTnEW2DAPJ",
    url: "https://www.instagram.com/reel/DcTnEW2DAPJ/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  },
  {
    id: "DcRK8H6AjCj",
    url: "https://www.instagram.com/reel/DcRK8H6AjCj/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  },
  {
    id: "DbqaXMJjxM1",
    url: "https://www.instagram.com/reel/DbqaXMJjxM1/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  },
  {
    id: "DblU-FqjaKA",
    url: "https://www.instagram.com/reel/DblU-FqjaKA/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  },
  {
    id: "Da-BzjogAmc",
    url: "https://www.instagram.com/reel/Da-BzjogAmc/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  },
  {
    id: "DaS-W3AAt9j",
    url: "https://www.instagram.com/reel/DaS-W3AAt9j/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  },
];
