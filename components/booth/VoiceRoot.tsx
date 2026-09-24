"use client";

import { useEffect, useState } from "react";
import { VoxideWidget } from "@voxide/react";
import { ensureVoxideClient } from "@/lib/voxide-client";

export function VoiceRoot() {
  const publicKey = process.env.NEXT_PUBLIC_VOXIDE_PUBLIC_KEY?.trim();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!publicKey || !ready) return null;

  return <VoxideWidget client={ensureVoxideClient(publicKey)} theme="light" />;
}
