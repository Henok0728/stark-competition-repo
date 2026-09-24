"use client";

import { useEffect, useState } from "react";
import { DebriefPanel } from "@/components/booth/DebriefPanel";
import { ExaminerPackCard } from "@/components/booth/ExaminerPackCard";
import { ManuscriptForm } from "@/components/booth/ManuscriptForm";
import { PackLibrary } from "@/components/booth/PackLibrary";
import { SessionBar } from "@/components/booth/SessionBar";
import { startBrowserListen } from "@/lib/browser-listen";
import { listPacks, rememberPack } from "@/lib/library";
import {
  capSpeechCitations,
  citationsFromTexts,
  extractSpeechCitations,
  mergeCitations,
} from "@/lib/extract-citations";
import { emptyCitations, emptyManuscript } from "@/lib/mock";
import { requestDebrief } from "@/lib/request-debrief";
import { requestExtract } from "@/lib/request-extract";
import { verifyCitations } from "@/lib/verify-citations";
import { buildPack, loadPack, savePack } from "@/lib/pack";
import { bindVivaSession } from "@/lib/session-bridge";
import { mergeSpeech } from "@/lib/speech-clean";
import { hushVoxide } from "@/lib/voxide-client";
import type {
  Citation,
  ExaminerPack,
  Manuscript,
  SessionMode,
  SessionPhase,
} from "@/lib/types";

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

function withId(pack: ExaminerPack): ExaminerPack {
  if (pack.id) return pack;
  return { ...pack, id: crypto.randomUUID() };
}


export function Booth() {
  const [manuscript, setManuscript] = useState<Manuscript>(emptyManuscript);
  const [pack, setPack] = useState<ExaminerPack | null>(null);
  const [library, setLibrary] = useState<ExaminerPack[]>([]);
  const [formOpen, setFormOpen] = useState(true);
  const [phase, setPhase] = useState<SessionPhase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [live, setLive] = useState("");
  const [transcript, setTranscript] = useState("");
  const [spoken, setSpoken] = useState<Citation[]>([]);
  const [checked, setChecked] = useState<Citation[] | null>(null);
  const [debrief, setDebrief] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadPack();
    if (stored) {
      const current = withId(stored);
      setPack(current);
      setManuscript(manuscriptFromPack(current));
      setPhase("prepared");
      setFormOpen(false);
    }
    setLibrary(listPacks());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (phase !== "talking") return;
    const id = window.setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "talking") return;
    hushVoxide();
    let stopListen: (() => void) | undefined;
    const wait = window.setTimeout(() => {
      stopListen = startBrowserListen((chunk) => {
        setLive((cur) => mergeSpeech(cur, chunk));
      });
    }, 1600);
    return () => {
      window.clearTimeout(wait);
      stopListen?.();
    };
  }, [phase]);

  const runVerify = (list: Citation[], spokenText: string, abstract: string) => {
    setChecked(list);
    setDebrief("");
    void (async () => {
      const next = await verifyCitations(list);
      setChecked(next);
      const text = await requestDebrief({
        transcript: spokenText,
        abstract,
        citations: next,
      });
      setDebrief(text);
    })();
  };

  const finalizeStop = () => {
    const spokenText = live.trim();
    const fromTalk = extractSpeechCitations(spokenText);
    setTranscript(spokenText);
    setSpoken(fromTalk);
    setPhase("stopped");
    const fromPack = pack && pack.mode === "prepared" ? pack.citations : emptyCitations;
    const abstract = pack?.abstract ?? "";
    setChecked(mergeCitations(fromPack, fromTalk));
    setDebrief("");
    void (async () => {
      const extra = citationsFromTexts(await requestExtract(spokenText));
      const speech = capSpeechCitations(mergeCitations(fromTalk, extra));
      setSpoken(speech);
      runVerify(mergeCitations(fromPack, speech), spokenText, abstract);
    })();
  };

  useEffect(() => {
    return bindVivaSession({
      start: () => {
        if (phase !== "prepared" && phase !== "stopped") {
          return {
            ok: false,
            message: "Prepare a manuscript or begin open talk first.",
          };
        }
        setLive("");
        setTranscript("");
        setSpoken([]);
        setChecked(null);
        setDebrief("");
        setElapsed(0);
        setPhase("talking");
        return { ok: true, message: "Practice started." };
      },
      stop: () => {
        if (phase !== "talking") {
          return { ok: false, message: "Practice is not running." };
        }
        finalizeStop();
        return { ok: true, message: "Practice stopped." };
      },
      snapshot: () => ({
        phase,
        elapsedSeconds: elapsed,
        canStart: phase === "prepared" || phase === "stopped",
        canStop: phase === "talking",
      }),
    });
  }, [phase, elapsed, live]);

  const lockPack = (mode: SessionMode) => {
    const next = buildPack(manuscript, mode);
    setPack(next);
    savePack(next);
    rememberPack(next);
    setLibrary(listPacks());
    setPhase("prepared");
    setElapsed(0);
    setLive("");
    setTranscript("");
    setSpoken([]);
    setChecked(null);
    setDebrief("");
    setFormOpen(false);
    if (mode === "prepared") runVerify(next.citations, "", next.abstract);
  };

  const applyPack = (next: ExaminerPack) => {
    const current = withId(next);
    setPack(current);
    setManuscript(manuscriptFromPack(current));
    savePack(current);
    setPhase("prepared");
    setElapsed(0);
    setFormOpen(false);
    if (current.mode === "prepared") {
      runVerify(current.citations, "", current.abstract);
    }
  };

  const formLocked = phase === "talking";
  const showForm = !hydrated || formOpen || !pack;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10 md:px-10 md:py-14">
      <header className="flex items-baseline justify-between gap-6">
        <h1 className="font-display text-5xl text-ink md:text-6xl">Viva</h1>
        <p className="max-w-[13rem] text-right text-xs leading-relaxed text-ink/45">
          Read first. Then listen. Never invent a paper.
        </p>
      </header>

      {hydrated ? (
        <PackLibrary
          packs={library}
          activeId={pack?.id ?? null}
          onSelect={applyPack}
        />
      ) : null}

      {showForm ? (
        <ManuscriptForm
          value={manuscript}
          onChange={setManuscript}
          disabled={formLocked}
          onPrepare={() => lockPack("prepared")}
          onOpenTalk={() => lockPack("open")}
        />
      ) : pack ? (
        <ExaminerPackCard pack={pack} onEdit={() => setFormOpen(true)} />
      ) : null}

      <SessionBar
        phase={phase}
        elapsedSeconds={elapsed}
        onStart={() => {
          setLive("");
          setTranscript("");
          setSpoken([]);
          setChecked(null);
          setDebrief("");
          setElapsed(0);
          setPhase("talking");
          hushVoxide();
        }}
        onStop={finalizeStop}
      />

      <DebriefPanel
        transcript={phase === "talking" ? live : transcript}
        citations={
          checked ??
          mergeCitations(
            pack && pack.mode === "prepared" ? pack.citations : emptyCitations,
            spoken,
          )
        }
        debrief={debrief}
      />
    </div>
  );
}
