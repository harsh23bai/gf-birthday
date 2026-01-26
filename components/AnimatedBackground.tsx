"use client";

import { motion } from "framer-motion";

const floatingItems = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  size: 18 + index * 3,
  left: `${(index * 8) % 100}%`,
  top: `${(index * 11) % 100}%`,
  delay: index * 0.4,
}));

const hearts = [
  { id: "h1", left: "15%", top: "25%", size: 26 },
  { id: "h2", left: "70%", top: "18%", size: 20 },
  { id: "h3", left: "82%", top: "70%", size: 24 },
  { id: "h4", left: "30%", top: "78%", size: 18 },
];

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 romantic-gradient" />
      {floatingItems.map((item) => (
        <motion.span
          key={item.id}
          className="absolute rounded-full bg-white/10 blur-sm"
          style={{
            width: item.size,
            height: item.size,
            left: item.left,
            top: item.top,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.35, 0.8, 0.35],
          }}
          transition={{
            duration: 6 + item.id * 0.6,
            repeat: Infinity,
            delay: item.delay,
          }}
        />
      ))}
      <div className="absolute -top-20 left-10 h-40 w-40 rounded-full bg-rose-400/20 blur-[90px]" />
      <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-purple-400/20 blur-[120px]" />
      {hearts.map((heart, index) => (
        <motion.div
          key={heart.id}
          className="absolute text-rose-200/70"
          style={{ left: heart.left, top: heart.top, fontSize: heart.size }}
          animate={{ y: [0, -18, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 5 + index, repeat: Infinity, delay: index * 0.6 }}
        >
          ♥
        </motion.div>
      ))}
      <div className="absolute inset-0 opacity-50 mix-blend-screen">
        <svg className="h-full w-full" viewBox="0 0 800 800" fill="none">
          <circle cx="620" cy="200" r="2" fill="white" />
          <circle cx="120" cy="300" r="1.5" fill="white" />
          <circle cx="520" cy="620" r="1" fill="white" />
          <circle cx="220" cy="540" r="1" fill="white" />
        </svg>
      </div>
    </div>
  );
}
