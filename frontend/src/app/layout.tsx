import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "SwarmGuard — Autonomous Workforce Operating System",
  description:
    "SwarmGuard is an AI-native operating system where users describe a project and autonomous workforces are recruited, evaluated, paid, and healed automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
