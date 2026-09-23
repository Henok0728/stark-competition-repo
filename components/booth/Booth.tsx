"use client";

import { useEffect, useState } from "react";
import { DebriefPanel } from "@/components/booth/DebriefPanel";
import { ExaminerPackCard } from "@/components/booth/ExaminerPackCard";
import { ManuscriptForm } from "@/components/booth/ManuscriptForm";
import { SessionBar } from "@/components/booth/SessionBar";
import { emptyCitations, emptyManuscript } from "@/lib/mock";
import { buildPack, loadPack, savePack } from "@/lib/pack";
import type { ExaminerPack, Manuscript, SessionMode, SessionPhase } from "@/lib/types";

function manuscriptFromPack(pack: ExaminerPack): Manuscript {
  const references: Manuscript["references"] = ["", "", "", "", ""];
  pack.citations.forEach((c, i) => {
    if (i < 5) references[i] = c.text;
  });
  return {
    title: pack.title,
    question: pack.question,
    abstract: pack.abstract,
    references,
  };
}

export function Booth() {
  const [manuscript, setManuscript] = useState<Manuscript>(emptyManuscript);
  const [pack, setPack] = useState<ExaminerPack | null>(null);
  const [phase, setPhase] = useState<SessionPhase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadPack();
    if (stored) {
      setPack(stored);
      setManuscript(manuscriptFromPack(stored));
      setPhase("prepared");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (phase !== "talking") return;
    const id = window.setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const lockPack = (mode: SessionMode) => {
    const next = buildPack(manuscript, mode);
    setPack(next);
    savePack(next);
    setPhase("prepared");
    setElapsed(0);
  };

  const formLocked = phase === "talking";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-12 md:px-10 md:py-16">
      <header className="flex items-baseline justify-between gap-6">
        <h1 className="font-display text-5xl text-ink md:text-6xl">Viva</h1>
        <p className="max-w-[14rem] text-right text-xs leading-relaxed text-ink/45">
          Read first. Then listen. Never invent a paper.
        </p>
      </header>

      <ManuscriptForm
        value={manuscript}
        onChange={setManuscript}
        disabled={formLocked}
        onPrepare={() => lockPack("prepared")}
        onOpenTalk={() => lockPack("open")}
      />

      {hydrated && pack ? <ExaminerPackCard pack={pack} /> : null}

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
        citations={pack && pack.mode === "prepared" ? pack.citations : emptyCitations}
        debrief=""
      />
    </div>
  );
}
