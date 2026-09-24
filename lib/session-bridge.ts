import type { SessionPhase } from "@/lib/types";

export type SessionSnapshot = {
  phase: SessionPhase;
  elapsedSeconds: number;
  canStart: boolean;
  canStop: boolean;
};

export type SessionCommandResult = {
  ok: boolean;
  message: string;
};

type Controls = {
  start: () => SessionCommandResult;
  stop: () => SessionCommandResult;
  snapshot: () => SessionSnapshot;
};

let controls: Controls | null = null;

export function bindVivaSession(next: Controls) {
  controls = next;
  return () => {
    if (controls === next) controls = null;
  };
}

export function vivaStart(): SessionCommandResult {
  if (!controls) {
    return { ok: false, message: "Booth is not ready." };
  }
  return controls.start();
}

export function vivaStop(): SessionCommandResult {
  if (!controls) {
    return { ok: false, message: "Booth is not ready." };
  }
  return controls.stop();
}

export function vivaSnapshot(): SessionSnapshot {
  if (!controls) {
    return {
      phase: "idle",
      elapsedSeconds: 0,
      canStart: false,
      canStop: false,
    };
  }
  return controls.snapshot();
}
