import { VoxideClient } from "@voxide/react";
import { vivaSnapshot, vivaStart, vivaStop } from "@/lib/session-bridge";
import { pushTranscript, textFromUnknown } from "@/lib/transcript-bridge";

let client: VoxideClient | null = null;

export function getVoxideClient() {
  return client;
}

export function ensureVoxideClient(publicKey: string) {
  if (client) return client;
  const ai = new VoxideClient({
    publicKey,
    ui: { theme: "light" },
  });
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
  ai.on("transcript", (payload) => {
    const text = textFromUnknown(payload);
    if (text) pushTranscript(text);
  });
  ai.on("message", (payload) => {
    const rec = payload as { role?: string; text?: string };
    if (rec?.role === "user" && rec.text) pushTranscript(rec.text);
  });
  client = ai;
  return ai;
}

export function userSpeechFromVoxide() {
  if (!client) return "";
  return client
    .getSnapshot()
    .messages.filter((m) => m.role === "user" && m.text.trim())
    .map((m) => m.text.trim())
    .join("\n");
}
