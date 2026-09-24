type Sink = (chunk: string) => void;

let sink: Sink | null = null;

export function bindTranscriptSink(next: Sink | null) {
  sink = next;
}

export function pushTranscript(chunk: string) {
  const text = chunk.trim();
  if (!text || !sink) return;
  sink(text);
}

export function textFromUnknown(payload: unknown): string {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return "";
  const rec = payload as Record<string, unknown>;
  for (const key of ["text", "transcript", "content"]) {
    if (typeof rec[key] === "string") return rec[key] as string;
  }
  const msg = rec.message;
  if (msg && typeof msg === "object" && "text" in msg) {
    const t = (msg as { text?: unknown }).text;
    if (typeof t === "string") return t;
  }
  return "";
}
