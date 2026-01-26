"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlowButton from "./GlowButton";

export default function SurprisePanel({
  className = "glass rounded-3xl px-6 py-6",
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <p className="text-sm uppercase tracking-[0.3em] text-rose-200/70">Surprise Gift</p>
      <h3 className="text-2xl font-semibold text-white">A glow just for you</h3>
      <p className="mt-3 text-sm text-white/70">
        Tap to reveal the photo meant for your eyes only.
      </p>
      <div className="mt-6">
        <GlowButton label="Open the gift" onClick={() => setOpen(true)} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-lg overflow-hidden rounded-3xl bg-white/10 p-6 text-center"
            >
              <div className="absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-rose-400/30 blur-[90px]" />
              <motion.img
                src="/surprise.svg"
                alt="Surprise"
                initial={{ filter: "blur(18px)", scale: 0.95 }}
                animate={{ filter: "blur(0px)", scale: 1 }}
                transition={{ duration: 1.2 }}
                className="mx-auto h-64 w-64 rounded-2xl object-cover shadow-2xl"
              />
              <p className="mt-4 text-lg text-white/90">
                Your photo goes here — swap this with the real one.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-6 rounded-full bg-white/15 px-6 py-2 text-xs uppercase tracking-[0.3em] text-white"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
