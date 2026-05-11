"use client";

import { SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { JOB_CATEGORIES, LANGS, SOURCES } from "@/lib/api/constants";

interface FilterBarProps {
  q: string;
  onQChange: (value: string) => void;
  onSearch: () => void;
  source: string | null;
  onSourceChange: (value: string | null) => void;
  jobCategory: string | null;
  onJobCategoryChange: (value: string | null) => void;
  language: string | null;
  onLanguageChange: (value: string | null) => void;
  salaryMin: number | null;
  onSalaryMinChange: (value: number | null) => void;
  salaryMax: number | null;
  onSalaryMaxChange: (value: number | null) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  q,
  onQChange,
  onSearch,
  source,
  onSourceChange,
  jobCategory,
  onJobCategoryChange,
  language,
  onLanguageChange,
  salaryMin,
  onSalaryMinChange,
  salaryMax,
  onSalaryMaxChange,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <>
      {/* Desktop filter bar */}
      <div className="hidden flex-col gap-3 lg:flex">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[160px] max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={q}
              onChange={(e) => onQChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="Search jobs..."
              aria-label="Search jobs"
              className="h-10 pl-9 pr-8 text-sm"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  onQChange("");
                  onSearch();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <Select
            value={source ?? ""}
            onValueChange={(v) => onSourceChange(v || null)}
          >
            <SelectTrigger className="h-10 min-w-[110px] text-xs">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All sources</SelectItem>
              {SOURCES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={jobCategory ?? ""}
            onValueChange={(v) => onJobCategoryChange(v || null)}
          >
            <SelectTrigger className="h-10 min-w-[110px] text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {JOB_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={language ?? ""}
            onValueChange={(v) => onLanguageChange(v || null)}
          >
            <SelectTrigger className="h-10 min-w-[110px] text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All languages</SelectItem>
              {LANGS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1.5 rounded-md border border-input bg-background px-2">
            <Input
              type="number"
              placeholder="Min $"
              value={salaryMin ?? ""}
              onChange={(e) =>
                onSalaryMinChange(
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
              aria-label="Minimum salary"
              className="h-10 w-20 border-0 bg-transparent px-0 text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-xs text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max $"
              value={salaryMax ?? ""}
              onChange={(e) =>
                onSalaryMaxChange(
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
              aria-label="Maximum salary"
              className="h-10 w-20 border-0 bg-transparent px-0 text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Mobile: search + filter sheet trigger */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Search jobs..."
            aria-label="Search jobs"
            className="h-10 pl-9 pr-8 text-sm"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                onQChange("");
                onSearch();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-10 shrink-0 gap-1.5"
              />
            }
          >
            <SlidersHorizontal className="size-3.5" />
            <span className="text-xs">Filters</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Source
                </span>
                <Select
                  value={source ?? ""}
                  onValueChange={(v) => onSourceChange(v || null)}
                >
                  <SelectTrigger className="h-10 w-full text-xs">
                    <SelectValue placeholder="All sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All sources</SelectItem>
                    {SOURCES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Category
                </span>
                <Select
                  value={jobCategory ?? ""}
                  onValueChange={(v) => onJobCategoryChange(v || null)}
                >
                  <SelectTrigger className="h-10 w-full text-xs">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {JOB_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Language
                </span>
                <Select
                  value={language ?? ""}
                  onValueChange={(v) => onLanguageChange(v || null)}
                >
                  <SelectTrigger className="h-10 w-full text-xs">
                    <SelectValue placeholder="All languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All languages</SelectItem>
                    {LANGS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Salary range (USD)
                </span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={salaryMin ?? ""}
                    onChange={(e) =>
                      onSalaryMinChange(
                        e.target.value ? parseFloat(e.target.value) : null,
                      )
                    }
                    aria-label="Minimum salary"
                    className="h-10 flex-1 text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="text-xs text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={salaryMax ?? ""}
                    onChange={(e) =>
                      onSalaryMaxChange(
                        e.target.value ? parseFloat(e.target.value) : null,
                      )
                    }
                    aria-label="Maximum salary"
                    className="h-10 flex-1 text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

interface EmptyStateProps {
  query?: string;
  onClearFilters?: () => void;
}

export function EmptyState({ query, onClearFilters }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <SearchIcon className="mx-auto size-8 text-muted-foreground/40" />
      <p className="mt-4 text-sm font-medium text-foreground">
        {query ? `No results for "${query}"` : "No jobs found"}
      </p>
      <p className="mt-1 px-4 text-xs text-muted-foreground">
        Try adjusting your search terms or removing filters.
      </p>
      {onClearFilters && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onClearFilters}
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
}
