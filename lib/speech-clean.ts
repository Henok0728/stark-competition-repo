const COMMAND = /^(ok|okay|start|stop|top|стоп)[.!\s]*$/i;

const ASSISTANT = /practice session|starting the timer|already running|officially underway|stopping the practice|do you want me to|timer now/i;

export function isBoothNoise(text: string) {
  const t = text.trim();
  if (!t) return true;
  if (COMMAND.test(t)) return true;
  if (ASSISTANT.test(t)) return true;
  return false;
}

export function mergeSpeech(current: string, chunk: string) {
  const next = chunk.trim();
  if (!next || isBoothNoise(next)) return current;
  if (!current) return next;
  if (next.includes(current)) return next;
  if (current.includes(next)) return current;
  return `${current} ${next}`.replace(/\s+/g, " ");
}
