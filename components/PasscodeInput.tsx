"use client";

import { useEffect, useRef } from "react";

type PasscodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
};

export default function PasscodeInput({
  value,
  onChange,
  length = 6,
  autoFocus = false,
}: PasscodeInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div
      className="relative flex items-center justify-center gap-3"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value.toUpperCase().slice(0, length))}
        maxLength={length}
        autoComplete="one-time-code"
        inputMode="text"
        className="absolute inset-0 h-full w-full opacity-0"
      />
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="otp-box">
          {value[index] ?? ""}
        </div>
      ))}
    </div>
  );
}
