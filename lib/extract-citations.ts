import type { Citation } from "./types";

function tidy(text: string) {
  return text.replace(/\s+/g, " ").replace(/[.,;:]+$/, "").trim();
}

function key(text: string) {
  return tidy(text).toLowerCase();
}

function pushUnique(into: Map<string, Citation>, text: string, i: number) {
  const clean = tidy(text);
  if (clean.length < 8 || clean.length > 160) return;
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

  const patterns: RegExp[] = [
    /([A-Z][A-Za-z']+(?:\s+[A-Z][A-Za-z']+){0,3})\s+et\s+al\.?,?\s*((?:19|20)\d{2})/gi,
    /([A-Z][A-Za-z']+)\s+and\s+([A-Z][A-Za-z']+),?\s*((?:19|20)\d{2})/gi,
    /IEEE Transactions on [A-Za-z][A-Za-z\s]{2,48}/gi,
    /Journal of [A-Za-z][A-Za-z\s]{2,48}/gi,
    /(?:according to|published (?:by|in)|studies from)\s+([^.]{8,80})/gi,
  ];

  for (const re of patterns) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const raw = m[0].replace(/^(according to|published (?:by|in)|studies from)\s+/i, "");
      n += 1;
      pushUnique(found, raw, n);
    }
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
