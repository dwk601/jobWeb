import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import Providers from "./providers";

export const metadata: Metadata = {
  title: { default: "CareerFlow - Job Search", template: "%s | CareerFlow" },
  description:
    "Search thousands of job postings across top platforms in the US and Korea.",
  keywords: ["jobs", "job search", "career", "employment", "hiring"],
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
