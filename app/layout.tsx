import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://legencymedia.com"),
  title: "Legency Media | Webflow Agency & Enterprise Partner",
  description:
    "Webflow development, SEO, AI visibility and conversion optimisation for B2B marketing teams. A shared plan and monthly reporting on results.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
