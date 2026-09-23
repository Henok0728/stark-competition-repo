"use client";

import { Button } from "@/components/ui/Button";
import type { SessionPhase } from "@/lib/types";

type Props = {
  phase: SessionPhase;
  elapsedSeconds: number;
  onStart: () => void;
  onStop: () => void;
};

function formatTime(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const captions: Record<SessionPhase, string> = {
  idle: "Mic is a placeholder until Voxide.",
  prepared: "Pack is ready. Start when you are standing.",
  talking: "Talking. Stop when you are done.",
  stopped: "Stopped. Debrief is still empty.",
};

export function SessionBar({ phase, elapsedSeconds, onStart, onStop }: Props) {
  const canStart = phase === "prepared" || phase === "stopped";
  const canStop = phase === "talking";

  return (
    <div className="flex flex-col gap-5 border-t border-rule pt-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/40">
          Session
        </p>
        <p className="font-display mt-1 text-5xl tabular-nums tracking-tight text-ink">
          {formatTime(elapsedSeconds)}
        </p>
        <p className="mt-2 max-w-sm text-sm text-ink/50">{captions[phase]}</p>
      </div>
      <div className="flex gap-3">
        <Button type="button" onClick={onStart} disabled={!canStart}>
          Start
        </Button>
        <Button type="button" tone="line" onClick={onStop} disabled={!canStop}>
          Stop
        </Button>
      </div>
    </div>
  );
}
