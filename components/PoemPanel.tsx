"use client";

import { motion } from "framer-motion";

const poemLines = [
  "You are the hush before dawn and the spark right after.",
  "The softest glow in my day, the surest home in my night.",
  "In every laugh you leave light behind.",
  "In every tear you teach me to hold the sky.",
  "Today is yours, but you are forever my favorite day.",
];

export default function PoemPanel({
  className = "glass rounded-3xl px-6 py-6",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm uppercase tracking-[0.3em] text-rose-200/70">Birthday Poem</p>
      <h3 className="text-2xl font-semibold text-white">A few lines for you</h3>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/85">
        {poemLines.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
