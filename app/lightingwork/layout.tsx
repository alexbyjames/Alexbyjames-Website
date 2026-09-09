import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lighting Work — James Alexander Topham",
  description: "Gaffer and lighting portfolio — James Alexander Topham",
};

export default function LightingWorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
