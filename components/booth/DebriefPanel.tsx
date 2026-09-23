import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import type { Citation } from "@/lib/types";

type Props = {
  transcript: string;
  citations: Citation[];
  debrief: string;
};

function Pane({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <article className="flex min-h-[14rem] flex-col border-t border-rule pt-5">
      <h3 className="text-[11px] uppercase tracking-[0.18em] text-ink/40">
        {label}
      </h3>
      <div className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
        {children}
      </div>
    </article>
  );
}

export function DebriefPanel({ transcript, citations, debrief }: Props) {
  return (
    <section className="grid gap-10 md:grid-cols-3">
      <Pane label="Transcript">
        {transcript ? (
          <p className="whitespace-pre-wrap">{transcript}</p>
        ) : (
          <p className="text-ink/35">Nothing spoken yet.</p>
        )}
      </Pane>
      <Pane label="Citations">
        {citations.length === 0 ? (
          <p className="text-ink/35">
            Scholarxiv checks appear here. Never invented.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {citations.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3">
                <span>{c.text}</span>
                <Badge status={c.status} />
              </li>
            ))}
          </ul>
        )}
      </Pane>
      <Pane label="Say it like this">
        {debrief ? (
          <p className="whitespace-pre-wrap">{debrief}</p>
        ) : (
          <p className="text-ink/35">Keep. Fix. One line to say instead.</p>
        )}
      </Pane>
    </section>
  );
}
