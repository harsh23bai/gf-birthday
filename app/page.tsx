"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import Countdown from "../components/Countdown";
import MusicToggle from "../components/MusicToggle";
import { getBirthdayDate } from "../utils/date";

export default function Home() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isComplete) return;
    const timeout = setTimeout(() => router.push("/login"), 1200);
    return () => clearTimeout(timeout);
  }, [isComplete, router]);

  const birthdayDate = useMemo(() => getBirthdayDate(), []);

  return (
    <div className="relative min-h-screen overflow-hidden romantic-gradient">
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-rose-200/80">
            February 04, 2026
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl text-glow">
            Happiest Birthday
          </h1>
          <h2 className="text-4xl font-semibold leading-tight text-white md:text-6xl text-glow">
            to the girl who turns ordinary moments into stardust.
          </h2>
          <p className="mt-6 text-lg text-white/80 md:text-xl">
            A countdown to your favorite day, wrapped in light, music, and love.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-12 w-full max-w-3xl"
        >
          <Countdown targetDate={birthdayDate} onComplete={() => setIsComplete(true)} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <MusicToggle />
        </motion.div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 text-rose-100/80"
          >
            Unlocking the surprise…
          </motion.div>
        )}
      </div>
      <motion.div
        aria-hidden
        animate={{ opacity: isComplete ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 bg-black/70"
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}
