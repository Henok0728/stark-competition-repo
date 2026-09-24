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
