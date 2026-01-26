"use client";

import { motion } from "framer-motion";

export default function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="h-14 w-14 rounded-full border border-rose-200/40 border-t-rose-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-sm uppercase tracking-[0.35em] text-white/60">{label}</p>
    </div>
  );
}
