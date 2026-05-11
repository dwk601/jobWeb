import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";

export const metadata: Metadata = {
  title: "Koreer — Cross-Border Job Search",
  description:
    "Find your next role across the US and South Korea. Search thousands of bilingual job postings from top platforms.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Koreer",
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            description:
              "Cross-border job search platform for bilingual professionals in the US and South Korea.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/jobs?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <Hero />
    </>
  );
}
