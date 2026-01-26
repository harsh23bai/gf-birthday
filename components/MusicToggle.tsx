"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    try {
      audioRef.current.muted = false;
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={toggle}
        className="glass pulse-glow flex items-center gap-3 rounded-full px-6 py-3 text-sm uppercase tracking-[0.25em]"
      >
        <span className="h-2 w-2 rounded-full bg-rose-300" />
        {isPlaying ? "Pause the melody" : "Play the melody"}
      </motion.button>
      <p className="text-xs text-white/60">Muted by default — tap to add music.</p>
      <audio ref={audioRef} src="/bg.mp3" loop preload="auto" muted />
    </div>
  );
}
