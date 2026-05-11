"use client";

import { useQuery } from "@tanstack/react-query";
import {
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JobListSkeleton, JobRow } from "@/components/jobs/job-card";
import { PaginationBar } from "@/components/jobs/pagination-bar";
import { EmptyState, FilterBar } from "@/components/jobs/search-results";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiError } from "@/lib/api/client";
import { SORT_FIELDS } from "@/lib/api/constants";
import { fetchJobs } from "@/lib/api/jobs";
import type { JobPosting } from "@/lib/api/schemas";
import { useDebounce } from "@/lib/hooks";
import { detectStateQuery } from "@/lib/state-search";

function sortWithLocationFirst(items: JobPosting[]): JobPosting[] {
  return [...items].sort((a, b) => {
    const aHas = a.location?.city || a.location?.state;
    const bHas = b.location?.city || b.location?.state;
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    return 0;
  });
}

interface SearchResultsClientProps {
  initialFilters: Record<string, string | number | undefined>;
}

export function SearchResultsClient({
  initialFilters: _initialFilters,
}: SearchResultsClientProps) {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [company, _setCompany] = useQueryState("company", parseAsString);
  const [language, setLanguage] = useQueryState("language", parseAsString);
  const [state, setState] = useQueryState("location_state", parseAsString);
  const [salaryMin, setSalaryMin] = useQueryState("salary_min", parseAsFloat);
  const [salaryMax, setSalaryMax] = useQueryState("salary_max", parseAsFloat);
  const [sortBy, setSortBy] = useQueryState(
    "sort_by",
    parseAsStringEnum([
      "id",
      "title",
      "company",
      "post_date",
      "source",
      "language",
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

  const [inputValue, setInputValue] = useState(q);
  const debouncedQ = useDebounce(inputValue, 400);

  useEffect(() => {
    if (debouncedQ !== q) {
      setQ(debouncedQ);
    }
  }, [debouncedQ, q, setQ]);

  const detectedState = useMemo(() => detectStateQuery(q), [q]);

  const filters = useMemo(() => {
    return {
      q: detectedState ? undefined : q.trim() || undefined,
      company: company ?? undefined,
      language: language ?? undefined,
      location_state: state ?? detectedState ?? undefined,
      salary_min: salaryMin ?? undefined,
      salary_max: salaryMax ?? undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
      page,
      page_size: pageSize,
    };
  }, [
    q,
    company,
    language,
    state,
    salaryMin,
    salaryMax,
    sortBy,
    sortOrder,
    page,
    pageSize,
    detectedState,
  ]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["jobs", "list", filters],
    queryFn: ({ signal }) => fetchJobs(filters, signal),
    placeholderData: (prev) => prev,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 429) return false;
      return failureCount < 2;
    },
  });

  const hasActiveFilters =
    !!q || !!language || !!state || salaryMin !== null || salaryMax !== null;

  const handleSearch = useCallback(() => {
    setQ(inputValue.trim() || "");
    setPage(1);
  }, [inputValue, setQ, setPage]);

  const handleClearSearch = useCallback(() => {
    setInputValue("");
    setQ("");
    setPage(1);
  }, [setQ, setPage]);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      resultsRef.current?.scrollIntoView({ behavior: "instant" });
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
    setInputValue("");
    setQ("");
    setLanguage(null);
    setState(null);
    setSalaryMin(null);
    setSalaryMax(null);
    setPage(1);
  }, [setQ, setLanguage, setState, setSalaryMin, setSalaryMax, setPage]);

  const sortedItems = useMemo(
    () => (data ? sortWithLocationFirst(data.items) : null),
    [data],
  );

  const isRateLimited = error instanceof ApiError && error.status === 429;

  return (
    <div ref={resultsRef} className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <FilterBar
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        language={language}
        onLanguageChange={setLanguage}
        state={state}
        onStateChange={setState}
        salaryMin={salaryMin}
        onSalaryMinChange={setSalaryMin}
        salaryMax={salaryMax}
        onSalaryMaxChange={setSalaryMax}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="mt-4 flex items-center justify-between border-b border-border pb-3">
        <p className="text-xs text-muted-foreground">
          {isLoading
            ? "Searching..."
            : data
              ? `${data.total.toLocaleString()} results`
              : ""}
          {detectedState && !state && (
            <span className="ml-2 text-primary">in {detectedState}</span>
          )}
        </p>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                aria-label="Sort jobs"
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

      {isLoading ? (
        <JobListSkeleton count={10} />
      ) : isError ? (
        isRateLimited ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-destructive">
              Too many requests
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Please wait a moment before searching again.
            </p>
            {error instanceof ApiError && error.retryAfter != null && (
              <p className="mt-2 text-xs text-muted-foreground">
                Retry after {error.retryAfter} second
                {error.retryAfter !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-destructive">
              Error loading jobs
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Something went wrong. Try again."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        )
      ) : data && sortedItems && sortedItems.length > 0 ? (
        <>
          <div className="divide-y divide-border">
            {sortedItems.map((job) => (
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
          query={q.trim() || undefined}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
}
