import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  hint?: string;
};

export function TextField({
  label,
  hint,
  id,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block" htmlFor={fieldId}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-ink/45">
        {label}
      </span>
      <input
        id={fieldId}
        className="w-full border-b border-rule bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-ink/25 focus:border-ink"
        {...props}
      />
      {hint ? <span className="mt-1 block text-xs text-ink/40">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  id,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block" htmlFor={fieldId}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-ink/45">
        {label}
      </span>
      <textarea
        id={fieldId}
        className="min-h-[7.5rem] w-full resize-y border border-rule bg-paper/40 px-3 py-2.5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink/25 focus:border-ink"
        {...props}
      />
      {hint ? <span className="mt-1 block text-xs text-ink/40">{hint}</span> : null}
    </label>
  );
}
