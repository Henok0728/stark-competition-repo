export async function requestExtract(transcript: string): Promise<string[]> {
  if (!transcript.trim()) return [];
  try {
    const res = await fetch("/api/citations/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { queries?: unknown };
    if (!Array.isArray(data.queries)) return [];
    return data.queries.filter((q): q is string => typeof q === "string" && q.trim().length > 0);
  } catch {
    return [];
  }
}
