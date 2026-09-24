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
  idle: "Prepare or open talk, then start.",
  prepared: "The bar is the mic. Start is the clock.",
  talking: "Listening. Stop when you are done.",
  stopped: "Stopped. Start again for a second take.",
};

export function SessionBar({ phase, elapsedSeconds, onStart, onStop }: Props) {
  const canStart = phase === "prepared" || phase === "stopped";
  const canStop = phase === "talking";

  return (
    <div className="flex flex-col items-center border-t border-rule pt-12 text-center">
      <p className="font-display text-7xl tabular-nums tracking-tight text-ink md:text-8xl">
        {formatTime(elapsedSeconds)}
      </p>
      <div className="mt-6 flex gap-3">
        <Button type="button" onClick={onStart} disabled={!canStart}>
          Start
        </Button>
        <Button type="button" tone="line" onClick={onStop} disabled={!canStop}>
          Stop
        </Button>
      </div>
      <p className="mt-4 max-w-sm text-sm text-ink/45">{captions[phase]}</p>
    </div>
  );
}
