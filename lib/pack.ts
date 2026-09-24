import type { Citation, ExaminerPack, Manuscript, SessionMode } from "./types";

const STORAGE_KEY = "viva.examinerPack";

export function buildPack(manuscript: Manuscript, mode: SessionMode): ExaminerPack {
  const citations: Citation[] =
    mode === "open"
      ? []
      : manuscript.references
          .map((text) => text.trim())
          .filter(Boolean)
          .map((text, i) => ({
            id: `ms-${i + 1}`,
            text,
            status: "pending" as const,
            source: "manuscript" as const,
          }));

  return {
    id: crypto.randomUUID(),
    mode,
    packedAt: new Date().toISOString(),
    title: manuscript.title.trim(),
    question: manuscript.question.trim(),
    abstract: manuscript.abstract.trim(),
    citations,
  };
}

export function savePack(pack: ExaminerPack) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pack));
  } catch {
    /* private mode / quota */
  }
}

export function loadPack(): ExaminerPack | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ExaminerPack;
  } catch {
    return null;
  }
}

export function clearPack() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
