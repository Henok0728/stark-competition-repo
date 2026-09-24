import type { Citation, CitationStatus } from "./types";

type Row = {
  query: string;
  status: CitationStatus;
  title?: string;
};

export async function verifyCitations(list: Citation[]): Promise<Citation[]> {
  if (list.length === 0) return [];
  try {
    const res = await fetch("/api/citations/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queries: list.map((c) => c.text) }),
    });
    if (!res.ok) {
      return list.map((c) => ({ ...c, status: "unverified" as const }));
    }
    const data = (await res.json()) as { results?: Row[] };
    const rows = data.results ?? [];
    return list.map((c, i) => {
      const row = rows[i];
      if (!row) return { ...c, status: "unverified" as const };
      return {
        ...c,
        status: row.status,
        hitTitle: row.title,
      };
    });
  } catch {
    return list.map((c) => ({ ...c, status: "unverified" as const }));
  }
}
