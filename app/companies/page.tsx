import type { Metadata } from "next";

export default function CompaniesPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Companies</h1>
      <p className="mt-4 text-muted-foreground">
        Company directory coming soon.
      </p>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Companies",
  description: "Browse companies currently hiring",
};
