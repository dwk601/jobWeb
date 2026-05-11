"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PaginationBar({
  currentPage,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationBarProps) {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger className="w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs">per page</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-11 w-11 p-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="h-11 w-11 p-0 text-xs"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-11 w-11 p-0"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <span className="text-xs text-muted-foreground text-center">
        {(currentPage - 1) * pageSize + 1}-
        {Math.min(currentPage * pageSize, total)} of {total.toLocaleString()}
      </span>
    </div>
  );
}

function getVisiblePages(current: number, total: number): number[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: number[] = [];
  const start = Math.max(1, current - 1);
  const end = Math.min(total, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Ensure we always show 3 pages when possible
  if (pages.length < 3 && pages[0] > 1) {
    pages.unshift(pages[0] - 1);
  }
  if (pages.length < 3 && pages[pages.length - 1] < total) {
    pages.push(pages[pages.length - 1] + 1);
  }

  return pages;
}
