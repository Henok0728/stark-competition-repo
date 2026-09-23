import type { Citation, Manuscript } from "./types";

export const emptyManuscript: Manuscript = {
  title: "",
  question: "",
  abstract: "",
  references: ["", "", "", "", ""],
};

export const emptyCitations: Citation[] = [];
