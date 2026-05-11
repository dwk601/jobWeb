import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import Providers from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#2b2a28" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Koreer — Cross-Border Job Search",
    template: "%s | Koreer",
  },
  description:
    "Search thousands of job postings across top platforms in the US and South Korea. Find bilingual roles in software engineering, design, marketing, and more.",
  keywords: [
    "jobs",
    "job search",
    "career",
    "employment",
    "hiring",
    "korea",
    "usa",
    "bilingual jobs",
    "english korean jobs",
  ],
  authors: [{ name: "Koreer" }],
  category: "Technology",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    siteName: "Koreer",
    title: "Koreer — Cross-Border Job Search",
    description:
      "Search thousands of job postings across top platforms in the US and South Korea.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Koreer — Cross-Border Job Search",
    description:
      "Search thousands of job postings across top platforms in the US and South Korea.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
