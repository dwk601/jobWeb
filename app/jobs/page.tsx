import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { makeQueryClient } from "@/lib/query-client";
import { SearchResultsClient } from "./search-results-client";

export const metadata: Metadata = {
  title: "Job Search",
  description:
    "Browse and filter thousands of job postings from the US and South Korea. Filter by source, category, language, salary, and more.",
  alternates: {
    canonical: "/jobs",
  },
};

interface JobsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const raw = await searchParams;

  const filters: Record<string, string | number | undefined> = {};

  if (raw.q && typeof raw.q === "string") filters.q = raw.q;
  if (raw.source && typeof raw.source === "string") filters.source = raw.source;
  if (raw.company && typeof raw.company === "string")
    filters.company = raw.company;
  if (raw.language && typeof raw.language === "string")
    filters.language = raw.language;
  if (raw.location_city && typeof raw.location_city === "string")
    filters.location_city = raw.location_city;
  if (raw.location_state && typeof raw.location_state === "string")
    filters.location_state = raw.location_state;
  if (raw.job_category && typeof raw.job_category === "string")
    filters.job_category = raw.job_category;
  if (raw.job_status && typeof raw.job_status === "string")
    filters.job_status = raw.job_status;
  if (raw.sort_by && typeof raw.sort_by === "string")
    filters.sort_by = raw.sort_by;
  if (raw.sort_order && typeof raw.sort_order === "string")
    filters.sort_order = raw.sort_order;
  if (raw.page && typeof raw.page === "string")
    filters.page = parseInt(raw.page, 10);
  if (raw.page_size && typeof raw.page_size === "string")
    filters.page_size = parseInt(raw.page_size, 10);
  if (raw.salary_min && typeof raw.salary_min === "string")
    filters.salary_min = parseFloat(raw.salary_min);
  if (raw.salary_max && typeof raw.salary_max === "string")
    filters.salary_max = parseFloat(raw.salary_max);

  const queryClient = makeQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={<div className="p-8 text-center">Loading jobs...</div>}
      >
        <SearchResultsClient initialFilters={filters} />
      </Suspense>
    </HydrationBoundary>
  );
}
