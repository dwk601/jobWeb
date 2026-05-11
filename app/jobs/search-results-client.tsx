"use client";

import { useQuery } from "@tanstack/react-query";
import {
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { useCallback, useMemo } from "react";
import { JobListSkeleton, JobRow } from "@/components/jobs/job-card";
import { PaginationBar } from "@/components/jobs/pagination-bar";
import { EmptyState, FilterBar } from "@/components/jobs/search-results";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SORT_FIELDS } from "@/lib/api/constants";
import { fetchJobs } from "@/lib/api/jobs";

interface SearchResultsClientProps {
  initialFilters: Record<string, string | number | undefined>;
}

export function SearchResultsClient({
  initialFilters: _initialFilters,
}: SearchResultsClientProps) {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [source, setSource] = useQueryState("source", parseAsString);
  const [company, _setCompany] = useQueryState("company", parseAsString);
  const [language, setLanguage] = useQueryState("language", parseAsString);
  const [jobCategory, setJobCategory] = useQueryState(
    "job_category",
    parseAsString,
  );
  const [_jobStatus] = useQueryState("job_status", parseAsString);
  const [salaryMin, setSalaryMin] = useQueryState("salary_min", parseAsFloat);
  const [salaryMax, setSalaryMax] = useQueryState("salary_max", parseAsFloat);
  const [sortBy, setSortBy] = useQueryState(
    "sort_by",
    parseAsStringEnum([
      "id",
      "title",
      "company",
      "post_date",
      "created_at",
      "updated_at",
      "source",
      "language",
      "description_length",
    ]).withDefault("post_date"),
  );
  const [sortOrder, _setSortOrder] = useQueryState(
    "sort_order",
    parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(20),
  );

  const filters = useMemo(
    () => ({
      q: q || undefined,
      source: source ?? undefined,
      company: company ?? undefined,
      language: language ?? undefined,
      job_category: jobCategory ?? undefined,
      salary_min: salaryMin ?? undefined,
      salary_max: salaryMax ?? undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
      page,
      page_size: pageSize,
    }),
    [
      q,
      source,
      company,
      language,
      jobCategory,
      salaryMin,
      salaryMax,
      sortBy,
      sortOrder,
      page,
      pageSize,
    ],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobs", "list", filters],
    queryFn: () => fetchJobs(filters),
    placeholderData: (prev) => prev,
  });

  const hasActiveFilters =
    !!q ||
    !!source ||
    !!jobCategory ||
    !!language ||
    salaryMin !== null ||
    salaryMax !== null;

  const handleSearch = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setPage],
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    [setPageSize, setPage],
  );

  const handleClearFilters = useCallback(() => {
    setQ("");
    setSource(null);
    setLanguage(null);
    setJobCategory(null);
    setSalaryMin(null);
    setSalaryMax(null);
    setPage(1);
  }, [
    setQ,
    setSource,
    setLanguage,
    setJobCategory,
    setSalaryMin,
    setSalaryMax,
    setPage,
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Filter bar */}
      <FilterBar
        q={q}
        onQChange={setQ}
        onSearch={handleSearch}
        source={source}
        onSourceChange={setSource}
        jobCategory={jobCategory}
        onJobCategoryChange={setJobCategory}
        language={language}
        onLanguageChange={setLanguage}
        salaryMin={salaryMin}
        onSalaryMinChange={setSalaryMin}
        salaryMax={salaryMax}
        onSalaryMaxChange={setSalaryMax}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results header */}
      <div className="mt-4 flex items-center justify-between border-b border-border pb-3">
        <p className="text-xs text-muted-foreground">
          {isLoading
            ? "Searching..."
            : data
              ? `${data.total.toLocaleString()} results`
              : ""}
        </p>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <span>
                  Sort:{" "}
                  {SORT_FIELDS.find((o) => o.value === sortBy)?.label ?? sortBy}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-current"
                  aria-hidden="true"
                >
                  <title>Sort direction</title>
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            }
          >
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={(v) => setSortBy(v as typeof sortBy)}
              >
                {SORT_FIELDS.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    className="text-xs"
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>

      {/* Results */}
      {isLoading ? (
        <JobListSkeleton count={10} />
      ) : isError ? (
        <div className="py-16 text-center">
          <p className="text-sm font-medium text-destructive">
            Error loading jobs
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong. Try again."}
          </p>
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="divide-y divide-border">
            {data.items.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </div>
          <PaginationBar
            currentPage={data.page}
            totalPages={data.total_pages}
            total={data.total}
            pageSize={data.page_size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      ) : (
        <EmptyState
          query={q || undefined}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
}
