"use client";

import { useMemo } from "react";
import { VoxideClient, VoxideWidget } from "@voxide/react";
import { vivaSnapshot, vivaStart, vivaStop } from "@/lib/session-bridge";

export function VoiceRoot() {
  const publicKey = process.env.NEXT_PUBLIC_VOXIDE_PUBLIC_KEY?.trim();

  const client = useMemo(() => {
    if (!publicKey) return null;
    const ai = new VoxideClient({ publicKey });
    ai.register({
      startPractice: {
        description:
          "Start the viva practice timer. The student begins presenting. Only works after they have prepared a manuscript or chosen open talk.",
        handler: async () => vivaStart(),
      },
      stopPractice: {
        description:
          "Stop the viva practice timer. The student finished talking.",
        handler: async () => vivaStop(),
      },
    });
    ai.bindState(() => vivaSnapshot());
    return ai;
  }, [publicKey]);

  if (!client) return null;

  return <VoxideWidget client={client} />;
}
