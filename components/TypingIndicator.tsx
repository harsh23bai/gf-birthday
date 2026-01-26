"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs text-white/60">
      <span className="h-2 w-2 animate-pulse rounded-full bg-rose-300" />
      <span>Typing a message…</span>
    </div>
  );
}
