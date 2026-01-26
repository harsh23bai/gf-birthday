"use client";

export default function TypingIndicator({ label = "Typing…" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/70">
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-rose-300" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-rose-200" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-rose-100" />
      </div>
      <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}
