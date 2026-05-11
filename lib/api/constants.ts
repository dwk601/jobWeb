export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export const SOURCES = [
  { value: "saramin", label: "Saramin" },
  { value: "wanted", label: "Wanted" },
  { value: "programmers", label: "Programmers" },
  { value: "github", label: "GitHub Jobs" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "glassdoor", label: "Glassdoor" },
  { value: "monkeytail", label: "MonkeyTail" },
] as const;

export const JOB_CATEGORIES = [
  { value: "software-engineering", label: "Software Engineering" },
  { value: "data-science", label: "Data Science" },
  { value: "product-management", label: "Product Management" },
  { value: "design", label: "Design" },
  { value: "finance", label: "Finance" },
  { value: "marketing", label: "Marketing" },
  { value: "healthcare", label: "Healthcare" },
  { value: "devops", label: "DevOps" },
] as const;

export const SORT_FIELDS = [
  { value: "post_date", label: "Date Posted" },
  { value: "title", label: "Title" },
  { value: "company", label: "Company" },
  { value: "salary", label: "Salary" },
  { value: "relevance", label: "Relevance" },
] as const;

export const JOB_STATUSES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
] as const;

export const LANGS = [
  { value: "en", label: "English" },
  { value: "ko", label: "Korean" },
] as const;

export const ITEMS_PER_PAGE_OPTIONS = [
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
] as const;
