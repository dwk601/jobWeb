"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/salaries", label: "Salaries" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          CareerFlow
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 transition-colors",
                pathname === item.href
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/jobs"
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Find Jobs
          </Link>
        </div>
      </div>
    </header>
  );
}
