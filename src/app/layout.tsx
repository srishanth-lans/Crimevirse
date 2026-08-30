import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrimeVerse – Open World Crime Investigation",
  description: "Become the investigator. Solve cases in a living 3D city. Offline & Online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
