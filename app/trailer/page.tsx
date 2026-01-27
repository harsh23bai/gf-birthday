"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../../components/AnimatedBackground";
import Loader from "../../components/Loader";
import GlowButton from "../../components/GlowButton";

export default function TrailerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(true);

  return (
    <div className="relative min-h-screen overflow-hidden romantic-gradient">
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black/30">
          <video
            ref={videoRef}
            src="https://oehdgezicamuzoabelja.supabase.co/storage/v1/object/public/data_bday/2_Minute_Timer_with_Music_ELECTRIC_720p.mp4"
            poster="/trailer-poster.svg"
            className="h-full w-full"
            autoPlay
            // muted
            playsInline
            controls={true}
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            onCanPlay={() => setReady(true)}
            onEnded={() => setEnded(true)}
            onContextMenu={(event) => event.preventDefault()}
          />
          <AnimatePresence>
            {!ready && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/70"
              >
                <Loader label="Loading Video.." />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {ended && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10"
            >
              <GlowButton
                label="Explore More ✨"
                onClick={() => router.push("/dashboard")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
