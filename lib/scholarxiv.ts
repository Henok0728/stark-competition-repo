export type PaperHit = {
  title?: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function collectPapers(payload: unknown): PaperHit[] {
  const root = asRecord(payload);
  if (!root) return [];
  const bags = [root.data, root.papers, root.results, root.items];
  for (const bag of bags) {
    if (Array.isArray(bag)) {
      return bag.map((row) => {
        const r = asRecord(row);
        const inner = r ? asRecord(r.paper) ?? r : null;
        const title =
          (inner && typeof inner.title === "string" && inner.title) ||
          (inner && typeof inner.ti === "string" && inner.ti) ||
          undefined;
        return { title };
      });
    }
    const nested = asRecord(bag);
    if (nested && Array.isArray(nested.data)) {
      return collectPapers(nested);
    }
  }
  return [];
}

export async function searchScholarxiv(query: string): Promise<PaperHit[] | null> {
  const key = process.env.SCHOLARXIV_API_KEY?.trim();
  if (!key) return null;

  const url = `https://scholarxiv.com/api/v1/papers/search?q=${encodeURIComponent(query)}&limit=3`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  try {
    return collectPapers(await res.json());
  } catch {
    return null;
  }
}
