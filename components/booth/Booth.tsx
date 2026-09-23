"use client";

import { useEffect, useState } from "react";
import { DebriefPanel } from "@/components/booth/DebriefPanel";
import { ManuscriptForm } from "@/components/booth/ManuscriptForm";
import { SessionBar } from "@/components/booth/SessionBar";
import { emptyCitations, emptyManuscript } from "@/lib/mock";
import type { Manuscript, SessionPhase } from "@/lib/types";

export function Booth() {
  const [manuscript, setManuscript] = useState<Manuscript>(emptyManuscript);
  const [phase, setPhase] = useState<SessionPhase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [mode, setMode] = useState<"open" | "prepared" | null>(null);

  useEffect(() => {
    if (phase !== "talking") return;
    const id = window.setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const formLocked = phase === "talking";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-12 md:px-10 md:py-16">
      <header className="flex items-baseline justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-ink/40">
            Team Arada
          </p>
          <h1 className="font-display mt-3 text-5xl text-ink md:text-6xl">
            Viva
          </h1>
        </div>
        <p className="max-w-[14rem] text-right text-xs leading-relaxed text-ink/45">
          Read first. Then listen. Never invent a paper.
        </p>
      </header>

      <ManuscriptForm
        value={manuscript}
        onChange={setManuscript}
        disabled={formLocked}
        onPrepare={() => {
          setMode("prepared");
          setPhase("prepared");
          setElapsed(0);
        }}
        onOpenTalk={() => {
          setMode("open");
          setPhase("prepared");
          setElapsed(0);
        }}
      />

      {mode ? (
        <p className="text-xs uppercase tracking-[0.18em] text-ink/40">
          {mode === "prepared" ? "Manuscript packed" : "Open talk"}
        </p>
      ) : null}

      <SessionBar
        phase={phase}
        elapsedSeconds={elapsed}
        onStart={() => {
          setPhase("talking");
        }}
        onStop={() => {
          setPhase("stopped");
        }}
      />

      <DebriefPanel
        transcript=""
        citations={emptyCitations}
        debrief=""
      />
    </div>
  );
}
