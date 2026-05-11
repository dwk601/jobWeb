export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export const SOURCES = [
  { value: "gtksa", label: "GTKSA" },
  { value: "jobkoreausa", label: "Job Korea USA" },
  { value: "workingus", label: "WorkingUS" },
  { value: "wowseattle", label: "Wow Seattle" },
  { value: "heykorean", label: "Hey Korean" },
  { value: "radiokorea", label: "Radio Korea" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "koreadaily", label: "Korea Daily" },
] as const;

export const JOB_CATEGORIES = [
  { value: "agriculture", label: "Agriculture" },
  { value: "automotive", label: "Automotive" },
  { value: "beauty", label: "Beauty" },
  { value: "caregiver", label: "Caregiver" },
  { value: "cleaning", label: "Cleaning" },
  { value: "construction", label: "Construction" },
  { value: "delivery", label: "Delivery" },
  { value: "healthcare", label: "Healthcare" },
  { value: "hotel", label: "Hotel" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "office", label: "Office" },
  { value: "restaurant", label: "Restaurant" },
  { value: "retail", label: "Retail" },
  { value: "tutor", label: "Tutor" },
  { value: "warehouse", label: "Warehouse" },
] as const;

export const SORT_FIELDS = [
  { value: "post_date", label: "Date Posted" },
  { value: "title", label: "Title" },
  { value: "company", label: "Company" },
  { value: "source", label: "Source" },
  { value: "language", label: "Language" },
] as const;

export const LANGS = [
  { value: "korean", label: "Korean" },
  { value: "english", label: "English" },
  { value: "bilingual", label: "Bilingual" },
] as const;

export const STATES = [
  { value: "CA", label: "California" },
  { value: "TX", label: "Texas" },
  { value: "GA", label: "Georgia" },
  { value: "NY", label: "New York" },
  { value: "NJ", label: "New Jersey" },
  { value: "AL", label: "Alabama" },
  { value: "WA", label: "Washington" },
  { value: "MI", label: "Michigan" },
  { value: "IL", label: "Illinois" },
  { value: "VA", label: "Virginia" },
  { value: "TN", label: "Tennessee" },
  { value: "IN", label: "Indiana" },
  { value: "NV", label: "Nevada" },
  { value: "AZ", label: "Arizona" },
  { value: "PA", label: "Pennsylvania" },
  { value: "OR", label: "Oregon" },
  { value: "NE", label: "Nebraska" },
  { value: "KY", label: "Kentucky" },
  { value: "KS", label: "Kansas" },
  { value: "SC", label: "South Carolina" },
] as const;

export const ITEMS_PER_PAGE_OPTIONS = [
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
] as const;
