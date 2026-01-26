"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useCountdown } from "../hooks/useCountdown";

const pad = (value: number) => value.toString().padStart(2, "0");

type CountdownProps = {
  targetDate: Date;
  onComplete?: () => void;
};

export default function Countdown({ targetDate, onComplete }: CountdownProps) {
  const { timeLeft, isComplete, hasMounted } = useCountdown(targetDate);

  useEffect(() => {
    if (hasMounted && isComplete) onComplete?.();
  }, [hasMounted, isComplete, onComplete]);

  return (
    <div className="glass rounded-3xl px-6 py-8 md:px-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center rounded-2xl bg-white/5 px-4 py-4 text-center"
          >
            <span className="text-3xl font-semibold text-white md:text-4xl text-glow">
              {pad(item.value)}
            </span>
            <span className="mt-2 text-xs uppercase tracking-[0.35em] text-white/60">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-sm text-white/70">
        Counting down to the moment your birthday begins.
      </p>
    </div>
  );
}
