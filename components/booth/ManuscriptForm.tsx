"use client";

import { TextArea, TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { Manuscript } from "@/lib/types";

type Props = {
  value: Manuscript;
  onChange: (next: Manuscript) => void;
  onPrepare: () => void;
  onOpenTalk: () => void;
  disabled: boolean;
};

export function ManuscriptForm({
  value,
  onChange,
  onPrepare,
  onOpenTalk,
  disabled,
}: Props) {
  const setRef = (index: number, text: string) => {
    const references = [...value.references] as Manuscript["references"];
    references[index] = text;
    onChange({ ...value, references });
  };

  return (
    <section className="flex flex-col gap-8">
      <header className="max-w-xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/40">
          Examiner pack
        </p>
        <h2 className="font-display mt-2 text-3xl leading-tight text-ink md:text-[2.15rem]">
          Let the booth read the manuscript first.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/55">
          Title, question, abstract, five references. No PDF. Skip this for open
          talk.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <TextField
          label="Title"
          placeholder="The work you will defend"
          value={value.title}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
        <TextField
          label="Research question"
          placeholder="One sentence"
          value={value.question}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, question: e.target.value })}
        />
        <TextArea
          label="Abstract"
          placeholder="Paste the abstract only"
          value={value.abstract}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, abstract: e.target.value })}
        />
        <div className="grid gap-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
            References · five lines
          </p>
          {value.references.map((ref, i) => (
            <TextField
              key={i}
              label={`Ref ${i + 1}`}
              placeholder="Author, year, title — or leave blank"
              value={ref}
              disabled={disabled}
              onChange={(e) => setRef(i, e.target.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="button" onClick={onPrepare} disabled={disabled}>
          Prepare, then talk
        </Button>
        <Button type="button" tone="ghost" onClick={onOpenTalk} disabled={disabled}>
          Begin open talk
        </Button>
      </div>
    </section>
  );
}
