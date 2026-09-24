const STOP = new Set([
  "journal",
  "the",
  "and",
  "of",
  "for",
  "in",
  "on",
  "a",
  "an",
  "to",
  "volume",
  "page",
  "transactions",
  "ieee",
  "paper",
]);

export function significantTokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

/** True only when the Scholarxiv title is actually about this claim. */
export function titleMatchesClaim(query: string, title: string) {
  const q = query.trim().toLowerCase();
  const t = title.trim().toLowerCase();
  if (!q || !t) return false;
  if (t.includes(q) || q.includes(t)) return true;
  const qt = significantTokens(query);
  const tt = new Set(significantTokens(title));
  if (qt.length === 0) return false;
  const hit = qt.filter((w) => tt.has(w)).length;
  if (qt.length === 1) return hit === 1;
  return hit >= 2;
}
