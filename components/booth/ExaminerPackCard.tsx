import type { ExaminerPack } from "@/lib/types";

type Props = {
  pack: ExaminerPack;
};

export function ExaminerPackCard({ pack }: Props) {
  const emptyOpen = pack.mode === "open";

  return (
    <section className="border-t border-rule pt-10">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ink/40">
        Examiner pack
      </p>
      <h2 className="font-display mt-2 text-2xl text-ink">
        {emptyOpen ? "Open talk — no manuscript." : pack.title || "Untitled"}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/55">
        {emptyOpen
          ? "Citations will come from speech after you stop. Scholarxiv is not called yet."
          : pack.question || "No research question packed."}
      </p>
      {!emptyOpen && pack.abstract ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
          {pack.abstract}
        </p>
      ) : null}
      {!emptyOpen ? (
        <ol className="mt-6 max-w-2xl list-decimal space-y-2 pl-5 text-sm text-ink/70">
          {pack.citations.length === 0 ? (
            <li className="list-none pl-0 text-ink/35">No references packed.</li>
          ) : (
            pack.citations.map((c) => <li key={c.id}>{c.text}</li>)
          )}
        </ol>
      ) : null}
    </section>
  );
}
