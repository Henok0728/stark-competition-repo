import type { CitationStatus } from "@/lib/types";

const labels: Record<CitationStatus, string> = {
  pending: "Pending",
  in_corpus: "In corpus",
  not_found: "Not found",
  unverified: "Unverified",
};

export function Badge({ status }: { status: CitationStatus }) {
  return (
    <span className="rounded-full border border-rule px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-ink/50">
      {labels[status]}
    </span>
  );
}
