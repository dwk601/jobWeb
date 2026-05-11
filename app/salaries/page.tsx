import type { Metadata } from "next";

export default function SalariesPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Salary Insights</h1>
      <p className="mt-4 text-muted-foreground">
        Salary data and insights coming soon.
      </p>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Salaries",
  description: "Salary insights and compensation data",
};
