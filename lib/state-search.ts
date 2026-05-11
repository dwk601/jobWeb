const STATES_MAP: Record<string, string> = {
  al: "AL",
  ak: "AK",
  az: "AZ",
  ar: "AR",
  ca: "CA",
  co: "CO",
  ct: "CT",
  de: "DE",
  fl: "FL",
  ga: "GA",
  hi: "HI",
  id: "ID",
  il: "IL",
  in: "IN",
  ia: "IA",
  ks: "KS",
  ky: "KY",
  la: "LA",
  me: "ME",
  md: "MD",
  ma: "MA",
  mi: "MI",
  mn: "MN",
  ms: "MS",
  mo: "MO",
  mt: "MT",
  ne: "NE",
  nv: "NV",
  nh: "NH",
  nj: "NJ",
  nm: "NM",
  ny: "NY",
  nc: "NC",
  nd: "ND",
  oh: "OH",
  ok: "OK",
  or: "OR",
  pa: "PA",
  ri: "RI",
  sc: "SC",
  sd: "SD",
  tn: "TN",
  tx: "TX",
  ut: "UT",
  vt: "VT",
  va: "VA",
  wa: "WA",
  wv: "WV",
  wi: "WI",
  wy: "WY",
};

const STATES_LOWERCASE = new Set(Object.keys(STATES_MAP));

/**
 * Detects if a search query is a US state abbreviation.
 * Returns the uppercase state code if detected, null otherwise.
 * Handles: "nj", "NJ", "New Jersey", "new jersey"
 */
export function detectStateQuery(query: string): string | null {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  if (STATES_LOWERCASE.has(lower)) {
    return STATES_MAP[lower];
  }

  return null;
}
