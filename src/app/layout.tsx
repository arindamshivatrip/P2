import type { Metadata } from "next";
import type { ReactNode } from "react";
import { epoch, instrumentSerif, neueRegrade } from "@/app/fonts";
import { SiteChrome } from "@/components/layout/site-chrome";
import { siteMeta } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.title,
    template: `%s — ${siteMeta.name}`
  },
  description: siteMeta.description,
  applicationName: siteMeta.name,
  authors: [{ name: siteMeta.formalName, url: siteMeta.url }],
  creator: siteMeta.formalName,
  openGraph: {
    type: "website",
    siteName: siteMeta.name,
    url: siteMeta.url,
    title: siteMeta.title,
    description: siteMeta.description,
    images: [{ url: siteMeta.ogImage, alt: siteMeta.ogImageAlt }]
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    images: [siteMeta.ogImage]
  },
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
