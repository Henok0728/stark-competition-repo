import { packLabel } from "@/lib/library";
import type { ExaminerPack } from "@/lib/types";

type Props = {
  packs: ExaminerPack[];
  activeId: string | null;
  onSelect: (pack: ExaminerPack) => void;
};

export function PackLibrary({ packs, activeId, onSelect }: Props) {
  if (packs.length === 0) return null;

  return (
    <nav className="flex flex-wrap gap-2">
      {packs.map((pack) => {
        const on = pack.id === activeId;
        return (
          <button
            key={pack.id}
            type="button"
            onClick={() => onSelect(pack)}
            className={`rounded-full px-3 py-1 text-xs tracking-wide transition ${
              on
                ? "bg-ink text-paper"
                : "border border-rule text-ink/55 hover:border-ink/30 hover:text-ink"
            }`}
          >
            {packLabel(pack)}
          </button>
        );
      })}
    </nav>
  );
}
