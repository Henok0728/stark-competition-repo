import type { Citation } from "./types";

export async function requestDebrief(input: {
  transcript: string;
  abstract: string;
  citations: Citation[];
}) {
  const res = await fetch("/api/debrief", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transcript: input.transcript,
      abstract: input.abstract,
      citations: input.citations.map((c) => ({
        text: c.text,
        status: c.status,
        hitTitle: c.hitTitle,
      })),
    }),
  });
  if (!res.ok) return "";
  const data = (await res.json()) as { text?: string };
  return data.text ?? "";
}
