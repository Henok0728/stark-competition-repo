import type { ExaminerPack } from "./types";

const KEY = "viva.library";
const MAX = 5;

function read(): ExaminerPack[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ExaminerPack[];
  } catch {
    return [];
  }
}

function write(packs: ExaminerPack[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(packs.slice(0, MAX)));
  } catch {
    /* ignore */
  }
}

export function rememberPack(pack: ExaminerPack) {
  const rest = read().filter((p) => p.id !== pack.id);
  write([pack, ...rest]);
}

export function listPacks(): ExaminerPack[] {
  return read();
}

export function packLabel(pack: ExaminerPack) {
  if (pack.mode === "open") return "Open talk";
  return pack.title || "Untitled";
}
