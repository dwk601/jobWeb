"use client";

import { MapPinIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location_city", location.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 sm:py-32">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Find your next role
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Search thousands of jobs across the US
      </p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Job title or company..."
              className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="relative flex-1 sm:max-w-[180px]">
            <MapPinIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or State..."
              className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
