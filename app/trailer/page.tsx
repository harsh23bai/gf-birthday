"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../../components/AnimatedBackground";
import Loader from "../../components/Loader";
import GlowButton from "../../components/GlowButton";

export default function TrailerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  // show skip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div className="relative min-h-screen overflow-hidden romantic-gradient">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        {/* VIDEO CONTAINER */}
        <div
          className="
            relative w-full
            md:max-w-4xl
            aspect-[9/16] md:aspect-video
            overflow-hidden
            rounded-none md:rounded-3xl
            bg-black
          "
        >
          <video
            ref={videoRef}
            src="https://res.cloudinary.com/dn95byqcd/video/upload/v1769524025/demo_vid_sb5btw.mp4"
            poster="https://res.cloudinary.com/dn95byqcd/image/upload/v1769525883/poster_cykqsd.svg"
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            onCanPlay={() => setReady(true)}
            onEnded={() => setEnded(true)}
            onClick={toggleMute}
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Loader */}
          <AnimatePresence>
            {!ready && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80"
              >
                <Loader label="Loading surprise..." />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tap to unmute */}
          <AnimatePresence>
            {muted && ready && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-5 py-2 text-xs text-white backdrop-blur"
              >
                Tap to unmute 🔊
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip button */}
          <AnimatePresence>
            {showSkip && !ended && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => router.push("/dashboard")}
                className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-2 text-xs text-white backdrop-blur"
              >
                Skip →
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Explore button */}
      <AnimatePresence>
        {ended && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20"
          >
            <GlowButton
              label="Explore More ✨"
              onClick={() => router.push("/dashboard")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}