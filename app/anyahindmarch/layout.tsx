import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anya Hindmarch — James Alexander Topham",
  description: "Anya Hindmarch cinematography — James Alexander Topham",
};

export default function AnyaHindmarchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
