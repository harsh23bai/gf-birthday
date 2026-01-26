"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={(event) => event.stopPropagation()}
            className="glass w-full max-w-3xl rounded-3xl px-6 py-6 md:px-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {title ?? ""}
              </h3>
              <button
                onClick={onClose}
                className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white"
              >
                Close
              </button>
            </div>
            <div className="mt-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
