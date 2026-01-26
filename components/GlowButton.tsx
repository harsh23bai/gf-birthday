"use client";

import { motion } from "framer-motion";

type GlowButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
};

export default function GlowButton({
  label,
  onClick,
  className = "",
  type = "button",
}: GlowButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`glass pulse-glow rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white ${className}`}
    >
      {label}
    </motion.button>
  );
}
