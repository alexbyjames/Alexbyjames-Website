import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "James Alexander Topham",
  description: "Cinematographer and Director",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}

