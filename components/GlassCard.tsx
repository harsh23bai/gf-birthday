"use client";

import { motion } from "framer-motion";

type GlassCardProps = {
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
  active?: boolean;
};

export default function GlassCard({
  title,
  description,
  icon,
  onClick,
  active = false,
}: GlassCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      className={`glass flex h-full w-full flex-col items-start gap-3 rounded-2xl px-6 py-6 text-left transition ${
        active ? "border-rose-200/60 shadow-[0_0_30px_rgba(236,72,153,0.3)]" : ""
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/70">{description}</p>
      </div>
    </motion.button>
  );
}
