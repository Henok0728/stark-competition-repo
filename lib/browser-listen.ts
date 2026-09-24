type ResultRow = { isFinal: boolean; 0?: { transcript?: string } };

type Rec = {
  start: () => void;
  stop: () => void;
  onresult: ((ev: { resultIndex: number; results: ArrayLike<ResultRow> }) => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

function ctor(): (new () => Rec) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => Rec;
    webkitSpeechRecognition?: new () => Rec;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function startBrowserListen(onFinal: (text: string) => void): () => void {
  const Ctor = ctor();
  if (!Ctor) return () => {};
  const rec = new Ctor();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";
  rec.onresult = (ev) => {
    let piece = "";
    for (let i = ev.resultIndex; i < ev.results.length; i++) {
      const row = ev.results[i];
      if (row.isFinal) piece += row[0]?.transcript ?? "";
    }
    if (piece.trim()) onFinal(piece);
  };
  try {
    rec.start();
  } catch {
    return () => {};
  }
  return () => {
    try {
      rec.stop();
    } catch {
      /* already stopped */
    }
  };
}
