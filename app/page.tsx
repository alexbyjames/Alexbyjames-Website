import type { Metadata } from "next";
import HomeShell from "@/components/HomeShell";

const baseTitle = "James Alexander Topham — Cinematographer & Director";
const baseDescription =
  "London-based cinematographer and director crafting music videos, commercials, and art projects.";

export const metadata: Metadata = {
  title: baseTitle,
  description: baseDescription,
  openGraph: {
    title: baseTitle,
    description: baseDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: baseTitle,
    description: baseDescription,
  },
};

export default function Page() {
  return <HomeShell />;
}
