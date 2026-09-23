import type { ButtonHTMLAttributes } from "react";

type Tone = "solid" | "ghost" | "line";

const tones: Record<Tone, string> = {
  solid:
    "bg-ink text-paper hover:bg-ink/90 disabled:bg-ink/30 disabled:text-paper/70",
  ghost: "text-ink/70 hover:text-ink hover:bg-ink/5 disabled:text-ink/30",
  line: "border border-rule text-ink hover:border-ink/40 disabled:opacity-40",
};

export function Button({
  tone = "solid",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[13px] tracking-wide transition ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
