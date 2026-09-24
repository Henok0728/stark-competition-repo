import { Button } from "@/components/ui/Button";
import type { ExaminerPack } from "@/lib/types";

type Props = {
  pack: ExaminerPack;
  onEdit: () => void;
};

export function ExaminerPackCard({ pack, onEdit }: Props) {
  const emptyOpen = pack.mode === "open";
  const refs = pack.citations.length;

  return (
    <section className="flex items-start justify-between gap-6 border-t border-rule pt-6">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/40">
          Packed
        </p>
        <h2 className="font-display mt-1 truncate text-2xl text-ink">
          {emptyOpen ? "Open talk" : pack.title || "Untitled"}
        </h2>
        <p className="mt-1 truncate text-sm text-ink/50">
          {emptyOpen
            ? "Citations from speech after you stop"
            : [pack.question, refs ? `${refs} refs` : "No refs"]
                .filter(Boolean)
                .join(" · ")}
        </p>
      </div>
      <Button type="button" tone="ghost" onClick={onEdit}>
        Edit
      </Button>
    </section>
  );
}
