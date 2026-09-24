import type { Citation } from "./types";

function tidy(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[.,;:]+$/, "")
    .replace(/\s+(volume|page|pp\.?)\b.*$/i, "")
    .trim();
}

function key(text: string) {
  return tidy(text).toLowerCase();
}

function looksLikeClause(text: string) {
  return /\b(shows that|allows models|revolutionized|furthermore|according to)\b/i.test(
    text,
  );
}

function pushUnique(into: Map<string, Citation>, text: string, i: number) {
  const clean = tidy(text);
  if (clean.length < 10 || clean.length > 100) return;
  if (looksLikeClause(clean)) return;
  const k = key(clean);
  if (into.has(k)) return;
  into.set(k, {
    id: `sp-${i}-${k.slice(0, 24)}`,
    text: clean,
    status: "pending",
    source: "speech",
  });
}

export function extractSpeechCitations(transcript: string): Citation[] {
  const found = new Map<string, Citation>();
  const text = transcript.replace(/\s+/g, " ");
  let n = 0;

  const namedPaper =
    /\b(?:19|20)\d{2} paper\s+(.+?)(?:\s+revolutionized|\s+introduced|\s+which\b)/gi;
  let m: RegExpExecArray | null;
  while ((m = namedPaper.exec(text))) {
    n += 1;
    pushUnique(found, m[1], n);
  }

  const authorYearJournal =
    /([A-Z][A-Za-z]+)\s+((?:19|20)\d{2})\s+(Journal of [A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){0,6})/g;
  while ((m = authorYearJournal.exec(text))) {
    n += 1;
    pushUnique(found, `${m[1]} ${m[2]}, ${m[3]}`, n);
  }

  const twoAuthorsYear =
    /([A-Z][A-Za-z]+)\s+and\s+([A-Z][A-Za-z]+)\s+((?:19|20)\d{2})/g;
  while ((m = twoAuthorsYear.exec(text))) {
    n += 1;
    pushUnique(found, `${m[1]} and ${m[2]} ${m[3]}`, n);
  }

  const etAl =
    /([A-Z][A-Za-z']+(?:\s+[A-Z][A-Za-z']+){0,3})\s+et\s+al\.?,?\s*((?:19|20)\d{2})/gi;
  while ((m = etAl.exec(text))) {
    n += 1;
    pushUnique(found, m[0], n);
  }

  const ieee = /IEEE Transactions on [A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){0,6}/gi;
  while ((m = ieee.exec(text))) {
    n += 1;
    pushUnique(found, m[0], n);
  }

  return [...found.values()];
}

export function mergeCitations(manuscript: Citation[], speech: Citation[]): Citation[] {
  const seen = new Set<string>();
  const out: Citation[] = [];
  for (const c of [...manuscript, ...speech]) {
    const k = key(c.text);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(c);
  }
  return out;
}
