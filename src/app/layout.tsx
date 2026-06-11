import type { Metadata } from "next";
import type { ReactNode } from "react";
import { epoch, instrumentSerif, neueRegrade } from "@/app/fonts";
import { SiteChrome } from "@/components/layout/site-chrome";
import { siteMeta } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${neueRegrade.variable} ${instrumentSerif.variable} ${epoch.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
