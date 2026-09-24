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
  "from",
  "with",
]);

function yearsIn(text: string) {
  return text.match(/\b(?:19|20)\d{2}\b/g) ?? [];
}

export function significantTokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w) && !/^\d{4}$/.test(w));
}

/** True only when the Scholarxiv title is actually about this claim. */
export function titleMatchesClaim(query: string, title: string) {
  const q = query.trim().toLowerCase();
  const t = title.trim().toLowerCase();
  if (!q || !t) return false;

  const qYears = yearsIn(q);
  if (qYears.length > 0 && !qYears.some((y) => t.includes(y))) {
    return false;
  }

  if (t.includes(q)) return true;

  const qt = significantTokens(query);
  const tt = new Set(significantTokens(title));
  if (qt.length === 0) return false;
  const hit = qt.filter((w) => tt.has(w)).length;
  // Two generic words ("architectures" + "intelligence") is not a paper match.
  if (qt.length <= 2) return hit === qt.length;
  return hit >= Math.ceil(qt.length * 0.75);
}

/** True when the claim's content words actually appear in the heard talk. */
export function claimGroundedInTranscript(claim: string, transcript: string) {
  const qt = significantTokens(claim);
  if (qt.length === 0) return false;
  const hay = transcript.toLowerCase();
  const hit = qt.filter((w) => hay.includes(w)).length;
  if (qt.length <= 2) return hit === qt.length;
  return hit >= Math.ceil(qt.length * 0.6);
}
